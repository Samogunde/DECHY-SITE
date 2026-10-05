/**
 * Conceptual diagram: software, AI and data, automation, and cloud as layers of one system, joined
 * by an integration bus. Original artwork; labeled conceptual by its caption. Text is real SVG text.
 */
const LAYERS = [
  { title: "Experiences", body: "Websites, apps, portals, dashboards", dark: false },
  { title: "Software", body: "Applications, APIs, business logic", dark: false },
  { title: "AI and data", body: "Assistants, agents, analytics, search", dark: false },
  { title: "Automation", body: "Workflows, approvals, notifications", dark: false },
  { title: "Cloud and security", body: "Infrastructure, pipelines, identity", dark: true },
];

import type { CSSProperties } from "react";

const step = (i: number) => ({ "--i": i }) as CSSProperties;

export function SystemMap({ titleId }: { titleId: string }) {
  const h = 76;
  const gap = 10;
  return (
    <svg
      viewBox="0 0 400 470"
      role="img"
      aria-labelledby={`${titleId}-t ${titleId}-d`}
      className="mx-auto w-full max-w-[30rem]"
    >
      <title id={`${titleId}-t`}>One system, five connected layers</title>
      <desc id={`${titleId}-d`}>
        A layered diagram. From top to bottom: experiences such as websites and portals; software
        such as applications and APIs; AI and data; automation and workflows; and cloud
        infrastructure and security. A vertical integration bus on the right connects every layer.
      </desc>
      {LAYERS.map((l, i) => {
        const y = i * (h + gap);
        const cy = y + h / 2;
        return (
          <g key={l.title} className="hero-layer" style={step(i)}>
            <rect
              x="1"
              y={y + 1}
              width="298"
              height={h - 2}
              rx="4"
              className={l.dark ? "fill-ink stroke-ink" : "fill-white stroke-ink"}
              strokeWidth="1.5"
            />
            <text
              x="20"
              y={y + 32}
              fontSize="18"
              fontWeight="700"
              className={`fig-text ${l.dark ? "fill-paper" : "fill-ink"}`}
            >
              {l.title}
            </text>
            <text
              x="20"
              y={y + 56}
              fontSize="15"
              className={`fig-body ${l.dark ? "fill-slate-on-dark" : "fill-slate-text"}`}
            >
              {l.body}
            </text>
            <line x1="299" y1={cy} x2="343" y2={cy} className="stroke-ink" strokeWidth="1.5" />
            <circle cx="299" cy={cy} r="4" className="fill-ink" />
          </g>
        );
      })}
      <g className="hero-layer" style={step(5)}>
        <rect x="326" y="1" width="62" height="428" rx="4" className="fill-blue" />
      </g>
      {LAYERS.map((l, i) => {
        const cy = i * (h + gap) + h / 2;
        return <circle key={l.title} cx="343" cy={cy} r="5" className="fill-white" />;
      })}
      <circle
        className="bus-packet"
        cx="343"
        cy="38"
        r="7"
        fill="#fff"
        style={{ "--travel": "344px" } as CSSProperties}
      />
      <text
        transform="translate(373 214) rotate(-90)"
        textAnchor="middle"
        fontSize="16"
        fontWeight="700"
        letterSpacing="1.5"
        className="fig-text fill-white"
      >
        INTEGRATION
      </text>
      <text x="0" y="458" fontSize="15" className="fig-body fill-slate-text">
        Security and monitoring run through every layer.
      </text>
    </svg>
  );
}
