import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ThemeToggle } from "../components/ThemeToggle";

describe("ThemeToggle a11y", () => {
  it("exposes aria-pressed and toggles", () => {
    const onToggle = vi.fn();
    const { rerender } = render(
      <ThemeToggle theme="day" onToggle={onToggle} />,
    );
    const btn = screen.getByRole("button", { name: /switch to night/i });
    expect(btn).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(btn);
    expect(onToggle).toHaveBeenCalledTimes(1);

    rerender(<ThemeToggle theme="night" onToggle={onToggle} />);
    const btnNight = screen.getByRole("button", { name: /switch to day/i });
    expect(btnNight).toHaveAttribute("aria-pressed", "true");
  });
});
