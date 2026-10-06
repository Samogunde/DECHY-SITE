import { DiagramRoot, step } from "./DiagramRoot";

/**
 * Conceptual diagram, drawn for a dark surface: the engineering assurance model. A test pyramid
 * (many fast checks at the base, few broad ones at the top) beside the release gates a change
 * passes. Original artwork describing method, not a claim about any client system.
 *
 * The tier shapes are an SVG that stretches with the pyramid's fixed square frame; every word is
 * HTML positioned inside that frame, so type stays at the type system's sizes.
 */
const GATES = [
  "Type checks and linting",
  "Automated tests",
  "Security and dependency scans",
  "Accessibility and performance budgets",
  "Review in a preview environment",
  "Release, then monitoring",
];

function CheckIcon() {
  return (
    <svg className="gate-icon" viewBox="0 0 28 28" aria-hidden="true" focusable="false">
      <circle
        cx="14"
        cy="14"
        r="12.5"
        fill="var(--dgm-fill)"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M8.5 14.5l3.8 3.8 7.2-7.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function QualityLayers({ titleId }: { titleId: string }) {
  return (
    <DiagramRoot
      titleId={titleId}
      title="Engineering assurance: test pyramid and release gates"
      description="Left: a test pyramid with many fast unit tests at the base, integration tests in the middle, and a few end to end tests at the top. Right: the six gates a change passes before release: type checks and linting, automated tests, security and dependency scans, accessibility and performance budgets, review in a preview environment, then release and monitoring."
      className="quality"
    >
      <div className="pyramid">
        <svg viewBox="0 0 300 300" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <polygon
            className="tier tier-base fx-step"
            style={step(0)}
            points="42,210 258,210 300,300 0,300"
          />
          <polygon
            className="tier tier-mid fx-step"
            style={step(1)}
            points="88,105 212,105 250,200 50,200"
          />
          <polygon
            className="tier tier-top fx-step"
            style={step(2)}
            points="115,0 185,0 205,95 95,95"
          />
        </svg>
        <div className="pyr-label pyr-label-top fx-step" style={step(2)}>
          <span className="dgm-title">End to end</span>
        </div>
        <div className="pyr-label pyr-label-mid fx-step" style={step(1)}>
          <span className="dgm-title">Integration</span>
        </div>
        <div className="pyr-label pyr-label-base fx-step" style={step(0)}>
          <span className="dgm-title">Unit tests</span>
          <span className="dgm-text">Many, fast, run on every change</span>
        </div>
      </div>
      <div>
        <p className="dgm-label">Release gates</p>
        <ol className="gates" style={{ marginTop: "0.5rem" }}>
          {GATES.map((g, i) => (
            <li key={g} className="fx-step" style={step(i + 3)}>
              <CheckIcon />
              <span className="gate-text">{g}</span>
            </li>
          ))}
        </ol>
      </div>
    </DiagramRoot>
  );
}
