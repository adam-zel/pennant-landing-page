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
    const cells = container.querySelectorAll(".pennant-matchup__cell");
    expect(cells).toHaveLength(5);
    expect([...cells].map((el) => el.textContent)).toEqual([
      "S",
      "O",
      "O",
      "O",
      "N",
    ]);
  });

  it("uses a double divider before the third O (Paper center pair)", () => {
    render(<LandingOverlay />);
    expect(screen.getByTestId("matchup-double-divider")).toBeInTheDocument();
    expect(screen.getByTestId("matchup-double-divider").children).toHaveLength(
      2,
    );
  });
});
