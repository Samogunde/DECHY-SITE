import Link from "next/link";
import type { ReactNode } from "react";
import { Arrow } from "@/components/primitives/Arrow";
import { EntityLink, Inline } from "@/components/primitives/Inline";
import { Photo } from "@/components/primitives/Photo";
import { getRegistry } from "@/lib/content/load";
import type { Block } from "@/lib/content/schema";
import { pathExists, publishedPath } from "@/lib/content/urls";
import { Section, SectionHeader } from "./Section";

type Of<T extends Block["type"]> = Extract<Block, { type: T }>;

/** The approved company statement, set large. Text comes from the facts register only. */
export function StatementBlock({ block }: { block: Of<"statement"> }) {
  const fact = getRegistry().facts.get(block.factId);
  if (!fact) throw new Error(`Unknown fact ${block.factId}`);
  return (
    <Section id={block.id} tone={block.tone}>
      <div className="editorial">
        <div className="rail">
          <p className="t-eyebrow m-0">{block.label}</p>
          <h2 id={`${block.id}-h`} className="visually-hidden">
            About DECHY
          </h2>
        </div>
        <p
          className="m-0 max-w-[34ch] font-[family-name:var(--font-heading)] font-semibold min-[48rem]:max-w-[40ch]"
          style={{ fontSize: "var(--fs-h2)", lineHeight: 1.25, letterSpacing: "-0.012em" }}
        >
          {fact.value}
        </p>
      </div>
    </Section>
  );
}

/** The opening text beside a visual: heading, the direct answer, then the supporting paragraphs. */
function AnswerVisual({
  block,
  answer,
  paragraphs,
  visual,
  aside,
}: {
  block: { id: string; tone: "paper" | "white" | "ink"; label: string; heading: string };
  answer: string;
  paragraphs: string[];
  visual: ReactNode;
  aside?: { title: string; items: string[] };
}) {
  return (
    <Section id={block.id} tone={block.tone}>
      <div className="answer-visual">
        <div className="answer-visual-text">
          <SectionHeader id={block.id} label={block.label} heading={block.heading} />
          <p className="answer-lead" data-reveal="block">
            <Inline text={answer} />
          </p>
          {paragraphs.length > 0 ? (
            <div className="prose-service answer-visual-body" data-reveal="block">
              {paragraphs.map((p, i) => (
                <p key={i}>
                  <Inline text={p} />
                </p>
              ))}
            </div>
          ) : null}
          {aside ? <AsideCard aside={aside} /> : null}
        </div>
        <div className="answer-visual-figure" data-reveal="figure">
          {visual}
        </div>
      </div>
    </Section>
  );
}

function AsideCard({ aside }: { aside: { title: string; items: string[] } }) {
  return (
    <aside className="aside-card" aria-label={aside.title}>
      <p className="aside-card-title">{aside.title}</p>
      <ul className="aside-card-list">
        {aside.items.map((it) => (
          <li key={it}>
            <Inline text={it} />
          </li>
        ))}
      </ul>
    </aside>
  );
}

/**
 * Answer-first opening: the heading and the direct answer share the left column, so the answer is
 * read first and the column is never an empty rail; the supporting paragraphs sit beside it.
 */
export function DefinitionBlock({
  block,
  visual,
}: {
  block: Of<"definition">;
  visual?: ReactNode;
}) {
  if (visual)
    return (
      <AnswerVisual
        block={block}
        answer={block.answer}
        paragraphs={block.paragraphs}
        visual={visual}
      />
    );
  return (
    <Section id={block.id} tone={block.tone}>
      <div className="answer-split">
        <div className="answer-split-lead">
          <SectionHeader id={block.id} label={block.label} heading={block.heading} />
          <p className="answer-lead" data-reveal="block">
            <Inline text={block.answer} />
          </p>
        </div>
        {block.paragraphs.length > 0 ? (
          <div className="prose-service answer-split-body" data-reveal="block">
            {block.paragraphs.map((p, i) => (
              <p key={i}>
                <Inline text={p} />
              </p>
            ))}
          </div>
        ) : null}
      </div>
    </Section>
  );
}

/**
 * Running text. Its first paragraph is set as the answer under the heading and the rest sits
 * beside it (or beside a visual), so prose never arrives as one undivided column.
 */
export function ProseBlock({ block, visual }: { block: Of<"prose">; visual?: ReactNode }) {
  const [lead, ...more] = block.paragraphs;
  if (visual && lead)
    return (
      <AnswerVisual
        block={block}
        answer={lead}
        paragraphs={more}
        visual={visual}
        aside={block.aside}
      />
    );
  if (lead && more.length > 0)
    return (
      <Section id={block.id} tone={block.tone}>
        <div className="answer-split">
          <div className="answer-split-lead">
            <SectionHeader id={block.id} label={block.label} heading={block.heading} />
            <p className="answer-lead" data-reveal="block">
              <Inline text={lead} />
            </p>
          </div>
          <div className="prose-service answer-split-body" data-reveal="block">
            {more.map((p, i) => (
              <p key={i}>
                <Inline text={p} />
              </p>
            ))}
            {block.aside ? <AsideCard aside={block.aside} /> : null}
          </div>
        </div>
      </Section>
    );
  return (
    <Section id={block.id} tone={block.tone}>
      <div className="editorial">
        <div className="rail">
          <SectionHeader id={block.id} label={block.label} heading={block.heading} />
        </div>
        <div className="prose-service" data-reveal="block">
          {block.paragraphs.map((p, i) => (
            <p key={i}>
              <Inline text={p} />
            </p>
          ))}
          {block.aside ? <AsideCard aside={block.aside} /> : null}
        </div>
      </div>
    </Section>
  );
}

