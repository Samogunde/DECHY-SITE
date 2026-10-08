import type { CSSProperties, ReactNode } from "react";
import { DiagramRoot, step } from "./DiagramRoot";

/**
 * Conceptual interface mockups. Original DECHY artwork built from real HTML text in grids (never
 * scaled vector text), so type keeps the floors of the type system and the layout answers to the
 * width of its own figure. Every mockup is labeled conceptual by its caption. None contains a
 * client's interface, data, brand, or figures: names are generic placeholders, and charts carry no
 * numbers. See docs/design/layout-and-visual-quality-rules.md and ADR 0003.
 */

function Chrome({ title }: { title: string }) {
  return (
    <div className="mk-chrome" aria-hidden="true">
      <span className="mk-dot" />
      <span className="mk-dot" />
      <span className="mk-dot" />
      <span className="mk-url">{title}</span>
    </div>
  );
}

function Bars({ values, accent = -1 }: { values: number[]; accent?: number }) {
  return (
    <div className="mk-bars" aria-hidden="true">
      {values.map((v, i) => (
        <span
          key={i}
          className={`mk-bar${i === accent ? " mk-bar-accent" : ""}`}
          style={{ height: `${v}%`, "--b": i } as CSSProperties}
        />
      ))}
    </div>
  );
}

function Chip({
  children,
  tone = "line",
}: {
  children: ReactNode;
  tone?: "line" | "blue" | "ink";
}) {
  return <span className={`mk-chip mk-chip-${tone}`}>{children}</span>;
}

type P = { titleId: string };

