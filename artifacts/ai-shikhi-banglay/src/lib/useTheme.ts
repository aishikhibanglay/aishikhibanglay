import { useState, useEffect } from "react";

type Theme = "dark" | "light";

const STORAGE_KEY = "ai-shikhi-theme";

let _currentTheme: Theme = "dark";
let _listeners: Array<(t: Theme) => void> = [];

function applyTheme(theme: Theme) {
  _currentTheme = theme;
  if (typeof document !== "undefined") {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {}
  _listeners.forEach((fn) => fn(theme));
}

function loadTheme(): Theme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {}
  return "dark";
}

if (typeof window !== "undefined") {
  applyTheme(loadTheme());
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(_currentTheme);

  useEffect(() => {
    _listeners.push(setTheme);
    return () => {
      _listeners = _listeners.filter((fn) => fn !== setTheme);
    };
  }, []);

  const toggle = () => applyTheme(_currentTheme === "dark" ? "light" : "dark");

  return { isDark: theme === "dark", theme, toggle };
}
