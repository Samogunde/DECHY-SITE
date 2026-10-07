import Link from "next/link";
import { Arrow } from "@/components/primitives/Arrow";
import { EntityName, Inline } from "@/components/primitives/Inline";
import { getRegistry } from "@/lib/content/load";
import type { Block, Page } from "@/lib/content/schema";
import { publishedPath, representedPath } from "@/lib/content/urls";
import { Section, SectionHeader } from "./Section";

type Of<T extends Block["type"]> = Extract<Block, { type: T }>;

/** All 15 pillars, grouped in the five navigation families, with equal visual weight. */
export function ServiceIndexBlock({ block }: { block: Of<"service-index"> }) {
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
      <div className="mt-12 min-[48rem]:mt-16">
        {registry.families.map((family) => {
          const services = registry.services.filter((s) => s.family === family.id);
          return (
            <div
              key={family.id}
              data-reveal="block"
              className="editorial rule-top py-9 min-[48rem]:py-12"
            >
              <h3 className="t-eyebrow rail m-0 text-ink!">{family.label}</h3>
              <ul className="m-0 grid list-none gap-x-12 gap-y-8 p-0 min-[48rem]:grid-cols-2">
                {services.map((s) => {
                  const href = publishedPath(registry.nodes.get(s.id), registry);
                  const inner = (
                    <>
                      <span className="row-title t-h4 block">
                        {s.name}
                        {href ? <Arrow className="row-arrow" /> : null}
                      </span>
                      <span className="t-small mt-1.5 block max-w-[46ch] text-slate-text">
                        {s.micro}
                      </span>
                    </>
                  );
                  return (
                    <li key={s.id}>
                      {href ? (
                        <Link href={href} className="row-link block">
                          {inner}
                        </Link>
                      ) : (
                        <div>{inner}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

/** An entity in a list: a link to its own page or to the page that represents it, else a tag. */
function EntityChip({ id, here, chip }: { id: string; here?: string; chip: boolean }) {
  const registry = getRegistry();
  const node = registry.nodes.get(id)!;
  const own = publishedPath(node, registry);
  const rep = own ? null : representedPath(node, registry);
  const href = own ?? (rep && rep !== here ? rep : null);
  if (!chip) return href ? <Link href={href}>{node.name}</Link> : <span>{node.name}</span>;
  return href ? (
    <Link href={href} className="chip chip-link">
      {node.name}
      <Arrow className="chip-arrow" />
    </Link>
  ) : (
    <span className="chip chip-tag">{node.name}</span>
  );
}

export function EntitiesBlock({ block, page }: { block: Of<"entities">; page?: Page }) {
  const registry = getRegistry();
  for (const g of block.groups)
    for (const id of g.entityIds)
      if (!registry.nodes.has(id)) throw new Error(`Unknown entity "${id}" in block ${block.id}`);
  const chips = block.style === "chips";
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
        <div data-reveal="group" className={chips ? "" : "grid gap-x-10 min-[48rem]:grid-cols-2"}>
          {block.groups.map((g) => (
            <div
              key={g.title}
              className={chips ? "rule-row py-6 first:pt-0 first:border-t-0" : "rule-top pb-8 pt-5"}
            >
              <h3 className="t-h4 m-0">{g.title}</h3>
              {g.note ? (
                <p className="t-small m-0 mt-1 max-w-[56ch] text-slate-text">
                  <Inline text={g.note} />
                </p>
              ) : null}
              {chips ? (
                <ul className="m-0 mt-4 flex list-none flex-wrap gap-2 p-0">
                  {g.entityIds.map((id) => (
                    <li key={id}>
                      <EntityChip id={id} here={page?.path} chip />
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="inline-list t-small m-0 mt-3 flex list-none flex-wrap p-0">
                  {g.entityIds.map((id) => (
                    <li key={id}>
                      <EntityChip id={id} here={page?.path} chip={false} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function RelatedBlock({ block }: { block: Of<"related"> }) {
  const registry = getRegistry();
  for (const g of block.groups)
    for (const id of g.entityIds)
      if (!registry.nodes.has(id)) throw new Error(`Unknown entity "${id}" in block ${block.id}`);
  return (
    <Section id={block.id} tone={block.tone}>
      <div className="editorial">
        <SectionHeader id={block.id} label={block.label} heading={block.heading} className="rail" />
        <div
          data-reveal="group"
          className="grid gap-10 min-[48rem]:grid-cols-2 min-[64rem]:grid-cols-3"
        >
          {block.groups.map((g) => (
            <div key={g.title}>
              <h3 className="t-h4 m-0">{g.title}</h3>
              <ul className="t-body m-0 mt-3 list-none p-0">
                {g.entityIds.map((id) => (
                  <li key={id} className="rule-row py-2.5">
                    <EntityName id={id} />
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

export function ColumnsBlock({ block }: { block: Of<"columns"> }) {
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
      <div
        data-reveal="group"
        className={`mt-10 grid gap-x-10 gap-y-10 min-[48rem]:mt-14 min-[48rem]:grid-cols-2 ${block.columns.length >= 3 ? "min-[64rem]:grid-cols-3" : ""} ${block.columns.length >= 4 ? "min-[80rem]:grid-cols-4" : ""}`}
      >
        {block.columns.map((c) => (
          <div key={c.title} className="rule-top pt-5">
            <h3 className="t-h4 m-0">{c.title}</h3>
            <ul className="t-body m-0 mt-3 list-none space-y-2.5 p-0">
              {c.items.map((it) => (
                <li
                  key={it}
                  className="relative pl-5 before:absolute before:left-0.5 before:top-[0.62em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-ink before:content-['']"
                >
                  <Inline text={it} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