/** A website builder: page canvas, a tool panel, and the hosting that comes with it. */
export function SiteBuilder({ titleId }: P) {
  return (
    <DiagramRoot
      titleId={titleId}
      title="Conceptual website builder"
      description="A browser window showing a site editor. A page canvas holds a heading, a booking button, an image, and three service blocks: consultations, online booking, and a client area. A tool panel lists pages, design, store, bookings, and apps. A strip below shows that hosting, security, and backups are included."
      className="mk mk-site"
    >
      <div className="mk-window">
        <Chrome title="yourbusiness.example" />
        <div className="mk-site-body">
          <ul className="mk-rail" aria-hidden="true">
            {["Pages", "Design", "Store", "Bookings", "Apps"].map((t, i) => (
              <li key={t} className={i === 0 ? "mk-rail-on" : ""} style={step(i)}>
                {t}
              </li>
            ))}
          </ul>
          <div className="mk-canvas" aria-hidden="true">
            <div className="mk-hero-block">
              <p className="mk-h">Care that fits around your week</p>
              <p className="mk-p">
                Book online, see your appointments, and send documents securely.
              </p>
              <span className="mk-btn">Book a consultation</span>
            </div>
            <div className="mk-img" />
            <div className="mk-cols3">
              {[
                ["Consultations", "In person or online"],
                ["Online booking", "Live availability"],
                ["Client area", "Documents and updates"],
              ].map(([s, t]) => (
                <div key={s} className="mk-tile">
                  <span className="mk-tile-bar" />
                  <p className="mk-t">{s}</p>
                  <p className="mk-p">{t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="mk-strip" aria-hidden="true">
          Hosting, security updates, and backups are included
        </p>
      </div>
    </DiagramRoot>
  );
}

/** An online store front beside the commerce engine that holds the catalog and orders. */
export function StoreUi({ titleId }: P) {
  return (
    <DiagramRoot
      titleId={titleId}
      title="Conceptual online store"
      description="A store front with a header, a grid of product cards with names and prices, and a basket. Beside it, a commerce engine panel lists catalog, pricing, orders, and stock, connected to the store front."
      className="mk mk-store"
    >
      <div className="mk-store-grid">
        <div className="mk-window">
          <Chrome title="shop.example" />
          <div className="mk-store-front" aria-hidden="true">
            <div className="mk-nav">
              <span className="mk-logo">Shop</span>
              <span>New</span>
              <span>Sale</span>
              <span className="mk-grow" />
              <span>Basket</span>
            </div>
            <div className="mk-products">
              {[
                ["Everyday tote", "In stock"],
                ["Desk lamp", "Two colours"],
                ["Ceramic mug set", "Back soon"],
              ].map(([n, s], i) => (
                <div key={i} className="mk-product">
                  <span className={`mk-img mk-img-sm mk-img-v${i}`} />
                  <p className="mk-t">{n}</p>
                  <p className="mk-p">{s}</p>
                  <span className="mk-btn mk-btn-sm">Add to basket</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mk-link" aria-hidden="true" />
        <div className="mk-engine" aria-hidden="true">
          <p className="mk-label">Commerce engine</p>
          <ul>
            {["Catalog", "Pricing and customer groups", "Orders and payments", "Stock"].map(
              (t, i) => (
                <li key={t} style={step(i)}>
                  {t}
                </li>
              ),
            )}
          </ul>
        </div>
      </div>
    </DiagramRoot>
  );
}

/** A management dashboard: tiles, a trend chart, and a table of exceptions. No numbers. */
export function DashboardUi({ titleId }: P) {
  return (
    <DiagramRoot
      titleId={titleId}
      title="Conceptual business dashboard"
      description="A dashboard window with three summary tiles, a bar chart of activity over time, and a short table listing items that need attention with status labels. The chart carries no figures."
      className="mk mk-dash"
    >
      <div className="mk-window">
        <Chrome title="dashboard.example" />
        <div className="mk-dash-body" aria-hidden="true">
          <div className="mk-tiles">
            {[
              ["Open requests", 62],
              ["On time", 84],
              ["Needs attention", 28],
            ].map(([l, w]) => (
              <div key={l as string} className="mk-kpi">
                <p className="mk-label">{l}</p>
                <span className="mk-meter">
                  <span style={{ width: `${w}%` }} />
                </span>
              </div>
            ))}
          </div>
          <div className="mk-panel">
            <p className="mk-label">Activity by week</p>
            <Bars values={[38, 52, 46, 64, 58, 72, 66, 80]} accent={7} />
          </div>
          <div className="mk-panel">
            <p className="mk-label">Needs attention</p>
            <ul className="mk-rows">
              {[
                ["Order waiting for approval", "Review", "blue"],
                ["Delivery behind schedule", "Late", "ink"],
                ["Invoice query", "Open", "line"],
              ].map(([t, s, tone]) => (
                <li key={t as string}>
                  <span>{t}</span>
                  <Chip tone={tone as "line" | "blue" | "ink"}>{s}</Chip>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </DiagramRoot>
  );
}

/** A phone showing an app screen: a list with status labels and a tab bar. */
export function MobileAppUi({ titleId }: P) {
  return (
    <DiagramRoot
      titleId={titleId}
      title="Conceptual mobile app"
      description="A phone showing an app with a title bar, a list of three jobs with status labels, a primary button, and a tab bar with four tabs."
      className="mk mk-phone-wrap"
    >
      <div className="mk-phone" aria-hidden="true">
        <p className="mk-phone-title">Today</p>
        <ul className="mk-rows mk-rows-card">
          {[
            ["Site visit", "Due 10:00", "blue", "North depot"],
            ["Deliver order", "In progress", "ink", "12 items"],
            ["Sign off report", "Waiting", "line", "Two photos added"],
          ].map(([t, s, tone, d]) => (
            <li key={t as string}>
              <span>
                <b>{t}</b>
                <small>{d}</small>
              </span>
              <Chip tone={tone as "line" | "blue" | "ink"}>{s}</Chip>
            </li>
          ))}
        </ul>
        <span className="mk-btn mk-btn-block">Start next job</span>
        <ul className="mk-tabs">
          {["Today", "Jobs", "Map", "Profile"].map((t, i) => (
            <li key={t} className={i === 0 ? "mk-tab-on" : ""}>
              {t}
            </li>
          ))}
        </ul>
      </div>
    </DiagramRoot>
  );
}

/** Generic deals: kinds of work, never client names. */
const CRM_PIPE: [string, [string, string][]][] = [
  [
    "Lead",
    [
      ["Website enquiry", "Today"],
      ["Second location", "From a form"],
      ["Training request", "By phone"],
    ],
  ],
  [
    "Qualified",
    [
      ["Annual support plan", "Call booked"],
      ["Equipment order", "Needs quote"],
    ],
  ],
  [
    "Proposal",
    [
      ["Site rebuild", "Quote sent"],
      ["Renewal", "Awaiting reply"],
    ],
  ],
  ["Won", [["Office move", "Invoice raised"]]],
];

/** A customer system: pipeline columns and the shared record behind them. */
export function CrmUi({ titleId }: P) {
  return (
    <DiagramRoot
      titleId={titleId}
      title="Conceptual customer system"
      description="A customer system window. Four pipeline columns, named lead, qualified, proposal, and won, hold cards for deals such as a website enquiry, a renewal, and an office move. A side panel shows one customer record with contact, orders, support, and billing sections that stay in step with other tools."
      className="mk mk-crm"
    >
      <div className="mk-window">
        <Chrome title="customers.example" />
        <div className="mk-crm-body" aria-hidden="true">
          <div className="mk-pipe">
            {CRM_PIPE.map(([c, cards]) => (
              <div key={c} className="mk-col">
                <p className="mk-label">{c}</p>
                {cards.map(([t, sub]) => (
                  <div key={t} className="mk-card">
                    <p className="mk-t">{t}</p>
                    <p className="mk-p">{sub}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <aside className="mk-record">
            <p className="mk-label">Customer record</p>
            <ul>
              {["Contact details", "Orders", "Support history", "Billing"].map((t, i) => (
                <li key={t} style={step(i)}>
                  {t}
                  <Chip tone="blue">In sync</Chip>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </DiagramRoot>
  );
}

/** A report: filters, a chart with two series, and a table. No numbers. */
export function AnalyticsUi({ titleId }: P) {
  return (
    <DiagramRoot
      titleId={titleId}
      title="Conceptual analytics report"
      description="A report window with filter chips for date range, region, and product, a chart of two bar series by month, and a table of three rows with a trend label on each. The chart carries no figures."
      className="mk mk-analytics"
    >
      <div className="mk-window">
        <Chrome title="reports.example" />
        <div className="mk-an-body" aria-hidden="true">
          <div className="mk-filters">
            <Chip tone="blue">Last 12 months</Chip>
            <Chip>All regions</Chip>
            <Chip>All products</Chip>
          </div>
          <div className="mk-panel">
            <p className="mk-label">Sales and returns by month</p>
            <div className="mk-twin">
              <Bars values={[40, 48, 44, 56, 62, 58, 70, 66, 74, 80, 76, 88]} accent={11} />
              <Bars values={[10, 12, 9, 14, 12, 11, 15, 12, 13, 14, 11, 12]} />
            </div>
          </div>
          <ul className="mk-rows">
            {[
              ["Product group one", "Rising"],
              ["Product group two", "Steady"],
              ["Product group three", "Falling"],
            ].map(([t, s]) => (
              <li key={t}>
                <span>{t}</span>
                <Chip>{s}</Chip>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DiagramRoot>
  );
}

/** A support assistant: a customer question, a sourced answer, and a hand-over to a person. */
export function AssistantUi({ titleId }: P) {
  return (
    <DiagramRoot
      titleId={titleId}
      title="Conceptual support assistant"
      description="A chat window. A customer asks how to return an item. The assistant answers in two short sentences and shows the source it used. A second message offers a hand-over to a person, with a button."
      className="mk mk-chat-wrap"
    >
      <div className="mk-window mk-chat">
        <Chrome title="help.example" />
        <div className="mk-chat-body" aria-hidden="true">
          <p className="mk-msg mk-msg-user">How do I return an item?</p>
          <div className="mk-msg mk-msg-bot">
            <p>
              You can return most items within the return window. Start from your order page and
              choose Return.
            </p>
            <Chip tone="blue">Source: Returns policy</Chip>
          </div>
          <div className="mk-msg mk-msg-bot">
            <p>Would you like to talk to a person about this order?</p>
            <span className="mk-btn mk-btn-sm">Talk to a person</span>
          </div>
        </div>
      </div>
    </DiagramRoot>
  );
}

/** A workflow: a request moving through approval steps with owners and status. */
export function WorkflowUi({ titleId }: P) {
  return (
    <DiagramRoot
      titleId={titleId}
      title="Conceptual workflow board"
      description="A workflow window showing one request moving through four steps, submitted, manager approval, finance check, and complete, with an owner and a status label on each step. A line below says every step is recorded."
      className="mk mk-flow"
    >
      <div className="mk-window">
        <Chrome title="workflow.example" />
        <div className="mk-flow-body" aria-hidden="true">
          <p className="mk-label">Request: new supplier</p>
          <ol className="mk-steps">
            {[
              ["Submitted", "Requester", "Done", "blue"],
              ["Manager approval", "Team lead", "Done", "blue"],
              ["Finance check", "Accounts", "In progress", "ink"],
              ["Complete", "System", "Waiting", "line"],
            ].map(([t, o, s, tone], i) => (
              <li key={t as string} style={step(i)}>
                <b>{t}</b>
                <small>{o}</small>
                <Chip tone={tone as "line" | "blue" | "ink"}>{s}</Chip>
              </li>
            ))}
          </ol>
          <p className="mk-strip">Every step is timed, owned, and recorded</p>
        </div>
      </div>
    </DiagramRoot>
  );
}

/** A composition of three interfaces: a dashboard, a phone screen, and an assistant. */
export function InterfaceSet({ titleId }: P) {
  return (
    <DiagramRoot
      titleId={titleId}
      title="Conceptual set of interfaces"
      description="Three conceptual interfaces side by side: a management dashboard with summary tiles and a bar chart, a phone showing a short list of jobs with status labels, and a support assistant answering a customer question with a source. They stand for the screens that sit on top of connected systems."
      className="mk mk-set"
    >
      <div className="mk-set-grid" aria-hidden="true">
        <div className="mk-window mk-set-dash">
          <Chrome title="dashboard.example" />
          <div className="mk-dash-body">
            <div className="mk-tiles">
              {[
                ["Open requests", 62],
                ["On time", 84],
                ["Needs attention", 28],
              ].map(([l, w]) => (
                <div key={l as string} className="mk-kpi">
                  <p className="mk-label">{l}</p>
                  <span className="mk-meter">
                    <span style={{ width: `${w}%` }} />
                  </span>
                </div>
              ))}
            </div>
            <div className="mk-panel">
              <p className="mk-label">Activity by week</p>
              <Bars values={[38, 52, 46, 64, 58, 72, 66, 80]} accent={7} />
            </div>
            <div className="mk-panel">
              <p className="mk-label">Needs attention</p>
              <ul className="mk-rows">
                {[
                  ["Order waiting for approval", "Review", "blue"],
                  ["Delivery behind schedule", "Late", "ink"],
                ].map(([t, s, tone]) => (
                  <li key={t as string}>
                    <span>{t}</span>
                    <Chip tone={tone as "line" | "blue" | "ink"}>{s}</Chip>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mk-phone mk-set-phone">
          <p className="mk-phone-title">Today</p>
          <ul className="mk-rows mk-rows-card">
            {[
              ["Site visit", "Due 10:00", "blue", "North depot"],
              ["Deliver order", "In progress", "ink", "12 items"],
            ].map(([t, s, tone, d]) => (
              <li key={t as string}>
                <span>
                  <b>{t}</b>
                  <small>{d}</small>
                </span>
                <Chip tone={tone as "line" | "blue" | "ink"}>{s}</Chip>
              </li>
            ))}
          </ul>
          <ul className="mk-tabs">
            {["Today", "Jobs", "Map", "Profile"].map((t, i) => (
              <li key={t} className={i === 0 ? "mk-tab-on" : ""}>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="mk-window mk-chat mk-set-chat">
          <Chrome title="help.example" />
          <div className="mk-chat-body">
            <p className="mk-msg mk-msg-user">How do I return an item?</p>
            <div className="mk-msg mk-msg-bot">
              <p>Start from your order page and choose Return.</p>
              <Chip tone="blue">Source: Returns policy</Chip>
            </div>
          </div>
        </div>
      </div>
    </DiagramRoot>
  );
}
