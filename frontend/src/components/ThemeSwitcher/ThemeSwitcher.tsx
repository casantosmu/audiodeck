import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi";
import useTheme from "../../context/ThemeContext/useTheme";

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="cursor-pointer p-1 px-2 text-lg text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-md hover:border-sky-700 hover:text-sky-700 dark:hover:border-sky-400 dark:hover:text-sky-400"
    >
      {theme === "light" ? (
        <HiOutlineMoon size={18} />
      ) : (
        <HiOutlineSun size={18} />
      )}
    </button>
  );
}
