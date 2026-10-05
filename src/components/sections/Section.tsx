import type { ReactNode } from "react";
import { Inline } from "@/components/primitives/Inline";

export type Tone = "paper" | "white" | "ink";

/** A page section: semantic landmark with its own heading, tone, and consistent rhythm. */
export function Section({
  id,
  tone = "paper",
  children,
  className = "",
  ruled = true,
}: {
  id: string;
  tone?: Tone;
  children: ReactNode;
  className?: string;
  ruled?: boolean;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-h`}
      className={`section tone-${tone} ${ruled && tone !== "ink" ? "rule-top" : ""} ${className}`.trim()}
    >
      <div className="container-site">{children}</div>
    </section>
  );
}

/** Label, heading, and optional intro: the left rail of an editorial layout, or a stacked header. */
export function SectionHeader({
  id,
  label,
  heading,
  intro,
  className = "",
}: {
  id: string;
  label: string;
  heading: string;
  intro?: string;
  className?: string;
}) {
  return (
    <div className={className} data-reveal="block">
      <p className="t-eyebrow eyebrow-accent m-0">{label}</p>
      <h2 id={`${id}-h`} className="t-h2 mt-3 max-w-[22ch]">
        {heading}
      </h2>
      {intro ? (
        <p className="t-body mt-4 max-w-[40ch] opacity-90">
          <Inline text={intro} />
        </p>
      ) : null}
    </div>
  );
}
