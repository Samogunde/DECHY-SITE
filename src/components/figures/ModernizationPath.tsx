import { Arrow } from "@/components/primitives/Arrow";
import { DiagramRoot, step } from "./DiagramRoot";

/**
 * Conceptual diagram: modernizing a legacy system in stages (a "strangler" approach). Original
 * artwork describing method. Four stages in a grid: one column on narrow containers, two on
 * medium, four across on wide, with the same schematic drawn for each stage.
 */
const STAGES = [
  { title: "Assess", body: "Map the system, its data, and risks" },
  { title: "Wrap", body: "Put a new front layer in place" },
  { title: "Replace", body: "Move modules over one at a time" },
  { title: "Retire", body: "Switch off what is no longer used" },
];

function Legacy({
  w,
  y,
  h,
  opacity = 1,
  dashed = false,
}: {
  w: number;
  y: number;
  h: number;
  opacity?: number;
  dashed?: boolean;
}) {
  return (
    <rect
      x="0"
      y={y}
      width={w}
      height={h}
      rx="4"
      className="fill-white stroke-ink"
      strokeWidth="1.5"
      strokeDasharray={dashed ? "5 4" : undefined}
      opacity={opacity}
    />
  );
}

/** A small schematic for each stage, drawn in a 210 wide box at the origin. */
function Schematic({ stage }: { stage: number }) {
  return (
    <g>
      {stage === 0 && (
        <>
          <Legacy w={210} y={0} h={150} />
          {[0, 1, 2].map((r) =>
            [0, 1, 2].map((c) => (
              <rect
                key={`${r}${c}`}
                x={14 + c * 62}
                y={18 + r * 42}
                width="52"
                height="32"
                rx="3"
                className="fill-paper stroke-slate"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
            )),
          )}
        </>
      )}
      {stage === 1 && (
        <>
          <rect x="0" y="0" width="210" height="34" rx="4" className="fill-blue" />
          <text
            x="105"
            y="22"
            textAnchor="middle"
            fontSize="14"
            fontWeight="700"
            className="fig-text fill-white"
          >
            New front layer
          </text>
          <Legacy w={210} y={50} h={100} />
          <text
            x="105"
            y="106"
            textAnchor="middle"
            fontSize="15"
            fontWeight="700"
            className="fig-text fill-ink"
          >
            Legacy system
          </text>
        </>
      )}
      {stage === 2 && (
        <>
          <rect x="0" y="0" width="210" height="34" rx="4" className="fill-blue" />
          <text
            x="105"
            y="22"
            textAnchor="middle"
            fontSize="14"
            fontWeight="700"
            className="fig-text fill-white"
          >
            New front layer
          </text>
          <Legacy w={100} y={50} h={100} />
          <text
            x="50"
            y="106"
            textAnchor="middle"
            fontSize="14"
            fontWeight="700"
            className="fig-text fill-ink"
          >
            Legacy
          </text>
          {[0, 1].map((r) =>
            [0, 1].map((c) => (
              <rect
                key={`${r}${c}`}
                x={112 + c * 52}
                y={50 + r * 52}
                width="46"
                height="46"
                rx="3"
                className="fill-white stroke-blue"
                strokeWidth="1.8"
              />
            )),
          )}
        </>
      )}
      {stage === 3 && (
        <>
          <rect x="0" y="0" width="210" height="34" rx="4" className="fill-blue" />
          <text
            x="105"
            y="22"
            textAnchor="middle"
            fontSize="14"
            fontWeight="700"
            className="fig-text fill-white"
          >
            New front layer
          </text>
          <Legacy w={60} y={50} h={100} opacity={0.55} dashed />
          {[0, 1].map((r) =>
            [0, 1, 2].map((c) => (
              <rect
                key={`${r}${c}`}
                x={72 + c * 46}
                y={50 + r * 52}
                width="40"
                height="46"
                rx="3"
                className="fill-white stroke-blue"
                strokeWidth="1.8"
              />
            )),
          )}
          <text
            x="30"
            y="106"
            textAnchor="middle"
            fontSize="14"
            className="fig-body fill-slate-text"
          >
            retired
          </text>
        </>
      )}
    </g>
  );
}

export function ModernizationPath({ titleId }: { titleId: string }) {
  return (
    <DiagramRoot
      titleId={titleId}
      title="Modernizing legacy software in four stages"
      description="Four stages of modernizing a legacy system without stopping the business. Assess: map the system, its data and its risks. Wrap: put a new front layer in place. Replace: move modules over one at a time while the legacy system shrinks. Retire: switch off what is no longer used."
      className="modern"
    >
      <ol className="modern-steps">
        {STAGES.map((s, i) => (
          <li key={s.title} className="modern-step fx-step" style={step(i)}>
            <div className="modern-head">
              <span className="dgm-badge dgm-badge-ink" aria-hidden="true">
                {i + 1}
              </span>
              <span className="dgm-title">{s.title}</span>
            </div>
            <div className="modern-art">
              <svg viewBox="0 0 210 150" aria-hidden="true" focusable="false">
                <Schematic stage={i} />
              </svg>
              {i < STAGES.length - 1 ? (
                <span className="modern-arrow" aria-hidden="true">
                  <Arrow />
                </span>
              ) : null}
            </div>
            <p className="dgm-text">{s.body}</p>
          </li>
        ))}
      </ol>
    </DiagramRoot>
  );
}
