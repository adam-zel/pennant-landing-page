export type Theme = "day" | "night";

type ThemeToggleProps = {
  theme: Theme;
  onToggle: () => void;
};

/** Moon in day mode, sun in night — same icons as `pennant-landing.html`. */
export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isNight = theme === "night";
  return (
    <button
      type="button"
      className="pennant-theme-toggle"
      onClick={onToggle}
      aria-label={isNight ? "Switch to day mode" : "Switch to night mode"}
      aria-pressed={isNight}
    >
      <svg
        className="ico-moon"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M13.5 9.8A5.5 5.5 0 0 1 6.2 2.5 5.5 5.5 0 1 0 13.5 9.8z" />
      </svg>
      <svg
        className="ico-sun"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <circle cx="8" cy="8" r="2.6" />
        <line x1="8" y1="1.5" x2="8" y2="3" />
        <line x1="8" y1="13" x2="8" y2="14.5" />
        <line x1="1.5" y1="8" x2="3" y2="8" />
        <line x1="13" y1="8" x2="14.5" y2="8" />
        <line x1="3.4" y1="3.4" x2="4.5" y2="4.5" />
        <line x1="11.5" y1="11.5" x2="12.6" y2="12.6" />
        <line x1="3.4" y1="12.6" x2="4.5" y2="11.5" />
        <line x1="11.5" y1="4.5" x2="12.6" y2="3.4" />
      </svg>
    </button>
  );
}
