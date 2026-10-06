import type { CSSProperties, ReactNode } from "react";

/** Staggered motion index for a diagram part (see the motion section of globals.css). */
export const step = (i: number) => ({ "--i": i }) as CSSProperties;

/**
 * Root of every HTML diagram. Gives the diagram an accessible name and description (read before
 * its content) and carries the diagram tokens (src/styles/diagrams.css). The diagram itself is
 * real, selectable, scalable text in a grid; see docs/design/layout-and-visual-quality-rules.md.
 */
export function DiagramRoot({
  titleId,
  title,
  description,
  className = "",
  children,
}: {
  titleId: string;
  title: string;
  description: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`dgm ${className}`.trim()}
      role="group"
      aria-labelledby={`${titleId}-t`}
      aria-describedby={`${titleId}-d`}
    >
      <p id={`${titleId}-t`} className="visually-hidden">
        {title}
      </p>
      <p id={`${titleId}-d`} className="visually-hidden">
        {description}
      </p>
      {children}
    </div>
  );
}
