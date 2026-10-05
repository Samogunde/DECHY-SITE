/**
 * Conceptual diagram, drawn for a dark surface: the engineering assurance model. A test pyramid
 * (many fast checks at the base, few broad ones at the top) beside the release gates a change
 * passes. Original artwork describing method, not a claim about any client system.
 */
import type { CSSProperties } from "react";

const step = (i: number) => ({ "--i": i }) as CSSProperties;

const GATES = [
  "Type checks and linting",
  "Automated tests",
  "Security and dependency scans",
  "Accessibility and performance budgets",
  "Review in a preview environment",
  "Release, then monitoring",
];

export function QualityLayers({ titleId }: { titleId: string }) {
  const desc = (
    <desc id={`${titleId}-d`}>
      Left: a test pyramid with many fast unit tests at the base, integration tests in the middle,
      and a few end to end tests at the top. Right: the six gates a change passes before release:
      type checks and linting, automated tests, security and dependency scans, accessibility and
      performance budgets, review in a preview environment, then release and monitoring.
    </desc>
  );
  const pyramid = (
    <g>
      <g className="fx-step" style={step(2)}>
        <path
          d="M170 8 L230 108 L110 108 Z"
          className="fill-blue stroke-blue"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <text
          x="170"
          y="92"
          textAnchor="middle"
          fontSize="14"
          fontWeight="700"
          className="fig-text fill-white"
        >
          End to end
        </text>
      </g>
      <g className="fx-step" style={step(1)}>
        <path
          d="M104 118 L236 118 L296 218 L44 218 Z"
          className="fill-ink-raised stroke-blue-on-dark"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <text
          x="170"
          y="176"
          textAnchor="middle"
          fontSize="16"
          fontWeight="700"
          className="fig-text fill-paper"
        >
          Integration
        </text>
      </g>
      <g className="fx-step" style={step(0)}>
        <path
          d="M38 228 L302 228 L356 328 L-16 328 Z"
          className="fill-ink-raised stroke-ink-line"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <text
          x="170"
          y="286"
          textAnchor="middle"
          fontSize="17"
          fontWeight="700"
          className="fig-text fill-paper"
        >
          Unit tests
        </text>
        <text
          x="170"
          y="308"
          textAnchor="middle"
          fontSize="14"
          className="fig-body fill-slate-on-dark"
        >
          Many, fast, run on every change
        </text>
      </g>
    </g>
  );
  return (
    <>
      <svg
        viewBox="0 0 880 340"
        role="img"
        aria-labelledby={`${titleId}-t ${titleId}-d`}
        className="hidden h-auto w-full min-[48rem]:block"
      >
        <title id={`${titleId}-t`}>Engineering assurance: test pyramid and release gates</title>
        {desc}
        <g transform="translate(36 4)">{pyramid}</g>
        <text
          x="460"
          y="22"
          fontSize="14"
          fontWeight="700"
          letterSpacing="1.4"
          className="fig-text fill-slate-on-dark"
        >
          RELEASE GATES
        </text>
        {GATES.map((g, i) => {
          const y = 62 + i * 50;
          return (
            <g key={g} className="fx-step" style={step(i + 3)}>
              {i < GATES.length - 1 ? (
                <line
                  x1="476"
                  y1={y + 12}
                  x2="476"
                  y2={y + 50 - 12}
                  className="stroke-ink-line"
                  strokeWidth="2"
                />
              ) : null}
              <circle
                cx="476"
                cy={y}
                r="12"
                className="fill-ink stroke-blue-on-dark"
                strokeWidth="1.8"
              />
              <path
                d={`M470 ${y} l4 4 l8 -8`}
                className="fill-none stroke-blue-on-dark"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <text
                x="506"
                y={y + 6}
                fontSize="17"
                fontWeight="600"
                className="fig-text fill-paper"
              >
                {g}
              </text>
            </g>
          );
        })}
      </svg>
      <svg
        viewBox="0 0 360 620"
        role="img"
        aria-labelledby={`${titleId}-t2 ${titleId}-d2`}
        className="block h-auto w-full min-[48rem]:hidden"
      >
        <title id={`${titleId}-t2`}>Engineering assurance: test pyramid and release gates</title>
        <desc id={`${titleId}-d2`}>
          A test pyramid with many unit tests at the base and few end to end tests at the top,
          followed by six release gates from type checks to monitoring.
        </desc>
        <g transform="translate(8 4) scale(0.94)">{pyramid}</g>
        <text
          x="4"
          y="362"
          fontSize="14"
          fontWeight="700"
          letterSpacing="1.4"
          className="fig-text fill-slate-on-dark"
        >
          RELEASE GATES
        </text>
        {GATES.map((g, i) => {
          const y = 396 + i * 40;
          return (
            <g key={g} className="fx-step" style={step(i + 3)}>
              {i < GATES.length - 1 ? (
                <line
                  x1="16"
                  y1={y + 11}
                  x2="16"
                  y2={y + 40 - 11}
                  className="stroke-ink-line"
                  strokeWidth="2"
                />
              ) : null}
              <circle
                cx="16"
                cy={y}
                r="11"
                className="fill-ink stroke-blue-on-dark"
                strokeWidth="1.8"
              />
              <path
                d={`M11 ${y} l3.5 3.5 l7 -7`}
                className="fill-none stroke-blue-on-dark"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <text
                x="38"
                y={y + 5.5}
                fontSize="15.5"
                fontWeight="600"
                className="fig-text fill-paper"
              >
                {g}
              </text>
            </g>
          );
        })}
      </svg>
    </>
  );
}
