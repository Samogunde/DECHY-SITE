import Link from "next/link";
import { Arrow } from "@/components/primitives/Arrow";
import { Inline } from "@/components/primitives/Inline";
import { LinkButton } from "@/components/primitives/LinkButton";
import { getRegistry } from "@/lib/content/load";
import type { Block, Comprehension } from "@/lib/content/schema";
import { pathExists } from "@/lib/content/urls";
import { Section, SectionHeader } from "./Section";

type Of<T extends Block["type"]> = Extract<Block, { type: T }>;

/**
 * "At a glance": the visitor's five answers (clarity standard section 1), shown right after the
 * hero. Rendered from the page's `comprehension` record so the summary and the review record
 * can never disagree.
 */
export function AtAGlance({
  comprehension,
  cta,
}: {
  comprehension: Comprehension;
  cta?: { label: string; href: string };
}) {
  const items: [string, string][] = [
    ["What it is", comprehension.what],
    ["The problem it solves", comprehension.problem],
    ["Who it is for", comprehension.audience],
    ["How to choose", comprehension.choose],
  ];
  return (
    <section aria-labelledby="glance-h" className="tone-white rule-top glance">
      <div className="container-site">
        <h2 id="glance-h" className="t-eyebrow eyebrow-accent m-0">
          At a glance
        </h2>
        <dl className="glance-grid" data-reveal="group">
          {items.map(([k, v]) => (
            <div key={k} className="glance-item">
              <dt className="t-label">{k}</dt>
              <dd className="t-body m-0">
                <Inline text={v} />
              </dd>
            </div>
          ))}
          <div className="glance-item glance-next">
            <dt className="t-label">Next step</dt>
            <dd className="t-body m-0">
              <Inline text={comprehension.next} />
              {cta && pathExists(cta.href.split(/[?#]/)[0] ?? "", getRegistry()) ? (
                <LinkButton href={cta.href} className="mt-4" arrow>
                  {cta.label}
                </LinkButton>
              ) : null}
            </dd>
          </div>
        </dl>
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

/**
 * A guided decision. Built on native radio inputs so it works with no JavaScript, with the
 * keyboard, and on touch; every option's text is in the page for readers and crawlers.
 */
export function ChooserBlock({ block }: { block: Of<"chooser"> }) {
  const name = `chooser-${block.id}`;
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
      <fieldset className="chooser" data-reveal="block">
        <legend className="chooser-question t-h4">{block.question}</legend>
        {block.options.map((o, i) => (
          <input
            key={o.label}
            id={`${name}-${i}`}
            className="chooser-input"
            type="radio"
            name={name}
            defaultChecked={i === 0}
          />
        ))}
        <div className="chooser-tabs">
          {block.options.map((o, i) => (
            <label key={o.label} htmlFor={`${name}-${i}`} className="chooser-tab">
              {o.label}
            </label>
          ))}
        </div>
        <div className="chooser-panels">
          {block.options.map((o) => (
            <div key={o.label} className="chooser-panel">
              <p className="chooser-when t-body-lg m-0">
                <strong>Choose this when:</strong> <Inline text={o.when} />
              </p>
              <div className="chooser-cols">
                <div>
                  <p className="t-label m-0">What you get</p>
                  <p className="t-body m-0 mt-1">
                    <Inline text={o.get} />
                  </p>
                </div>
                {o.watch ? (
                  <div>
                    <p className="t-label m-0">Keep in mind</p>
                    <p className="t-body m-0 mt-1">
                      <Inline text={o.watch} />
                    </p>
                  </div>
                ) : null}
              </div>
              {o.cta && pathExists(o.cta.href.split(/[?#]/)[0] ?? "", getRegistry()) ? (
                <LinkButton href={o.cta.href} variant="secondary" className="mt-5" arrow>
                  {o.cta.label}
                </LinkButton>
              ) : null}
            </div>
          ))}
        </div>
      </fieldset>
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
        ? "Illustrative scenario"
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
          {block.variant === "illustrative" ? (
            <p className="t-caption m-0">
              This is a made-up example to explain how the system works. It is not a client project
              and describes no real result.
            </p>
          ) : null}
        </div>
      </div>
    </Section>
  );
}
