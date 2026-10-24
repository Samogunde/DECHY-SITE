import Link from "next/link";
import { BlogGrid } from "@/components/home/BlogGrid";
import { ResourceLibrary } from "@/components/home/ResourceLibrary";
import { Photo } from "@/components/primitives/Photo";
import { readingMinutes } from "@/lib/content/articles";
import { CATEGORY_LABEL } from "./ArticleView";
import { HoverArrow } from "./HomeBlocks";
import { Arrow } from "@/components/primitives/Arrow";
import { Inline } from "@/components/primitives/Inline";
import { getRegistry, type Registry } from "@/lib/content/load";
import type { Block, Page } from "@/lib/content/schema";
import { connectionsFor } from "@/lib/connections";
import { buildNavModel } from "@/lib/nav";
import { publishedPath } from "@/lib/content/urls";
import { Section, SectionHeader } from "./Section";
import { AccentText } from "@/components/primitives/AccentText";
import { NewsletterForm } from "@/components/patterns/NewsletterForm";

type Of<T extends Block["type"]> = Extract<Block, { type: T }>;

/** First sentence of a page's own summary: a concise description for a directory row. */
function firstSentence(text: string): string {
  const m = /^(.+?[.!?])(\s|$)/.exec(text.trim());
  return (m?.[1] ?? text).trim();
}

function describe(registry: Registry, id: string): string {
  const path = publishedPath(registry.nodes.get(id), registry);
  const page = path ? registry.pageByPath.get(path) : undefined;
  return page?.comprehension ? firstSentence(page.comprehension.what) : (page?.description ?? "");
}

/**
 * "Where this connects": the same five rails on every service, technology, and Work Area page.
 * Built from the page's authored relations and the entity graph; a published page is a link and an
 * unbuilt name is plain text, so it never creates a dead end.
 */
