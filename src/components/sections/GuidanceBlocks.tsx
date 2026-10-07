import Link from "next/link";
import { Arrow } from "@/components/primitives/Arrow";
import { Inline } from "@/components/primitives/Inline";
import { LinkButton } from "@/components/primitives/LinkButton";
import { getRegistry } from "@/lib/content/load";
import type { Block, Comprehension } from "@/lib/content/schema";
import { pathExists } from "@/lib/content/urls";
import { SelectPanel } from "./SelectPanel";
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
}: {
  comprehension: Comprehension;
  cta?: { label: string; href: string };
}) {
  const items: { label: string; text: string }[] = [
    { label: "What it is", text: comprehension.what },
    { label: "The problem it solves", text: comprehension.problem },
    { label: "Who it is for", text: comprehension.audience },
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
            hint="Choose a question to see the answer"
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
              <span className="row-title t-h4 block">
                {p.need}
                {live ? <Arrow className="row-arrow" /> : null}
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
          hint="Choose the answer closest to yours"
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

/** Level 4 of the progressive depth: technical detail, always in the page, opened on demand. */
export function TechnicalBlock({ block }: { block: Of<"technical"> }) {
  return (
    <Section id={block.id} tone={block.tone}>
      <div className="editorial">
        <SectionHeader
          id={block.id}
          label={block.label}
          heading={block.heading}
          intro={block.intro}
          className="rail"
        />
        <div className="faq technical" data-reveal="block">
          {block.panels.map((p) => (
            <details key={p.title}>
              <summary>
                <span>{p.title}</span>
              </summary>
              <div className="answer t-body-lg">
                {p.paragraphs.map((para, k) => (
                  <p key={k}>
                    <Inline text={para} />
                  </p>
                ))}
                {p.items.length > 0 ? (
                  <ul className="technical-list">
                    {p.items.map((it) => (
                      <li key={it}>
                        <Inline text={it} />
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}

/** A set-apart note: honest limits, an illustrative scenario, or a short reminder. */
export function CalloutBlock({ block }: { block: Of<"callout"> }) {
  const eyebrow =
    block.variant === "limits"
      ? "When this is not the right answer"
      : block.variant === "illustrative"
        ? "A typical example"
        : "Worth knowing";
  return (
    <Section id={block.id} tone={block.tone} ruled={false} className="callout-section">
      <div className="editorial">
        <div className="rail" data-reveal="block">
          <p className="t-eyebrow eyebrow-accent m-0">{eyebrow}</p>
          <h2 id={`${block.id}-h`} className="t-h3 mt-3 max-w-[22ch]">
            {block.title}
          </h2>
        </div>
        <div className={`callout callout-${block.variant}`} data-reveal="block">
          {block.paragraphs.map((p, i) => (
            <p key={i} className="t-body-lg m-0">
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
