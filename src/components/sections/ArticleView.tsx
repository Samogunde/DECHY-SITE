import Link from "next/link";
import { Breadcrumbs } from "@/components/patterns/Breadcrumbs";
import { Inline } from "@/components/primitives/Inline";
import { Photo } from "@/components/primitives/Photo";
import { readingMinutes } from "@/lib/content/articles";
import { breadcrumbsFor } from "@/lib/content/breadcrumbs";
import type { Registry } from "@/lib/content/load";
import type { Page } from "@/lib/content/schema";
import { allPricing, modelTable, pricingFor } from "@/lib/content/samples";
import { callHref } from "@/lib/contact/channels";
import { pathExists } from "@/lib/content/urls";
import { BlockRenderer } from "./BlockRenderer";
import { HoverArrow } from "./HomeBlocks";
import { CtaBandBlock } from "./GrowthBlocks";
import { LinkButton } from "@/components/primitives/LinkButton";
import { Arrow } from "@/components/primitives/Arrow";
import { NewsletterForm } from "@/components/patterns/NewsletterForm";

const ESTIMATOR = "/tools/cost-estimator/";
const COST_HUB = "/cost/";
/** Timelines count from approved scope (owner's pricing review, 22 October 2026). */
const TIME_HEAD = "Typical timeline from approved scope";
const TIME_NOTE =
  "The timeline starts once the scope is approved and we have what we need from you.";
const isTime = (c: string) => /^(typical )?timeline/i.test(c);

