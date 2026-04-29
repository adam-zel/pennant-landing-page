PENNANT — CURSOR PROMPT
========================

Build a single self-contained HTML file (`pennant-landing.html`) that
renders a minimal, cinematic landing-page background for a baseball
app called Pennant. No text, no inputs, no fonts, no build step. Just
a WebGL canvas, two CSS overlays, and a single theme-toggle button.


STRUCTURE (z-index stack)
-------------------------

  z=0   <canvas id="field">   Full viewport, position: fixed; inset: 0
  z=1   .vignette             Full viewport. Single radial:
                               radial-gradient(ellipse 110% 90% at 50% 35%,
                                 transparent 0%, transparent 65%,
                                 rgba(0,0,0,0.28) 100%)
                              No linear bands.
  z=2   .grain                Full viewport. Inline-SVG fractalNoise as
                              background-image, opacity: 0.06,
                              mix-blend-mode: overlay, sized 220x220.
  z=10  .theme-toggle         Top-right, clamp(20px, 3.5vw, 36px) offset.
                              32px round button with sun/moon SVG icons.


THEME
-----
- data-theme attribute on <html> switches modes
- Day (default): body background #0F1F17
- Night (data-theme="night"): body background #030906
- Body: transition: background-color 600ms cubic-bezier(0.23, 1, 0.32, 1)
- Click toggle:
    - Flip data-theme attribute
    - Persist in localStorage['pennant.theme']
    - Set a target value, JS lerps a u_night uniform 0<->1 over ~600ms
      (lerp factor 0.06 per frame)


SHADER (fragment)
-----------------
Top-down view. Field at top, fading to body bg at bottom.

UNIFORMS:
  u_time, u_resolution
  u_mouse       (smoothed 0..1, GL Y-up convention)
  u_mouseVel    (smoothed velocity in uv-space)
  u_influence   (0..1 hover state)
  u_fadeIn      (0..1 page entrance)
  u_night       (0=day, 1=night)

HELPERS:
  Ashima 2D simplex noise (snoise)
  5-octave FBM
  sdSegment SDF (distance to a line segment)


CURSOR WAKE — STRICT RULES
--------------------------
- TRANSLATIONAL DISPLACEMENT ONLY. Never compute pushDir = toMouse / dist.
  Any per-pixel direction varying with distance from cursor causes radial
  pinching that looks like tie-dye/swirl.
- NO IDLE MOTION. When u_mouseVel ~= 0, displacement is exactly zero.
- NO GLOW, no halo, no spotlight, no saturation lift on the cursor.
  Visible cursor effects look video-gamey.

  vec2 toMouse  = p - mp;
  float falloff = smoothstep(0.30, 0.0, length(toMouse));
  falloff *= falloff;
  falloff *= u_influence;
  vec2 disp = u_mouseVel * 0.95 * falloff;
  vec2 q = uv + disp;


GRASS — TWO PALETTES LERPED BY u_night
--------------------------------------
  blades  = fbm(q * 240)             // fine clusters
  patches = fbm(q * 18 + u_time*0.02) // slow drift
  wind    = snoise(q * 5 - u_time * 0.05)

  Day palette:
    deep   = vec3(0.060, 0.155, 0.075)
    mid    = vec3(0.140, 0.295, 0.130)
    bright = vec3(0.260, 0.450, 0.180)
    Mowing modulator: 0.88 + mow * 0.12
    Patches:          0.82 + (patches*0.5+0.5)*0.36

  Night palette:
    deep   = vec3(0.012, 0.052, 0.052)
    mid    = vec3(0.040, 0.135, 0.105)
    bright = vec3(0.135, 0.345, 0.215)
    Mowing modulator: 0.78 + mow * 0.24   // pops harder
    Patches:          0.70 + (patches*0.5+0.5)*0.45

  Then: color *= 0.97 + wind * 0.04


MOWING STRIPES
--------------
- 45 degree diagonal, mowAngle = pi/4
- Frequency 90 in aspect-corrected space
- Modulated by + patches * 1.5 for organic break-up
- smoothstep(-0.4, 0.4, stripe)


CHALK FOUL LINES
----------------
Two diagonals crossing at (0, -0.25) — well below the visible field, so
within frame you only see two diverging lines, never the meeting point.
Endpoints at vec2(+/-2.0, foulY +/- 2.0) so they extend off-canvas in both
directions and dissolve naturally with the bg fade.

  foulD += snoise(p * 75.0) * 0.0006     // hand-painted edge wobble
  density = mix(0.55, 1.05,
              smoothstep(-0.5, 0.7,
                snoise(p*7.0 + vec2(1.7,0.4))))   // patchy worn sections
  density *= mix(0.84, 1.0, snoise(p*150)*0.5+0.5) // powder grain
  chalk    = smoothstep(0.0028, 0.0010, foulD) * density   // thin core

  Color:   warm (0.94,0.92,0.82) day -> (1.00,1.00,0.95) night
  Opacity: mix(0.80, 0.92, u_night)

NO outer dust halo. That read as bloom, not chalk.


STADIUM LIGHTS — FIXTURES ARE OFF-CANVAS
-----------------------------------------
Banks live at p.y > 0.5 (above visible canvas). Never drawn directly.
Only their effects spill into frame.

Four banks at:
  (-0.55, 0.62), (-0.18, 0.68), (0.18, 0.68), (0.55, 0.62)

Per-bank flicker (staggered freqs/phases):
  fl = 1.0 + 0.06 * sin(u_time * (1.3 + i*0.18) + i*1.7)

