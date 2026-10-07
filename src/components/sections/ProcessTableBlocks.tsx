import { Figure, MOCKUP_FIGURES } from "@/components/figures/Figure";
import { Inline } from "@/components/primitives/Inline";
import { Photo } from "@/components/primitives/Photo";
import type { Block } from "@/lib/content/schema";
import { Section, SectionHeader } from "./Section";

type Of<T extends Block["type"]> = Extract<Block, { type: T }>;

/** Numbered delivery rail: each step with what it produces. */
export function ProcessBlock({ block }: { block: Of<"process"> }) {
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
      <ol
        data-reveal="group"
        className="m-0 mt-12 grid list-none gap-x-10 gap-y-12 p-0 min-[48rem]:mt-16 min-[48rem]:grid-cols-2 min-[64rem]:grid-cols-3"
      >
        {block.steps.map((s, i) => (
          <li key={s.title} className="relative border-t-2 border-ink pt-5">
            <span className="absolute -top-[0.9rem] left-0 inline-flex h-7 min-w-7 items-center justify-center bg-paper pr-3 font-[family-name:var(--font-heading)] text-[length:var(--fs-label)] font-bold tabular-nums text-link">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="t-h3 m-0">{s.title}</h3>
            <p className="t-body m-0 mt-3">
              <Inline text={s.body} />
            </p>
            {s.artifacts.length > 0 ? (
              <div className="mt-4">
                <p className="t-eyebrow m-0">What it produces</p>
                <ul className="t-small m-0 mt-2 list-none space-y-1 p-0">
                  {s.artifacts.map((a) => (
                    <li
                      key={a}
                      className="relative pl-4 before:absolute before:left-0 before:top-[0.65em] before:h-[2px] before:w-2 before:bg-blue before:content-['']"
                    >
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </li>
        ))}
      </ol>
    </Section>
  );
}

/** Semantic, scrollable comparison table (keyboard reachable when it overflows). */
export function TableBlock({ block }: { block: Of<"table"> }) {
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
        <div data-reveal="block">
          <div
            className="table-wrap"
            tabIndex={0}
            role="region"
            aria-label={`${block.caption} (scrollable)`}
          >
            <table>
              <caption className="visually-hidden">{block.caption}</caption>
              <thead>
                <tr>
                  {block.columns.map((c) => (
                    <th key={c} scope="col">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, k) =>
                      k === 0 ? (
                        <th key={k} scope="row">
                          <Inline text={cell} />
                        </th>
                      ) : (
                        <td key={k}>
                          <Inline text={cell} />
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.note ? (
            <p className="t-caption mt-3 max-w-[60ch]">
              <Inline text={block.note} />
            </p>
          ) : null}
        </div>
      </div>
    </Section>
  );
}

/** A figure with its explanation. Light or dark surface. An optional photograph sits beside the points. */
export function DiagramBlock({ block }: { block: Of<"diagram"> }) {
  const points = block.points.map((p) => (
    <div key={p.title} className="rule-top pt-5">
      <h3 className="t-h4 m-0">{p.title}</h3>
      <p className="t-body m-0 mt-2">
        <Inline text={p.body} />
      </p>
    </div>
  ));
  if (block.figure && MOCKUP_FIGURES.has(block.figure)) {
    // An interface mockup sits beside its heading and text, so the page has no empty half.
    return (
      <Section id={block.id} tone={block.tone}>
        <div className="grid items-center gap-10 min-[64rem]:grid-cols-12 min-[64rem]:gap-14">
          <div className="min-[64rem]:col-span-5">
            <SectionHeader
              id={block.id}
              label={block.label}
              heading={block.heading}
              intro={block.intro}
            />
            {points.length > 0 ? (
              <div className="mt-8 grid gap-6" data-reveal="group">
                {points}
              </div>
            ) : null}
          </div>
          <div className="min-[64rem]:col-span-7">
            <Figure
              id={block.figure}
              title={block.visualTitle ?? block.heading}
              uid={block.id}
              caption={block.caption}
            />
          </div>
        </div>
      </Section>
    );
  }
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
      <Figure
        id={block.figure}
        spec={block.spec}
        title={block.visualTitle ?? block.heading}
        uid={block.id}
        caption={block.caption}
        className="mt-10 min-[48rem]:mt-14"
      />
      {block.photo ? (
        <div className="mt-14 grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <Photo photo={block.photo} />
          </div>
          <div className="grid gap-8 lg:col-span-7" data-reveal="group">
            {points}
          </div>
        </div>
      ) : block.points.length > 0 ? (
        <div className="mt-12 grid gap-x-10 gap-y-8 min-[48rem]:grid-cols-3" data-reveal="group">
          {points}
        </div>
      ) : null}
    </Section>
  );
}
