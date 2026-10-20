import Link from "next/link";
import { Breadcrumbs } from "@/components/patterns/Breadcrumbs";
import { Inline } from "@/components/primitives/Inline";
import { Photo } from "@/components/primitives/Photo";
import { readingMinutes } from "@/lib/content/articles";
import { breadcrumbsFor } from "@/lib/content/breadcrumbs";
import type { Registry } from "@/lib/content/load";
import type { Page } from "@/lib/content/schema";
import { pathExists } from "@/lib/content/urls";
import { BlockRenderer } from "./BlockRenderer";
import { HoverArrow } from "./HomeBlocks";

export const CATEGORY_LABEL: Record<string, string> = {
  guide: "Guide",
  comparison: "Comparison",
  decision: "Decision guide",
  explainer: "Explainer",
  industry: "Industry note",
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
  const service = registry.services.find((s) => s.slug === page.article?.service);
  const serviceHref = service ? `/${service.slug}/` : undefined;
  return (
    <>
      <header className="tone-paper page-hero article-hero">
        <div className="container-site">
          <div className="pt-6">
            <Breadcrumbs crumbs={crumbs} />
          </div>
          <div className="article-head">
            <p className="article-meta">
              <span className="article-cat">
                {CATEGORY_LABEL[page.article?.category ?? "guide"]}
              </span>
              <span>{formatDate(page.datePublished)}</span>
              <span>{readingMinutes(page)} min read</span>
            </p>
            <h1 className="t-h1 article-title">{page.h1}</h1>
            {page.lead ? (
              <p className="article-lead">
                <Inline text={page.lead} />
              </p>
            ) : null}
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
          <article className="article-body">
            {prose.map((b) =>
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
                    <p key={i}>
                      <Inline text={p} />
                    </p>
                  ))}
                  {b.aside ? (
                    <div className="article-points">
                      <p className="article-points-title">{b.aside.title}</p>
                      <ul>
                        {b.aside.items.map((x) => (
                          <li key={x}>
                            <Inline text={x} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </section>
              ) : null,
            )}
          </article>
        </div>
      </div>
      {after.map((b) => (
        <BlockRenderer key={b.id} block={b} page={page} />
      ))}
    </>
  );
}
