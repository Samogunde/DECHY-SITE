/**
 * Conceptual diagram, drawn for a dark surface: how a web form, CRM, workflow, AI step,
 * follow-up, and analytics can be connected through shared APIs. Original artwork, always shown
 * under a caption that calls it illustrative; it does not claim this system was delivered.
 * Two compositions: a horizontal flow for wide screens and a vertical flow for narrow ones.
 */
import type { CSSProperties } from "react";

const step = (i: number) => ({ "--i": i }) as CSSProperties;

const STEPS = [
  { n: "1", title: "Web form", body: ["Captures an", "inquiry"] },
  { n: "2", title: "CRM record", body: ["Stores the", "contact"] },
  { n: "3", title: "Workflow", body: ["Routes and", "enriches"] },
  { n: "4", title: "AI step", body: ["Scores fit;", "people review"] },
  { n: "5", title: "Follow-up", body: ["Email, calendar,", "alerts"] },
  { n: "6", title: "Analytics", body: ["Dashboards and", "reporting"] },
];

export function ConnectedFlow({ titleId }: { titleId: string }) {
  const desc = (
    <desc id={`${titleId}-d`}>
      An illustrative flow in six steps: a web form captures an inquiry; a CRM record stores the
      contact; a workflow routes and enriches it; an AI step scores fit with people reviewing
      results; follow-up goes out by email, calendar and alerts; analytics dashboards report on the
      whole process. Shared APIs, data and authentication connect every step, and monitoring,
      retries and audit logs sit underneath.
    </desc>
  );
  return (
    <>
      {/* Wide composition */}
      <svg
        viewBox="0 0 964 350"
        role="img"
        aria-labelledby={`${titleId}-t ${titleId}-d`}
        className="hidden h-auto w-full min-[48rem]:block"
      >
        <title id={`${titleId}-t`}>Illustrative connected system</title>
        {desc}
        {STEPS.map((s, i) => {
          const x = i * 166;
          return (
            <g key={s.n} className="fx-step" style={step(i)}>
              <rect
                x={x + 1}
                y="31"
                width="130"
                height="118"
                rx="4"
                className="fill-ink-raised stroke-ink-line"
                strokeWidth="1.5"
              />
              <circle cx={x + 26} cy="56" r="13" className="fill-blue" />
              <circle
                cx={x + 26}
                cy="56"
                r="13"
                className="fx-halo fill-none stroke-blue-on-dark"
                strokeWidth="2"
                style={step(i)}
              />
              <text
                x={x + 26}
                y="61.5"
                textAnchor="middle"
                fontSize="15"
                fontWeight="700"
                className="fig-text fill-white"
              >
                {s.n}
              </text>
              <text
                x={x + 16}
                y="94"
                fontSize="17"
                fontWeight="700"
                className="fig-text fill-paper"
              >
                {s.title}
              </text>
              {s.body.map((line, k) => (
                <text
                  key={line}
                  x={x + 16}
                  y={115 + k * 18}
                  fontSize="14.5"
                  className="fig-body fill-slate-on-dark"
                >
                  {line}
                </text>
              ))}
              {i < STEPS.length - 1 ? (
                <path
                  d={`M${x + 135} 90 h26 m-6 -6 l6 6 l-6 6`}
                  className="fill-none stroke-blue-on-dark"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : null}
              <line
                x1={x + 66}
                y1="149"
                x2={x + 66}
                y2="208"
                className="stroke-ink-line"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
            </g>
          );
        })}
        <rect
          x="1"
          y="209"
          width="962"
          height="62"
          rx="4"
          className="fill-none stroke-blue-on-dark"
          strokeWidth="1.8"
        />
        <text x="22" y="236" fontSize="17" fontWeight="700" className="fig-text fill-paper">
          Shared APIs, data, and authentication
        </text>
        <text x="22" y="258" fontSize="14.5" className="fig-body fill-slate-on-dark">
          One set of integrations the whole flow relies on, not six separate connections.
        </text>
        <rect
          x="1"
          y="293"
          width="962"
          height="48"
          rx="4"
          className="fill-ink-raised stroke-ink-line"
          strokeWidth="1.5"
        />
        <text x="22" y="322" fontSize="15.5" className="fig-body fill-slate-on-dark">
          <tspan fontWeight="700" className="fig-text fill-paper">
            Monitoring
          </tspan>
          {"  Retries, error handling, audit logs, and alerts when a step fails."}
        </text>
      </svg>

      {/* Narrow composition */}
      <svg
        viewBox="0 0 360 748"
        role="img"
        aria-labelledby={`${titleId}-t2 ${titleId}-d2`}
        className="block h-auto w-full min-[48rem]:hidden"
      >
        <title id={`${titleId}-t2`}>Illustrative connected system</title>
        <desc id={`${titleId}-d2`}>
          An illustrative flow in six steps from web form to CRM record, workflow, AI step,
          follow-up, and analytics, with shared APIs and monitoring underneath.
        </desc>
        {STEPS.map((s, i) => {
          const y = i * 92;
          return (
            <g key={s.n} className="fx-step" style={step(i)}>
              {i < STEPS.length - 1 ? (
                <line
                  x1="30"
                  y1={y + 70}
                  x2="30"
                  y2={y + 92}
                  className="stroke-blue-on-dark"
                  strokeWidth="1.8"
                />
              ) : null}
              <rect
                x="1"
                y={y + 1}
                width="358"
                height="72"
                rx="4"
                className="fill-ink-raised stroke-ink-line"
                strokeWidth="1.5"
              />
              <circle cx="30" cy={y + 37} r="14" className="fill-blue" />
              <circle
                cx="30"
                cy={y + 37}
                r="14"
                className="fx-halo fill-none stroke-blue-on-dark"
                strokeWidth="2"
                style={step(i)}
              />
              <text
                x="30"
                y={y + 42.5}
                textAnchor="middle"
                fontSize="15"
                fontWeight="700"
                className="fig-text fill-white"
              >
                {s.n}
              </text>
              <text
                x="58"
                y={y + 33}
                fontSize="17"
                fontWeight="700"
                className="fig-text fill-paper"
              >
                {s.title}
              </text>
              <text x="58" y={y + 56} fontSize="14.5" className="fig-body fill-slate-on-dark">
                {s.body.join(" ")}
              </text>
            </g>
          );
        })}
        <rect
          x="1"
          y="564"
          width="358"
          height="82"
          rx="4"
          className="fill-none stroke-blue-on-dark"
          strokeWidth="1.8"
        />
        <text x="16" y="594" fontSize="17" fontWeight="700" className="fig-text fill-paper">
          Shared APIs, data, and auth
        </text>
        <text x="16" y="620" fontSize="14.5" className="fig-body fill-slate-on-dark">
          One set of integrations the flow relies on.
        </text>
        <rect
          x="1"
          y="664"
          width="358"
          height="68"
          rx="4"
          className="fill-ink-raised stroke-ink-line"
          strokeWidth="1.5"
        />
        <text x="16" y="693" fontSize="17" fontWeight="700" className="fig-text fill-paper">
          Monitoring
        </text>
        <text x="16" y="716" fontSize="14.5" className="fig-body fill-slate-on-dark">
          Retries, error handling, audit logs, alerts.
        </text>
      </svg>
    </>
  );
}
