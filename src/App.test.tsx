import { render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  afterEach(() => {
    document.documentElement.setAttribute("data-theme", "day");
    localStorage.clear();
  });

  it("mounts without throwing", () => {
    render(<App />);
  });

  it("defaults to day on html[data-theme]", () => {
    render(<App />);
    expect(document.documentElement.getAttribute("data-theme")).toBe("day");
  });
});
