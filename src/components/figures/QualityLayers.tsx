"use client";

import { useState } from "react";
import { DiagramRoot, step } from "./DiagramRoot";

/**
 * Conceptual figure, drawn for a dark surface: how quality is built into every change. Left, the
 * layers of automated tests (many quick tests of small parts, fewer of parts together, a few full
 * journeys). Right, the release pipeline a change passes through. Selecting a stage (click, tap,
 * or keyboard) opens its detail and marks the stages before it as passed; every stage title is
 * always visible, so nothing depends on hover. Original artwork describing method, not a claim
 * about any client system.
 */
const LAYERS = [
  { title: "Full journeys", text: "A few end-to-end runs", w: 46 },
  { title: "Parts together", text: "Services and data, checked as a unit", w: 72 },
  { title: "Small parts", text: "Many quick tests on every change", w: 100 },
];

const GATES = [
  {
    title: "Code checks",
    text: "Automatic checks catch simple mistakes before anyone reviews the change.",
  },
  {
    title: "Automated tests",
    text: "The test layers run on every change, in minutes.",
  },
  {
    title: "Security scans",
    text: "Known weaknesses and outdated parts are flagged before release.",
  },
  {
    title: "Accessibility and speed",
    text: "Limits keep the product usable by everyone, and fast.",
  },
  { title: "Preview copy", text: "People try the change in a safe copy of the real system." },
  {
    title: "Release and monitor",
    text: "It goes live in small steps, with alerts watching for problems.",
  },
];

export function QualityLayers({ titleId }: { titleId: string }) {
  const [active, setActive] = useState(0);
  return (
    <DiagramRoot
      titleId={titleId}
      title="How quality is built into every change"
      description="Left: three layers of automated tests, many quick tests of small parts at the base, tests of parts together in the middle, and a few full journeys at the top. Right: the six stages a change passes before and after release: code checks, automated tests, security scans, accessibility and speed limits, a preview copy, then release and monitoring."
      className="quality"
    >
      <div className="q-layers">
        <p className="dgm-label">Test layers</p>
        <ol className="q-stack">
          {LAYERS.map((l, i) => (
            <li
              key={l.title}
              className={`q-layer fx-step ${i === 0 ? "q-layer-top" : ""}`.trim()}
              style={{ ...step(2 - i), width: `${l.w}%` }}
            >
              <span className="dgm-title">{l.title}</span>
              <span className="dgm-text">{l.text}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="q-pipe">
        <p className="dgm-label">Every change passes</p>
        <ol className="q-gates">
          {GATES.map((g, i) => {
            const state = i < active ? "done" : i === active ? "on" : "next";
            return (
              <li key={g.title} className="q-gate fx-step" data-state={state} style={step(i + 3)}>
                <button
                  type="button"
                  className="q-gate-btn"
                  aria-expanded={i === active}
                  aria-controls={`${titleId}-gate-${i}`}
                  onClick={() => setActive(i)}
                >
                  <span className="q-node" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span className="q-gate-title">{g.title}</span>
                </button>
                <p id={`${titleId}-gate-${i}`} className="q-gate-text" hidden={i !== active}>
                  {g.text}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </DiagramRoot>
  );
}