For each bank, sum these into three accumulators:

  lightGlow:  multi-Gaussian, soft atmospheric, no hard edge
    exp(-r*90)*1.00 + exp(-r*28)*0.55 + exp(-r*10)*0.32 + exp(-r*3.5)*0.18

  lightStreak: anamorphic horizontal smear; lower edge spills into canvas
    ds = d * vec2(0.16, 2.6)
    exp(-dot(ds, ds) * 4.5)

  lightPool: asymmetric cone falling on field
    vs = mix(0.45, 4.0, smoothstep(-0.05, 0.05, d.y))
    pr = d.x*d.x + d.y*d.y * vs
    exp(-pr * 5.0)
  After loop: lightPool *= 0.55

APPLY at night:
  color *= mix(1.0, 0.32, u_night) + lightPool * u_night * 1.70

  Cool tint outside hot pools:
    mix(vec3(1.0), vec3(0.82, 0.92, 1.14),
        u_night * (1.0 - smoothstep(0.35, 1.0, lightPool)))

  Specular twinkle (dewy blade tips catching light):
    spec = smoothstep(0.86, 1.0, snoise(uv*90 + u_time*0.6)*0.5+0.5)
    color += spec * lightPool * u_night * 0.30 * vec3(1.04, 1.00, 0.88)

  Spill (additive warm):
    lightWarm = vec3(1.14, 1.05, 0.82)
    color += lightGlow   * u_night * 0.62 * lightWarm
    color += lightStreak * u_night * 0.34 * lightWarm


BUG SWARM — 8 particles, only visible at night
-----------------------------------------------
  for (int i = 0; i < 8; i++) {
    float fi = float(i);
    vec2 bp = vec2(
      sin(u_time*0.35 + fi*1.71)*0.55 + cos(u_time*0.21 + fi*0.93)*0.14,
      0.40 + sin(u_time*0.27 + fi*2.31)*0.07
           + cos(u_time*0.45 + fi*1.13)*0.05
    );
    bp = mix(bp, mp, u_night * u_influence * 0.18);   // pull to cursor
    float bd = length(p - bp);
    float bf = max(0.0, sin(u_time*11.0 + fi*4.7));   // fast on/off
    bugs += smoothstep(0.0030, 0.0008, bd) * bf;
  }
  color += bugs * u_night * 0.85 * vec3(1.10, 1.04, 0.85);


BOTTOM FADE — USE TRUE SMOOTHERSTEP
-----------------------------------
  vec3 bgDay   = vec3(0.059, 0.122, 0.090);   // matches #0F1F17
  vec3 bgNight = vec3(0.012, 0.035, 0.024);   // matches #030906
  vec3 bgColor = mix(bgDay, bgNight, u_night);

  float t = clamp((v_uv.y - 0.20) / 0.55, 0.0, 1.0);   // 55% range
  float grassAlpha = t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
  // smootherstep: 6t^5 - 15t^4 + 10t^3
  color = mix(bgColor, color, grassAlpha);

Plain smoothstep has non-zero second derivatives at endpoints which
leave visible inflection bands. Smootherstep zeros those out.

FINAL: color *= u_fadeIn; gl_FragColor = vec4(color, 1.0);


JS RENDER LOOP
--------------
- requestAnimationFrame, t = (now - start) / 1000
- Entrance: fadeIn = min(1, t/0.8); fadeEased = 1 - pow(1-fadeIn, 3)
- Mouse smoothing: mx += (targetMX - mx) * 0.12

ASYMMETRIC VELOCITY SMOOTHING — this is what makes the wake feel alive:

  const targetMag = Math.hypot(rawVX, rawVY);
  const currMag   = Math.hypot(velX, velY);
  const velLerp   = targetMag > currMag ? 0.25 : 0.05;
  velX += (rawVX - velX) * velLerp;
  velY += (rawVY - velY) * velLerp;

  Fast ramp-up (instant response when you start dragging) + slow decay
  (~500ms lingering wake when you stop).

- Hover influence asymmetric: enter 0.18, settle 0.045
- Night lerp: nightVal += (targetNight - nightVal) * 0.06
- Pointer events listen on window; Y is GL-flipped:
    targetMY = 1.0 - clientY / innerHeight
- DPR-aware resize, capped at 2:
    Math.min(devicePixelRatio || 1, 2)


HARD RULES (do not violate)
---------------------------
1. No pushDir = toMouse / dist anywhere. Cursor displacement is purely
   u_mouseVel * scalar * falloff.
2. No glow, halo, spotlight, brightness lift, or saturation lift on
   the cursor.
3. No idle/wobble motion when cursor is stationary.
4. Stadium light fixtures stay off-canvas (banks at p.y > 0.5).
   Never render them directly.
5. Smootherstep (6t^5 - 15t^4 + 10t^3), not smoothstep, for the bottom
   fade.
6. CSS body bg colors must exactly match shader bgDay/bgNight
   (linear-RGB equivalents) so canvas and body are visually continuous.
7. The .grain overlay is required — its fractal noise dithers any
   8-bit color banding in the gradient.


DEFINITION OF DONE
------------------
- Page fades in over ~800ms
- Top of viewport: subtle green grass with 45deg diagonal mowing stripes
  and two diverging chalk foul lines
- Bottom: smooth seamless fade to body bg
- Top-right: round button with moon (day) / sun (night) icon
- Click toggle -> smooth ~600ms transition to night:
    - Deeper, cooler greens
    - Four off-canvas warm light banks bleeding glow + anamorphic
      streaks over the top edge
    - Bright pools on the field
    - Cool atmospheric tint on shadowed areas
    - 8 bugs flickering near the top
- Drag cursor across field: grass under cursor flows in motion direction
  with a brief lingering wake. Zero visible glow. Zero idle motion.
- Theme persists across reloads
- Resize handles cleanly
