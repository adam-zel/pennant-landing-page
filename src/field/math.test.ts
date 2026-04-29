import { describe, expect, it } from "vitest";
import {
  easeOutCubic,
  lerp,
  lerpNightUniform,
  smoothVelocityAxis,
} from "./math";

describe("lerp", () => {
  it("interpolates", () => {
    expect(lerp(0, 10, 0.5)).toBe(5);
  });
});

describe("easeOutCubic", () => {
  it("is 0 at 0 and 1 at 1", () => {
    expect(easeOutCubic(0)).toBe(0);
    expect(easeOutCubic(1)).toBe(1);
  });
  it("ramps faster early", () => {
    expect(easeOutCubic(0.5)).toBeGreaterThan(0.5);
  });
});

describe("lerpNightUniform", () => {
  it("asymptotically approaches target over repeated ticks", () => {
    let v = 0;
    for (let i = 0; i < 200; i++) v = lerpNightUniform(v, 1);
    expect(v).toBeGreaterThan(0.99);
  });
});

describe("smoothVelocityAxis", () => {
  it("uses faster lerp when accelerating", () => {
    const slow = smoothVelocityAxis(0, 1, 0.5, 2);
    const fast = smoothVelocityAxis(0, 1, 2, 0.5);
    expect(Math.abs(fast)).toBeGreaterThan(Math.abs(slow));
  });
});
