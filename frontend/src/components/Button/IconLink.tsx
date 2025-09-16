import type { PropsWithChildren } from "react";
import { Link, type LinkProps } from "react-router";
import { iconButtonClasses } from "./styles";

export default function IconLink({
  className,
  children,
  ...props
}: PropsWithChildren<LinkProps>) {
  const classes = [iconButtonClasses, className].filter(Boolean).join(" ");

  return (
    <Link {...props} className={classes}>
      {children}
    </Link>
  );
}
