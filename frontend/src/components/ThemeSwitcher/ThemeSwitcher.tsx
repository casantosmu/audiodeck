import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi";
import useTheme from "../../context/Theme/useTheme";

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
      className="cursor-pointer p-1 px-2 text-lg text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-md hover:border-sky-700 hover:text-sky-700 dark:hover:border-sky-400 dark:hover:text-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-offset-gray-800"
    >
      {theme === "light" ? (
        <HiOutlineMoon size={18} aria-hidden="true" />
      ) : (
        <HiOutlineSun size={18} aria-hidden="true" />
      )}
    </button>
  );
}
