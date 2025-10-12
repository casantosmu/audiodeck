import { type PropsWithChildren, useEffect, useMemo, useState } from "react";
import ThemeContext from "./ThemeContext";
import type { Theme } from "./types";

const LOCAL_STORAGE_KEY = "theme";

const getInitialTheme = (): Theme => {
  const storedTheme = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }
  return "dark";
};

export default function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState(getInitialTheme);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem(LOCAL_STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);
  return <ThemeContext value={value}>{children}</ThemeContext>;
}
