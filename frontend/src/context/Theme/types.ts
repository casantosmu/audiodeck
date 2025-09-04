export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export type Theme = "light" | "dark";
