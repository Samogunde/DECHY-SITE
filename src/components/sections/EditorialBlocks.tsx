import Link from "next/link";
import { EntityLink, Inline } from "@/components/primitives/Inline";
import { Photo } from "@/components/primitives/Photo";
import { getRegistry } from "@/lib/content/load";
import type { Block } from "@/lib/content/schema";
import { pathExists } from "@/lib/content/urls";
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

/** Answer-first definition: a direct answer, then depth. */
export function DefinitionBlock({ block }: { block: Of<"definition"> }) {
  return (
    <Section id={block.id} tone={block.tone}>
      <div className="editorial">
        <SectionHeader id={block.id} label={block.label} heading={block.heading} className="rail" />
        <div className="prose-service" data-reveal="block">
          <p
            className="answer-lead m-0 font-[family-name:var(--font-heading)] font-semibold"
            style={{ fontSize: "var(--fs-lead)", lineHeight: 1.4 }}
          >
            <Inline text={block.answer} />
          </p>
          {block.paragraphs.map((p, i) => (
            <p key={i}>
              <Inline text={p} />
            </p>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function ProseBlock({ block }: { block: Of<"prose"> }) {
  return (
    <Section id={block.id} tone={block.tone}>
      <div className="editorial">
        <div className="rail">
          <SectionHeader id={block.id} label={block.label} heading={block.heading} />
          {block.aside ? (
            <aside
              className="mt-8 hidden border-l-2 border-blue pl-4 lg:block"
              aria-label={block.aside.title}
            >
              <p className="t-label m-0">{block.aside.title}</p>
              <ul className="t-small m-0 mt-2 list-none space-y-1.5 p-0">
                {block.aside.items.map((it) => (
                  <li key={it}>
                    <Inline text={it} />
                  </li>
                ))}
              </ul>
            </aside>
          ) : null}
        </div>
        <div className="prose-service" data-reveal="block">
          {block.paragraphs.map((p, i) => (
            <p key={i}>
              <Inline text={p} />
            </p>
          ))}
          {block.aside ? (
            <aside className="border-l-2 border-blue pl-4 lg:hidden" aria-label={block.aside.title}>
              <p className="t-label m-0">{block.aside.title}</p>
              <ul className="t-small m-0 mt-2 list-none space-y-1.5 p-0">
                {block.aside.items.map((it) => (
                  <li key={it}>
                    <Inline text={it} />
                  </li>
                ))}
              </ul>
            </aside>
          ) : null}
        </div>
      </div>
    </Section>
  );
}

function IndexItems({ block, twoCol }: { block: Of<"index">; twoCol: boolean }) {
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