/** A comparison or price table inside the reading column, with its note. */
function DataTable({
  t,
}: {
  t: { heading: string; columns: string[]; rows: string[][]; note?: string };
}) {
  return (
    <>
      <div className="cmp-scroll">
        <table className="cmp-table">
          <thead>
            <tr>
              {t.columns.map((c) => (
                <th key={c} scope="col">
                  {isTime(c) ? TIME_HEAD : c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {t.rows.map((r, ri) => (
              <tr key={ri}>
                {r.map((cell, i) =>
                  i === 0 ? (
                    <th key={i} scope="row">
                      <Inline text={cell} />
                    </th>
                  ) : (
                    <td key={i}>
                      <Inline text={cell} />{" "}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {t.note || t.columns.some(isTime) ? (
        <p className="cmp-note">
          <Inline
            text={[t.note, t.columns.some(isTime) ? TIME_NOTE : ""].filter(Boolean).join(" ")}
          />
        </p>
      ) : null}
    </>
  );
}

/** A paragraph, or a label with the inline list that follows it ("- item" lines). */
function Paragraph({ text }: { text: string }) {
  const [first, ...lines] = text.split("\n");
  const items = lines.filter((l) => l.startsWith("- ")).map((l) => l.slice(2));
  if (!items.length)
    return (
      <p>
        <Inline text={text} />
      </p>
    );
  return (
    <>
      <p>
        <Inline text={first ?? ""} />
      </p>
      <ul className="article-list">
        {items.map((x, i) => (
          <li key={i}>
            <Inline text={x} />
          </li>
        ))}
      </ul>
    </>
  );
}

/** A call to action inside the reading column. */
function ArticleCta({
  text,
  primary,
  secondary,
  soft = false,
}: {
  text: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  soft?: boolean;
}) {
  return (
    <aside className={`article-cta${soft ? " article-cta-soft" : ""}`} aria-label={primary.label}>
      <p>{text}</p>
      <div className="article-cta-actions">
        {soft ? (
          <Link href={primary.href} className="cta-soft-link">
            {primary.label} <Arrow />
          </Link>
        ) : (
          <LinkButton href={primary.href} arrow>
            {primary.label}
          </LinkButton>
        )}
        {secondary ? (
          <Link href={secondary.href} className="cta-soft-link">
            {secondary.label} <Arrow />
          </Link>
        ) : null}
      </div>
    </aside>
  );
}

export const CATEGORY_LABEL: Record<string, string> = {
  guide: "Guide",
  comparison: "Comparison",
  decision: "Decision guide",
  explainer: "Explainer",
  industry: "Industry note",
  cost: "Cost guide",
};

export function formatDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * A blog article: cover photograph, a reading column with a table of contents that stays in view,
 * key points beside each section, then the questions and the next step.
 */
export function ArticleView({ page, registry }: { page: Page; registry: Registry }) {
  const crumbs = breadcrumbsFor(page, registry);
  const prose = page.sections.filter((b) => b.type === "prose");
  const after = page.sections.filter((b) => b.type !== "prose");
  const a = page.article;
  const service = registry.services.find((s) => s.slug === a?.service);
  const serviceHref = service ? `/${service.slug}/` : undefined;
  const price = a?.pricing && a.pricing !== "all" ? pricingFor(a.pricing) : undefined;
  // "all": one row per service, from its smallest to its largest typical project.
  const everyPrice =
    a?.pricing === "all"
      ? allPricing().flatMap(([slug, p]) => {
          const svc = registry.services.find((s) => s.slug === slug);
          const [first, last] = [p.plans[0], p.plans[p.plans.length - 1]];
          return svc && first && last ? [{ slug, name: svc.name, first, last }] : [];
        })
      : [];
  // Related reading: the links the writer chose, then other articles on the same service.
  const related = [
    ...(a?.related ?? []).filter((r) => pathExists(r.href.split("#")[0] ?? "", registry)),
    ...registry.pages
      .filter(
        (p) => p.kind === "article" && p.path !== page.path && p.article?.service === a?.service,
      )
      .map((p) => ({ label: p.h1 ?? p.title, href: p.path })),
  ]
    .filter((r, i, all) => all.findIndex((x) => x.href === r.href) === i)
    .slice(0, 4);
  const faq = after.filter((b) => b.type === "faq");
  const live = (href: string) => pathExists(href, registry);
  const isCost = a?.category === "cost";
  const slug = a?.pricing && a.pricing !== "all" ? a.pricing : a?.service;
  const quoteHref = `/contact/${slug ? `?service=${slug}` : "?intent=quote"}`;
  const estimatorHref = `${ESTIMATOR}${slug ? `?service=${slug}` : ""}`;
  // Midway through the article: a soft step (the estimator, the cost hub, or the service).
  const midSection = Math.max(0, Math.floor(prose.length / 2) - 1);
  const midCta = isCost
    ? live(COST_HUB)
      ? {
          text: "Comparing options? Every cost guide we publish is on one page, with the estimator.",
          primary: { label: "See all cost guides", href: COST_HUB },
        }
      : undefined
    : live(ESTIMATOR)
      ? {
          text: "Want a number for your own project? The estimator gives a price and timeline range in two minutes.",
          primary: { label: "Try the estimator", href: estimatorHref },
        }
      : undefined;
  const rest = after.filter((b) => b.type !== "faq");
  return (
    <>
      <header className="tone-paper page-hero article-hero">
        <div className="container-site">
          <div className="pt-6">
            <Breadcrumbs crumbs={crumbs} />
          </div>
          <div className="article-head">
            <p className="article-meta">
              <span className="article-cat">{CATEGORY_LABEL[a?.category ?? "guide"]}</span>
              <span>{readingMinutes(page)} min read</span>
            </p>
            <h1 className="t-h1 article-title">{page.h1}</h1>
            {page.lead ? (
              <p className="article-lead">
                <Inline text={page.lead} />
              </p>
            ) : null}
            <dl className="article-byline">
              <div>
                <dt>Written by</dt>
                <dd>{a?.author ?? "The DECHY team"}</dd>
              </div>
              <div>
                <dt>Published</dt>
                <dd>
                  <time dateTime={page.datePublished}>{formatDate(page.datePublished)}</time>
                </dd>
              </div>
              <div>
                <dt>Last reviewed</dt>
                <dd>
                  <time dateTime={page.dateModified}>{formatDate(page.dateModified)}</time>
                </dd>
              </div>
            </dl>
          </div>
          {page.article?.photo ? (
            <figure className="article-cover">
              <Photo photo={{ ...page.article.photo, layout: "band" }} />
            </figure>
          ) : null}
        </div>
      </header>
      <div className="tone-paper article-wrap">
        <div className="container-site article-grid">
          <aside className="article-side">
            <nav className="article-toc" aria-label="In this article">
              <p className="article-toc-title">In this article</p>
              <ol>
                {everyPrice.length ? (
                  <section className="article-section" aria-labelledby="all-price-h">
                    <h2 id="all-price-h" className="article-h2">
                      Typical ranges for every service
                    </h2>
                    <div className="cmp-scroll">
                      <table className="cmp-table">
                        <thead>
                          <tr>
                            <th scope="col">Service</th>
                            <th scope="col">Smaller projects</th>
                            <th scope="col">Larger projects</th>
                          </tr>
                        </thead>
                        <tbody>
                          {everyPrice.map((r) => (
                            <tr key={r.slug}>
                              <th scope="row">
                                {pathExists(`/${r.slug}/`, registry) ? (
                                  <Link href={`/${r.slug}/`}>{r.name}</Link>
                                ) : (
                                  r.name
                                )}
                              </th>
                              <td>
                                {r.first.range}{" "}
                                <span className="cmp-sub">
                                  {r.first.name}, {r.first.timeline}
                                </span>
                              </td>
                              <td>
                                {r.last.range}{" "}
                                <span className="cmp-sub">
                                  {r.last.name}, {r.last.timeline}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                ) : null}
                {prose.map((b) =>
                  b.type === "prose" ? (
                    <li key={b.id}>
                      <a href={`#${b.id}`}>{b.heading}</a>
                    </li>
                  ) : null,
                )}
              </ol>
            </nav>
            {service && serviceHref && pathExists(serviceHref, registry) ? (
              <Link href={serviceHref} className="article-service link-card" data-spotlight>
                <span className="article-service-label">How we help</span>
                <span className="article-service-name">{service.name}</span>
                <span className="article-service-text">{service.micro}</span>
                <HoverArrow />
              </Link>
            ) : null}
          </aside>
          <article className="article-body" data-read-depth={page.path}>
            <aside className="article-answer" aria-label="Short answer">
              <p className="article-answer-title">The short answer</p>
              <p>
                <Inline text={a?.answer ?? a?.summary ?? ""} />
              </p>
            </aside>
            {a?.compare ? <CompareTable compare={a.compare} /> : null}
            {[...(a?.models ?? []).map((k) => modelTable(k)), ...(a?.tables ?? [])].map((t) => (
              <section key={t.heading} className="article-section">
                <h2 className="article-h2">{t.heading}</h2>
                <DataTable t={t} />
              </section>
            ))}
            {price ? (
              <section className="article-section" aria-labelledby="price-h">
                <h2 id="price-h" className="article-h2">
                  Typical price ranges
                </h2>
                <div className="cmp-scroll">
                  <table className="cmp-table">
                    <thead>
                      <tr>
                        <th scope="col">Project</th>
                        <th scope="col">Typical range</th>
                        <th scope="col">{TIME_HEAD}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {price.plans.map((p) => (
                        <tr key={p.name}>
                          <th scope="row">
                            {p.name} <span className="cmp-sub">{p.summary}</span>{" "}
                          </th>
                          <td>
                            <Inline text={p.range} />{" "}
                          </td>
                          <td>{p.timeline} </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="cmp-note">{TIME_NOTE}</p>
                <div className="article-points">
                  <p className="article-points-title">What moves the price</p>
                  <ul>
                    {price.factors.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </div>
              </section>
            ) : null}
            {isCost ? (
              <ArticleCta
                text={`Prices depend on scope. Tell us yours and we will send a fixed quote in writing, or try the estimator first.`}
                primary={{ label: "Get a quote for your project", href: quoteHref }}
                secondary={
                  live(ESTIMATOR) ? { label: "Try the estimator", href: estimatorHref } : undefined
                }
              />
            ) : null}
            {prose.map((b, bi) =>
              b.type === "prose" ? (
                <section
                  key={b.id}
                  id={b.id}
                  aria-labelledby={`${b.id}-h`}
                  className="article-section"
                >
                  <h2 id={`${b.id}-h`} className="article-h2">
                    {b.heading}
                  </h2>
                  {b.paragraphs.map((p, i) => (
                    <Paragraph key={i} text={p} />
                  ))}
                  {b.tables.map((t, ti) => (
                    <DataTable key={ti} t={t} />
                  ))}
                  {b.aside ? (
                    <div className="article-points">
                      <p className="article-points-title">{b.aside.title}</p>
                      <ul>
                        {b.aside.items.map((x, i) => (
                          <li key={i}>
                            <Inline text={x} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {bi === midSection && midCta ? (
                    <ArticleCta text={midCta.text} soft primary={midCta.primary} />
                  ) : null}
                </section>
              ) : null,
            )}
            {a?.compare ? (
              <section className="article-section" aria-labelledby="choose-h">
                <h2 id="choose-h" className="article-h2">
                  When to choose each
                </h2>
                <div className="cmp-choose">
                  {a.compare.choose.map((c) => (
                    <div key={c.option} className="cmp-option">
                      <p className="cmp-option-title">Choose {c.option} when</p>
                      <ul>
                        {c.when.map((w) => (
                          <li key={w}>
                            <Inline text={w} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="cmp-reco">
                  <p className="cmp-reco-title">Our recommendation</p>
                  <p>
                    <Inline text={a.compare.recommendation} />
                  </p>
                </div>
              </section>
            ) : null}
            <aside className="article-newsletter" aria-label="Newsletter">
              <NewsletterForm />
            </aside>
          </article>
        </div>
      </div>
      {faq.map((b) => (
        <BlockRenderer key={b.id} block={b} page={page} />
      ))}
      {faq.length ? (
        <CtaBandBlock
          block={{
            type: "cta-band",
            id: "cta-faq",
            tone: "ink",
            variant: "primary",
            text: isCost
              ? "Still not sure what your project will cost? Ask an engineer on a 30-minute call."
              : "Have a question this guide did not answer? Ask us on a 30-minute call.",
            primary: { label: "Book a call", href: callHref() },
            email: "sales",
            secondary: live(COST_HUB)
              ? { label: "See every cost guide", href: COST_HUB }
              : undefined,
          }}
        />
      ) : null}
      {related.length ? (
        <section className="section tone-paper article-related" aria-labelledby="related-h">
          <div className="container-site">
            <h2 id="related-h" className="t-h2">
              Related reading
            </h2>
            <ul className="article-related-list">
              {related.map((r) => (
                <li key={r.href}>
                  <Link href={r.href} className="article-related-link link-card" data-spotlight>
                    <span>{r.label}</span>
                    <HoverArrow />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
      {rest.map((b) => (
        <BlockRenderer key={b.id} block={b} page={page} />
      ))}
    </>
  );
}

/** A comparison: the options side by side, one row per question. */
function CompareTable({ compare }: { compare: NonNullable<Page["article"]>["compare"] }) {
  if (!compare) return null;
  return (
    <section className="article-section" aria-labelledby="compare-h">
      <h2 id="compare-h" className="article-h2">
        Side by side
      </h2>
      <div className="cmp-scroll">
        <table className="cmp-table">
          <thead>
            <tr>
              <th scope="col">
                <span className="sr-only">Question</span>
              </th>
              {compare.options.map((o) => (
                <th key={o} scope="col">
                  {o}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {compare.rows.map((r) => (
              <tr key={r.label}>
                <th scope="row">{r.label}</th>
                {r.values.map((v, i) => (
                  <td key={i}>
                    <Inline text={v} />{" "}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
