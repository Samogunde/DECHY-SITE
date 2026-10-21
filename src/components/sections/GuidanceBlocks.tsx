import Link from "next/link";
import { Arrow } from "@/components/primitives/Arrow";
import { Inline } from "@/components/primitives/Inline";
import { LinkButton } from "@/components/primitives/LinkButton";
import { getRegistry } from "@/lib/content/load";
import type { Block, Comprehension } from "@/lib/content/schema";
import { pathExists } from "@/lib/content/urls";
import { SelectPanel } from "./SelectPanel";
import { Tabs } from "./Tabs";
import { Section, SectionHeader } from "./Section";

type Of<T extends Block["type"]> = Extract<Block, { type: T }>;

/**
 * "At a glance": the visitor's five answers (clarity standard section 1), right after the hero,
 * rendered from the page's `comprehension` record so the summary and the review record can never
 * disagree. One interaction on every page: four questions to choose from, the selected answer
 * beside them, and the next step as a separate action.
 */
export function AtAGlance({
  comprehension,
  cta,
  kind,
}: {
  comprehension: Comprehension;
  cta?: { label: string; href: string };
  /** The page kind, so the first question fits the page: a technology is explained, a
      commercial page says what we do or build. */
  kind?: string;
}) {
  // Tab names only name the answer (consultant brief, 20 October 2026); no instructions.
  const tech = kind === "technology";
  const items: { label: string; text: string }[] = [
    { label: tech ? "What it is" : "What we build", text: comprehension.what },
    { label: tech ? "Problems it solves" : "Problems we solve", text: comprehension.problem },
    { label: tech ? "Who it suits" : "Who we serve", text: comprehension.audience },
    { label: "How to choose", text: comprehension.choose },
  ];
  const showCta = cta && pathExists(cta.href.split(/[?#]/)[0] ?? "", getRegistry());
  return (
    <section aria-labelledby="glance-h" className="tone-white rule-top glance">
      <div className="container-site">
        <h2 id="glance-h" className="t-eyebrow eyebrow-accent m-0">
          At a glance
        </h2>
        <div className="glance-layout">
          <SelectPanel
            label="At a glance"
            items={items.map((it) => ({
              label: it.label,
              body: (
                <>
                  <p className="sp-kicker">{it.label}</p>
                  <p className="sp-statement">
                    <Inline text={it.text} />
                  </p>
                </>
              ),
            }))}
          />
          <aside className="glance-action" aria-label="Next step">
            <p className="t-eyebrow glance-next-label m-0">Next step</p>
            <p className="glance-next-text m-0">
              <Inline text={comprehension.next} />
            </p>
            {showCta ? (
              <LinkButton href={cta.href} className="glance-next-btn" arrow>
                {cta.label}
              </LinkButton>
            ) : null}
          </aside>
        </div>
      </div>
    </section>
  );
}

/** "On this page": one-tap jumps to each section, for scanning long pages. */
export function SectionNav({ items }: { items: { id: string; label: string }[] }) {
  return (
    <nav aria-label="On this page" className="tone-paper section-nav">
      <div className="container-site">
        <p className="t-eyebrow m-0">On this page</p>
        <ul className="section-nav-list">
          {items.map((it) => (
            <li key={it.id}>
              <a href={`#${it.id}`} className="menu-link">
                {it.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

/** "I need..." pathways: the visitor's own words, each leading to the right page. */
export function PathFinderBlock({ block }: { block: Of<"pathfinder"> }) {
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
      <ul className="pathfinder" data-reveal="group">
        {block.paths.map((p) => {
          const base = p.href.split(/[?#]/)[0] ?? "";
          const live = pathExists(base, registry);
          const inner = (
            <>
              <span className="path-head">
                <span className="row-title t-h4">{p.need}</span>
                {live ? (
                  <span className="path-go" aria-hidden="true">
                    <Arrow />
                  </span>
                ) : null}
              </span>
              <span className="t-small mt-1.5 block max-w-[46ch] text-slate-text">
                <Inline text={p.text} />
              </span>
              {live && p.action ? <span className="path-action">{p.action}</span> : null}
            </>
          );
          return (
            <li key={p.need} className="path-row">
              {live ? (
                <Link href={p.href} className="row-link block">
                  {inner}
                </Link>
              ) : (
                <div>{inner}</div>
              )}
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

/** A guided decision: the visitor picks the answer closest to their situation and sees the route. */
export function ChooserBlock({ block }: { block: Of<"chooser"> }) {
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
      <div className="chooser" data-reveal="block">
        <h3 className="chooser-question">{block.question}</h3>
        <SelectPanel
          label={block.question}
          numbered={false}
          items={block.options.map((o) => ({
            label: o.label,
            body: (
              <>
                <p className="sp-kicker">Choose this when</p>
                <p className="sp-statement">
                  <Inline text={o.when} />
                </p>
                <dl className="sp-fields">
                  <div>
                    <dt>What you get</dt>
                    <dd className="t-body">
                      <Inline text={o.get} />
                    </dd>
                  </div>
                  {o.watch ? (
                    <div>
                      <dt>Keep in mind</dt>
                      <dd className="t-body">
                        <Inline text={o.watch} />
                      </dd>
                    </div>
                  ) : null}
                </dl>
                {o.cta && pathExists(o.cta.href.split(/[?#]/)[0] ?? "", getRegistry()) ? (
                  <LinkButton href={o.cta.href} variant="secondary" className="mt-6" arrow>
                    {o.cta.label}
                  </LinkButton>
                ) : null}
              </>
            ),
          }))}
        />
      </div>
    </Section>
  );
}

/**
 * Level 4 of the progressive depth: technical detail, always in the page, opened on demand. Set on
 * a dark surface as topic tabs, so it reads as a different kind of section from questions.
 */
export function TechnicalBlock({ block }: { block: Of<"technical"> }) {
  return (
    <Section id={block.id} tone="ink" className="technical-section">
      <div className="technical-layout">
        <SectionHeader
          id={block.id}
          label={block.label}
          heading={block.heading}
          intro={block.intro}
        />
        <div className="technical-card" data-reveal="block">
          <Tabs
            label={block.heading}
            items={block.panels.map((p) => ({
              label: p.title,
              body: (
                <div className="technical-body">
                  {p.paragraphs.length > 0 ? (
                    <div className="technical-text">
                      {p.paragraphs.map((para, k) => (
                        <p key={k}>
                          <Inline text={para} />
                        </p>
                      ))}
                    </div>
                  ) : null}
                  {p.items.length > 0 ? (
                    <ul className="technical-points">
                      {p.items.map((it) => (
                        <li key={it}>
                          <Inline text={it} />
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ),
            }))}
          />
        </div>
      </div>
    </Section>
  );
}

/** A set-apart note: honest limits, an illustrative scenario, or a short reminder. */
export function CalloutBlock({ block }: { block: Of<"callout"> }) {
  const eyebrow =
    block.variant === "limits"
      ? "Choosing the right approach"
      : block.variant === "illustrative"
        ? "A typical example"
        : "Worth knowing";
  return (
    <Section id={block.id} tone={block.tone} ruled={false} className="callout-section">
      <div className={`callout-card callout-${block.variant}`} data-reveal="block">
        <div className="callout-head">
          <p className="callout-eyebrow m-0">{eyebrow}</p>
          <h2 id={`${block.id}-h`} className="callout-title">
            {block.title}
          </h2>
        </div>
        <div className="callout-body">
          {block.paragraphs.map((p, i) => (
            <p key={i} className="m-0">
              <Inline text={p} />
            </p>
          ))}
          {block.items.length > 0 ? (
            <ul className="callout-list">
              {block.items.map((it) => (
                <li key={it}>
                  <Inline text={it} />
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </Section>
  );
}

/** A glossary: a letter index, then each term with its plain definition, A to Z. */
export function GlossaryBlock({ block }: { block: Of<"glossary"> }) {
  const items = [...block.items].sort((a, b) => a.term.localeCompare(b.term));
  const anchor = (term: string) =>
    `term-${term
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")}`;
  const letters = [...new Set(items.map((t) => t.term[0]!.toUpperCase()))];
  return (
    <Section id={block.id} tone={block.tone} ruled={false}>
      <SectionHeader
        id={block.id}
        label={block.label}
        heading={block.heading}
        intro={block.intro}
      />
      <nav className="glossary-letters" aria-label="Glossary letters">
        {letters.map((l) => (
          <a key={l} href={`#${anchor(items.find((t) => t.term[0]!.toUpperCase() === l)!.term)}`}>
            {l}
          </a>
        ))}
      </nav>
      <dl className="glossary-grid">
        {items.map((t) => (
          <div key={t.term} id={anchor(t.term)} className="glossary-item">
            <dt>{t.term}</dt>
            <dd>{t.definition}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
