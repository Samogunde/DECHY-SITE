import type { ReactNode } from "react";
import { DiagramRoot, step } from "./DiagramRoot";

/**
 * Conceptual product interfaces, finished to the level of real product design. Original DECHY
 * artwork in HTML and CSS (real text, never scaled vector text). Names are generic ("Your
 * practice"), records are everyday examples, and there are no client brands, logos, figures, or
 * results. Each is labeled conceptual in its accessible description and caption.
 */

function Chrome({ url }: { url: string }) {
  return (
    <div className="mk-chrome" aria-hidden="true">
      <span className="mk-dot" />
      <span className="mk-dot" />
      <span className="mk-dot" />
      <span className="mk-url">{url}</span>
    </div>
  );
}

function Status({ tone, children }: { tone: "new" | "ok" | "wait" | "info"; children: ReactNode }) {
  return <span className={`pu-status pu-status-${tone}`}>{children}</span>;
}

/** A customer portal on a desktop, with the same portal on a phone in front of it. */
export function PortalUi({ titleId }: { titleId: string }) {
  const rows: [string, string, "new" | "ok" | "wait" | "info", string][] = [
    ["Kitchen refit quote", "Approved", "ok", "Today"],
    ["Annual service visit", "Scheduled", "info", "Yesterday"],
    ["Replacement part order", "In progress", "new", "Monday"],
    ["Warranty claim", "Needs reply", "wait", "Last week"],
  ];
  return (
    <DiagramRoot
      titleId={titleId}
      title="Conceptual customer portal on a desktop and a phone"
      description="A conceptual customer portal. On the desktop: a menu with overview, orders, invoices, documents, and support; an orders page with a search box and a new request button; three summary cards; and a list of orders, each with a status such as approved, scheduled, in progress, or needs reply. In front of it, a phone shows the same orders as cards with a tab bar."
      className="mk pu pu-portal"
    >
      <div className="pu-stage" aria-hidden="true">
        <div className="mk-window pu-desk">
          <Chrome url="portal.yourcompany.example" />
          <div className="pu-app">
            <nav className="pu-side">
              <p className="pu-brand">Your company</p>
              {["Overview", "Orders", "Invoices", "Documents", "Support"].map((t, i) => (
                <span key={t} className={`pu-nav${i === 1 ? " pu-nav-on" : ""}`}>
                  <span className="pu-ico" />
                  {t}
                </span>
              ))}
            </nav>
            <div className="pu-main">
              <div className="pu-top">
                <p className="pu-h">Orders</p>
                <span className="pu-search">Search orders</span>
                <span className="pu-cta">New request</span>
              </div>
              <div className="pu-cards">
                {[
                  ["Open", "pu-meter-a"],
                  ["In progress", "pu-meter-b"],
                  ["Completed", "pu-meter-c"],
                ].map(([t, m]) => (
                  <div key={t} className="pu-card">
                    <p className="pu-card-t">{t}</p>
                    <span className={`pu-meter ${m}`} />
                  </div>
                ))}
              </div>
              <div className="pu-table">
                <div className="pu-tr pu-th">
                  <span>Order</span>
                  <span>Status</span>
                  <span>Updated</span>
                </div>
                {rows.map(([name, status, tone, when], i) => (
                  <div key={name} className="pu-tr fx-step" style={step(i)}>
                    <span className="pu-strong">{name}</span>
                    <span>
                      <Status tone={tone}>{status}</Status>
                    </span>
                    <span className="pu-muted">{when}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="pu-phone">
          <span className="pu-notch" />
          <p className="pu-h">Orders</p>
          <span className="pu-cta pu-cta-block">New request</span>
          {rows.slice(0, 3).map(([name, status, tone]) => (
            <div key={name} className="pu-mcard">
              <span className="pu-strong">{name}</span>
              <Status tone={tone}>{status}</Status>
            </div>
          ))}
          <div className="pu-tabs">
            {["Home", "Orders", "Account"].map((t, i) => (
              <span key={t} className={i === 1 ? "pu-tab-on" : ""}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </DiagramRoot>
  );
}

/**
 * A business web platform at work: the public booking page a visitor uses, with the staff view
 * that receives the booking in front of it, and the link to the business's own records.
 */
export function PlatformUi({ titleId }: { titleId: string }) {
  return (
    <DiagramRoot
      titleId={titleId}
      title="Conceptual business web platform: a booking page and the staff view"
      description="A conceptual business website. A visitor books an initial consultation: they choose a day and a time and confirm. In front of the page, the staff view lists new requests: a consultation booked, documents uploaded, and a payment taken, each with a status. A note shows the booking saved to the business's own records."
      className="mk pu pu-platform"
    >
      <div className="pu-stage" aria-hidden="true">
        <div className="mk-window pu-site">
          <Chrome url="yourpractice.example/book" />
          <div className="pu-site-nav">
            <span className="pu-brand">Your practice</span>
            <span>Services</span>
            <span>About</span>
            <span>Contact</span>
            <span className="pu-signin">Sign in</span>
          </div>
          <div className="pu-site-body">
            <div className="pu-site-copy">
              <p className="pu-kicker">Online booking</p>
              <p className="pu-display">Book an appointment in a minute</p>
              <p className="pu-muted">
                Choose a time that suits you. We confirm by email and remind you the day before.
              </p>
            </div>
            <div className="pu-book">
              <p className="pu-strong">Initial consultation</p>
              <p className="pu-muted pu-small">45 minutes, in person or online</p>
              <div className="pu-days">
                {["Mon", "Tue", "Wed", "Thu", "Fri"].map((d, i) => (
                  <span key={d} className={i === 2 ? "pu-on" : ""}>
                    {d}
                  </span>
                ))}
              </div>
              <div className="pu-times">
                {["09:00", "10:30", "13:00", "15:30"].map((t, i) => (
                  <span key={t} className={i === 1 ? "pu-on" : ""}>
                    {t}
                  </span>
                ))}
              </div>
              <span className="pu-cta pu-cta-block">Confirm booking</span>
            </div>
          </div>
        </div>
        <div className="pu-staff fx-step" style={step(2)}>
          <div className="pu-staff-head">
            <span className="pu-strong">New requests</span>
            <span className="pu-muted pu-small">Staff view</span>
          </div>
          {[
            ["Consultation booked", "Wednesday, 10:30", "new", "New"],
            ["Documents uploaded", "Two files", "info", "Received"],
            ["Payment taken", "Deposit", "ok", "Paid"],
          ].map(([t, s, tone, label]) => (
            <div key={t} className="pu-req">
              <span>
                <span className="pu-strong">{t}</span>
                <span className="pu-muted pu-small">{s}</span>
              </span>
              <Status tone={tone as "new" | "ok" | "wait" | "info"}>{label}</Status>
            </div>
          ))}
        </div>
        <p className="pu-sync fx-step" style={step(3)}>
          <span className="pu-sync-ico" />
          Saved to your records
        </p>
      </div>
    </DiagramRoot>
  );
}
