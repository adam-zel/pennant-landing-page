import { render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  afterEach(() => {
    document.documentElement.removeAttribute("data-theme");
    localStorage.clear();
  });

  it("mounts without throwing", () => {
    render(<App />);
  });

  it("defaults to day (no data-theme on html)", () => {
    render(<App />);
    expect(document.documentElement.getAttribute("data-theme")).toBeNull();
  });
});
