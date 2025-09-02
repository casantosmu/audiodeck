import { createContext } from "react";
import type { Theme } from "./Theme";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
export default ThemeContext;
