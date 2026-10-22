import Link from "next/link";
import { Quotes } from "@phosphor-icons/react/dist/ssr";
import { TestimonialWall } from "@/components/home/TestimonialWall";
import { TestimonialSpotlight } from "@/components/home/TestimonialSpotlight";
import { Arrow } from "@/components/primitives/Arrow";
import { Icon } from "@/components/primitives/Icon";
import { Photo } from "@/components/primitives/Photo";
import { getRegistry } from "@/lib/content/load";
import type { Block } from "@/lib/content/schema";
import { testimonials, type Testimonial } from "@/lib/content/testimonials";
import { SERVICE_ICONS, SplitHeader } from "./HomeBlocks";
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

/** Service and industry names and pages, for quotes read straight from the data file. */
function tagger() {
  const registry = getRegistry();
  const services = new Map(registry.services.map((s) => [s.slug, s.name]));
  const industryPath = new Map(
    registry.pages.filter((p) => p.kind === "industry" && p.entityId).map((p) => [p.entityId!, p]),
  );
  return {
    service: (t: Testimonial): Tag => ({
      label: services.get(t.service) ?? t.service,
      href: `/${t.service}/`,
    }),
    industry: (t: Testimonial): Tag => ({
      label: registry.nodes.get(t.industry)?.name ?? t.industry,
      href: industryPath.get(t.industry)?.path,
    }),
  };
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

/** Every testimonial, filtered by service or industry, nine at a time. */
export function TestimonialWallBlock({ block }: { block: Of<"testimonial-wall"> }) {
  const all = testimonials();
  const tag = tagger();
  const facet = (key: (t: Testimonial) => string, label: (t: Testimonial) => string) => {
    const m = new Map<string, { label: string; count: number }>();
    for (const t of all) {
      const f = m.get(key(t)) ?? { label: label(t), count: 0 };
      f.count++;
      m.set(key(t), f);
    }
    return [...m].map(([k, v]) => ({ key: k, ...v }));
  };
  return (
    <Section id={block.id} tone={block.tone} ruled={false}>
      <SplitHeader id={block.id} label={block.label} heading={block.heading} intro={block.intro} />
      <div className="mt-8">
        <TestimonialWall
          services={facet(
            (t) => t.service,
            (t) => tag.service(t).label,
          )}
          industries={facet(
            (t) => t.industry,
            (t) => tag.industry(t).label,
          ).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))}
          cards={all.map((t) => ({
            key: t.id,
            service: t.service,
            industry: t.industry,
            node: <QuoteCard {...t} tags={[tag.service(t), tag.industry(t)]} />,
          }))}
        />
      </div>
    </Section>
  );
}

/** A few voices, one large at a time, chosen from a row of people. */
export function TestimonialSpotlightBlock({ block }: { block: Of<"testimonial-spotlight"> }) {
  const tag = tagger();
  const byName = new Map(testimonials().map((t) => [t.name, t]));
  const picked = block.names.map((n) => byName.get(n)).filter((t): t is Testimonial => !!t);
  return (
    <Section id={block.id} tone={block.tone} ruled={false}>
      <SplitHeader id={block.id} label={block.label} heading={block.heading} intro={block.intro} />
      <TestimonialSpotlight
        label={block.heading}
        items={picked.map((t) => ({
          id: t.id,
          name: t.name,
          company: t.company,
          avatar: <Initials name={t.name} size="sm" />,
          panel: (
            <figure className="tqs-figure">
              <Quotes aria-hidden="true" weight="fill" className="tqs-mark" />
              <blockquote className="tqs-quote">
                <p>{t.quote}</p>
              </blockquote>
              <figcaption className="tqs-who">
                <Initials name={t.name} size="lg" />
                <span className="tq-id">
                  <span className="tqs-name">{t.name}</span>
                  <span className="tq-role">
                    {t.role}, {t.company}
                  </span>
                </span>
                <span className="tqs-tags">
                  <TagLink tag={tag.service(t)} className="tq-svc" />
                  <TagLink tag={tag.industry(t)} className="tq-chip" />
                </span>
              </figcaption>
            </figure>
          ),
        }))}
      />
    </Section>
  );
}

/** One card per service: the clients who spoke about it, and a link to the service page. */
export function TestimonialServicesBlock({ block }: { block: Of<"testimonial-services"> }) {
  const registry = getRegistry();
  const all = testimonials();
  const services = [...registry.services].filter((s) => all.some((t) => t.service === s.slug));
  return (
    <Section id={block.id} tone={block.tone} ruled={false}>
      <SplitHeader id={block.id} label={block.label} heading={block.heading} intro={block.intro} />
      <ul className="tqv-grid" data-reveal="group">
        {services.map((s) => {
          const people = all.filter((t) => t.service === s.slug);
          const first = people[0]!;
          const href = `/${s.slug}/`;
          const live = registry.pageByPath.has(href);
          return (
            <li key={s.slug} className="tqv">
              <div className="tqv-head">
                <span className="tqv-icon">
                  <Icon name={SERVICE_ICONS[s.slug] ?? "sparkles"} weight="duotone" />
                </span>
                <h3 className="tqv-title">{s.name}</h3>
              </div>
              <p className="tqv-quote">{first.quote}</p>
              <ul className="tqv-people">
                {people.map((t) => (
                  <li key={t.id}>
                    <Initials name={t.name} size="sm" />
                    <span>
                      <strong>{t.name}</strong>
                      <span>{t.company}</span>
                    </span>
                  </li>
                ))}
              </ul>
              {live ? (
                <Link
                  href={`${href}#client-quotes`}
                  className="tqv-go"
                  aria-label={`See the ${s.name} service`}
                >
                  See the service <Arrow />
                </Link>
              ) : null}
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

/** How a project with us goes: a photograph beside numbered steps. */
export function JourneyBlock({ block }: { block: Of<"journey"> }) {
  return (
    <Section id={block.id} tone={block.tone} ruled={false}>
      <div className="journey">
        <div className="journey-photo">
          <Photo photo={block.photo} />
        </div>
        <div className="journey-body">
          <SplitHeader
            id={block.id}
            label={block.label}
            heading={block.heading}
            intro={block.intro}
          />
          <ol className="journey-steps" data-reveal="group">
            {block.steps.map((s, i) => (
              <li key={s.title} className="journey-step">
                <span className="journey-n" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="journey-title">{s.title}</h3>
                  <p className="journey-text">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