export function ConnectsBlock({ block, page }: { block: Of<"related">; page: Page }) {
  const registry = getRegistry();
  const rails = connectionsFor(page, registry);
  return (
    <Section id={block.id} tone={block.tone}>
      <SectionHeader
        id={block.id}
        label="Related"
        heading="Related services, technologies and industries"
      />
      <div
        data-reveal="group"
        className="connects"
        style={{ "--rails": rails.length } as React.CSSProperties}
      >
        {rails.map((r) => (
          <div key={r.id} data-rail={r.id} className="connects-card">
            <h3 className="connects-title">{r.title}</h3>
            <ul className="connects-list">
              {r.items.map((i) => (
                <li key={i.id}>
                  {i.href ? (
                    <Link href={i.href} className="chip chip-link">
                      {i.label}
                      <Arrow className="chip-arrow" />
                    </Link>
                  ) : (
                    <span className="chip chip-tag">{i.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}

const WAYS = [
  {
    id: "problem",
    label: "By problem",
    question: "I know what is going wrong",
    text: "Start from the business problem and see the kind of solution that fits.",
    href: "/solutions/",
  },
  {
    id: "system",
    label: "By system",
    question: "I know what I want built",
    text: "Browse the kinds of system we build, such as portals, platforms, and agents.",
    href: "/work/",
  },
  {
    id: "technology",
    label: "By technology",
    question: "I know the tool I want to use",
    text: "See where each technology fits, when it is right, and what the alternatives are.",
    href: "/technologies/",
  },
  {
    id: "discipline",
    label: "By discipline",
    question: "I know the kind of help I need",
    text: "Explore what we do, from software and AI to cloud, security, and design.",
    href: "/services/",
  },
] as const;

/** Four ways into the site, one per mental model. The current hub is marked, not repeated. */
export function BrowseBlock({ block }: { block: Of<"browse"> }) {
  const registry = getRegistry();
  return (
    <Section id={block.id} tone={block.tone}>
      <div className="max-w-[48rem]">
        <SectionHeader
          id={block.id}
          label={block.label}
          heading={block.heading}
          intro={block.intro}
        />
      </div>
      <ul
        data-reveal="group"
        className="m-0 mt-10 grid list-none grid-cols-1 gap-x-8 gap-y-6 p-0 min-[40rem]:grid-cols-2 min-[64rem]:grid-cols-4"
      >
        {WAYS.map((w) => {
          const here = w.id === block.current;
          const live = registry.pageByPath.has(w.href);
          return (
            <li key={w.id} className="rule-top pt-4" data-way={w.id} data-here={here}>
              <p className="t-eyebrow m-0">{w.label}</p>
              <p className="t-h4 mt-2 mb-0">{w.question}</p>
              <p className="t-small mt-2 text-slate-text">{w.text}</p>
              <p className="t-small mt-3 mb-0">
                {here ? (
                  <span aria-current="page" className="font-semibold">
                    You are here
                  </span>
                ) : live ? (
                  <Link
                    href={w.href}
                    className="menu-link inline-flex min-h-11 items-center gap-2 font-semibold"
                  >
                    {w.label.replace("By ", "Browse by ")}
                    <Arrow />
                  </Link>
                ) : (
                  <span>{w.label}</span>
                )}
              </p>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

/**
 * One directory for technologies or Work Areas, generated from the navigation data so the menu and
 * the directory can never disagree. Categories with counts, a short description per page, and a
 * filter that works without JavaScript (radio buttons and sibling selectors).
 */
export function DirectoryBlock({ block }: { block: Of<"directory"> }) {
  const registry = getRegistry();
  const nav = buildNavModel(registry);
  type Group = {
    id: string;
    anchor: string;
    label: string;
    summary?: string;
    items: { id: string; label: string; href: string }[];
  };
  let groups: Group[] = [];
  let noun = "technologies";
  if (block.source === "technologies") {
    const item = nav.items.find((i) => i.kind === "technologies");
    if (item?.kind === "technologies")
      groups = item.categories.map((c) => ({
        id: c.id,
        anchor: `cat-${c.id}`,
        label: c.label,
        summary: c.summary,
        items: c.all,
      }));
  } else {
    noun = "Work Areas";
    const item = nav.items.find((i) => i.kind === "work");
    if (item?.kind === "work")
      groups = item.groups.map((g) => ({
        id: g.id,
        anchor: `grp-${g.id}`,
        label: g.label,
        items: g.items,
      }));
  }
  const total = groups.reduce((n, g) => n + g.items.length, 0);
  const name = `${block.id}-filter`;
  return (
    <Section id={block.id} tone={block.tone}>
      <div className="max-w-[48rem]">
        <SectionHeader
          id={block.id}
          label={block.label}
          heading={block.heading}
          intro={block.intro}
        />
      </div>
      <div className="directory mt-10" data-reveal="block">
        <fieldset className="directory-filter">
          <legend className="t-label">Show</legend>
          <input id={`${name}-all`} className="dir-input" type="radio" name={name} defaultChecked />
          {groups.map((g) => (
            <input
              key={g.id}
              id={`${name}-${g.id}`}
              className="dir-input"
              type="radio"
              name={name}
            />
          ))}
          <div className="dir-tabs">
            <label htmlFor={`${name}-all`} className="dir-tab">
              All {noun} <span className="dir-count">{total}</span>
            </label>
            {groups.map((g) => (
              <label key={g.id} htmlFor={`${name}-${g.id}`} className="dir-tab">
                {g.label} <span className="dir-count">{g.items.length}</span>
              </label>
            ))}
          </div>
          <div className="dir-groups">
            {groups.map((g) => (
              <section
                key={g.id}
                id={g.anchor}
                aria-labelledby={`${g.anchor}-h`}
                className="dir-group"
              >
                <div className="dir-head">
                  <h3 id={`${g.anchor}-h`} className="t-h3 m-0">
                    {g.label}
                  </h3>
                  {g.summary ? (
                    <p className="t-small m-0 max-w-[52ch] text-slate-text">{g.summary}</p>
                  ) : null}
                </div>
                <ul className="dir-list">
                  {g.items.map((i) => (
                    <li key={i.id}>
                      <Link href={i.href} className="dir-link">
                        <span className="dir-name">{i.label}</span>
                        <span className="dir-desc">
                          <Inline text={describe(registry, i.id)} />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </fieldset>
      </div>
    </Section>
  );
}

const ARTICLE_CATEGORIES: Record<string, string> = {
  guide: "Guides",
  comparison: "Comparisons",
  decision: "Decision frameworks",
  explainer: "Explainers",
  industry: "Industry notes",
};

/** Published articles in the resource library, grouped by kind. Renders nothing until one exists. */
export function articlePages(registry: Registry): Page[] {
  return registry.pages
    .filter((p) => p.kind === "article" && p.indexing === "index")
    .sort((a, b) => b.datePublished.localeCompare(a.datePublished) || a.path.localeCompare(b.path));
}

export function ArticlesBlock({ block }: { block: Of<"articles"> }) {
  const registry = getRegistry();
  const articles = articlePages(registry);
  if (articles.length === 0) return null;
  const categories = Object.entries(ARTICLE_CATEGORIES)
    .map(([key, label]) => ({
      key,
      label,
      count: articles.filter((p) => p.article?.category === key).length,
    }))
    .filter((c) => c.count > 0);
  const card = (p: Page, featured = false) => (
    <Link
      href={p.path}
      className={`blog-card link-card${featured ? " is-featured" : ""}`}
      data-spotlight
    >
      {p.article?.photo ? (
        <span className="blog-photo">
          <Photo photo={p.article.photo} />
        </span>
      ) : null}
      <span className="blog-text">
        <span className="blog-meta">
          <span className="article-cat">{CATEGORY_LABEL[p.article?.category ?? "guide"]}</span>
          <span>{readingMinutes(p)} min read</span>
        </span>
        <span className="blog-title">{p.breadcrumbLabel}</span>
        <span className="blog-summary">{p.article?.summary ?? p.description}</span>
      </span>
      <HoverArrow />
    </Link>
  );
  const pillars = articles.filter((p) => p.article?.number === 1);
  const featured = pillars[0] ?? articles[0]!;
  return (
    <Section id={block.id} tone={block.tone}>
      <div className="max-w-[48rem]">
        <SectionHeader
          id={block.id}
          label={block.label}
          heading={block.heading}
          intro={block.intro}
        />
      </div>
      <div className="blog-featured">{card(featured, true)}</div>
      <BlogGrid
        total={articles.length}
        categories={categories}
        cards={articles
          .filter((p) => p !== featured)
          .map((p) => ({ key: p.path, category: p.article?.category ?? "guide", node: card(p) }))}
      />
    </Section>
  );
}

/** Which tab an article belongs to on the Resources page. */
const LIBRARY_GROUP = (p: Page) =>
  p.article?.category === "comparison"
    ? "comparisons"
    : p.article?.category === "cost"
      ? "cost-guides"
      : "guides";

const LIBRARY_TABS: { key: string; label: string }[] = [
  { key: "guides", label: "Guides" },
  { key: "comparisons", label: "Comparisons" },
  { key: "cost-guides", label: "Cost guides" },
];

/** A resource card: category, reading time, title, and summary. */
function ResourceCard({ p, featured = false }: { p: Page; featured?: boolean }) {
  return (
    <Link
      href={p.path}
      className={`blog-card link-card${featured ? " is-featured" : ""}`}
      data-spotlight
    >
      {p.article?.photo ? (
        <span className="blog-photo">
          <Photo photo={p.article.photo} />
        </span>
      ) : null}
      <span className="blog-text">
        <span className="blog-meta">
          <span className="article-cat">{CATEGORY_LABEL[p.article?.category ?? "guide"]}</span>
          <span>{readingMinutes(p)} min read</span>
        </span>
        <span className="blog-title">{p.breadcrumbLabel}</span>
        <span className="blog-summary">{p.article?.summary ?? p.description}</span>
      </span>
      <HoverArrow />
    </Link>
  );
}

/**
 * The Resources page library: filter tabs, the featured article, the latest articles, then a
 * row of cost guides and a row of comparisons (each only once one exists), and the Glossary.
 */
export function LibraryBlock({ block }: { block: Of<"library"> }) {
  const registry = getRegistry();
  const articles = articlePages(registry);
  if (articles.length === 0) return null;
  const featured = articles.find((p) => p.article?.number === 1) ?? articles[0]!;
  const tabs = LIBRARY_TABS.map((t) => ({
    ...t,
    count: articles.filter((p) => LIBRARY_GROUP(p) === t.key).length,
  })).filter((t) => t.count > 0);
  const glossaryHref = registry.pageByPath.has("/resources/glossary/")
    ? "/resources/glossary/"
    : undefined;
  const row = (id: string, label: string, heading: string) => {
    const list = articles.filter((p) => LIBRARY_GROUP(p) === id);
    if (list.length === 0) return null;
    return (
      <div id={id} className="rl-row">
        <div className="rl-row-head">
          <p className="t-eyebrow eyebrow-accent m-0">{label}</p>
          <h3 className="rl-row-title">{heading}</h3>
        </div>
        <ul className="blog-grid">
          {list.map((p) => (
            <li key={p.path}>
              <ResourceCard p={p} />
            </li>
          ))}
        </ul>
      </div>
    );
  };
  return (
    <Section id={block.id} tone={block.tone} ruled={false}>
      <h2 id={`${block.id}-h`} className="sr-only">
        <AccentText text={block.heading} />
      </h2>
      <ResourceLibrary
        tabs={tabs}
        glossaryHref={glossaryHref}
        featured={<ResourceCard p={featured} featured />}
        cards={articles
          .filter((p) => p !== featured)
          .map((p) => ({ key: p.path, group: LIBRARY_GROUP(p), node: <ResourceCard p={p} /> }))}
      />
      {row("cost-guides", "Cost guides", "What it costs, and why")}
      {row("comparisons", "Comparisons", "Two options, side by side")}
      {glossaryHref ? (
        <Link href={glossaryHref} className="rl-glossary link-card" data-spotlight>
          <span className="rl-glossary-label">Glossary</span>
          <span className="rl-glossary-title">Technology terms in plain English, A to Z</span>
          <span className="rl-glossary-text">
            {registry.pageByPath.get(glossaryHref)?.description}
          </span>
          <HoverArrow />
        </Link>
      ) : null}
      <div className="rl-newsletter">
        <NewsletterForm />
      </div>
    </Section>
  );
}

/** One short centered line at the end of a page. */
export function NoteBlock({ block }: { block: Of<"note"> }) {
  return (
    <div className={`note-line tone-${block.tone}`}>
      <div className="container-site">
        <p>{block.text}</p>
      </div>
    </div>
  );
}
