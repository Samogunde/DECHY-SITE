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
  { title: "Basic code checks", text: "Automatic checks that catch simple mistakes." },
  { title: "Automated tests", text: "Programs that test the software on every change." },
  { title: "Security and update scans", text: "Checks for known weaknesses and outdated parts." },
  { title: "Accessibility and speed limits", text: "Keeps it usable by everyone, and fast." },
  { title: "Try it in a preview copy", text: "People review the change somewhere safe first." },
  { title: "Release, then watch", text: "Go live, then monitor for problems." },
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
      description="Left: a pyramid of tests with many quick tests of small parts at the base, tests of parts working together in the middle, and a few full walk-throughs at the top. Right: the six checks a change passes before release: basic code checks, automated tests, security and update scans, accessibility and speed limits, a try-out in a preview copy, then release and monitoring."
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
          <span className="dgm-title">Full journeys</span>
        </div>
        <div className="pyr-label pyr-label-mid fx-step" style={step(1)}>
          <span className="dgm-title">Parts together</span>
        </div>
        <div className="pyr-label pyr-label-base fx-step" style={step(0)}>
          <span className="dgm-title">Small parts</span>
          <span className="dgm-text">Many quick tests, run on every change</span>
        </div>
      </div>
      <div>
        <p className="dgm-label">Checks before release</p>
        <ol className="gates" style={{ marginTop: "0.5rem" }}>
          {GATES.map((g, i) => (
            <li key={g.title} className="fx-step" style={step(i + 3)}>
              <CheckIcon />
              <span className="gate-body">
                <span className="gate-text">{g.title}</span>
                <span className="dgm-text">{g.text}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </DiagramRoot>
  );
}
