/** Lerp factor per frame toward night uniform (~600ms feel at 60fps). */
export const NIGHT_LERP = 0.06;

/** Mouse position smoothing toward target. */
export const MOUSE_SMOOTH = 0.12;

export const VEL_LERP_FAST = 0.25;
export const VEL_LERP_SLOW = 0.05;

export const DPR_CAP = 2;

export const THEME_STORAGE_KEY = "pennant.theme";

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Page entrance easing from spec: 1 - (1 - fadeIn)^3 */
export function easeOutCubic(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return 1 - Math.pow(1 - x, 3);
}

export function smoothMouseAxis(
  current: number,
  target: number,
  factor = MOUSE_SMOOTH,
): number {
  return lerp(current, target, factor);
}

export function smoothVelocityAxis(
  vel: number,
  raw: number,
  targetMag: number,
  currMag: number,
): number {
  const velLerp = targetMag > currMag ? VEL_LERP_FAST : VEL_LERP_SLOW;
  return lerp(vel, raw, velLerp);
}

export function lerpNightUniform(current: number, target: number): number {
  return lerp(current, target, NIGHT_LERP);
}
