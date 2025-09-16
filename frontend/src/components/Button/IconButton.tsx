import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { iconButtonClasses } from "./styles";

export default function IconButton({
  className,
  children,
  ...props
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  const classes = [iconButtonClasses, className].filter(Boolean).join(" ");

  return (
    <button type="button" {...props} className={classes}>
      {children}
    </button>
  );
}
