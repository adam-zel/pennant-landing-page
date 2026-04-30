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

  it("renders S, O, N cells plus solari middle (reads visually as SOON)", () => {
    const { container } = render(<LandingOverlay />);
    const strip = container.querySelector(".pennant-matchup");
    const cells = [...strip!.querySelectorAll(".pennant-matchup__cell")].map(
      (el) => el.textContent?.trim(),
    );
    expect(cells).toEqual(["S", "O", "N"]);
    expect(strip?.querySelectorAll(".pennant-matchup__cell")).toHaveLength(3);
  });

  it("uses solari split-flap middle for the second O", () => {
    render(<LandingOverlay />);
    expect(screen.getByTestId("matchup-solari-o")).toBeInTheDocument();
    expect(document.querySelectorAll(".pennant-matchup__solari-half")).toHaveLength(
      2,
    );
    expect(
      document.querySelector(".pennant-matchup__solari-crease"),
    ).toBeInTheDocument();
    expect(document.querySelectorAll(".pennant-matchup__divider")).toHaveLength(
      3,
    );
  });

  it("hides decorative matchup strip from accessibility tree", () => {
    const { container } = render(<LandingOverlay />);
    const shell = container.querySelector(".pennant-matchup-shell");
    expect(shell).toHaveAttribute("aria-hidden", "true");
  });
});
