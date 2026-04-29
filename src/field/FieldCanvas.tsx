import { useEffect, useRef } from "react";
import {
  DPR_CAP,
  easeOutCubic,
  lerpNightUniform,
} from "./math";
import { FIELD_POINTER } from "./fieldPointerConstants";
import fragmentSource from "./shaders/fragment.glsl?raw";
import vertexSource from "./shaders/vertex.glsl?raw";

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, source);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

function createProgram(
  gl: WebGLRenderingContext,
  vs: string,
  fs: string,
): WebGLProgram | null {
  const v = compileShader(gl, gl.VERTEX_SHADER, vs);
  const f = compileShader(gl, gl.FRAGMENT_SHADER, fs);
  if (!v || !f) return null;
  const p = gl.createProgram();
  if (!p) return null;
  gl.attachShader(p, v);
  gl.attachShader(p, f);
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(p));
    gl.deleteProgram(p);
    return null;
  }
  return p;
}

export type FieldCanvasProps = {
  nightTarget: number;
  /** Multiply shader time; use &lt; 1 when prefers-reduced-motion. */
  timeScale?: number;
};

/**
 * WebGL field — fragment + pointer math aligned with `pennant-landing.html`.
 */
export function FieldCanvas({ nightTarget, timeScale = 1 }: FieldCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nightValRef = useRef(0);
  const propsRef = useRef({ nightTarget, timeScale });
  propsRef.current = { nightTarget, timeScale };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: true,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
    });
    if (!gl) {
      if (import.meta.env.MODE !== "test") {
        console.warn("WebGL unavailable");
      }
      return;
    }

    const program = createProgram(gl, vertexSource, fragmentSource);
    if (!program) return;

    const buf = gl.createBuffer();
    if (!buf) return;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const aPos = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = {
      time: gl.getUniformLocation(program, "u_time"),
      resolution: gl.getUniformLocation(program, "u_resolution"),
      mouse: gl.getUniformLocation(program, "u_mouse"),
      mouseVel: gl.getUniformLocation(program, "u_mouseVel"),
      influence: gl.getUniformLocation(program, "u_influence"),
      fadeIn: gl.getUniformLocation(program, "u_fadeIn"),
      night: gl.getUniformLocation(program, "u_night"),
    };

    nightValRef.current = propsRef.current.nightTarget;

    let raf = 0;
    const start = performance.now();
    let targetMX = 0.5;
    let targetMY = 0.5;
    let mx = 0.5;
    let my = 0.5;
    let prevMX = 0.5;
    let prevMY = 0.5;
    let velX = 0;
    let velY = 0;
    let influence = 0;
    let targetInfluence = 0;
    let hovering = false;

    const setPointer = (clientX: number, clientY: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (w <= 0 || h <= 0) return;
      targetMX = clientX / w;
      targetMY = 1.0 - clientY / h;
    };

    const setSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (w <= 0 || h <= 0) return;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    setSize();

    const onMove = (e: PointerEvent) => {
      hovering = true;
      targetInfluence = 1;
      setPointer(e.clientX, e.clientY);
    };

    const onLeave = () => {
      hovering = false;
      targetInfluence = 0;
    };

    const onDown = (e: PointerEvent) => {
      hovering = true;
      targetInfluence = 1;
      setPointer(e.clientX, e.clientY);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("resize", setSize);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const tSec = (now - start) / 1000;
      const fadeIn = Math.min(1, tSec / 0.8);
      const fadeEased = easeOutCubic(fadeIn);

      mx += (targetMX - mx) * FIELD_POINTER.mouseLerp;
      my += (targetMY - my) * FIELD_POINTER.mouseLerp;

      const rawVX = mx - prevMX;
      const rawVY = my - prevMY;
      prevMX = mx;
      prevMY = my;

      const targetMag = Math.hypot(rawVX, rawVY);
      const currMag = Math.hypot(velX, velY);
      const velLerp =
        targetMag > currMag
          ? FIELD_POINTER.velLerpFast
          : FIELD_POINTER.velLerpSlow;
      velX += (rawVX - velX) * velLerp;
      velY += (rawVY - velY) * velLerp;

      const inflLerp = hovering
        ? FIELD_POINTER.enterSpeed
        : FIELD_POINTER.settleSpeed;
      influence += (targetInfluence - influence) * inflLerp;

      const { nightTarget: nt, timeScale: ts } = propsRef.current;
      nightValRef.current = lerpNightUniform(nightValRef.current, nt);

      gl.useProgram(program);
      gl.uniform1f(u.time, tSec * ts);
      gl.uniform2f(u.resolution, canvas.width, canvas.height);
      gl.uniform2f(u.mouse, mx, my);
      gl.uniform2f(u.mouseVel, velX, velY);
      gl.uniform1f(u.influence, influence);
      gl.uniform1f(u.fadeIn, fadeEased);
      gl.uniform1f(u.night, nightValRef.current);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("resize", setSize);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="field"
      className="pennant-field-canvas"
      aria-hidden
    />
  );
}
