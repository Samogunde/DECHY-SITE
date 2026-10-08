import Link from "next/link";
import { AdminShell, when } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/server/admin-session";
import { Repo } from "@/lib/server/records";

export const dynamic = "force-dynamic";

export default async function AdminContacts() {
  const { email } = await requireAdmin();
  const contacts = await new Repo().listContacts();
  return (
    <AdminShell email={email} current="/admin/contacts/" title="Contacts">
      {contacts.length === 0 ? (
        <p className="admin-empty">
          No contacts yet. People appear here when they leave their details.
        </p>
      ) : (
        <ul className="admin-list">
          {contacts.map((c) => (
            <li key={c.id} id={`c-${c.id}`} className="admin-row admin-row-static">
              <span className="admin-row-main">
                <span className="admin-row-title">
                  {c.name}
                  {c.organization ? (
                    <span className="admin-row-org"> · {c.organization}</span>
                  ) : null}
                </span>
                <span className="admin-row-sub">
                  <a href={`mailto:${c.email}`}>{c.email}</a>
                </span>
              </span>
              <span className="admin-row-meta">
                {c.refs.map((r) => (
                  <Link key={r} href={`/admin/inbox/${r}/`} className="admin-row-ref">
                    {r}
                  </Link>
                ))}
                {c.conversationIds.length > 0 ? (
                  <span className="admin-chip">
                    {c.conversationIds.length} conversation{c.conversationIds.length > 1 ? "s" : ""}
                  </span>
                ) : null}
                <span className="admin-row-at">{when(c.updatedAt)}</span>
              </span>
              <details className="admin-danger">
                <summary>Delete this contact</summary>
                <form
                  method="post"
                  action={`/api/admin/contacts/${c.id}/`}
                  className="admin-status-form"
                >
                  <label className="assist-check">
                    <input type="checkbox" name="confirm" value="yes" required />
                    <span>
                      Permanently delete this contact with all their inquiries, requests, and
                      conversations
                    </span>
                  </label>
                  <div>
                    <button type="submit" className="admin-btn admin-btn-quiet">
                      Delete permanently
                    </button>
                  </div>
                </form>
              </details>
            </li>
          ))}
        </ul>
      )}
    </AdminShell>
  );
}
