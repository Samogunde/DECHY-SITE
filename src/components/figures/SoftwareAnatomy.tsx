import type { CSSProperties } from "react";
import { Arrow } from "@/components/primitives/Arrow";
import { DiagramRoot } from "./DiagramRoot";

/**
 * Conceptual diagram: anatomy of a custom business application. Original artwork. It shows the
 * parts a delivered system typically has; it is not a depiction of any client system.
 *
 * Layout rule: every supporting system sits in the same grid row as the layer it supports, so the
 * relationship is read from the row. A layer with two supporting systems shares its row height
 * between them. On narrow containers the supporting systems drop beneath their layer.
 */
const LAYERS = [
  { title: "People", body: "Customers, staff, partners", dashed: true, support: [] as string[] },
  {
    title: "Interfaces",
    body: "Web app, mobile app, admin",
    support: ["Identity and access"],
  },
  {
    title: "Services and logic",
    body: "Rules, workflows, APIs",
    support: ["Background jobs", "Integrations and events"],
  },
  {
    title: "Data",
    body: "Database, search, files, reports",
    support: ["Logs, metrics, alerts"],
  },
];
const PIPELINE = ["Build", "Test", "Release", "Maintain"];

export function SoftwareAnatomy({ titleId }: { titleId: string }) {
  return (
    <DiagramRoot
      titleId={titleId}
      title="Anatomy of a custom business application"
      description="A layered diagram. People use interfaces (web app, mobile app, admin). Interfaces call services and business logic, which read and write data. Supporting systems sit beside the layer they support: identity and access beside interfaces; background jobs and integrations and events beside services and logic; logs, metrics and alerts beside data. A delivery pipeline along the bottom builds, tests, releases and maintains the whole system."
      className="anatomy"
    >
      <div className="anatomy-heads" aria-hidden="true">
        <p className="dgm-label">Application layers</p>
        <p className="dgm-label">Supporting systems</p>
      </div>
      <ol className="anatomy-stack">
        {LAYERS.map((l) => (
          <li
            key={l.title}
            className={`anatomy-row ${l.support.length > 0 ? "has-support" : ""}`.trim()}
            style={{ "--n": l.support.length } as CSSProperties}
          >
            <div className="anatomy-stage">
              <div className={`dgm-box ${l.dashed ? "dgm-box-dashed" : ""}`.trim()}>
                <span className="dgm-title">{l.title}</span>
                <span className="dgm-text">{l.body}</span>
              </div>
            </div>
            {l.support.length > 0 ? (
              <>
                <span className="anatomy-link" aria-hidden="true" />
                <div className="anatomy-support-wrap">
                  <p className="dgm-label anatomy-support-label" aria-hidden="true">
                    Supported by
                  </p>
                  <ul className="anatomy-support" aria-label={`Supports ${l.title}`}>
                    {l.support.map((s) => (
                      <li key={s}>
                        <div className="dgm-box dgm-box-accent">
                          <span className="dgm-title">{s}</span>
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
      <ol className="anatomy-pipeline" aria-label="Delivery pipeline">
        {PIPELINE.map((p, i) => (
          <li key={p}>
            {p}
            {i < PIPELINE.length - 1 ? <Arrow /> : null}
          </li>
        ))}
      </ol>
    </DiagramRoot>
  );
}
