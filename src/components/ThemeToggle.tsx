import { useId } from "react";

export type Theme = "day" | "night";

type ThemeToggleProps = {
  theme: Theme;
  onToggle: () => void;
};

/** Moon in day mode, sun in night — custom glyphs inherit `currentColor` from the toggle. */
export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isNight = theme === "night";
  const sunUid = useId();
  const sunClipId = `${sunUid}-sun-clip`;
  const sunMaskId = `${sunUid}-sun-mask`;

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
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M12.0517 3.59971C12.2712 3.28123 12.2873 2.86472 12.0931 2.53021C11.8989 2.19569 11.5292 2.00315 11.1438 2.03581C6.0214 2.46985 2 6.76372 2 11.9979C2 17.5197 6.47632 21.996 11.9981 21.996C17.2324 21.996 21.5264 17.9745 21.9602 12.8519C21.9929 12.4664 21.8003 12.0968 21.4658 11.9026C21.1313 11.7084 20.7148 11.7246 20.3963 11.9441C19.4302 12.61 18.2602 12.9998 16.9961 12.9998C13.6824 12.9998 10.9961 10.3135 10.9961 6.99976C10.9961 5.73577 11.3858 4.56582 12.0517 3.59971Z"
          fill="currentColor"
        />
      </svg>
      <svg
        className="ico-sun"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <g clipPath={`url(#${sunClipId})`}>
          <mask
            id={sunMaskId}
            style={{ maskType: "luminance" }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="24"
            height="24"
          >
            <path d="M24 0H0V24H24V0Z" fill="white" />
          </mask>
          <g mask={`url(#${sunMaskId})`}>
            <path
              d="M12 20C12.5523 20 13 20.4477 13 21V23C13 23.5523 12.5523 24 12 24C11.4477 24 11 23.5523 11 23V21C11 20.4477 11.4477 20 12 20Z"
              fill="currentColor"
            />
            <path
              d="M4.92871 17.6572C5.31923 17.2667 5.95225 17.2667 6.34277 17.6572C6.7333 18.0478 6.7333 18.6808 6.34277 19.0713L4.92871 20.4854C4.53818 20.8757 3.90513 20.8758 3.51465 20.4854C3.12418 20.0949 3.12427 19.4618 3.51465 19.0713L4.92871 17.6572Z"
              fill="currentColor"
            />
            <path
              d="M17.6572 17.6572C18.0478 17.2667 18.6808 17.2667 19.0713 17.6572L20.4854 19.0713C20.8757 19.4618 20.8758 20.0949 20.4854 20.4854C20.0949 20.8758 19.4618 20.8757 19.0713 20.4854L17.6572 19.0713C17.2667 18.6808 17.2667 18.0478 17.6572 17.6572Z"
              fill="currentColor"
            />
            <path
              d="M7.75781 7.75781C10.101 5.41467 13.899 5.41467 16.2422 7.75781C18.5853 10.101 18.5853 13.899 16.2422 16.2422C13.899 18.5853 10.101 18.5853 7.75781 16.2422C5.41467 13.899 5.41467 10.101 7.75781 7.75781Z"
              fill="currentColor"
            />
            <path
              d="M3 11C3.55228 11 3.99999 11.4477 4 12C4 12.5523 3.55228 13 3 13H1C0.447715 13 0 12.5523 0 12C1.03079e-05 11.4477 0.447722 11 1 11H3Z"
              fill="currentColor"
            />
            <path
              d="M23 11C23.5523 11 24 11.4477 24 12C24 12.5523 23.5523 13 23 13H21C20.4477 13 20 12.5523 20 12C20 11.4477 20.4477 11 21 11H23Z"
              fill="currentColor"
            />
            <path
              d="M3.51465 3.51465C3.90513 3.12418 4.53818 3.12427 4.92871 3.51465L6.34277 4.92871C6.7333 5.31923 6.73329 5.95225 6.34277 6.34277C5.95225 6.7333 5.31923 6.7333 4.92871 6.34277L3.51465 4.92871C3.12427 4.53818 3.12417 3.90512 3.51465 3.51465Z"
              fill="currentColor"
            />
            <path
              d="M19.0713 3.51465C19.4618 3.12428 20.0949 3.12419 20.4854 3.51465C20.8758 3.90512 20.8757 4.53817 20.4854 4.92871L19.0713 6.34277C18.6808 6.7333 18.0478 6.7333 17.6572 6.34277C17.2667 5.95225 17.2667 5.31923 17.6572 4.92871L19.0713 3.51465Z"
              fill="currentColor"
            />
            <path
              d="M12 0C12.5523 0 13 0.447715 13 1V3C13 3.55228 12.5523 4 12 4C11.4477 4 11 3.55228 11 3V1C11 0.447715 11.4477 0 12 0Z"
              fill="currentColor"
            />
          </g>
        </g>
        <defs>
          <clipPath id={sunClipId}>
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </button>
  );
}
