import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell, CHANNEL_LABEL, StatusBadge, when } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/server/admin-session";
import { Repo, STATUSES } from "@/lib/server/records";

export const dynamic = "force-dynamic";

export default async function AdminRecord({ params }: { params: Promise<{ ref: string }> }) {
  const { email } = await requireAdmin();
  const { ref } = await params;
  const repo = new Repo();
  let record = await repo.getByRef(ref);
  if (!record) notFound();
  // Opening a record marks it read (a harmless state change, never destructive).
  if (!record.read) record = (await repo.updateRecord(ref, { read: true }, "admin")) ?? record;
  const conv =
    record.kind === "support" && record.conversationId
      ? await repo.getConversation(record.conversationId)
      : null;

  const rows: [string, string][] =
    record.kind === "inquiry"
      ? [
          ["Name", record.name],
          ["Email", record.email],
          ["Organization", record.organization],
          ["Help with", record.service],
          ["Timeline", record.timeline],
          ["Estimated budget", record.budget],
          ["Subject", record.subject],
        ]
      : [
          ["Name", record.name],
          ["Email", record.email],
          ["Organization", record.organization],
          [
            "Origin",
            record.origin === "assistant-escalation" ? "Assistant handoff" : "Asked for a person",
          ],
          ["Reason", record.escalationReason],
          ["Detected need", record.detectedNeed],
          ["Recommended service", record.recommendedService],
          ["Recommended solution", record.recommendedSolution],
          [
            "Time-sensitive",
            record.urgency === "stated" ? "Yes, stated by the visitor" : "Not stated",
          ],
          ["Handled by", record.handledBy],
        ];

  return (
    <AdminShell email={email} current="/admin/inbox/" title={record.ref}>
      <p className="admin-meta-line">
        <span className="admin-chip">{CHANNEL_LABEL[record.channel]}</span>
        <StatusBadge status={record.status} />
        <span>Received {when(record.createdAt)}</span>
        <span>Updated {when(record.updatedAt)}</span>
      </p>
      <div className="admin-grid">
        <section className="admin-card" aria-labelledby="details-h">
          <h2 id="details-h" className="admin-h2">
            Details
          </h2>
          <dl className="admin-config">
            {rows
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{k === "Email" ? <a href={`mailto:${v}`}>{v}</a> : v}</dd>
                </div>
              ))}
            {record.contactId ? (
              <div>
                <dt>Contact</dt>
                <dd>
                  <Link href={`/admin/contacts/#c-${record.contactId}`}>View contact</Link>
                </dd>
              </div>
            ) : null}
          </dl>
        </section>
        <section className="admin-card" aria-labelledby="status-h">
          <h2 id="status-h" className="admin-h2">
            Status
          </h2>
          <form
            method="post"
            action={`/api/admin/records/${record.ref}/`}
            className="admin-status-form"
          >
            <div className="field">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" defaultValue={record.status}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            {record.kind === "support" ? (
              <div className="field">
                <label htmlFor="handledBy">Handled by</label>
                <input
                  id="handledBy"
                  name="handledBy"
                  defaultValue={record.handledBy}
                  maxLength={120}
                />
              </div>
            ) : null}
            <div className="admin-actions">
              <button type="submit" className="admin-btn">
                Save
              </button>
              <button type="submit" name="read" value="false" className="admin-btn admin-btn-quiet">
                Mark unread
              </button>
            </div>
          </form>
        </section>
      </div>
      {record.kind === "support" && record.summary ? (
        <section className="admin-card" aria-labelledby="summary-h">
          <h2 id="summary-h" className="admin-h2">
            Summary for the team
          </h2>
          <p className="admin-text">{record.summary}</p>
        </section>
      ) : null}
      {record.message ? (
        <section className="admin-card" aria-labelledby="message-h">
          <h2 id="message-h" className="admin-h2">
            {record.kind === "inquiry" ? "Message" : "Note from the visitor"}
          </h2>
          <p className="admin-text">{record.message}</p>
        </section>
      ) : null}
      {conv ? (
        <section className="admin-card" aria-labelledby="conv-h">
          <h2 id="conv-h" className="admin-h2">
            Conversation
          </h2>
          <ol className="admin-transcript">
            {conv.messages.map((m, i) => (
              <li key={i} data-role={m.role}>
                <span className="admin-transcript-who">
                  {m.role === "visitor" ? "Visitor" : "Assistant"}
                </span>
                <p className="admin-text">{m.text}</p>
              </li>
            ))}
          </ol>
        </section>
      ) : null}
      <section className="admin-card" aria-labelledby="delete-h">
        <h2 id="delete-h" className="admin-h2">
          Delete
        </h2>
        <form
          method="post"
          action={`/api/admin/records/${record.ref}/`}
          className="admin-status-form"
        >
          <input type="hidden" name="action" value="delete" />
          <label className="assist-check">
            <input type="checkbox" name="confirm" value="yes" required />
            <span>
              Permanently delete this record and its conversation (for example, on request)
            </span>
          </label>
          <div>
            <button type="submit" className="admin-btn admin-btn-quiet">
              Delete permanently
            </button>
          </div>
        </form>
      </section>
      {record.email ? (
        <p>
          <a
            className="admin-btn"
            href={`mailto:${record.email}?subject=${encodeURIComponent(`Re: ${record.ref}`)}`}
          >
            Reply by email
          </a>
        </p>
      ) : null}
    </AdminShell>
  );
}
