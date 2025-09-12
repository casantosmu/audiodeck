import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

export default function IconButton({
  className,
  children,
  ...props
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  const baseClasses =
    "cursor-pointer p-1 px-2 text-lg text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-md hover:border-sky-700 hover:text-sky-700 dark:hover:border-sky-400 dark:hover:text-sky-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:dark:hover:border-gray-600 disabled:hover:text-gray-500 disabled:dark:hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-offset-gray-800";

  const combinedClasses = [baseClasses, className].filter(Boolean).join(" ");

  return (
    <button type="button" {...props} className={combinedClasses}>
      {children}
    </button>
  );
}
