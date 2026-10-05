import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  href: string;
  variant?: "primary" | "secondary";
  children: ReactNode;
  className?: string;
};

export function LinkButton({ href, variant = "primary", children, className = "" }: Props) {
  const cls = `btn ${variant === "primary" ? "btn-primary" : "btn-secondary"} ${className}`.trim();
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
