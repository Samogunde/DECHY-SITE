import Link from "next/link";
import { Quotes } from "@phosphor-icons/react/dist/ssr";
import { Arrow } from "@/components/primitives/Arrow";
import { getRegistry } from "@/lib/content/load";
import type { Block } from "@/lib/content/schema";
import { Section } from "./Section";

type Of<T extends Block["type"]> = Extract<Block, { type: T }>;
type Tag = { label: string; href?: string };

/**
 * Client testimonials (owner, 21 October 2026): one card everywhere. The quote leads, with the
 * service it is about above it, and the person, their role, and their company below.
 */

/** The person's initials, in a circle colored by the first letter of their name. */
export function Initials({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const letters = name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  return (
    <span className={`tq-av tq-av-${size}`} data-hue={name.charCodeAt(0) % 4} aria-hidden="true">
      {letters}
    </span>
  );
}

function TagLink({ tag, className }: { tag: Tag; className: string }) {
  return tag.href && getRegistry().pageByPath.has(tag.href) ? (
    <Link href={tag.href} className={className}>
      {tag.label}
    </Link>
  ) : (
    <span className={className}>{tag.label}</span>
  );
}

export function QuoteCard({
  quote,
  name,
  role,
  company,
  tags = [],
}: {
  quote: string;
  name: string;
  role: string;
  company: string;
  tags?: Tag[];
}) {
  const [service, industry] = tags;
  return (
    <figure className="tq">
      <div className="tq-top">
        <Quotes aria-hidden="true" weight="fill" className="tq-mark" />
        {service ? <TagLink tag={service} className="tq-svc" /> : null}
      </div>
      <blockquote className="tq-quote">
        <p>{quote}</p>
      </blockquote>
      <figcaption className="tq-who">
        <Initials name={name} />
        <span className="tq-id">
          <span className="tq-name">{name}</span>
          <span className="tq-role">{role}</span>
          <span className="tq-co">{company}</span>
          {industry ? <TagLink tag={industry} className="tq-ind" /> : null}
        </span>
      </figcaption>
    </figure>
  );
}

export function TestimonialsBlock({ block }: { block: Of<"testimonials"> }) {
  const more = getRegistry().pageByPath.has("/testimonials/");
  if (block.items.length === 0) return null;
  return (
    <Section id={block.id} tone={block.tone} ruled={false} className="quotes-section">
      <div className="quotes-head">
        <div>
          <p className="t-eyebrow eyebrow-accent m-0">{block.label}</p>
          <h2 id={`${block.id}-h`} className="home-h2 mt-4">
            {block.heading}
          </h2>
        </div>
        {more ? (
          <Link href="/testimonials/" className="mega-foot-link">
            Read all client testimonials <Arrow />
          </Link>
        ) : null}
      </div>
      <ul className="tq-grid" data-count={block.items.length} data-reveal="group">
        {block.items.map((q) => (
          <li key={q.name}>
            <QuoteCard {...q} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
