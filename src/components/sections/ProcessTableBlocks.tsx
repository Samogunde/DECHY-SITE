import { Figure, MOCKUP_FIGURES } from "@/components/figures/Figure";
import { Inline } from "@/components/primitives/Inline";
import { Photo } from "@/components/primitives/Photo";
import type { Block } from "@/lib/content/schema";
import { SelectPanel } from "./SelectPanel";
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
        className={`process-steps m-0 mt-10 grid list-none gap-x-8 gap-y-10 p-0 min-[48rem]:mt-12 min-[48rem]:grid-cols-2 ${
          block.steps.length === 4
            ? "min-[64rem]:grid-cols-4"
            : block.steps.length === 2
              ? ""
              : "min-[64rem]:grid-cols-3"
        }`}
      >
        {block.steps.map((s, i) => (
          <li key={s.title} className="relative border-t-2 border-ink pt-5">
            <span className="absolute -top-[0.9rem] left-0 inline-flex h-7 min-w-7 items-center justify-center bg-paper pr-3 font-[family-name:var(--font-heading)] text-[length:var(--fs-label)] font-bold tabular-nums text-link">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="t-h4 m-0">{s.title}</h3>
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
                      className="relative pl-4 before:absolute before:left-0 before:top-[0.65em] before:h-[2px] before:w-2 before:bg-slate-text before:content-['']"
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

/** First-column headings that mean "pick one of these": such tables become a choice, not a grid. */
const CHOICE_HEADERS = new Set([
  "Option",
  "Route",
  "Approach",
  "Way to connect",
  "Tool",
  "Platform",
  "Model",
  "Your situation",
  "Situation",
  "Language",
  "Channel",
]);

const plain = (s: string) => s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

/**
 * A comparison. Where the rows are options to choose between (build, buy, or connect; one hosting
 * route or another), the visitor picks an option and sees what it suits and what to watch for.
 * Other comparisons stay a table: on wide screens a grid, on narrow screens one card per row.
 */
export function TableBlock({ block }: { block: Of<"table"> }) {
  if (block.display === "compare" && block.columns.length === 3) {
    const [rowHead, a, b] = block.columns;
    return (
      <Section id={block.id} tone={block.tone}>
        <div className="compare-wrap">
          <div className="compare-intro">
            <SectionHeader
              id={block.id}
              label={block.label}
              heading={block.heading}
              intro={block.intro}
            />
          </div>
          <div className="compare" role="table" aria-label={block.caption} data-reveal="block">
            <div className="compare-row compare-head" role="row">
              <span className="compare-q visually-hidden" role="columnheader">
                {rowHead}
              </span>
              <span className="compare-a" role="columnheader">
                {a}
              </span>
              <span className="compare-b" role="columnheader">
                {b}
              </span>
            </div>
            {block.rows.map((row, i) => (
              <div key={i} className="compare-row" role="row">
                <span className="compare-q" role="rowheader">
                  <Inline text={row[0] ?? ""} />
                </span>
                <span className="compare-a" role="cell" data-label={a}>
                  <Inline text={row[1] ?? ""} />
                </span>
                <span className="compare-b" role="cell" data-label={b}>
                  <Inline text={row[2] ?? ""} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </Section>
    );
  }
  const choice =
    block.display !== "table" &&
    CHOICE_HEADERS.has(block.columns[0] ?? "") &&
    block.columns.length >= 3 &&
    block.rows.length >= 2 &&
    block.rows.length <= 6;
  if (choice) {
    const [, lead, ...rest] = block.columns;
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
          <SelectPanel
            label={block.caption}
            hint="Choose an option to compare"
            numbered={false}
            items={block.rows.map((row) => ({
              label: plain(row[0] ?? ""),
              body: (
                <>
                  {plain(row[0] ?? "") !== row[0] ? (
                    <p className="t-body m-0 mb-3">
                      <Inline text={row[0] ?? ""} />
                    </p>
                  ) : null}
                  <p className="sp-kicker">{lead}</p>
                  <p className="sp-statement">
                    <Inline text={row[1] ?? ""} />
                  </p>
                  {rest.length > 0 ? (
                    <dl className="sp-fields">
                      {rest.map((h, k) => (
                        <div key={h}>
                          <dt>{h}</dt>
                          <dd className="t-body">
                            <Inline text={row[k + 2] ?? ""} />
                          </dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                </>
              ),
            }))}
          />
          {block.note ? (
            <p className="t-caption mt-5 max-w-[60ch]">
              <Inline text={block.note} />
            </p>
          ) : null}
        </div>
      </Section>
    );
  }
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
                        <td key={k} data-label={block.columns[k]}>
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
      <p className="t-small m-0 mt-2">
        <Inline text={p.body} />
      </p>
    </div>
  ));
  if (block.layout === "split" || (block.figure && MOCKUP_FIGURES.has(block.figure))) {
    // The visual sits beside its heading and points, so the section reads as one composition
    // and the page has no empty half. Four or more points run in a row under both instead, so the
    // text column never outgrows the visual.
    const wide = points.length >= 4;
    return (
      <Section id={block.id} tone={block.tone}>
        <div className="split-visual">
          <div className="split-visual-text">
            <SectionHeader
              id={block.id}
              label={block.label}
              heading={block.heading}
              intro={block.intro}
            />
            {points.length > 0 && !wide ? (
              <div className="split-points" data-reveal="group">
                {points}
              </div>
            ) : null}
          </div>
          <div className="split-visual-figure">
            <Figure
              id={block.figure}
              spec={block.spec}
              title={block.visualTitle ?? block.heading}
              uid={block.id}
              caption={block.caption}
            />
          </div>
        </div>
        {wide ? (
          <div className="split-points-row" data-reveal="group">
            {points}
          </div>
        ) : null}
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
