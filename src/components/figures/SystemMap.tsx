import { DiagramRoot, step } from "./DiagramRoot";

/**
 * Conceptual diagram: software, AI and data, automation, and cloud as layers of one system, joined
 * by an integration bus. Original artwork; labeled conceptual by its caption. A grid of real text:
 * each layer, its connector, and its bus junction share one row, so they stay aligned at any width.
 */
const LAYERS = [
  { title: "Experiences", body: "Websites, apps, portals, dashboards", dark: false },
  { title: "Software", body: "Applications, APIs, business logic", dark: false },
  { title: "AI and data", body: "Assistants, agents, analytics, search", dark: false },
  { title: "Automation", body: "Workflows, approvals, notifications", dark: false },
  { title: "Cloud and security", body: "Infrastructure, pipelines, identity", dark: true },
];

export function SystemMap({ titleId }: { titleId: string }) {
  return (
    <DiagramRoot
      titleId={titleId}
      title="One system, five connected layers"
      description="A layered diagram. From top to bottom: experiences such as websites and portals; software such as applications and APIs; AI and data; automation and workflows; and cloud infrastructure and security. A vertical integration bus on the right connects every layer."
      className="sysmap"
    >
      <div className="sysmap-body">
        <ol className="sysmap-rows">
          {LAYERS.map((l, i) => (
            <li key={l.title}>
              <div
                className={`dgm-box hero-layer ${l.dark ? "dgm-box-ink" : ""}`.trim()}
                style={step(i)}
              >
                <span className="dgm-title">{l.title}</span>
                <span className="dgm-text">{l.body}</span>
              </div>
              <span className="sysmap-link" aria-hidden="true" />
              <span className="sysmap-bus" aria-hidden="true" />
            </li>
          ))}
        </ol>
        <div className="sysmap-overlay" aria-hidden="true">
          <span className="sysmap-label">INTEGRATION</span>
          <span className="bus-packet" />
        </div>
      </div>
      <p className="dgm-note">Security and monitoring run through every layer.</p>
    </DiagramRoot>
  );
}
