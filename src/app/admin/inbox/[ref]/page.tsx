import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AdminShell,
  CHANNEL_LABEL,
  RecordKind,
  SOURCE_LABEL,
  StatusBadge,
  when,
} from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/server/admin-session";
import {
  conversationIdOf,
  Repo,
  STATUS_LABEL,
  STATUSES,
  type FieldSource,
} from "@/lib/server/records";

export const dynamic = "force-dynamic";

function Source({ source }: { source?: FieldSource }) {
  if (!source) return null;
  return <span className="admin-src">{SOURCE_LABEL[source]}</span>;
}

export default async function AdminRecord({ params }: { params: Promise<{ ref: string }> }) {
  const { email } = await requireAdmin();
  const { ref } = await params;
  const repo = new Repo();
  let record = await repo.getByRef(ref);
  if (!record) notFound();
  // Opening a record marks it read (a harmless state change, never destructive).
  if (!record.read) record = (await repo.updateRecord(ref, { read: true }, "admin")) ?? record;
  const cid = conversationIdOf(record);
  const conv = cid ? await repo.getConversation(cid) : null;
  const h = record.handoff ?? null;
  const notes = record.notes ?? [];
  const after = conv?.messages.filter((m) => m.afterHandoff && m.role === "visitor") ?? [];
  const src = h?.fieldSources ?? {};

  const contact: [string, string, FieldSource | undefined][] = [
    ["Name", record.name, src.name],
    ["Email", record.email, src.email],
    ["Organization", record.organization, src.organization],
  ];
  const facts: [string, string][] =
    record.kind === "inquiry"
      ? [
          ["Help with", h ? "" : record.service],
          ["Timeline", record.timeline],
          ["Estimated budget", record.budget],
          ["Subject", record.subject],
        ]
      : [];
  if (h)
    facts.push(
      ["Recommended service", h.recommendedService],
      ["Recommended solution", h.recommendedSolution],
      ["Time-sensitive", h.urgency === "stated" ? "Yes, stated by the visitor" : "Not stated"],
      ["Started on", h.startPage],
      ["Asked for the team on", h.handoffPage],
      ["Reason", h.reason],
    );
  else if (record.kind === "support")
    facts.push(
      ["Recommended service", record.recommendedService],
      ["Time-sensitive", record.urgency === "stated" ? "Yes, stated by the visitor" : "Not stated"],
      ["Reason", record.escalationReason],
    );

  return (
    <AdminShell email={email} current="/admin/inbox/" title={record.ref}>
      <p className="admin-meta-line">
        <RecordKind record={record} />
        <span className="admin-chip">{CHANNEL_LABEL[record.channel]}</span>
        <StatusBadge status={record.status} />
        <span>Received {when(record.createdAt)}</span>
        <span>Updated {when(record.updatedAt)}</span>
        {record.assignedTo ? <span>Assigned to {record.assignedTo}</span> : null}
      </p>

      {h ? (
        <section className="admin-card admin-summary" aria-labelledby="summary-h">
          <h2 id="summary-h" className="admin-h2">
            Summary
          </h2>
          <dl className="admin-summary-list">
            <div>
              <dt>Need</dt>
              <dd>{h.summary.need || "Not stated"}</dd>
            </div>
            {h.summary.context ? (
              <div>
                <dt>Context</dt>
                <dd>{h.summary.context}</dd>
              </div>
            ) : null}
            {h.summary.suggested ? (
              <div>
                <dt>Suggested to the visitor</dt>
                <dd>{h.summary.suggested}</dd>
              </div>
            ) : null}
            {h.summary.openQuestions.length ? (
              <div>
                <dt>Open questions</dt>
                <dd>
                  <ul className="admin-bullets">
                    {h.summary.openQuestions.map((q) => (
                      <li key={q}>{q}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            ) : null}
          </dl>
          {after.length ? (
            <p className="admin-after-flag">
              The visitor added {after.length} {after.length === 1 ? "message" : "messages"} after
              the handoff. See the end of the transcript.
            </p>
          ) : null}
        </section>
      ) : null}

      <div className="admin-grid">
        <section className="admin-card" aria-labelledby="details-h">
          <h2 id="details-h" className="admin-h2">
            Details
          </h2>
          <dl className="admin-config">
            {contact
              .filter(([, v]) => v)
              .map(([k, v, s]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>
                    {k === "Email" ? <a href={`mailto:${v}`}>{v}</a> : v} <Source source={s} />
                  </dd>
                </div>
              ))}
            {facts
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>
                    {k === "Started on" || k === "Asked for the team on" ? <code>{v}</code> : v}
                  </dd>
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
            {conv ? (
              <div>
                <dt>Conversation</dt>
                <dd>
                  <Link href={`/admin/conversations/${conv.id}/`}>Open conversation</Link>
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
                    {STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="assignedTo">Assigned to</label>
              <input
                id="assignedTo"
                name="assignedTo"
                defaultValue={record.assignedTo ?? ""}
                maxLength={120}
              />
            </div>
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

      {h?.keyMessages.length ? (
        <section className="admin-card" aria-labelledby="key-h">
          <h2 id="key-h" className="admin-h2">
            In the visitor&apos;s words
          </h2>
          <ul className="admin-quotes">
            {h.keyMessages.map((m) => (
              <li key={m}>
                <blockquote className="admin-text">{m}</blockquote>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {record.message ? (
        <section className="admin-card" aria-labelledby="message-h">
          <h2 id="message-h" className="admin-h2">
            {h ? "Note from the visitor" : "Message"}
          </h2>
          <p className="admin-text">{record.message}</p>
        </section>
      ) : null}

      {conv ? (
        <section className="admin-card" aria-labelledby="conv-h">
          <details className="admin-disclosure">
            <summary>
              <h2 id="conv-h" className="admin-h2">
                Full transcript
              </h2>
              <span className="admin-note-inline">
                {conv.messages.length} messages,{" "}
                {conv.mode === "ai" ? "DECHY AI" : "automated assistant"}
              </span>
            </summary>
            <ol className="admin-transcript">
              {conv.messages.map((m, i) => (
                <li key={i} data-role={m.kind === "handoff" ? "system" : m.role}>
                  <span className="admin-transcript-who">
                    {m.kind === "handoff"
                      ? "Handoff"
                      : m.role === "visitor"
                        ? "Visitor"
                        : "Assistant"}
                    {" · "}
                    {when(m.at)}
                    {m.page ? (
                      <>
                        {" "}
                        · <code>{m.page}</code>
                      </>
                    ) : null}
                    {m.afterHandoff ? <span className="admin-after"> After handoff</span> : null}
                  </span>
                  <p className="admin-text">{m.text}</p>
                </li>
              ))}
            </ol>
          </details>
        </section>
      ) : null}

      <section className="admin-card" aria-labelledby="notes-h">
        <h2 id="notes-h" className="admin-h2">
          Internal notes
        </h2>
        {notes.length ? (
          <ol className="admin-notes">
            {notes.map((n, i) => (
              <li key={i}>
                <span className="admin-transcript-who">
                  {n.by} · {when(n.at)}
                </span>
                <p className="admin-text">{n.text}</p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="admin-empty">No notes yet. Notes are never shown to the visitor.</p>
        )}
        <form
          method="post"
          action={`/api/admin/records/${record.ref}/`}
          className="admin-status-form"
        >
          <input type="hidden" name="action" value="note" />
          <div className="field">
            <label htmlFor="note">Add a note</label>
            <textarea id="note" name="note" rows={3} maxLength={4000} required />
          </div>
          <div>
            <button type="submit" className="admin-btn admin-btn-quiet">
              Add note
            </button>
          </div>
        </form>
      </section>

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
