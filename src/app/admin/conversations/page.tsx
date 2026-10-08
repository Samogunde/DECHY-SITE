import Link from "next/link";
import { AdminShell, when } from "@/components/admin/AdminShell";
import { byId } from "@/lib/assistant/knowledge";
import { requireAdmin } from "@/lib/server/admin-session";
import { Repo, retentionDays } from "@/lib/server/records";

export const dynamic = "force-dynamic";

export default async function AdminConversations({
  searchParams,
}: {
  searchParams: Promise<{ person?: string }>;
}) {
  const { email } = await requireAdmin();
  const all = await new Repo().listConversations();
  const sp = await searchParams;
  const personOnly = sp.person === "1";
  const conversations = personOnly ? all.filter((c) => c.personRequestedAt && !c.supportRef) : all;
  return (
    <AdminShell email={email} current="/admin/conversations/" title="AI conversations">
      <p className="admin-note">
        Conversations are kept for {retentionDays()} days, then deleted, unless they were handed to
        the team, in which case they stay with that record.
      </p>
      <nav aria-label="Filter conversations" className="admin-filters">
        <Link
          href="/admin/conversations/"
          className="admin-filter"
          aria-current={personOnly ? undefined : "true"}
        >
          All
        </Link>
        <Link
          href="/admin/conversations/?person=1"
          className="admin-filter"
          aria-current={personOnly ? "true" : undefined}
        >
          Person requested, not yet sent
        </Link>
      </nav>
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
                      {c.detectedNeed ||
                        byId(c.recommendedService)?.name ||
                        "No recommendation yet"}
                    </span>
                  </span>
                  <span className="admin-row-meta">
                    {c.personRequestedAt && !c.supportRef ? (
                      <span className="admin-kind" data-kind="person">
                        Person requested
                      </span>
                    ) : null}
                    {c.supportRef ? (
                      <span className="admin-kind" data-kind="handoff">
                        AI handoff
                      </span>
                    ) : (
                      <span className="admin-kind" data-kind="conversation">
                        AI conversation
                      </span>
                    )}
                    <span className="admin-chip">{c.mode === "ai" ? "DECHY AI" : "Automated"}</span>
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
