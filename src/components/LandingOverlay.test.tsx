import { render, screen, within } from "@testing-library/react";
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
    expect(strip).not.toBeNull();
    const stripEl = strip as HTMLElement;
    const cells = [...stripEl.querySelectorAll(".pennant-matchup__cell")].map(
      (el) => el.textContent?.trim(),
    );
    expect(cells).toEqual(["S", "O", "N"]);
  });

  it("uses solari split-flap middle for the second O", () => {
    const { container } = render(<LandingOverlay />);
    const strip = container.querySelector(".pennant-matchup");
    expect(strip).not.toBeNull();
    const stripEl = strip as HTMLElement;

    const solari = within(stripEl).getByTestId("matchup-solari-o");
    expect(solari).toBeInTheDocument();

    const halves = solari.querySelectorAll(".pennant-matchup__solari-half");
    expect(halves).toHaveLength(2);
    expect([...halves].map((h) => h.textContent?.trim())).toEqual(["O", "O"]);

    const crease = solari.querySelector(".pennant-matchup__solari-crease");
    expect(crease).toBeInTheDocument();
    expect(crease).toHaveAttribute("aria-hidden", "true");

    const dividers = stripEl.querySelectorAll(".pennant-matchup__divider");
    expect(dividers).toHaveLength(3);
    dividers.forEach((d) => {
      expect(d).toHaveAttribute("aria-hidden", "true");
    });
  });

  it("hides decorative matchup strip from accessibility tree", () => {
    const { container } = render(<LandingOverlay />);
    const shell = container.querySelector(".pennant-matchup-shell");
    expect(shell).toHaveAttribute("aria-hidden", "true");
  });
});
