import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HERO_BODY_COPY } from "../siteCopy";
import { LandingOverlay } from "./LandingOverlay";

describe("LandingOverlay", () => {
  it("renders Paper copy", () => {
    render(<LandingOverlay />);
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByText("Pennant")).toBeInTheDocument();
    expect(screen.getByText("Baseball")).toBeInTheDocument();
    expect(screen.getByText("Without")).toBeInTheDocument();
    expect(screen.getByText("The Noise.")).toBeInTheDocument();
    expect(screen.getByText(HERO_BODY_COPY)).toBeInTheDocument();
  });

  it("renders SOON matchup letters in order", () => {
    const { container } = render(<LandingOverlay />);
    const letters = container.querySelectorAll(".pennant-matchup__cell");
    expect(letters).toHaveLength(5);
    expect([...letters].map((el) => el.textContent?.trim())).toEqual([
      "S",
      "O",
      "O",
      "O",
      "N",
    ]);
  });

  it("uses Paper middle column with horizontal double divider", () => {
    render(<LandingOverlay />);
    expect(screen.getByTestId("matchup-middle-column")).toBeInTheDocument();
    const double = screen.getByTestId("matchup-double-divider");
    expect(double.children).toHaveLength(2);
    expect(
      document.querySelectorAll(".pennant-matchup__divider-vertical"),
    ).toHaveLength(3);
  });

  it("hides decorative matchup strip from accessibility tree", () => {
    const { container } = render(<LandingOverlay />);
    const shell = container.querySelector(".pennant-matchup-shell");
    expect(shell).toHaveAttribute("aria-hidden", "true");
  });
});
