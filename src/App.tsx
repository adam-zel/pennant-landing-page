import { useEffect, useState } from "react";
import { LandingOverlay } from "./components/LandingOverlay";
import { ThemeToggle, type Theme } from "./components/ThemeToggle";
import { FieldCanvas } from "./field/FieldCanvas";
import { THEME_STORAGE_KEY } from "./field/math";
import "./styles/global.css";

function readTheme(): Theme {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    if (v === "night") return "night";
  } catch {
    /* ignore */
  }
  return "day";
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(() => readTheme());
  const [timeScale, setTimeScale] = useState(1);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "night") root.setAttribute("data-theme", "night");
    else root.removeAttribute("data-theme");
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setTimeScale(mq.matches ? 0.12 : 1);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const nightTarget = theme === "night" ? 1 : 0;

  return (
    <>
      <FieldCanvas nightTarget={nightTarget} timeScale={timeScale} />
      <div className="pennant-vignette" aria-hidden />
      <div className="pennant-grain" aria-hidden />
      <LandingOverlay />
      <ThemeToggle
        theme={theme}
        onToggle={() => setTheme((t) => (t === "day" ? "night" : "day"))}
      />
    </>
  );
}
