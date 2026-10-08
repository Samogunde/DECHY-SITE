import Link from "next/link";
import { AdminShell, when } from "@/components/admin/AdminShell";
import { byId } from "@/lib/assistant/knowledge";
import { requireAdmin } from "@/lib/server/admin-session";
import { Repo, retentionDays } from "@/lib/server/records";

export const dynamic = "force-dynamic";

export default async function AdminConversations() {
  const { email } = await requireAdmin();
  const conversations = await new Repo().listConversations();
  return (
    <AdminShell email={email} current="/admin/conversations/" title="AI conversations">
      <p className="admin-note">
        Conversations are kept for {retentionDays()} days, then deleted, unless they led to a
        support request.
      </p>
      {conversations.length === 0 ? (
        <p className="admin-empty">No conversations yet.</p>
      ) : (
        <ul className="admin-list">
          {conversations.map((c) => {
            const first = c.messages.find((m) => m.role === "visitor")?.text ?? "";
            return (
              <li key={c.id}>
                <Link href={`/admin/conversations/${c.id}/`} className="admin-row">
                  <span className="admin-row-main">
                    <span className="admin-row-title">{first.slice(0, 90) || "(no message)"}</span>
                    <span className="admin-row-sub">
                      {byId(c.recommendedService)?.name ?? "No recommendation yet"}
                    </span>
                  </span>
                  <span className="admin-row-meta">
                    <span className="admin-chip">{c.mode === "ai" ? "AI" : "Guided"}</span>
                    <span className="admin-chip">{c.status}</span>
                    {c.supportRef ? <span className="admin-row-ref">{c.supportRef}</span> : null}
                    <span className="admin-row-at">{when(c.updatedAt)}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </AdminShell>
  );
}
