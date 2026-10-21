import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight, CheckCircle, Clock, Quotes } from "@phosphor-icons/react/dist/ssr";
import { Figure } from "@/components/figures/Figure";
import Image from "next/image";
import {
  CaseViewer,
  CountUp,
  ExplorerPanel,
  PhaseScroller,
  RevealText,
  ServiceExplorer,
} from "@/components/home/Motion";
import { TechLogo } from "@/components/home/TechLogo";
import { TestimonialWall } from "@/components/home/TestimonialWall";
import { PortfolioGrid } from "@/components/home/PortfolioGrid";
import { PortfolioCard } from "./PortfolioCard";
import { projectPath, projects } from "@/lib/content/portfolio";
import { Arrow } from "@/components/primitives/Arrow";
import { Icon } from "@/components/primitives/Icon";
import { Inline } from "@/components/primitives/Inline";
import { LinkButton } from "@/components/primitives/LinkButton";
import { Photo } from "@/components/primitives/Photo";
import { expandFacts } from "@/lib/content/inline";
import { getRegistry, showDrafts } from "@/lib/content/load";
import type { Block, IconName } from "@/lib/content/schema";
import { pathExists, publishedPath } from "@/lib/content/urls";
import { Section } from "./Section";

type Of<T extends Block["type"]> = Extract<Block, { type: T }>;

