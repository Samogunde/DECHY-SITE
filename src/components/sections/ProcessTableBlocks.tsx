import { Figure, MOCKUP_FIGURES } from "@/components/figures/Figure";
import { Inline } from "@/components/primitives/Inline";
import { Photo } from "@/components/primitives/Photo";
import type { Block, Page } from "@/lib/content/schema";
import { SelectPanel } from "./SelectPanel";
import { Section, SectionHeader } from "./Section";

type Of<T extends Block["type"]> = Extract<Block, { type: T }>;

/** Numbered delivery path: connected step cards, each with what it produces. */
export function ProcessBlock({ block }: { block: Of<"process"> }) {
  const n = block.steps.length;
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
      <ol data-reveal="group" className="steps" data-count={n}>
        {block.steps.map((s, i) => (
          <li key={s.title} className="step">
            <span className="step-n" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="step-card">
              {s.duration ? <p className="step-duration">{s.duration}</p> : null}
              <h3 className="step-title">{s.title}</h3>
              <p className="step-body">
                <Inline text={s.body} />
              </p>
              {s.artifacts.length > 0 ? (
                <div className="step-out">
                  <p className="step-out-label">What it produces</p>
                  <ul className="step-out-list">
                    {s.artifacts.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
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
export function TableBlock({ block, page }: { block: Of<"table">; page?: Page }) {
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
              <span className="compare-q" role="columnheader">
                <span className="visually-hidden">{rowHead}</span>
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
  // A page that already asks the visitor to choose (a chooser block) shows its options as cards,
  // so two identical select panels never follow each other.
  const asCards = Boolean(page?.sections.some((b) => b.type === "chooser"));
  if (choice && asCards) {
    const [, lead, ...rest] = block.columns;
    const selfName = page?.breadcrumbLabel?.toLowerCase();
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
          className="option-cards"
          aria-label={block.caption}
          data-count={block.rows.length}
          data-reveal="group"
        >
          {block.rows.map((row) => {
            const name = plain(row[0] ?? "");
            const here = selfName !== undefined && name.toLowerCase() === selfName;
            return (
              <li key={name} className="option-card" data-here={here ? "true" : undefined}>
                <div className="option-card-head">
                  <h3 className="option-card-name">
                    <Inline text={row[0] ?? ""} />
                  </h3>
                  {here ? <span className="option-card-badge">This page</span> : null}
                </div>
                <p className="option-card-kicker">{lead}</p>
                <p className="option-card-lead">
                  <Inline text={row[1] ?? ""} />
                </p>
                {rest.length > 0 ? (
                  <dl className="option-card-fields">
                    {rest.map((h, k) => (
                      <div key={h}>
                        <dt>{h}</dt>
                        <dd>
                          <Inline text={row[k + 2] ?? ""} />
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </li>
            );
          })}
        </ul>
        {block.note ? (
          <p className="t-caption mt-5 max-w-[60ch]">
            <Inline text={block.note} />
          </p>
        ) : null}
      </Section>
    );
  }
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
  // Compact diagrams (a hub, layers, a funnel, a decision) sit beside their heading rather than
  // under it, so the section never leaves half its width empty. Flows and before-and-after need
  // the full width and stay stacked unless a page asks otherwise.
  const compact =
    block.spec !== undefined &&
    ["hub", "layers", "funnel", "decision"].includes(block.spec.kind) &&
    !block.photo;
  if (
    block.layout === "split" ||
    (block.layout !== "stack" && compact) ||
    (block.figure && MOCKUP_FIGURES.has(block.figure))
  ) {
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
