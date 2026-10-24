import Link from "next/link";
import { Logo } from "@/components/patterns/Logo";
import type { FieldSource, InboxRecord } from "@/lib/server/records";
import { STATUS_LABEL, type Status } from "@/lib/server/records";

const NAV = [
  { href: "/admin/", label: "Overview" },
  { href: "/admin/inbox/", label: "Inbox" },
  { href: "/admin/conversations/", label: "AI conversations" },
  { href: "/admin/contacts/", label: "Contacts" },
  { href: "/admin/security/", label: "Security" },
];

/** Signed-in admin chrome: brand, navigation, and sign out. Server component. */
export function AdminShell({
  email,
  current,
  title,
  children,
}: {
  email: string;
  current: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="admin-bar">
        <div className="admin-bar-in">
          <Link href="/admin/" className="admin-brand" aria-label="DECHY Admin overview">
            <Logo sizes="120px" className="h-6" />
            <span className="admin-brand-tag">Admin</span>
          </Link>
          <nav aria-label="Admin" className="admin-nav">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="admin-nav-link"
                aria-current={current === n.href ? "page" : undefined}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <form method="post" action="/api/admin/session/" className="admin-signout">
            <input type="hidden" name="action" value="logout" />
            <span className="admin-who">{email}</span>
            <button type="submit" className="admin-btn admin-btn-quiet">
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main id="main" className="admin-main">
        <h1 className="admin-title">{title}</h1>
        {children}
      </main>
    </>
  );
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`admin-status admin-status-${status}`}>
      {STATUS_LABEL[status as Status] ?? status}
    </span>
  );
}

export const CHANNEL_LABEL: Record<string, string> = {
  "contact-form": "Contact form",
  assistant: "Website assistant",
  "human-support": "Talk to the team",
  email: "Business email",
};

/** Where a detail came from, so inferred details are never mistaken for confirmed ones. */
export const SOURCE_LABEL: Record<FieldSource, string> = {
  visitor: "entered by the visitor",
  conversation: "from the conversation",
  page: "from the page",
  system: "system",
};

/** Inquiry (new business) or Support Request (existing client), and whether it is an AI handoff. */
export function RecordKind({ record }: { record: InboxRecord }) {
  return (
    <>
      <span className="admin-kind" data-kind={record.kind}>
        {record.kind === "inquiry" ? "Inquiry" : "Support request"}
      </span>
      {record.handoff && record.channel === "assistant" ? (
        <span className="admin-kind" data-kind="handoff">
          AI handoff
        </span>
      ) : null}
    </>
  );
}

export function when(iso: string) {
  return (
    new Date(iso).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    }) + " UTC"
  );
}
