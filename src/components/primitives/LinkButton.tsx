import Link from "next/link";
import type { ReactNode } from "react";
import { Arrow } from "./Arrow";

type Props = {
  href: string;
  variant?: "primary" | "secondary";
  children: ReactNode;
  className?: string;
  /** Show the forward arrow (primary calls to action). */
  arrow?: boolean;
};

export function LinkButton({
  href,
  variant = "primary",
  children,
  className = "",
  arrow = false,
}: Props) {
  const cls = `btn ${variant === "primary" ? "btn-primary" : "btn-secondary"} ${className}`.trim();
  return (
    <Link href={href} className={cls}>
      {children}
      {arrow ? <Arrow /> : null}
    </Link>
  );
}
