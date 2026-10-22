import Image from "next/image";
import type { ReactNode } from "react";
import Link from "next/link";
import { CheckCircle, Quotes, Star } from "@phosphor-icons/react/dist/ssr";
import {
  TmCarousel,
  TmFounders,
  TmHoverList,
  TmJourneySteps,
  TmStories,
} from "@/components/home/TestimonialMotion";
import { CountUp } from "@/components/home/Motion";
import { PartnerLogo } from "@/components/primitives/PartnerLogo";
import { Arrow } from "@/components/primitives/Arrow";
import { ClientFaces } from "@/components/primitives/ClientFaces";
import { Icon } from "@/components/primitives/Icon";
import { Inline } from "@/components/primitives/Inline";
import { Photo } from "@/components/primitives/Photo";
import { certificationGroups, partnerships } from "@/lib/content/certifications";
import { expandFacts } from "@/lib/content/inline";
import { getRegistry, showDrafts } from "@/lib/content/load";
import { projectPath, projects, showResults } from "@/lib/content/portfolio";
import { proofCounters } from "@/lib/content/proof";
import type { Block, IconName } from "@/lib/content/schema";
import { testimonials, type Testimonial } from "@/lib/content/testimonials";
import { pathExists } from "@/lib/content/urls";
import { Initials } from "./TestimonialBlocks";

type Of<T extends Block["type"]> = Extract<Block, { type: T }>;

/*
 * The Testimonials page (owner direction, 21 October 2026): the sections, layout, and motion of
 * the reference testimonial page, filled with DECHY's own testimonials, figures, partners,
 * certifications, and projects. Nothing here invents a figure: ratings show only when a client
 * gave one, and the measured row uses the approved proof figures.
 */

/** A section on this page: no tone bands, generous rhythm, the heading set large and light. */
function TmSection({
  id,
  className = "",
  children,
}: {
  id: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className={`tm-sec ${className}`.trim()}>
      <div className="container-site">{children}</div>
    </section>
  );
}

function TmHead({
  id,
  heading,
  intro,
  aside,
}: {
  id: string;
  heading: string;
  intro?: string;
  aside?: ReactNode;
}) {
  return (
    <div className={`tm-head${aside ? " has-aside" : ""}`} data-reveal="block">
      <div>
        <h2 id={`${id}-h`} className="tm-h2">
          {heading}
        </h2>
        {intro ? (
          <p className="tm-intro">
            <Inline text={intro} />
          </p>
        ) : null}
      </div>
      {aside}
    </div>
  );
}

/** The first sentence of a quote (shown large) and the rest (shown beneath), as written. */
function splitQuote(quote: string): [string, string] {
  const m = quote.match(/^(.+?[.!?])\s+(.+)$/s);
  return m ? [m[1]!, m[2]!] : [quote, ""];
}

const byName = () => new Map(testimonials().map((t) => [t.name, t]));

/** Service and industry names for a testimonial. */
function labels(t: Testimonial) {
  const registry = getRegistry();
  return {
    service: registry.services.find((s) => s.slug === t.service)?.name ?? t.service,
    industry: registry.nodes.get(t.industry)?.name ?? t.industry,
  };
}

const INDUSTRY_ICONS: Record<string, IconName> = {
  "ind.professional-services": "briefcase",
  "ind.logistics": "truck",
  "ind.education": "education",
  "ind.field-services": "wrench",
  "ind.retail": "store",
  "ind.healthcare": "health",
  "ind.saas": "cloud",
  "ind.restaurants": "food",
  "ind.fitness": "fitness",
  "ind.media": "media",
  "ind.hospitality": "hotel",
  "ind.nonprofits": "charity",
};

function Stars({ rating }: { rating: number }) {
  return (
    <span className="tm-rating">
      <span className="tm-rating-n">
        {rating.toFixed(1)}
        <span> / 5.0</span>
      </span>
      <span className="tm-stars" aria-label={`Rated ${rating} out of 5`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Star key={n} weight={n <= Math.round(rating) ? "fill" : "regular"} aria-hidden="true" />
        ))}
      </span>
    </span>
  );
}

