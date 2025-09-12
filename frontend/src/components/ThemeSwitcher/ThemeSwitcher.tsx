import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi";
import useTheme from "../../context/Theme/useTheme";
import IconButton from "../Button/IconButton";

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <IconButton
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
    >
      {theme === "light" ? (
        <HiOutlineMoon size={18} aria-hidden="true" />
      ) : (
        <HiOutlineSun size={18} aria-hidden="true" />
      )}
    </IconButton>
  );
}
