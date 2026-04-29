precision highp float;

varying vec2 v_uv;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform vec2 u_mouseVel;
uniform float u_influence;
uniform float u_fadeIn;
uniform float u_night;

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x * 34.0) + 1.0) * x);
}

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
    -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float f = 0.0;
  float w = 0.5;
  for (int i = 0; i < 5; i++) {
    f += w * snoise(p);
    p *= 2.0;
    w *= 0.5;
  }
  return f;
}

float sdSegment(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h);
}

void bankAccum(vec2 p, vec2 center, float fi, float u_time,
    inout float lightGlow, inout float lightStreak, inout float lightPool) {
  float fl = 1.0 + 0.06 * sin(u_time * (1.3 + fi * 0.18) + fi * 1.7);
  vec2 d = p - center;
  float r = length(d);
  lightGlow += (exp(-r * 90.0) * 1.00 + exp(-r * 28.0) * 0.55 + exp(-r * 10.0) * 0.32 + exp(-r * 3.5) * 0.18) * fl;
  vec2 ds = d * vec2(0.16, 2.6);
  lightStreak += exp(-dot(ds, ds) * 4.5) * fl;
  float vs = mix(0.45, 4.0, smoothstep(-0.05, 0.05, d.y));
  float pr = d.x * d.x + d.y * d.y * vs;
  lightPool += exp(-pr * 5.0) * fl;
}

void main() {
  vec2 uv = v_uv;
  vec2 mp = u_mouse;
  vec2 toMouse = uv - mp;
  float falloff = smoothstep(0.30, 0.0, length(toMouse));
  falloff *= falloff;
  falloff *= u_influence;
  vec2 disp = u_mouseVel * 0.95 * falloff;
  vec2 q = uv + disp;

  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 aq = q;
  aq.x *= aspect;

  float blades = fbm(q * 240.0);
  float patches = fbm(q * 18.0 + u_time * 0.02);
  float wind = snoise(q * 5.0 - u_time * 0.05);

  float mowAngle = 0.7853981633974483;
  vec2 dir = vec2(cos(mowAngle), sin(mowAngle));
  float stripeIn = sin(dot(aq, dir) * 90.0 + patches * 1.5);
  float mow = smoothstep(-0.4, 0.4, stripeIn);

  vec3 deepD = vec3(0.060, 0.155, 0.075);
  vec3 midD = vec3(0.140, 0.295, 0.130);
  vec3 brightD = vec3(0.260, 0.450, 0.180);
  vec3 deepN = vec3(0.012, 0.052, 0.052);
  vec3 midN = vec3(0.040, 0.135, 0.105);
  vec3 brightN = vec3(0.135, 0.345, 0.215);

  vec3 deep = mix(deepD, deepN, u_night);
  vec3 mid = mix(midD, midN, u_night);
  vec3 bright = mix(brightD, brightN, u_night);

  float mowMod = mix(0.88 + mow * 0.12, 0.78 + mow * 0.24, u_night);
  float patchMod = mix(0.82 + (patches * 0.5 + 0.5) * 0.36, 0.70 + (patches * 0.5 + 0.5) * 0.45, u_night);

  vec3 gcol = mix(mix(deep, mid, blades * 0.5 + 0.5), bright, blades * 0.5 + 0.5);
  gcol *= mowMod * patchMod;
  gcol *= 0.97 + wind * 0.04;

  vec3 color = gcol;

  vec2 p = q;
  float foulY = -0.25;
  float foulD = min(
    sdSegment(p, vec2(-2.0, foulY - 2.0), vec2(2.0, foulY + 2.0)),
    sdSegment(p, vec2(2.0, foulY - 2.0), vec2(-2.0, foulY + 2.0))
  );
  foulD += snoise(p * 75.0) * 0.0006;
  float density = mix(0.55, 1.05, smoothstep(-0.5, 0.7, snoise(p * 7.0 + vec2(1.7, 0.4))));
  density *= mix(0.84, 1.0, snoise(p * 150.0) * 0.5 + 0.5);
  float chalk = smoothstep(0.0028, 0.0010, foulD) * density;
  vec3 chalkCol = mix(vec3(0.94, 0.92, 0.82), vec3(1.0, 1.0, 0.95), u_night);
  float chalkOp = mix(0.80, 0.92, u_night);
  color = mix(color, chalkCol, chalk * chalkOp);

  float lightGlow = 0.0;
  float lightStreak = 0.0;
  float lightPool = 0.0;
  bankAccum(p, vec2(-0.55, 0.62), 0.0, u_time, lightGlow, lightStreak, lightPool);
  bankAccum(p, vec2(-0.18, 0.68), 1.0, u_time, lightGlow, lightStreak, lightPool);
  bankAccum(p, vec2(0.18, 0.68), 2.0, u_time, lightGlow, lightStreak, lightPool);
  bankAccum(p, vec2(0.55, 0.62), 3.0, u_time, lightGlow, lightStreak, lightPool);
  lightPool *= 0.55;

  float poolTerm = lightPool * u_night * 1.70;
  color *= mix(1.0, 0.32, u_night) + poolTerm;
  color = mix(color, color * vec3(0.82, 0.92, 1.14), u_night * (1.0 - smoothstep(0.35, 1.0, lightPool)));
  float spec = smoothstep(0.86, 1.0, snoise(uv * 90.0 + u_time * 0.6) * 0.5 + 0.5);
  color += spec * lightPool * u_night * 0.30 * vec3(1.04, 1.00, 0.88);
  vec3 lightWarm = vec3(1.14, 1.05, 0.82);
  color += lightGlow * u_night * 0.62 * lightWarm;
  color += lightStreak * u_night * 0.34 * lightWarm;

  float bugs = 0.0;
  for (int i = 0; i < 8; i++) {
    float fi = float(i);
    vec2 bp = vec2(
      sin(u_time * 0.35 + fi * 1.71) * 0.55 + cos(u_time * 0.21 + fi * 0.93) * 0.14,
      0.40 + sin(u_time * 0.27 + fi * 2.31) * 0.07 + cos(u_time * 0.45 + fi * 1.13) * 0.05
    );
    bp = mix(bp, mp, u_night * u_influence * 0.18);
    float bd = length(p - bp);
    float bf = max(0.0, sin(u_time * 11.0 + fi * 4.7));
    bugs += smoothstep(0.0030, 0.0008, bd) * bf;
  }
  color += bugs * u_night * 0.85 * vec3(1.10, 1.04, 0.85);

  vec3 bgDay = vec3(0.059, 0.122, 0.090);
  vec3 bgNight = vec3(0.012, 0.035, 0.024);
  vec3 bgColor = mix(bgDay, bgNight, u_night);
  float t = clamp((v_uv.y - 0.20) / 0.55, 0.0, 1.0);
  float grassAlpha = t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
  color = mix(bgColor, color, grassAlpha);

  gl_FragColor = vec4(color * u_fadeIn, 1.0);
}
