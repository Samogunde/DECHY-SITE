import Link from "next/link";
import { AdminShell, CHANNEL_LABEL, StatusBadge, when } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/server/admin-session";
import { Repo, STATUSES, type Channel, type Status } from "@/lib/server/records";

export const dynamic = "force-dynamic";

const FILTERS: { label: string; q: string }[] = [
  { label: "All", q: "" },
  { label: "Contact form", q: "channel=contact-form" },
  { label: "AI handoffs", q: "channel=assistant" },
  { label: "Human support", q: "channel=human-support" },
  { label: "Business email", q: "channel=email" },
];

export default async function AdminInbox({
  searchParams,
}: {
  searchParams: Promise<{ channel?: string; status?: string; kind?: string }>;
}) {
  const { email } = await requireAdmin();
  const sp = await searchParams;
  const channel = Object.keys(CHANNEL_LABEL).includes(sp.channel ?? "")
    ? (sp.channel as Channel)
    : undefined;
  const status = STATUSES.includes(sp.status as Status) ? (sp.status as Status) : undefined;
  const kind = sp.kind === "inquiry" || sp.kind === "support" ? sp.kind : undefined;
  const records = await new Repo().listInbox({ channel, status, kind });
  const activeQ = channel ? `channel=${channel}` : "";
  return (
    <AdminShell email={email} current="/admin/inbox/" title="Inbox">
      <nav aria-label="Filter by channel" className="admin-filters">
        {FILTERS.map((f) => (
          <Link
            key={f.label}
            href={`/admin/inbox/${f.q ? `?${f.q}` : ""}`}
            className="admin-filter"
            aria-current={f.q === activeQ ? "true" : undefined}
          >
            {f.label}
          </Link>
        ))}
      </nav>
      {records.length === 0 ? (
        <p className="admin-empty">No records here yet.</p>
      ) : (
        <ul className="admin-list">
          {records.map((r) => (
            <li key={r.id}>
              <Link
                href={`/admin/inbox/${r.ref}/`}
                className="admin-row"
                data-unread={r.read ? undefined : "true"}
              >
                <span className="admin-row-main">
                  <span className="admin-row-title">
                    {r.name || r.email || "Visitor"}
                    {r.organization ? (
                      <span className="admin-row-org"> · {r.organization}</span>
                    ) : null}
                  </span>
                  <span className="admin-row-sub">
                    {r.kind === "inquiry"
                      ? r.service || r.subject || "Inquiry"
                      : r.recommendedService || "Asked for a person"}
                  </span>
                </span>
                <span className="admin-row-meta">
                  <span className="admin-chip">{CHANNEL_LABEL[r.channel]}</span>
                  <StatusBadge status={r.status} />
                  <span className="admin-row-ref">{r.ref}</span>
                  <span className="admin-row-at">{when(r.createdAt)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AdminShell>
  );
}