/* ---------------- 1. Opening ---------------- */
export function TmHeroBlock({ block }: { block: Of<"tm-hero"> }) {
  const registry = getRegistry();
  const headline = expandFacts(block.headline, registry.facts);
  const accent = block.accent ? expandFacts(block.accent, registry.facts) : "";
  const at = accent ? headline.indexOf(accent) : -1;
  const words = (text: string, from: number, cls = "") =>
    text
      .split(/(\s+)/)
      .filter(Boolean)
      .map((w, i) =>
        /\s/.test(w) ? (
          w
        ) : (
          <span
            key={`${from}-${i}`}
            className={`tm-word ${cls}`.trim()}
            style={{ animationDelay: `${(from + i) * 45}ms` }}
          >
            {w}
          </span>
        ),
      );
  const counters = proofCounters(registry);
  return (
    <section id={block.id} aria-labelledby={`${block.id}-h`} className="tm-hero">
      <div className="tm-hero-photo" aria-hidden="true">
        <Photo photo={block.photo} priority />
      </div>
      <div className="container-site tm-hero-inner">
        <div className="tm-hero-copy">
          <p className="t-eyebrow eyebrow-accent m-0">{block.eyebrow}</p>
          <h1 id={`${block.id}-h`} className="tm-h1">
            {at >= 0 ? (
              <>
                {words(headline.slice(0, at), 0)}
                {words(accent, 20, "tm-accent")}
                {words(headline.slice(at + accent.length), 40)}
              </>
            ) : (
              words(headline, 0)
            )}
          </h1>
          <p className="tm-hero-lead">
            <Inline text={block.lead} />
          </p>
          <Link href={block.cta.href} className="tm-btn">
            {block.cta.label} <Arrow />
          </Link>
        </div>
        <dl className="tm-stats" data-reveal="group">
          {counters.map((c) => (
            <div key={c.id} className="tm-stat">
              <dt>{c.label}</dt>
              <dd>
                {c.faces ? <ClientFaces size="sm" /> : null}
                <CountUp value={c.value} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ---------------- 2. Companies ---------------- */
export function TmLogosBlock({ block }: { block: Of<"tm-logos"> }) {
  const seen = new Set<string>();
  const companies = testimonials().filter((t) => !seen.has(t.company) && seen.add(t.company));
  return (
    <TmSection id={block.id}>
      <TmHead id={block.id} heading={block.heading} intro={block.intro} />
      <ul className="tm-logos" data-reveal="group">
        {companies.slice(0, 16).map((t) => (
          <li key={t.company} className="tm-logo">
            <Icon name={INDUSTRY_ICONS[t.industry] ?? "building"} weight="duotone" />
            <span>{t.company}</span>
          </li>
        ))}
      </ul>
    </TmSection>
  );
}

/* ---------------- 3. Stories ---------------- */
export function TmStoriesBlock({ block }: { block: Of<"tm-stories"> }) {
  const people = byName();
  const slides = block.slides.flatMap((s) => {
    const t = people.get(s.name);
    if (!t) return [];
    const l = labels(t);
    return [
      {
        key: t.id,
        node: (
          <figure className="tms-card">
            <div className="tms-photo" aria-hidden="true">
              <Photo photo={s.photo} />
            </div>
            <div className="tms-shade" aria-hidden="true" />
            <blockquote className="tms-quote">
              <Quotes aria-hidden="true" weight="fill" className="tms-mark" />
              <p>{t.quote}</p>
            </blockquote>
            <figcaption className="tms-who">
              <Initials name={t.name} size="lg" />
              <span className="tms-id">
                <span className="tms-name">{t.name}</span>
                <span className="tms-role">
                  {t.role}, {t.company}
                </span>
              </span>
              <span className="tms-service">{l.service}</span>
            </figcaption>
          </figure>
        ),
      },
    ];
  });
  return (
    <TmSection id={block.id}>
      <TmHead id={block.id} heading={block.heading} intro={block.intro} />
      <div data-reveal="block">
        <TmStories label={block.heading} slides={slides} />
      </div>
    </TmSection>
  );
}

/* ---------------- 4. Client journey ---------------- */
export function TmJourneyBlock({ block }: { block: Of<"tm-journey"> }) {
  return (
    <TmSection id={block.id} className="tmj">
      <div className="tmj-grid">
        <div className="tmj-side">
          <TmHead id={block.id} heading={block.heading} intro={block.intro} />
          <div className="tmj-photo">
            <Photo photo={block.photo} />
          </div>
        </div>
        <TmJourneySteps>
          {block.steps.map((s, i) => (
            <div key={s.title} className="tmj-step-in">
              <span className="tmj-n">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="tmj-title">{s.title}</h3>
              <p className="tmj-text">{s.text}</p>
            </div>
          ))}
        </TmJourneySteps>
      </div>
    </TmSection>
  );
}

/* ---------------- 5. Outcomes ---------------- */
function OutcomeCard({ t }: { t: Testimonial }) {
  const l = labels(t);
  const registry = getRegistry();
  const svcHref = `/${t.service}/`;
  return (
    <figure className="tmo">
      <figcaption className="tmo-who">
        <Initials name={t.name} size="sm" />
        <span>
          <span className="tmo-name">{t.name}</span>
          <span className="tmo-role">
            {t.role}, {t.company}
          </span>
        </span>
        <Quotes aria-hidden="true" weight="fill" className="tmo-mark" />
      </figcaption>
      <blockquote className="tmo-quote">
        <p>{t.quote}</p>
      </blockquote>
      <div className="tmo-foot">
        {registry.pageByPath.has(svcHref) ? (
          <Link href={svcHref} className="tmo-big">
            {l.service}
          </Link>
        ) : (
          <span className="tmo-big">{l.service}</span>
        )}
        <span className="tmo-label">{l.industry}</span>
      </div>
    </figure>
  );
}

export function TmOutcomesBlock({ block }: { block: Of<"tm-outcomes"> }) {
  return (
    <TmSection id={block.id}>
      <TmHead id={block.id} heading={block.heading} intro={block.intro} />
      <TmCarousel label={block.heading} autoplay className="tmo-row">
        {testimonials().map((t) => (
          <OutcomeCard key={t.id} t={t} />
        ))}
      </TmCarousel>
    </TmSection>
  );
}

/* ---------------- 6. Featured voices ---------------- */
export function TmFoundersBlock({ block }: { block: Of<"tm-founders"> }) {
  const people = byName();
  const picked = block.names.map((n) => people.get(n)).filter((t): t is Testimonial => !!t);
  return (
    <TmSection id={block.id}>
      <TmHead id={block.id} heading={block.heading} intro={block.intro} />
      <div data-reveal="block">
        <TmFounders
          label={block.heading}
          visual={
            <>
              <Photo photo={block.photo} />
              <span className="tmf-visual-note">
                <ClientFaces size="sm" />
                In our clients&apos; words
              </span>
            </>
          }
          items={picked.map((t) => {
            const [head, rest] = splitQuote(t.quote);
            const l = labels(t);
            return {
              id: t.id,
              label: `${t.name}, ${t.company}`,
              thumb: (
                <span className="tmf-thumb-in">
                  <Initials name={t.name} size="lg" />
                  <span className="tmf-thumb-co">{t.company}</span>
                </span>
              ),
              panel: (
                <figure className="tmf-fig">
                  <div className="tmf-top">
                    <span className="tmf-co">
                      <Icon name={INDUSTRY_ICONS[t.industry] ?? "building"} weight="duotone" />
                      {t.company}
                    </span>
                    <Initials name={t.name} />
                  </div>
                  <blockquote className="tmf-quote">
                    <p className="tmf-head">&lsquo;{head}&rsquo;</p>
                    {rest ? <p className="tmf-body">{rest}</p> : null}
                  </blockquote>
                  <figcaption className="tmf-who">
                    <span>
                      <span className="tmf-name">{t.name}</span>
                      <span className="tmf-role">
                        {t.role} · {l.service}
                      </span>
                    </span>
                    {t.rating ? <Stars rating={t.rating} /> : null}
                  </figcaption>
                </figure>
              ),
            };
          })}
        />
      </div>
    </TmSection>
  );
}

/* ---------------- 7. Case studies ---------------- */
export function TmCasesBlock({ block }: { block: Of<"tm-cases"> }) {
  const registry = getRegistry();
  const all = projects();
  const picked = block.slugs
    .map((s) => all.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => !!p);
  return (
    <TmSection id={block.id}>
      <TmHead id={block.id} heading={block.heading} intro={block.intro} />
      <ul className="tmk" data-reveal="group">
        {picked.map((p) => {
          const result = showResults(p, showDrafts()) ? p.results[0] : undefined;
          const href = projectPath(p);
          return (
            <li key={p.slug} className="tmk-item">
              <span className="tmk-badge">{p.title}</span>
              <p className="tmk-value">{result ? <CountUp value={result.value} /> : p.duration}</p>
              <p className="tmk-label">{result ? result.label : "From kickoff to launch"}</p>
              <p className="tmk-text">{p.headline}.</p>
              {registry.pageByPath.has(href) ? (
                <Link href={href} className="tm-btn-outline">
                  Read the full story <Arrow />
                </Link>
              ) : null}
            </li>
          );
        })}
      </ul>
    </TmSection>
  );
}

/* ---------------- 8. Partner ---------------- */
export function TmPartnerBlock({ block }: { block: Of<"tm-partner"> }) {
  return (
    <TmSection id={block.id}>
      <TmHead id={block.id} heading={block.heading} intro={block.intro} />
      <div className="tmp-grid">
        <TmHoverList
          className="tmp-list"
          rows={block.items.map((it) => ({
            key: `${block.id}-${it.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
            head: (
              <span className="tmp-head">
                <Icon name={it.icon} weight="duotone" />
                <span className="tmp-title">{it.title}</span>
              </span>
            ),
            body: <p className="tmp-text">{it.text}</p>,
          }))}
        />
        <div className="tmp-photo">
          <Photo photo={block.photo} />
        </div>
      </div>
    </TmSection>
  );
}

/* ---------------- 9. By service ---------------- */
export function TmServicesBlock({ block }: { block: Of<"tm-services"> }) {
  const registry = getRegistry();
  const all = testimonials();
  // Each service shows its shorter testimonial, so the row reads as a set of headlines.
  const cards = registry.services.flatMap((s) => {
    const own = all.filter((t) => t.service === s.slug);
    if (own.length === 0) return [];
    const t = [...own].sort((a, b) => a.quote.length - b.quote.length)[0]!;
    return [{ s, t }];
  });
  return (
    <TmSection id={block.id}>
      <TmHead id={block.id} heading={block.heading} intro={block.intro} />
      <TmCarousel label={block.heading} className="tmv-row">
        {cards.map(({ s, t }) => {
          const href = `/${s.slug}/`;
          return (
            <figure key={s.slug} className="tmv">
              {registry.pageByPath.has(href) ? (
                <Link href={`${href}#client-quotes`} className="tmv-svc">
                  {s.name}
                </Link>
              ) : (
                <span className="tmv-svc">{s.name}</span>
              )}
              <blockquote className="tmv-quote">
                <p>&ldquo;{t.quote}&rdquo;</p>
              </blockquote>
              <figcaption className="tmv-who">
                {t.name}, {t.company}
              </figcaption>
            </figure>
          );
        })}
      </TmCarousel>
    </TmSection>
  );
}

/* ---------------- 10. Measured ---------------- */
const MEASURE_ICONS: Record<string, IconName> = {
  clients: "users",
  projects: "briefcase",
  team: "code",
  countries: "globe",
  certifications: "shield",
  years: "growth",
};

export function TmMeasuredBlock({ block }: { block: Of<"tm-measured"> }) {
  const registry = getRegistry();
  const founded = Number(registry.facts.get("company.founded")?.value ?? "0");
  const counters = proofCounters(registry);
  const cells = [
    ...counters.map((c) => ({ key: c.id, label: c.label, value: c.value })),
    ...(founded
      ? [
          {
            key: "years",
            label: "Years delivering",
            value: `${new Date().getFullYear() - founded}+`,
          },
        ]
      : []),
  ].slice(0, 5);
  return (
    <TmSection id={block.id}>
      <TmHead id={block.id} heading={block.heading} intro={block.intro} />
      <dl className="tmm" data-reveal="group">
        {cells.map((c) => (
          <div key={c.key} className="tmm-cell">
            <dt>
              <Icon name={MEASURE_ICONS[c.key] ?? "chart"} weight="duotone" />
              {c.label}
            </dt>
            <dd>
              <CountUp value={c.value} />
            </dd>
          </div>
        ))}
      </dl>
    </TmSection>
  );
}

/* ---------------- 11. Retention ---------------- */
export function TmRetentionBlock({ block }: { block: Of<"tm-retention"> }) {
  return (
    <TmSection id={block.id}>
      <TmHead id={block.id} heading={block.heading} intro={block.intro} />
      <div className="tmr-grid">
        <div className="tmr-photo">
          <Photo photo={block.photo} />
        </div>
        <TmHoverList
          className="tmr-list"
          rows={block.items.map((it, i) => ({
            key: `${block.id}-${i}`,
            head: (
              <span className="tmr-head">
                <span className="tmr-n">{String(i + 1).padStart(2, "0")}</span>
                {it.icon ? <Icon name={it.icon} weight="duotone" /> : null}
                <span className="tmr-title">{it.title}</span>
              </span>
            ),
            body: <p className="tmr-text">{it.text}</p>,
          }))}
        />
      </div>
    </TmSection>
  );
}

/* ---------------- 12. Excellence ---------------- */
export function TmExcellenceBlock({ block }: { block: Of<"tm-excellence"> }) {
  const registry = getRegistry();
  const facts = registry.facts;
  const projectsDone = facts.get("company.projects")?.value;
  const clients = facts.get("company.clients")?.value;
  const industries = registry.pages.filter((p) => p.kind === "industry").length;
  const { partners, compliance } = partnerships();
  return (
    <TmSection id={block.id}>
      <TmHead id={block.id} heading={block.heading} intro={block.intro} />
      <div className="tmx" data-reveal="block">
        <div className="tmx-left">
          {projectsDone ? (
            <>
              <p className="tmx-kicker">Projects delivered</p>
              <p className="tmx-big">
                <CountUp value={projectsDone} />
                <span>Projects delivered for clients worldwide</span>
              </p>
            </>
          ) : null}
          <p className="tmx-note">
            <Inline text={block.note} />
          </p>
          <dl className="tmx-stats">
            {industries ? (
              <div>
                <dd>
                  <CountUp value={`${industries}`} />
                </dd>
                <dt>Industries we build for</dt>
              </div>
            ) : null}
            {clients ? (
              <div>
                <dd>
                  <ClientFaces size="sm" />
                  <CountUp value={clients} />
                </dd>
                <dt>Clients helped worldwide</dt>
              </div>
            ) : null}
          </dl>
        </div>
        <div className="tmx-right">
          <p className="tmx-kicker">Partnerships</p>
          <ul className="tmx-tiles">
            {partners.map((p) => (
              <li key={p.name} className="tmx-tile">
                <PartnerLogo partner={p} height={p.wordmark ? 28 : 24} />
              </li>
            ))}
          </ul>
          <p className="tmx-kicker">Compliance</p>
          <ul className="tmx-tiles">
            {compliance.map((c) => (
              <li key={c.name} className="tmx-tile">
                <CheckCircle aria-hidden="true" weight="fill" />
                <span>{c.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </TmSection>
  );
}

/* ---------------- 13. Recognized ---------------- */
export function TmRecognizedBlock({ block }: { block: Of<"tm-recognized"> }) {
  const registry = getRegistry();
  const page = "/company/certifications/";
  const live = pathExists(page, registry);
  // One certification from each area first, so the list shows the range of the team's skills.
  const groups = certificationGroups();
  const picked: { name: string; issuer: string; file: string; text: string }[] = [];
  for (let round = 0; picked.length < block.limit && round < 8; round++)
    for (const g of groups) {
      const item = g.items[round];
      if (item && picked.length < block.limit) picked.push(item);
    }
  return (
    <TmSection id={block.id}>
      <TmHead
        id={block.id}
        heading={block.heading}
        aside={block.intro ? <p className="tm-intro tm-intro-aside">{block.intro}</p> : undefined}
      />
      <ul className="tmg" data-reveal="group">
        {picked.map((c) => {
          const body = (
            <>
              <span className="tmg-badge">
                <Image
                  src={`/certifications/${c.file}`}
                  alt=""
                  width={160}
                  height={160}
                  sizes="96px"
                />
              </span>
              <span className="tmg-copy">
                <span className="tmg-name">{c.name}</span>
                <span className="tmg-text">{c.text}</span>
              </span>
              <span className="tmg-go" aria-hidden="true">
                <Arrow />
              </span>
            </>
          );
          return (
            <li key={c.name} className="tmg-row">
              {live ? (
                <Link href={page} className="tmg-link">
                  {body}
                </Link>
              ) : (
                <div className="tmg-link">{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </TmSection>
  );
}

/* ---------------- 15. The closing call ---------------- */
export function TmCta({ block }: { block: Of<"cta"> }) {
  const live = pathExists(block.primary.href.split(/[?#]/)[0] ?? "", getRegistry());
  return (
    <section id={block.id} aria-labelledby={`${block.id}-h`} className="tm-sec tm-cta">
      <div className="container-site" data-reveal="block">
        <h2 id={`${block.id}-h`} className="tm-cta-h">
          {block.heading}
        </h2>
        <p className="tm-cta-body">
          <Inline text={block.body} />
        </p>
        {live ? (
          <Link href={block.primary.href} className="tm-btn">
            {block.primary.label} <Arrow />
          </Link>
        ) : null}
      </div>
    </section>
  );
}
