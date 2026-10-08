import Link from "next/link";
import {
  AdminShell,
  CHANNEL_LABEL,
  RecordKind,
  StatusBadge,
  when,
} from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/server/admin-session";
import { Repo, STATUSES, type Channel, type Status } from "@/lib/server/records";

export const dynamic = "force-dynamic";

const FILTERS: { label: string; q: string }[] = [
  { label: "All", q: "" },
  { label: "Inquiries", q: "kind=inquiry" },
  { label: "Support requests", q: "kind=support" },
  { label: "AI handoffs", q: "handoff=1" },
  { label: "Contact form", q: "channel=contact-form" },
  { label: "Business email", q: "channel=email" },
];

export default async function AdminInbox({
  searchParams,
}: {
  searchParams: Promise<{ channel?: string; status?: string; kind?: string; handoff?: string }>;
}) {
  const { email } = await requireAdmin();
  const sp = await searchParams;
  const channel = Object.keys(CHANNEL_LABEL).includes(sp.channel ?? "")
    ? (sp.channel as Channel)
    : undefined;
  const status = STATUSES.includes(sp.status as Status) ? (sp.status as Status) : undefined;
  const kind = sp.kind === "inquiry" || sp.kind === "support" ? sp.kind : undefined;
  const handoffOnly = sp.handoff === "1";
  const records = (await new Repo().listInbox({ channel, status, kind })).filter(
    (r) => !handoffOnly || (Boolean(r.handoff) && r.channel === "assistant"),
  );
  const activeQ = handoffOnly
    ? "handoff=1"
    : kind && !channel && !status
      ? `kind=${kind}`
      : channel
        ? `channel=${channel}`
        : "";
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
                    {r.handoff?.summary.need ||
                      (r.kind === "inquiry"
                        ? r.service || r.subject || "Inquiry"
                        : r.recommendedService || "Asked for the team")}
                  </span>
                </span>
                <span className="admin-row-meta">
                  <RecordKind record={r} />
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
