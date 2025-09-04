import { type PropsWithChildren, useEffect, useMemo, useState } from "react";
import ThemeContext from "./ThemeContext";
import type { Theme } from "./types";

export default function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState(
    () => (localStorage.getItem("theme") as Theme | null | undefined) ?? "dark",
  );

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);
  return <ThemeContext value={value}>{children}</ThemeContext>;
}
