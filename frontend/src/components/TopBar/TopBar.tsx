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
    <div className="flex h-16 flex-shrink-0 items-center border-b border-gray-200 px-4 dark:border-gray-700">
      {startContent && <div className="flex-shrink-0 pr-4">{startContent}</div>}
      <div className="flex-grow truncate">{children}</div>
      {endContent && <div className="flex-shrink-0 pl-4">{endContent}</div>}
    </div>
  );
}
