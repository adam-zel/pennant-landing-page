import { useEffect, useRef } from "react";
import {
  DPR_CAP,
  easeOutCubic,
  lerpNightUniform,
  smoothMouseAxis,
  smoothVelocityAxis,
} from "./math";
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

/** Full-viewport WebGL field from `docs/specs/pennant-field-prompt.md`. */
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
      antialias: false,
      depth: false,
      stencil: false,
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

    let raf = 0;
    const start = performance.now();
    let lastFrame = start;
    let mx = 0.5;
    let my = 0.5;
    let tmx = 0.5;
    let tmy = 0.5;
    let prevTmx = 0.5;
    let prevTmy = 0.5;
    let velX = 0;
    let velY = 0;
    let influence = 0.045;

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
      const h = window.innerHeight;
      const w = window.innerWidth;
      if (h <= 0 || w <= 0) return;
      tmx = e.clientX / w;
      tmy = 1.0 - e.clientY / h;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", setSize);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const tSec = (now - start) / 1000;
      const fadeIn = Math.min(1, tSec / 0.8);
      const fadeEased = easeOutCubic(fadeIn);
      const dt = Math.max(1e-4, (now - lastFrame) / 1000);
      lastFrame = now;

      mx = smoothMouseAxis(mx, tmx);
      my = smoothMouseAxis(my, tmy);

      const rawVX = (tmx - prevTmx) / dt;
      const rawVY = (tmy - prevTmy) / dt;
      prevTmx = tmx;
      prevTmy = tmy;

      const targetMag = Math.hypot(rawVX, rawVY);
      const currMag = Math.hypot(velX, velY);
      velX = smoothVelocityAxis(velX, rawVX, targetMag, currMag);
      velY = smoothVelocityAxis(velY, rawVY, targetMag, currMag);

      const speed = targetMag;
      const inflTarget = speed > 1.5 ? 0.18 : 0.045;
      const inflK = inflTarget > influence ? 0.18 : 0.045;
      influence += (inflTarget - influence) * inflK;

      const { nightTarget: nt, timeScale: ts } = propsRef.current;
      nightValRef.current = lerpNightUniform(nightValRef.current, nt);

      /** Scale UV/s velocity into shader-friendly displacement range */
      const velScale = 0.0025;
      const vx = velX * velScale;
      const vy = velY * velScale;

      gl.useProgram(program);
      gl.uniform1f(u.time, tSec * ts);
      gl.uniform2f(u.resolution, canvas.width, canvas.height);
      gl.uniform2f(u.mouse, mx, my);
      gl.uniform2f(u.mouseVel, vx, vy);
      gl.uniform1f(u.influence, influence);
      gl.uniform1f(u.fadeIn, fadeEased);
      gl.uniform1f(u.night, nightValRef.current);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
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