function IndexItems({ block, twoCol }: { block: Of<"index">; twoCol: boolean }) {
  const registry = getRegistry();
  const target = (item: Of<"index">["items"][number]) =>
    item.href && pathExists(item.href, registry)
      ? item.href
      : item.ref
        ? publishedPath(registry.nodes.get(item.ref), registry)
        : null;
  // A short list where every entry leads somewhere is a set of destinations: show it as cards.
  if (block.items.length <= 6 && block.items.every((i) => target(i))) {
    return (
      <ul data-reveal="group" className="dest-cards m-0 list-none p-0">
        {block.items.map((item) => (
          <li key={item.title}>
            <Link href={target(item)!} className="dest-card">
              <span className="dest-card-title">{item.title}</span>
              <span className="dest-card-body">
                <Inline text={item.body} />
              </span>
              <span className="dest-card-go" aria-hidden="true">
                <Arrow />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    );
  }
  // Longer two-column lists read better as a set of tiles than as a wall of ruled rows.
  if (twoCol && block.items.length >= 6) {
    return (
      <ol data-reveal="group" className="index-tiles m-0 list-none p-0">
        {block.items.map((item, i) => (
          <li key={item.title} className="index-tile">
            <h3 className="t-h4 m-0">
              {block.numbered ? (
                <span className="index-tile-n" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
              ) : null}
              {item.href && pathExists(item.href, getRegistry()) ? (
                <Link href={item.href}>{item.title}</Link>
              ) : item.ref ? (
                <EntityLink id={item.ref}>{item.title}</EntityLink>
              ) : (
                item.title
              )}
            </h3>
            <p className="t-small m-0">
              <Inline text={item.body} />
            </p>
          </li>
        ))}
      </ol>
    );
  }
  return (
    <ol
      data-reveal="group"
      className={`m-0 list-none p-0 ${twoCol ? "min-[48rem]:grid min-[48rem]:grid-cols-2 min-[48rem]:gap-x-10" : ""}`}
    >
      {block.items.map((item, i) => (
        <li key={item.title} className="rule-row">
          <div className="index-row" style={twoCol ? { gridTemplateColumns: "1fr" } : undefined}>
            <h3 className="t-h4 m-0 flex items-baseline gap-3">
              {block.numbered ? (
                <span className="t-caption font-[family-name:var(--font-heading)] font-bold tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
              ) : null}
              <span>
                {item.href && pathExists(item.href, getRegistry()) ? (
                  <Link href={item.href}>{item.title}</Link>
                ) : item.ref ? (
                  <EntityLink id={item.ref}>{item.title}</EntityLink>
                ) : (
                  item.title
                )}
              </span>
            </h3>
            <p className="t-body m-0 max-w-[60ch]">
              <Inline text={item.body} />
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/**
 * A list of titled entries. Optionally carries one photograph in one of three layouts:
 * rail (beside the heading, sticky), band (a wide image between heading and list), or split
 * (heading and image side by side above a two-column list).
 */
export function IndexBlock({ block }: { block: Of<"index"> }) {
  const photo = block.photo;
  const header = (className?: string) => (
    <SectionHeader
      id={block.id}
      label={block.label}
      heading={block.heading}
      intro={block.intro}
      className={className}
    />
  );

  if (photo?.layout === "band") {
    return (
      <Section id={block.id} tone={block.tone}>
        <div className="max-w-[48rem]">{header()}</div>
        <Photo photo={photo} className="mt-10 min-[48rem]:mt-14" />
        <div className="mt-10 min-[48rem]:mt-14">
          <IndexItems block={block} twoCol={block.columns === 2} />
        </div>
      </Section>
    );
  }

  if (photo?.layout === "split") {
    return (
      <Section id={block.id} tone={block.tone}>
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">{header()}</div>
          <div className="lg:col-span-7">
            <Photo photo={photo} />
          </div>
        </div>
        <div className="mt-10 min-[48rem]:mt-14">
          <IndexItems block={block} twoCol />
        </div>
      </Section>
    );
  }

  // A long list of tiles takes the full width under its heading (three across on wide screens),
  // instead of a narrow column beside an empty rail.
  if (!photo && block.columns === 2 && block.items.length >= 6) {
    return (
      <Section id={block.id} tone={block.tone}>
        <div className="index-tiles-head">{header()}</div>
        <div className="mt-8 min-[48rem]:mt-10">
          <IndexItems block={block} twoCol />
        </div>
      </Section>
    );
  }

  return (
    <Section id={block.id} tone={block.tone}>
      <div className="editorial">
        <div className="rail">
          {header()}
          {photo ? <Photo photo={photo} className="mt-8" /> : null}
        </div>
        <div>
          <IndexItems block={block} twoCol={block.columns === 2} />
        </div>
      </div>
    </Section>
  );
}
