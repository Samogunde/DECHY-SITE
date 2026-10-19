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
  { title: "Web form", body: "A visitor sends an inquiry" },
  { title: "Customer record", body: "Saved in your customer system" },
  { title: "Workflow", body: "Sent to the right person" },
  { title: "AI step", body: "Suggests how good a fit it is; a person decides" },
  { title: "Follow-up", body: "Email, calendar, and alerts go out" },
  { title: "Reporting", body: "Dashboards show what happened" },
];

export function ConnectedFlow({ titleId }: { titleId: string }) {
  return (
    <DiagramRoot
      titleId={titleId}
      title="Illustrative connected system"
      description="An illustrative flow in six steps: a visitor sends an inquiry through a web form; it is saved as a customer record; a workflow sends it to the right person; an AI step suggests how good a fit it is while a person decides; follow-up goes out by email, calendar and alerts; and dashboards report on the whole process. One shared foundation connects every step, and safety checks sit underneath."
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
        <span className="dgm-title">One shared foundation</span>
        <span className="dgm-text">
          Every step uses the same secure connections and the same information, so nothing is typed
          twice.
        </span>
      </div>
      <div className="dgm-box flow-monitor">
        <span className="dgm-title">Safety checks</span>
        <span className="dgm-text">
          Failed steps are retried, a record is kept, and a person is alerted if something goes
          wrong.
        </span>
      </div>
    </DiagramRoot>
  );
}
