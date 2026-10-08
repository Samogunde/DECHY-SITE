import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell, when } from "@/components/admin/AdminShell";
import { byId } from "@/lib/assistant/knowledge";
import { requireAdmin } from "@/lib/server/admin-session";
import { Repo } from "@/lib/server/records";

export const dynamic = "force-dynamic";

export default async function AdminConversation({ params }: { params: Promise<{ id: string }> }) {
  const { email } = await requireAdmin();
  const { id } = await params;
  const c = await new Repo().getConversation(id);
  if (!c) notFound();
  return (
    <AdminShell email={email} current="/admin/conversations/" title="Conversation">
      <div className="admin-grid">
        <section className="admin-card" aria-labelledby="facts-h">
          <h2 id="facts-h" className="admin-h2">
            Summary
          </h2>
          <dl className="admin-config">
            <div>
              <dt>Started</dt>
              <dd>{when(c.createdAt)}</dd>
            </div>
            <div>
              <dt>Mode</dt>
              <dd>{c.mode === "ai" ? "AI" : "Guided"}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{c.status}</dd>
            </div>
            {c.detectedNeed ? (
              <div>
                <dt>Detected need</dt>
                <dd>{c.detectedNeed}</dd>
              </div>
            ) : null}
            {c.recommendedService ? (
              <div>
                <dt>Recommended service</dt>
                <dd>{byId(c.recommendedService)?.name ?? c.recommendedService}</dd>
              </div>
            ) : null}
            {c.recommendedSolution ? (
              <div>
                <dt>Recommended solution</dt>
                <dd>{byId(c.recommendedSolution)?.name ?? c.recommendedSolution}</dd>
              </div>
            ) : null}
            {c.supportRef ? (
              <div>
                <dt>Handoff</dt>
                <dd>
                  <Link href={`/admin/inbox/${c.supportRef}/`}>{c.supportRef}</Link>
                </dd>
              </div>
            ) : null}
            <div>
              <dt>Deleted after</dt>
              <dd>
                {c.status === "escalated" ? "Kept with its support request" : when(c.expiresAt)}
              </dd>
            </div>
          </dl>
          {c.summary ? <p className="admin-text mt-4">{c.summary}</p> : null}
        </section>
      </div>
      <section className="admin-card" aria-labelledby="t-h">
        <h2 id="t-h" className="admin-h2">
          Transcript
        </h2>
        <ol className="admin-transcript">
          {c.messages.map((m, i) => (
            <li key={i} data-role={m.role}>
              <span className="admin-transcript-who">
                {m.role === "visitor" ? "Visitor" : "Assistant"} · {when(m.at)}
              </span>
              <p className="admin-text">{m.text}</p>
            </li>
          ))}
        </ol>
      </section>
    </AdminShell>
  );
}
