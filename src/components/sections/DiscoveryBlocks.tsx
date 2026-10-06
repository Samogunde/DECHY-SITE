import Link from "next/link";
import { Arrow } from "@/components/primitives/Arrow";
import { Inline } from "@/components/primitives/Inline";
import { getRegistry, type Registry } from "@/lib/content/load";
import type { Block, Page } from "@/lib/content/schema";
import { connectionsFor } from "@/lib/connections";
import { buildNavModel } from "@/lib/nav";
import { publishedPath } from "@/lib/content/urls";
import { Section, SectionHeader } from "./Section";

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
      <div className="editorial">
        <SectionHeader
          id={block.id}
          label="Connections"
          heading="Where this connects"
          className="rail"
        />
        <div
          data-reveal="group"
          className="grid gap-10 min-[48rem]:grid-cols-2 min-[64rem]:grid-cols-3"
        >
          {rails.map((r) => (
            <div key={r.id} data-rail={r.id}>
              <h3 className="t-h4 m-0">{r.title}</h3>
              <ul className="t-body m-0 mt-3 list-none p-0">
                {r.items.map((i) => (
                  <li key={i.id} className="rule-row py-2.5">
                    {i.href ? <Link href={i.href}>{i.label}</Link> : <span>{i.label}</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
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
