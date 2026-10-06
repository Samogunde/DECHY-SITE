import { Arrow } from "@/components/primitives/Arrow";
import { DiagramRoot, step } from "./DiagramRoot";

/**
 * Conceptual diagram, drawn for a dark surface: how a web form, CRM, workflow, AI step,
 * follow-up, and analytics can be connected through shared APIs. Original artwork, always shown
 * under a caption that calls it illustrative; it does not claim this system was delivered.
 *
 * One component, three layouts chosen by the diagram's own width: a vertical flow, three steps
 * per row, and six across with a drop from each step to the shared foundation.
 */
const STEPS = [
  { title: "Web form", body: "Captures an inquiry" },
  { title: "CRM record", body: "Stores the contact" },
  { title: "Workflow", body: "Routes and enriches" },
  { title: "AI step", body: "Scores fit; people review" },
  { title: "Follow-up", body: "Email, calendar, alerts" },
  { title: "Analytics", body: "Dashboards and reporting" },
];

export function ConnectedFlow({ titleId }: { titleId: string }) {
  return (
    <DiagramRoot
      titleId={titleId}
      title="Illustrative connected system"
      description="An illustrative flow in six steps: a web form captures an inquiry; a CRM record stores the contact; a workflow routes and enriches it; an AI step scores fit with people reviewing results; follow-up goes out by email, calendar and alerts; analytics dashboards report on the whole process. Shared APIs, data and authentication connect every step, and monitoring, retries and audit logs sit underneath."
      className="flow"
    >
      <ol className="flow-steps">
        {STEPS.map((s, i) => (
          <li key={s.title} className="flow-step fx-step" style={step(i)}>
            <div className="dgm-box">
              <span className="dgm-badge flow-num fx-halo" style={step(i)} aria-hidden="true">
                {i + 1}
              </span>
              <span className="flow-text">
                <span className="dgm-title">{s.title}</span>
                <span className="dgm-text">{s.body}</span>
              </span>
            </div>
            {i < STEPS.length - 1 ? (
              <span className="flow-arrow" aria-hidden="true">
                <Arrow />
              </span>
            ) : null}
          </li>
        ))}
      </ol>
      <div className="dgm-box dgm-box-open flow-shared">
        <span className="dgm-title">Shared APIs, data, and authentication</span>
        <span className="dgm-text">
          One set of integrations the whole flow relies on, not six separate connections.
        </span>
      </div>
      <div className="dgm-box flow-monitor">
        <span className="dgm-title">Monitoring</span>
        <span className="dgm-text">
          Retries, error handling, audit logs, and alerts when a step fails.
        </span>
      </div>
    </DiagramRoot>
  );
}
