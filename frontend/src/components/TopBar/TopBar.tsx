import type { PropsWithChildren, ReactNode } from "react";

interface TopBarProps {
  startContent?: ReactNode;
  endContent?: ReactNode;
}

export default function TopBar({
  children,
  startContent,
  endContent,
}: PropsWithChildren<TopBarProps>) {
  return (
    <div className="flex h-16 flex-shrink-0 items-center space-x-4 border-b border-gray-200 px-4 dark:border-gray-700">
      {startContent}
      <div className="flex-grow truncate">{children}</div>
      {endContent}
    </div>
  );
}
