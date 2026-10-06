import type { CSSProperties } from "react";
import { Arrow } from "@/components/primitives/Arrow";
import { Inline } from "@/components/primitives/Inline";
import type { DiagramSpec } from "@/lib/content/schema";
import { DiagramRoot, step } from "./DiagramRoot";

/**
 * Data-driven teaching diagrams (clarity standard section 6). Each kind answers one visitor
 * question: flow (what happens, in order), layers (how the parts stack and what supports them),
 * before-after (what changes), hub (what connects to what), funnel (how a large group narrows),
 * decision (which answer fits which situation). All are real HTML text in a grid on the diagram
 * system (src/styles/diagrams.css), so type, alignment and responsiveness follow the same rules.
 */

/** Plain-text description read by assistive technology before the diagram content. */
export function describeSpec(spec: DiagramSpec): string {
  const parts = (xs: { title: string; text?: string }[]) =>
    xs.map((x) => (x.text ? `${x.title}: ${x.text}` : x.title)).join("; ");
  switch (spec.kind) {
    case "flow":
      return `A sequence of ${spec.steps.length} steps. ${parts(spec.steps)}.`;
    case "layers":
      return `Layers from top to bottom. ${spec.layers
        .map((l) => `${l.title}${l.support.length ? `, supported by ${parts(l.support)}` : ""}`)
        .join("; ")}.`;
    case "before-after":
      return `Before: ${spec.before.title}. ${parts(spec.before.nodes)}. After: ${spec.after.title}. ${parts(spec.after.nodes)}.`;
    case "hub":
      return `${spec.center.title} connected to: ${parts(spec.spokes)}.`;
    case "funnel":
      return `Stages that narrow: ${parts(spec.stages)}.`;
    case "decision":
      return `${spec.question} ${spec.branches.map((b) => `${b.when}: ${b.choose}`).join("; ")}.`;
  }
}

/** A sensible widest size for each kind when it is not placed in a narrow column. */
export function defaultMax(spec: DiagramSpec): string | undefined {
  switch (spec.kind) {
    case "layers":
      return "56rem";
    case "decision":
      return "56rem";
    case "funnel":
      return "48rem";
    case "hub":
      return "60rem";
    default:
      return undefined;
  }
}

function Flow({ spec }: { spec: Extract<DiagramSpec, { kind: "flow" }> }) {
  const n = spec.steps.length;
  const mid = Math.min(n, 3);
  const wide = n <= 6 ? n : 4;
  return (
    <>
      <ol className="sflow" style={{ "--n": n, "--mid": mid, "--wide": wide } as CSSProperties}>
        {spec.steps.map((s, i) => (
          <li
            key={s.title}
            className="sflow-step fx-step"
            style={step(i)}
            data-end-mid={i % mid === mid - 1 || i === n - 1 ? "true" : undefined}
            data-end-wide={i % wide === wide - 1 || i === n - 1 ? "true" : undefined}
          >
            <div className="dgm-box">
              <span className="dgm-badge" aria-hidden="true">
                {i + 1}
              </span>
              <span className="sflow-text">
                <span className="dgm-title">{s.title}</span>
                {s.text ? (
                  <span className="dgm-text">
                    <Inline text={s.text} />
                  </span>
                ) : null}
              </span>
            </div>
            <span className="sflow-arrow" aria-hidden="true">
              <Arrow />
            </span>
          </li>
        ))}
      </ol>
      {spec.note ? (
        <p className="dgm-note">
          <Inline text={spec.note} />
        </p>
      ) : null}
    </>
  );
}

