import Link from "next/link";
import { AdminShell, when } from "@/components/admin/AdminShell";
import { aiConfigured } from "@/lib/assistant/engine";
import { businessEmail } from "@/lib/contact/deliver";
import { requireAdmin } from "@/lib/server/admin-session";
import { limits, todayUsage } from "@/lib/server/ai-budget";
import { Repo } from "@/lib/server/records";
import { getStore } from "@/lib/server/store";
import { PushToggle } from "@/components/admin/PushToggle";
import { vapidKeys } from "@/lib/server/push";
import { totpRequired } from "@/lib/server/totp";

export const dynamic = "force-dynamic";

function configState() {
  const env = process.env;
  const delivery = (env.CONTACT_DELIVERY ?? "none").toLowerCase();
  return [
    {
      label: "Business email",
      state:
        delivery === "resend" && businessEmail() && env.CONTACT_FROM_EMAIL
          ? "Connected"
          : delivery === "webhook" && env.CONTACT_WEBHOOK_URL
            ? "Connected (webhook)"
            : "Ready for configuration",
    },
    {
      label: "AI assistant",
      state: aiConfigured()
        ? `DECHY AI (${env.AI_MODEL || "default model"})`
        : "Automated assistant (no AI key set)",
    },
    {
      label: "Notifications",
      state:
        (env.NOTIFICATION_PROVIDER ?? "none") === "telegram" &&
        env.TELEGRAM_BOT_TOKEN &&
        env.TELEGRAM_CHAT_ID
          ? "Telegram alerts"
          : (env.NOTIFICATION_PROVIDER ?? "none") === "webhook" && env.NOTIFICATION_WEBHOOK
            ? "Webhook"
            : "Ready for configuration",
    },
    {
      label: "Inbound email",
      state: env.EMAIL_INGEST_SECRET ? "Endpoint enabled" : "Ready for configuration",
    },
  ];
}

export default async function AdminOverview() {
  const { email } = await requireAdmin();
  const repo = new Repo();
  const o = await repo.overview();
  const stats = [
    {
      label: "New inquiries",
      value: o.newInquiries,
      href: "/admin/inbox/?kind=inquiry&status=new",
    },
    { label: "Unread", value: o.unread, href: "/admin/inbox/" },
    { label: "Open support requests", value: o.openSupport, href: "/admin/inbox/?kind=support" },
    { label: "AI handoffs", value: o.escalations, href: "/admin/inbox/?handoff=1" },
    {
      label: "Person requested, not yet sent",
      value: o.personRequests,
      href: "/admin/conversations/?person=1",
    },
    { label: "AI conversations", value: o.conversations, href: "/admin/conversations/" },
  ];
  const usage = await todayUsage(getStore()).catch(() => null);
  const store = (() => {
    try {
      return getStore();
    } catch {
      return null;
    }
  })();
  const twoStep = await totpRequired(store);
  const push = await vapidKeys(store, process.env, true).catch(() => null);
  const cap = limits();
  return (
    <AdminShell email={email} current="/admin/" title="Overview">
      <ul className="admin-stats">
        {stats.map((s) => (
          <li key={s.label}>
            <Link href={s.href} className="admin-stat">
              <span className="admin-stat-value">{s.value}</span>
              <span className="admin-stat-label">{s.label}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="admin-grid">
        <section aria-labelledby="activity-h" className="admin-card">
          <h2 id="activity-h" className="admin-h2">
            Recent activity
          </h2>
          {o.activity.length === 0 ? (
            <p className="admin-empty">Nothing yet. New inquiries and requests appear here.</p>
          ) : (
            <ul className="admin-activity">
              {o.activity.map((a) => (
                <li key={a.id}>
                  <span className="admin-activity-at">{when(a.at)}</span>
                  {a.ref ? (
                    <Link href={`/admin/inbox/${a.ref}/`}>{a.summary}</Link>
                  ) : (
                    <span>{a.summary}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
        <section aria-labelledby="push-h" className="admin-card">
          <h2 id="push-h" className="admin-h2">
            Phone alerts
          </h2>
          <p className="admin-note">
            Get a notification on this phone or computer for every new lead and every request for a
            person.
          </p>
          {push ? (
            <PushToggle publicKey={push.publicKey} />
          ) : (
            <p className="admin-note">
              Phone alerts need the data store, which is not available here.
            </p>
          )}
          <p className="admin-note">
            Two-step sign-in is {twoStep ? "on" : "off"}.{" "}
            <Link href="/admin/security/">{twoStep ? "Manage" : "Turn it on"}</Link>
          </p>
        </section>
        <section aria-labelledby="export-h" className="admin-card">
          <h2 id="export-h" className="admin-h2">
            Export
          </h2>
          <p className="admin-note">
            Download every lead or the newsletter list as a spreadsheet (CSV). Netlify Forms keeps a
            second copy of each lead with its own export.
          </p>
          <p className="admin-actions">
            <a href="/api/admin/export/?type=leads" className="admin-btn" download>
              Leads (CSV)
            </a>{" "}
            <a href="/api/admin/export/?type=subscribers" className="admin-btn" download>
              Newsletter subscribers (CSV)
            </a>
          </p>
        </section>
        <section aria-labelledby="config-h" className="admin-card">
          <h2 id="config-h" className="admin-h2">
            Connections
          </h2>
          <dl className="admin-config">
            <div>
              <dt>Data store</dt>
              <dd>{repo.storeKind}</dd>
            </div>
            <div>
              <dt>AI use today</dt>
              <dd>
                {usage
                  ? `${usage.calls} of ${cap.calls} replies, ${usage.outputTokens.toLocaleString("en-GB")} of ${cap.outputTokens.toLocaleString("en-GB")} output tokens`
                  : "Not recorded"}
              </dd>
            </div>
            {configState().map((c) => (
              <div key={c.label}>
                <dt>{c.label}</dt>
                <dd>{c.state}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </AdminShell>
  );
}
