import Link from "next/link";
import type { ReactNode } from "react";
import { Check, Clock, Quote } from "lucide-react";
import { Figure } from "@/components/figures/Figure";
import { Arrow } from "@/components/primitives/Arrow";
import { Icon } from "@/components/primitives/Icon";
import { Inline } from "@/components/primitives/Inline";
import { LinkButton } from "@/components/primitives/LinkButton";
import { getRegistry } from "@/lib/content/load";
import type { Block } from "@/lib/content/schema";
import { pathExists } from "@/lib/content/urls";
import { Section, SectionHeader } from "./Section";

type Of<T extends Block["type"]> = Extract<Block, { type: T }>;

/** A link only when its page exists; otherwise the label as plain text (no dead links). */
function useLive() {
  const registry = getRegistry();
  return (href: string) =>
    href.startsWith("#") || pathExists(href.split(/[?#]/)[0] ?? "", registry);
}

function MoreLink({ cta }: { cta?: { label: string; href: string } }) {
  const live = useLive();
  if (!cta || !live(cta.href)) return null;
  return (
    <p className="mt-8 m-0">
      <Link href={cta.href} className="text-link-strong">
        {cta.label}
        <Arrow />
      </Link>
    </p>
  );
}

/** Heading on the left and the intro beside it on wide screens, so no half of the row is empty. */
function SplitHeader({
  id,
  label,
  heading,
  intro,
}: {
  id: string;
  label: string;
  heading: string;
  intro?: string;
}) {
  return (
    <div className="split-header" data-reveal="block">
      <div>
        <p className="t-eyebrow eyebrow-accent m-0">{label}</p>
        <h2 id={`${id}-h`} className="t-h2 mt-3 max-w-[22ch]">
          {heading}
        </h2>
      </div>
      {intro ? (
        <p className="t-body-lg split-intro m-0">
          <Inline text={intro} />
        </p>
      ) : null}
    </div>
  );
}

/** Wraps a section whose facts are not supplied yet. Only ever rendered in a review build. */
export function DraftFrame({ children }: { children: ReactNode }) {
  return (
    <div className="draft-frame" data-draft="true">
      <p className="draft-tag" role="note">
        Draft for review: sample layout and placeholder content, removed from the live site until
        real details are supplied.
      </p>
      {children}
    </div>
  );
}

export function LeadServicesBlock({ block }: { block: Of<"lead-services"> }) {
  const live = useLive();
  return (
    <Section id={block.id} tone={block.tone} className="lead-services">
      <SplitHeader id={block.id} label={block.label} heading={block.heading} intro={block.intro} />
      <ul className="lead-grid" data-reveal="group">
        {block.items.map((s, i) => (
          <li key={s.title} className="lead-tile">
            <div className="lead-visual">
              <Figure
                id={s.figure}
                uid={`${block.id}-${i}`}
                caption={`${s.title}: a conceptual interface.`}
              />
            </div>
            <div className="lead-copy">
              <p className="lead-kicker">{s.kicker}</p>
              <h3 className="t-h3 lead-title">
                {live(s.href) ? (
                  <Link href={s.href} className="stretched-link">
                    {s.title}
                  </Link>
                ) : (
                  s.title
                )}
              </h3>
              <p className="t-body mt-3">
                <Inline text={s.body} />
              </p>
              <ul className="check-list mt-5">
                {s.includes.map((x) => (
                  <li key={x}>
                    <Check aria-hidden="true" className="check-icon" strokeWidth={2.25} />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
              <p className="lead-action" aria-hidden="true">
                {s.action}
                <Arrow />
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function FeatureGridBlock({ block }: { block: Of<"feature-grid"> }) {
  const live = useLive();
  return (
    <Section id={block.id} tone={block.tone}>
      <SplitHeader id={block.id} label={block.label} heading={block.heading} intro={block.intro} />
      <ul className={`feature-grid feature-${block.style}`} data-reveal="group">
        {block.items.map((f) => {
          const linked = f.href && live(f.href);
          return (
            <li key={f.title} className={`feature-card${linked ? " is-linked" : ""}`}>
              <span className="feature-icon">
                <Icon name={f.icon} />
              </span>
              <h3 className="feature-title">
                {linked ? (
                  <Link href={f.href ?? ""} className="stretched-link">
                    {f.title}
                  </Link>
                ) : (
                  f.title
                )}
              </h3>
              {f.body ? (
                <p className="feature-body">
                  <Inline text={f.body} />
                </p>
              ) : null}
              {linked && block.style === "cards" ? (
                <span className="feature-arrow" aria-hidden="true">
                  <Arrow />
                </span>
              ) : null}
            </li>
          );
        })}
      </ul>
      <MoreLink cta={block.more} />
    </Section>
  );
}

export function ServiceStripBlock({ block }: { block: Of<"service-strip"> }) {
  const live = useLive();
  return (
    <Section id={block.id} tone={block.tone}>
      <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-4">
          <SectionHeader
            id={block.id}
            label={block.label}
            heading={block.heading}
            intro={block.intro}
          />
        </div>
        <div className="lg:col-span-8">
          <ul className="service-strip" data-reveal="group">
            {block.items.map((s) =>
              live(s.href) ? (
                <li key={s.title}>
                  <Link href={s.href} className="service-pill">
                    <Icon name={s.icon} />
                    <span>{s.title}</span>
                    <Arrow />
                  </Link>
                </li>
              ) : (
                <li key={s.title}>
                  <span className="service-pill">
                    <Icon name={s.icon} />
                    <span>{s.title}</span>
                  </span>
                </li>
              ),
            )}
          </ul>
          <MoreLink cta={block.more} />
        </div>
      </div>
    </Section>
  );
}

export function PricingBlock({ block }: { block: Of<"pricing"> }) {
  const live = useLive();
  return (
    <Section id={block.id} tone={block.tone} className="pricing">
      <SplitHeader id={block.id} label={block.label} heading={block.heading} intro={block.intro} />
      <ul className="price-grid" data-reveal="group">
        {block.plans.map((p) => (
          <li key={p.name} className={`price-card${p.featured ? " is-featured" : ""}`}>
            <h3 className="price-name">{p.name}</h3>
            <p className="price-range">{p.range}</p>
            <p className="price-time">
              <Clock aria-hidden="true" className="price-clock" strokeWidth={2} />
              {p.timeline}
            </p>
            <p className="price-summary">
              <Inline text={p.summary} />
            </p>
            <ul className="check-list">
              {p.includes.map((x) => (
                <li key={x}>
                  <Check aria-hidden="true" className="check-icon" strokeWidth={2.25} />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <div className="price-foot" data-reveal="block">
        <div className="price-factors">
          <h3 className="t-h4">{block.factors.title}</h3>
          <ul className="factor-list">
            {block.factors.items.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
        <div className="price-next">
          {block.note ? (
            <p className="t-body m-0">
              <Inline text={block.note} />
            </p>
          ) : null}
          {live(block.cta.href) ? (
            <LinkButton href={block.cta.href} arrow className="mt-6">
              {block.cta.label}
            </LinkButton>
          ) : null}
        </div>
      </div>
    </Section>
  );
}

export function CaseStudiesBlock({ block }: { block: Of<"case-studies"> }) {
  const live = useLive();
  return (
    <Section id={block.id} tone={block.tone}>
      <SplitHeader id={block.id} label={block.label} heading={block.heading} intro={block.intro} />
      <ul className="case-grid" data-reveal="group">
        {block.items.map((c) => (
          <li key={c.title} className="case-card">
            <p className="case-meta">
              <span className="case-sector">{c.sector}</span>
              <span>{c.client}</span>
            </p>
            <h3 className="t-h3 case-title">
              {c.href && live(c.href) ? (
                <Link href={c.href} className="stretched-link">
                  {c.title}
                </Link>
              ) : (
                c.title
              )}
            </h3>
            <p className="t-body mt-3">
              <Inline text={c.summary} />
            </p>
            <dl className="case-results">
              {c.results.map((r) => (
                <div key={r.label}>
                  <dt>{r.label}</dt>
                  <dd>{r.value}</dd>
                </div>
              ))}
            </dl>
            {c.services.length > 0 ? (
              <ul className="case-tags">
                {c.services.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function TestimonialsBlock({ block }: { block: Of<"testimonials"> }) {
  return (
    <Section id={block.id} tone={block.tone}>
      <div className="max-w-[52rem]">
        <SectionHeader id={block.id} label={block.label} heading={block.heading} />
      </div>
      <ul className="quote-grid" data-reveal="group">
        {block.items.map((q) => (
          <li key={q.name}>
            <figure className="quote-card">
              <Quote aria-hidden="true" className="quote-mark" strokeWidth={1.5} />
              <blockquote className="quote-text">
                <p>{q.quote}</p>
              </blockquote>
              <figcaption className="quote-who">
                <span className="quote-name">{q.name}</span>
                <span className="quote-role">
                  {q.role}, {q.company}
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function LogosBlock({ block }: { block: Of<"logos"> }) {
  const mark = (i: (typeof block.items)[number]) => (
    <>
      {i.icon ? <Icon name={i.icon} /> : null}
      <span>{i.name}</span>
    </>
  );
  const headingId = `${block.id}-h`;
  return (
    <section id={block.id} aria-labelledby={headingId} className={`logos tone-${block.tone}`}>
      <div className="container-site">
        <h2 id={headingId} className="logos-label">
          {block.heading ?? block.label}
        </h2>
        {block.style === "strip" ? (
          <div className="logo-strip">
            {/* The list is read once; the visual copy that makes the loop seamless is hidden. */}
            <ul className="logo-track">
              {block.items.map((i) => (
                <li key={i.name} className="logo-mark">
                  {mark(i)}
                </li>
              ))}
            </ul>
            <ul className="logo-track" aria-hidden="true">
              {block.items.map((i) => (
                <li key={i.name} className="logo-mark">
                  {mark(i)}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <ul className="logo-grid">
            {block.items.map((i) => (
              <li key={i.name} className="logo-mark">
                {mark(i)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export function PromiseBlock({ block }: { block: Of<"promise"> }) {
  return (
    <Section id={block.id} tone={block.tone} className="promise">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-end" data-reveal="block">
        <div className="lg:col-span-7">
          <p className="t-eyebrow eyebrow-accent m-0">{block.label}</p>
          <h2 id={`${block.id}-h`} className="promise-heading mt-4">
            {block.heading}
          </h2>
        </div>
        <p className="t-body-lg m-0 lg:col-span-5">
          <Inline text={block.body} />
        </p>
      </div>
      <ul className="promise-list" data-reveal="group">
        {block.items.map((p, i) => (
          <li key={p.title}>
            <span className="promise-n" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="t-h4">{p.title}</h3>
            <p className="t-body mt-2 m-0">
              <Inline text={p.body} />
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
