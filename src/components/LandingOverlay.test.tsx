import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LandingOverlay } from "./LandingOverlay";

describe("LandingOverlay", () => {
  it("renders Paper copy", () => {
    render(<LandingOverlay />);
    expect(screen.getByText("Pennant")).toBeInTheDocument();
    expect(screen.getByText("Baseball")).toBeInTheDocument();
    expect(screen.getByText("Without")).toBeInTheDocument();
    expect(screen.getByText("The Noise.")).toBeInTheDocument();
    expect(
      screen.getByText(/Pennant is your new baseball companion/i),
    ).toBeInTheDocument();
  });
});