/** A link only when its page exists; otherwise the label as plain text (no dead links). */
function useLive() {
  const registry = getRegistry();
  return (href: string) =>
    href.startsWith("#") || pathExists(href.split(/[?#]/)[0] ?? "", registry);
}

/** Facts expanded, plus {{years}}: whole years since the founding year in the facts register. */
function statValue(raw: string): string {
  const registry = getRegistry();
  const founded = Number(registry.facts.get("company.founded")?.value ?? "0");
  const years = founded ? new Date().getFullYear() - founded : 0;
  return expandFacts(raw, registry.facts).replace("{{years}}", String(years));
}

function MoreLink({ cta }: { cta?: { label: string; href: string } }) {
  const live = useLive();
  if (!cta || !live(cta.href)) return null;
  return (
    <p className="more-link">
      <Link href={cta.href} className="btn btn-ghost">
        {cta.label}
        <Arrow />
      </Link>
    </p>
  );
}

/** Heading on the left and the intro (or an action) beside it on wide screens. */
function SplitHeader({
  id,
  label,
  heading,
  intro,
  aside,
}: {
  id: string;
  label: string;
  heading: string;
  intro?: string;
  aside?: ReactNode;
}) {
  return (
    <div className={`split-header${aside ? " has-aside" : ""}`} data-reveal="block">
      <div className="split-main">
        <p className="t-eyebrow eyebrow-accent m-0">{label}</p>
        <h2 id={`${id}-h`} className="home-h2 mt-4">
          {heading}
        </h2>
        {intro ? (
          <p className="split-intro">
            <Inline text={intro} />
          </p>
        ) : null}
      </div>
      {aside ? <div className="split-side">{aside}</div> : null}
    </div>
  );
}

function Checks({ items }: { items: string[] }) {
  return (
    <ul className="check-list">
      {items.map((x) => (
        <li key={x}>
          <CheckCircle aria-hidden="true" weight="light" className="check-icon" />
          <span>{x}</span>
        </li>
      ))}
    </ul>
  );
}

/** A testimonial portrait: the person's photograph in a circle, or their initials. */
function Avatar({ photo, name }: { photo?: { asset: string }; name: string }) {
  const asset = photo ? getRegistry().assets.find((a) => a.id === photo.asset) : undefined;
  if (!asset || !asset.width || !asset.height) {
    return (
      <span className="quote-avatar" aria-hidden="true">
        {name
          .split(/s+/)
          .map((w) => w[0])
          .slice(0, 2)
          .join("")}
      </span>
    );
  }
  return (
    <Image
      className="quote-avatar quote-photo"
      src={`/${asset.file.replace(/^public\//, "")}`}
      alt=""
      width={112}
      height={112}
      sizes="56px"
      quality={85}
    />
  );
}

/** Icons for the fifteen services, by slug. */
const SERVICE_ICONS: Record<string, IconName> = {
  "software-development": "code",
  "web-development": "globe",
  "mobile-app-development": "phone",
  ecommerce: "cart",
  ai: "sparkles",
  automation: "workflow",
  "data-analytics": "chart",
  "api-integration": "plug",
  cloud: "cloud",
  cybersecurity: "shield",
  "ui-ux": "pen",
  branding: "palette",
  "seo-aeo-geo": "search",
  "digital-marketing": "megaphone",
  consulting: "compass",
};

export function ServiceExplorerBlock({ block }: { block: Of<"service-explorer"> }) {
  const registry = getRegistry();
  const families = block.families.map((f) => {
    const label = registry.families.find((x) => x.id === f.id)?.label ?? f.id;
    const services = registry.services.filter((s) => s.family === f.id);
    return { ...f, label, services };
  });
  return (
    <Section id={block.id} tone={block.tone} ruled={false}>
      <SplitHeader
        id={block.id}
        label={block.label}
        heading={block.heading}
        intro={block.intro}
        aside={<MoreLink cta={block.more} />}
      />
      <ServiceExplorer
        tabs={families.map((f) => ({ label: f.label, count: f.services.length }))}
        panels={families.map((f) => (
          <ExplorerPanel
            key={f.id}
            family={f.label}
            blurb={f.blurb}
            photos={f.services.map((s) => {
              const p = block.servicePhotos[s.slug];
              return p ? <Photo key={s.slug} photo={p} /> : null;
            })}
            captions={f.services.map((s) => ({ name: s.name, text: s.micro }))}
            cards={f.services.map((s) => {
              const href = `/${s.slug}/`;
              const live = pathExists(href, registry);
              const inner = (
                <>
                  <span className="feature-icon">
                    <Icon name={SERVICE_ICONS[s.slug] ?? "code"} />
                  </span>
                  <span className="explorer-text">
                    <span className="explorer-name">{s.name}</span>
                    <span className="explorer-micro">{s.micro}</span>
                  </span>
                  {live ? <HoverArrow /> : null}
                </>
              );
              return live ? (
                <Link key={s.slug} href={href} className="explorer-card link-card" data-spotlight>
                  {inner}
                </Link>
              ) : (
                <span key={s.slug} className="explorer-card">
                  {inner}
                </span>
              );
            })}
          />
        ))}
      />
    </Section>
  );
}

/** The "this opens another page" signal: an arrow that appears in the corner on hover or focus. */
export function HoverArrow() {
  return <ArrowUpRight aria-hidden="true" weight="regular" className="hover-arrow" />;
}

/** Draft sections exist only in review builds (see showDrafts); they render like any other. */
export function DraftFrame({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function StatsBlock({ block }: { block: Of<"stats"> }) {
  return (
    <Section id={block.id} tone={block.tone} className="stats-band" ruled={false}>
      <div className="stats-grid">
        <div>
          <p className="t-eyebrow eyebrow-accent m-0" data-reveal="block">
            {block.label}
          </p>
          <h2 id={`${block.id}-h`} className="home-h2 mt-4" data-reveal="block">
            {block.heading}
          </h2>
          {block.intro ? (
            <p className="split-intro mt-5" data-reveal="block">
              <Inline text={block.intro} />
            </p>
          ) : null}
          <dl className="stat-list">
            {block.items.map((s) => (
              <div key={s.label} className="stat">
                <dt>{s.label}</dt>
                <dd>
                  <CountUp value={statValue(s.value)} />
                </dd>
                {s.detail ? <p className="stat-detail">{s.detail}</p> : null}
              </div>
            ))}
          </dl>
        </div>
        {block.photo ? (
          <figure className="stats-photo">
            <Photo photo={block.photo} />
            {block.photoNote ? (
              <figcaption className="photo-note">{block.photoNote}</figcaption>
            ) : null}
          </figure>
        ) : null}
      </div>
    </Section>
  );
}

export function RevealBlock({ block }: { block: Of<"reveal"> }) {
  return (
    <section
      id={block.id}
      aria-labelledby={`${block.id}-h`}
      className={`section tone-${block.tone} reveal-band`}
    >
      <span className="beam beam-c" aria-hidden="true" />
      <div className="container-site">
        <h2 id={`${block.id}-h`} className="t-eyebrow eyebrow-accent m-0">
          {block.label}
        </h2>
        <RevealText text={block.text} className="mt-6" />
        {block.note ? <p className="reveal-note">{block.note}</p> : null}
      </div>
    </section>
  );
}

export function LeadServicesBlock({ block }: { block: Of<"lead-services"> }) {
  const live = useLive();
  return (
    <Section id={block.id} tone={block.tone} className="lead-services" ruled={false}>
      <SplitHeader id={block.id} label={block.label} heading={block.heading} intro={block.intro} />
      <ol className="lead-rows">
        {block.items.map((s, i) => (
          <li key={s.title} className="lead-row" data-reveal="block">
            <div className="lead-copy">
              <p className="lead-word" aria-hidden="true">
                {s.word ?? s.title}
              </p>
              <p className="lead-kicker">{s.kicker}</p>
              <h3 className="lead-title">
                {live(s.href) ? <Link href={s.href}>{s.title}</Link> : s.title}
              </h3>
              <p className="lead-body">
                <Inline text={s.body} />
              </p>
              <Checks items={s.includes} />
              {live(s.href) ? (
                <Link href={s.href} className="btn btn-ghost mt-8" aria-label={s.action}>
                  {s.action}
                  <Arrow />
                </Link>
              ) : null}
            </div>
            {live(s.href) ? (
              <Link
                href={s.href}
                className={`lead-visual glass link-card${s.photo ? " has-photo" : ""}`}
                data-spotlight
                aria-label={s.action}
              >
                {s.photo ? (
                  <Photo photo={s.photo} />
                ) : s.figure ? (
                  <Figure
                    id={s.figure}
                    uid={`${block.id}-${i}`}
                    caption={`${s.title}: a conceptual interface.`}
                  />
                ) : null}
                <HoverArrow />
              </Link>
            ) : (
              <div className={`lead-visual glass${s.photo ? " has-photo" : ""}`} data-spotlight>
                {s.photo ? (
                  <Photo photo={s.photo} />
                ) : s.figure ? (
                  <Figure
                    id={s.figure}
                    uid={`${block.id}-${i}`}
                    caption={`${s.title}: a conceptual interface.`}
                  />
                ) : null}
              </div>
            )}
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function FeatureGridBlock({ block }: { block: Of<"feature-grid"> }) {
  const live = useLive();
  return (
    <Section id={block.id} tone={block.tone} ruled={false}>
      <SplitHeader
        id={block.id}
        label={block.label}
        heading={block.heading}
        intro={block.intro}
        aside={<MoreLink cta={block.more} />}
      />
      <ul className={`feature-grid feature-${block.style}`} data-reveal="group">
        {block.items.map((f) => {
          const linked = Boolean(f.href && live(f.href));
          return (
            <li
              key={f.title}
              className={`feature-card${linked ? " is-linked link-card" : ""}`}
              data-spotlight
            >
              <span className="feature-icon">
                <Icon name={f.icon} weight={block.style === "panels" ? "thin" : "light"} />
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
              {linked ? <HoverArrow /> : null}
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

export function ServiceStripBlock({ block }: { block: Of<"service-strip"> }) {
  const live = useLive();
  return (
    <Section id={block.id} tone={block.tone} ruled={false}>
      <SplitHeader
        id={block.id}
        label={block.label}
        heading={block.heading}
        intro={block.intro}
        aside={<MoreLink cta={block.more} />}
      />
      <ul className="service-strip" data-reveal="group">
        {block.items.map((s) => (
          <li key={s.title}>
            {live(s.href) ? (
              <Link href={s.href} className="service-pill" data-spotlight>
                <Icon name={s.icon} />
                <span>{s.title}</span>
                <Arrow />
              </Link>
            ) : (
              <span className="service-pill">
                <Icon name={s.icon} />
                <span>{s.title}</span>
              </span>
            )}
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function StackBlock({ block }: { block: Of<"stack"> }) {
  const registry = getRegistry();
  return (
    <Section id={block.id} tone={block.tone} className="stack" ruled={false}>
      <div className="stack-grid">
        <div className="stack-head">
          <p className="t-eyebrow eyebrow-accent m-0">{block.label}</p>
          <h2 id={`${block.id}-h`} className="home-h2 mt-4">
            {block.heading}
          </h2>
          {block.intro ? (
            <p className="split-intro mt-5">
              <Inline text={block.intro} />
            </p>
          ) : null}
          <MoreLink cta={block.more} />
        </div>
        <div className="stack-groups">
          {block.groups.map((g) => (
            <div key={g.title} className="stack-group">
              <h3 className="stack-title">{g.title}</h3>
              <ul className="stack-tiles" data-reveal="group">
                {g.entityIds.map((id) => {
                  const node = registry.nodes.get(id);
                  if (!node) return null;
                  const href = publishedPath(node, registry);
                  const inner = (
                    <>
                      <TechLogo id={id} name={node.name} />
                      <span className="stack-name">{node.name}</span>
                    </>
                  );
                  return (
                    <li key={id}>
                      {href ? (
                        <Link href={href} className="stack-tile link-card" data-spotlight>
                          {inner}
                          <HoverArrow />
                        </Link>
                      ) : (
                        <span className="stack-tile">{inner}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function PhasesBlock({ block }: { block: Of<"phases"> }) {
  return (
    <Section id={block.id} tone={block.tone} ruled={false}>
      <SplitHeader id={block.id} label={block.label} heading={block.heading} intro={block.intro} />
      <PhaseScroller
        photos={block.steps.map((s) => (
          <Photo key={s.title} photo={s.photo} />
        ))}
      >
        {block.steps.map((s, i) => (
          <div key={s.title} className="phase-body">
            <div className="phase-inline-photo">
              <Photo photo={s.photo} />
            </div>
            <p className="phase-n">Phase {String(i + 1).padStart(2, "0")}</p>
            <h3 className="phase-title">{s.title}</h3>
            <p className="phase-summary">
              <Inline text={s.summary} />
            </p>
            {s.tags.length ? (
              <ul className="phase-tags">
                {s.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            ) : null}
            <div className="phase-cols">
              <div>
                <h4 className="phase-sub">Activities</h4>
                <ul className="dot-list">
                  {s.activities.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="phase-sub">Deliverables</h4>
                <ul className="dot-list">
                  {s.deliverables.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </PhaseScroller>
    </Section>
  );
}

export function InsightsBlock({ block }: { block: Of<"insights"> }) {
  const live = useLive();
  return (
    <Section id={block.id} tone={block.tone} ruled={false}>
      <SplitHeader
        id={block.id}
        label={block.label}
        heading={block.heading}
        intro={block.intro}
        aside={<MoreLink cta={block.more} />}
      />
      <ul className="insight-grid" data-reveal="group">
        {block.items.map((it) => (
          <li key={it.title} className={`insight-card${live(it.href) ? " link-card" : ""}`}>
            {live(it.href) ? <HoverArrow /> : null}
            <div className="insight-photo">
              <Photo photo={it.photo} />
            </div>
            <p className="insight-cat">{it.category}</p>
            <h3 className="insight-title">
              {live(it.href) ? (
                <Link href={it.href} className="stretched-link">
                  {it.title}
                </Link>
              ) : (
                it.title
              )}
            </h3>
            <p className="insight-summary">{it.summary}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function PricingBlock({ block }: { block: Of<"pricing"> }) {
  const live = useLive();
  return (
    <Section id={block.id} tone={block.tone} className="pricing" ruled={false}>
      <SplitHeader id={block.id} label={block.label} heading={block.heading} intro={block.intro} />
      <ul className="price-grid" data-reveal="group">
        {block.plans.map((p) => (
          <li key={p.name} className="price-card" data-spotlight>
            <h3 className="price-name">{p.name}</h3>
            <p className="price-from">Typical range</p>
            <p className="price-range">{p.range}</p>
            <p className="price-summary">
              <Inline text={p.summary} />
            </p>
            <p className="price-time">
              <Clock aria-hidden="true" weight="light" className="price-clock" />
              {p.timeline}
            </p>
          </li>
        ))}
      </ul>
      <div className="price-foot" data-reveal="block">
        <div>
          <h3 className="price-foot-title">{block.factors.title}</h3>
          <ul className="factor-chips">
            {block.factors.items.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
        <div className="price-next">
          {block.note ? (
            <p className="m-0">
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
  return (
    <Section id={block.id} tone={block.tone} ruled={false}>
      <SplitHeader id={block.id} label={block.label} heading={block.heading} intro={block.intro} />
      <CaseViewer
        labels={block.items.map((c) => c.client)}
        panels={block.items.map((c) => (
          <article key={c.title} className="case">
            {c.photo ? (
              <div className="case-photo">
                <Photo photo={c.photo} />
              </div>
            ) : null}
            <div className="case-body">
              <p className="case-meta">
                <span>{c.sector}</span>
              </p>
              <h3 className="case-title">{c.title}</h3>
              <p className="case-summary">
                <Inline text={c.summary} />
              </p>
              {c.services.length > 0 ? (
                <ul className="phase-tags">
                  {c.services.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              ) : null}
              <dl className="case-results">
                {c.results.map((r) => (
                  <div key={r.label}>
                    <dt>{r.label}</dt>
                    <dd>
                      <CountUp value={r.value} />
                    </dd>
                  </div>
                ))}
              </dl>
              {c.href && getRegistry().pageByPath.has(c.href) ? (
                <Link href={c.href} className="case-card-go mt-5">
                  Read the case study <Arrow />
                </Link>
              ) : null}
            </div>
          </article>
        ))}
      />
    </Section>
  );
}

export function TestimonialsBlock({ block }: { block: Of<"testimonials"> }) {
  return (
    <Section id={block.id} tone={block.tone} ruled={false}>
      <SplitHeader id={block.id} label={block.label} heading={block.heading} />
      <ul className="quote-grid" data-reveal="group">
        {block.items.map((q) => (
          <li key={q.name}>
            <figure className="quote-card" data-spotlight>
              <Quotes aria-hidden="true" weight="fill" className="quote-mark" />
              <blockquote className="quote-text">
                <p>{q.quote}</p>
              </blockquote>
              <figcaption className="quote-who">
                <Avatar photo={q.photo} name={q.name} />
                <span>
                  <span className="quote-name">{q.name}</span>
                  <span className="quote-role">
                    {q.role}, {q.company}
                  </span>
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
      {getRegistry().pageByPath.has("/testimonials/") ? (
        <div className="quote-more">
          <Link href="/testimonials/" className="mega-foot-link">
            See all client testimonials <Arrow />
          </Link>
        </div>
      ) : null}
    </Section>
  );
}

export function LogosBlock({ block }: { block: Of<"logos"> }) {
  const headingId = `${block.id}-h`;
  const mark = (i: (typeof block.items)[number]) => (
    <>
      {i.icon ? <Icon name={i.icon} weight="duotone" /> : null}
      <span>{i.name}</span>
    </>
  );
  return (
    <section id={block.id} aria-labelledby={headingId} className={`logos tone-${block.tone}`}>
      <div className="container-site">
        <h2 id={headingId} className="logos-label">
          {block.heading ?? block.label}
        </h2>
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
      </div>
    </section>
  );
}

export function PromiseBlock({ block }: { block: Of<"promise"> }) {
  return (
    <Section id={block.id} tone={block.tone} className="promise" ruled={false}>
      <SplitHeader id={block.id} label={block.label} heading={block.heading} intro={block.body} />
      <ul className="promise-list" data-reveal="group">
        {block.items.map((p, i) => (
          <li key={p.title} data-spotlight>
            <span className="promise-n" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="promise-title">{p.title}</h3>
            <p className="m-0">
              <Inline text={p.body} />
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function PartnersBlock({ block }: { block: Of<"partners"> }) {
  const inviteOk = block.invite
    ? pathExists(block.invite.cta.href.split(/[?#]/)[0] ?? "", getRegistry())
    : false;
  return (
    <Section id={block.id} tone={block.tone} className="partners" ruled={false}>
      <SplitHeader id={block.id} label={block.label} heading={block.heading} intro={block.intro} />
      <div className="partners-grid" data-reveal="group">
        {block.items.map((p) => (
          <article key={p.name} className="partner-card" data-spotlight>
            <div className="partner-top">
              <span className="partner-mark">
                <TechLogo id={p.entityId} name={p.name} />
              </span>
              <span className="partner-kind">{p.kind}</span>
            </div>
            <h3 className="partner-name">{p.name}</h3>
            <p className="partner-text">{p.text}</p>
          </article>
        ))}
        {block.invite ? (
          <article className="partner-card partner-invite">
            <span className="partner-invite-icon" aria-hidden="true">
              <Icon name="handshake" weight="regular" />
            </span>
            <h3 className="partner-name">{block.invite.title}</h3>
            <p className="partner-text">{block.invite.body}</p>
            {inviteOk ? (
              <Link href={block.invite.cta.href} className="partner-invite-link">
                {block.invite.cta.label}
                <Arrow />
              </Link>
            ) : null}
          </article>
        ) : null}
      </div>
    </Section>
  );
}

export function CaseGridBlock({ block }: { block: Of<"case-grid"> }) {
  const registry = getRegistry();
  const drafts = showDrafts();
  const facet = (key: "service" | "industry", label: "serviceLabel" | "industryLabel") => {
    const m = new Map<string, { label: string; count: number }>();
    for (const i of block.items) {
      const k = i[key];
      if (!k) continue;
      const f = m.get(k) ?? { label: i[label] ?? k, count: 0 };
      f.count++;
      m.set(k, f);
    }
    return [...m]
      .map(([k, v]) => ({ key: k, ...v }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  };
  const list = block.items
    .map((i) => projects().find((p) => projectPath(p) === i.href))
    .filter((p): p is NonNullable<typeof p> => !!p);
  return (
    <Section id={block.id} tone={block.tone} ruled={false}>
      <SplitHeader id={block.id} label={block.label} heading={block.heading} intro={block.intro} />
      <div className="mt-10">
        <PortfolioGrid
          services={facet("service", "serviceLabel")}
          industries={facet("industry", "industryLabel")}
          cards={list.map((p) => ({
            key: p.slug,
            service: p.service,
            industry: p.industry,
            node: <PortfolioCard project={p} registry={registry} drafts={drafts} />,
          }))}
        />
      </div>
      {block.items.length <= 6 ? (
        <div className="quote-more">
          <Link href="/work/" className="mega-foot-link">
            See all case studies <Arrow />
          </Link>
        </div>
      ) : null}
    </Section>
  );
}

export function TeamBlock({ block }: { block: Of<"team"> }) {
  return (
    <Section id={block.id} tone={block.tone} ruled={false}>
      <SplitHeader id={block.id} label={block.label} heading={block.heading} intro={block.intro} />
      <ul className="team-grid" data-reveal="group">
        {block.members.map((m) => (
          <li key={m.name} className="team-card">
            {m.photo ? (
              <span className="team-photo">
                <Photo photo={m.photo} />
              </span>
            ) : null}
            <span className="team-name">{m.name}</span>
            <span className="team-role">{m.role}</span>
            <p className="team-bio">{m.bio}</p>
            {m.focus.length ? (
              <ul className="team-focus">
                {m.focus.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function GalleryBlock({ block }: { block: Of<"gallery"> }) {
  return (
    <Section id={block.id} tone={block.tone} ruled={false}>
      <SplitHeader id={block.id} label={block.label} heading={block.heading} intro={block.intro} />
      <ul className="gallery" data-count={block.items.length} data-reveal="group">
        {block.items.map((g) => (
          <li key={g.photo.asset} className="gallery-item">
            <Photo photo={g.photo} />
            {g.title || g.text ? (
              <div className="gallery-note">
                {g.title ? <p className="gallery-title">{g.title}</p> : null}
                {g.text ? <p className="gallery-text">{g.text}</p> : null}
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </Section>
  );
}

function WallCard({
  t,
  big = false,
}: {
  t: Of<"testimonial-wall">["items"][number];
  big?: boolean;
}) {
  return (
    <figure className={`tw-card${big ? " tw-card-big" : ""}`}>
      <figcaption className="tw-person">
        {t.photo ? (
          <span className="tw-avatar">
            <Photo photo={t.photo} />
          </span>
        ) : null}
        <span className="tw-who">
          <span className="tw-name">{t.name}</span>
          <span className="tw-role">
            {t.role}, {t.company}
          </span>
        </span>
        <Quotes className="tw-mark" weight="fill" aria-hidden="true" />
      </figcaption>
      <blockquote className="tw-quote">{t.quote}</blockquote>
      <div className="tw-tags">
        <span className="tw-tag tw-tag-service">{t.serviceLabel}</span>
        <span className="tw-tag">{t.industryLabel}</span>
        {t.href && getRegistry().pageByPath.has(t.href) ? (
          <Link href={t.href} className="tw-case">
            Case study <Arrow />
          </Link>
        ) : null}
      </div>
    </figure>
  );
}

export function TestimonialWallBlock({ block }: { block: Of<"testimonial-wall"> }) {
  const facets = (key: "service" | "industry", label: "serviceLabel" | "industryLabel") => {
    const m = new Map<string, { label: string; count: number }>();
    for (const t of block.items) {
      const f = m.get(t[key]) ?? { label: t[label], count: 0 };
      f.count++;
      m.set(t[key], f);
    }
    return [...m]
      .map(([k, v]) => ({ key: k, ...v }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  };
  const [first, ...rest] = block.items;
  return (
    <Section id={block.id} tone={block.tone} ruled={false}>
      <SplitHeader id={block.id} label={block.label} heading={block.heading} intro={block.intro} />
      <dl className="tw-summary">
        <div>
          <dt>Client stories</dt>
          <dd>{block.items.length}</dd>
        </div>
        <div>
          <dt>Services covered</dt>
          <dd>{new Set(block.items.map((t) => t.service)).size}</dd>
        </div>
        <div>
          <dt>Industries</dt>
          <dd>{new Set(block.items.map((t) => t.industry)).size}</dd>
        </div>
        <div>
          <dt>Working with clients since</dt>
          <dd>{getRegistry().facts.get("company.founded")?.value}</dd>
        </div>
      </dl>
      <div className="mt-8">
        <TestimonialWall
          services={facets("service", "serviceLabel")}
          industries={facets("industry", "industryLabel")}
          featured={first ? <WallCard t={first} big /> : undefined}
          cards={[...(first ? [first] : []), ...rest].map((t) => ({
            key: t.name,
            service: t.service,
            industry: t.industry,
            node: <WallCard t={t} />,
          }))}
        />
      </div>
    </Section>
  );
}