function Layers({ spec }: { spec: Extract<DiagramSpec, { kind: "layers" }> }) {
  const anySupport = spec.layers.some((l) => l.support.length > 0);
  return (
    <div className={`anatomy ${anySupport ? "" : "anatomy-solo"}`.trim()}>
      {anySupport ? (
        <div className="anatomy-heads" aria-hidden="true">
          <p className="dgm-label">{spec.layerLabel}</p>
          <p className="dgm-label">{spec.supportLabel}</p>
        </div>
      ) : null}
      <ol className="anatomy-stack">
        {spec.layers.map((l, i) => (
          <li
            key={l.title}
            className={`anatomy-row fx-step ${l.support.length > 0 ? "has-support" : ""}`.trim()}
            style={{ "--n": l.support.length, "--i": i } as CSSProperties}
          >
            <div className="anatomy-stage">
              <div className="dgm-box">
                <span className="dgm-title">{l.title}</span>
                {l.text ? (
                  <span className="dgm-text">
                    <Inline text={l.text} />
                  </span>
                ) : null}
              </div>
            </div>
            {l.support.length > 0 ? (
              <>
                <span className="anatomy-link" aria-hidden="true" />
                <div className="anatomy-support-wrap">
                  <p className="dgm-label anatomy-support-label" aria-hidden="true">
                    {spec.supportLabel}
                  </p>
                  <ul className="anatomy-support" aria-label={`Supports ${l.title}`}>
                    {l.support.map((s) => (
                      <li key={s.title}>
                        <div className="dgm-box dgm-box-accent">
                          <span className="dgm-title">{s.title}</span>
                          {s.text ? (
                            <span className="dgm-text">
                              <Inline text={s.text} />
                            </span>
                          ) : null}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : null}
          </li>
        ))}
      </ol>
      {spec.base ? (
        <div className="anatomy-base">
          <span className="dgm-title">{spec.base.title}</span>
          {spec.base.text ? (
            <span className="dgm-text">
              <Inline text={spec.base.text} />
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function BeforeAfter({ spec }: { spec: Extract<DiagramSpec, { kind: "before-after" }> }) {
  return (
    <div className="ba">
      <section className="ba-panel ba-before" aria-label={spec.before.title}>
        <p className="dgm-label">Before</p>
        <p className="dgm-title ba-title">{spec.before.title}</p>
        {spec.before.text ? (
          <p className="dgm-text ba-lead">
            <Inline text={spec.before.text} />
          </p>
        ) : null}
        <ul className="ba-nodes">
          {spec.before.nodes.map((n, i) => (
            <li key={n.title} className="fx-step" style={step(i)}>
              <div className="dgm-box dgm-box-dashed">
                <span className="dgm-title">{n.title}</span>
                {n.text ? (
                  <span className="dgm-text">
                    <Inline text={n.text} />
                  </span>
                ) : null}
              </div>
              {i < spec.before.nodes.length - 1 ? (
                <span className="ba-hand" aria-hidden="true">
                  by hand
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </section>
      <span className="ba-arrow" aria-hidden="true">
        <Arrow />
      </span>
      <section className="ba-panel ba-after" aria-label={spec.after.title}>
        <p className="dgm-label">After</p>
        <p className="dgm-title ba-title">{spec.after.title}</p>
        {spec.after.text ? (
          <p className="dgm-text ba-lead">
            <Inline text={spec.after.text} />
          </p>
        ) : null}
        <div className="ba-connected">
          <p className="ba-bus-label" aria-hidden="true">
            {spec.hubLabel ?? "Connected automatically"}
          </p>
          <ul className="ba-nodes">
            {spec.after.nodes.map((n, i) => (
              <li key={n.title} className="fx-step" style={step(i + spec.before.nodes.length)}>
                <div className="dgm-box">
                  <span className="dgm-title">{n.title}</span>
                  {n.text ? (
                    <span className="dgm-text">
                      <Inline text={n.text} />
                    </span>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

function Hub({ spec }: { spec: Extract<DiagramSpec, { kind: "hub" }> }) {
  return (
    <div className="hub">
      <div className="dgm-box dgm-box-ink hub-center hero-layer" style={step(0)}>
        <span className="dgm-title">{spec.center.title}</span>
        {spec.center.text ? (
          <span className="dgm-text">
            <Inline text={spec.center.text} />
          </span>
        ) : null}
      </div>
      <span className="hub-stem" aria-hidden="true" />
      <ul className="hub-spokes">
        {spec.spokes.map((s, i) => (
          <li key={s.title} className="fx-step" style={step(i + 1)}>
            <div className="dgm-box">
              <span className="dgm-title">{s.title}</span>
              {s.text ? (
                <span className="dgm-text">
                  <Inline text={s.text} />
                </span>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Funnel({ spec }: { spec: Extract<DiagramSpec, { kind: "funnel" }> }) {
  const n = spec.stages.length;
  return (
    <ol className="funnel">
      {spec.stages.map((s, i) => (
        <li
          key={s.title}
          className="funnel-stage fx-step"
          style={{ ...step(i), "--w": `${100 - (i * 38) / (n - 1)}%` } as CSSProperties}
        >
          <div className="dgm-box">
            <span className="dgm-badge dgm-badge-ink" aria-hidden="true">
              {i + 1}
            </span>
            <span className="funnel-text">
              <span className="dgm-title">{s.title}</span>
              {s.text ? (
                <span className="dgm-text">
                  <Inline text={s.text} />
                </span>
              ) : null}
            </span>
          </div>
        </li>
      ))}
    </ol>
  );
}

function Decision({ spec }: { spec: Extract<DiagramSpec, { kind: "decision" }> }) {
  return (
    <div className="decision">
      <div className="dgm-box dgm-box-ink decision-question">
        <span className="dgm-title">{spec.question}</span>
      </div>
      <ul className="decision-branches">
        {spec.branches.map((b, i) => (
          <li key={b.when} className="decision-branch fx-step" style={step(i)}>
            <div className="decision-when">
              <span className="dgm-label">If</span>
              <span className="dgm-title">{b.when}</span>
            </div>
            <span className="decision-arrow" aria-hidden="true">
              <Arrow />
            </span>
            <div className="dgm-box dgm-box-accent decision-then">
              <span className="dgm-label">Choose</span>
              <span className="dgm-title">{b.choose}</span>
              {b.text ? (
                <span className="dgm-text">
                  <Inline text={b.text} />
                </span>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SpecDiagram({
  spec,
  titleId,
  title,
}: {
  spec: DiagramSpec;
  titleId: string;
  title: string;
}) {
  return (
    <DiagramRoot
      titleId={titleId}
      title={title}
      description={describeSpec(spec)}
      className={`spec spec-${spec.kind}`}
    >
      {spec.kind === "flow" ? <Flow spec={spec} /> : null}
      {spec.kind === "layers" ? <Layers spec={spec} /> : null}
      {spec.kind === "before-after" ? <BeforeAfter spec={spec} /> : null}
      {spec.kind === "hub" ? <Hub spec={spec} /> : null}
      {spec.kind === "funnel" ? <Funnel spec={spec} /> : null}
      {spec.kind === "decision" ? <Decision spec={spec} /> : null}
    </DiagramRoot>
  );
}
