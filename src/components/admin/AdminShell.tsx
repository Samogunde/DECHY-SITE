import Link from "next/link";
import { Logo } from "@/components/patterns/Logo";

const NAV = [
  { href: "/admin/", label: "Overview" },
  { href: "/admin/inbox/", label: "Inbox" },
  { href: "/admin/conversations/", label: "AI conversations" },
  { href: "/admin/contacts/", label: "Contacts" },
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
  return <span className={`admin-status admin-status-${status}`}>{status}</span>;
}

export const CHANNEL_LABEL: Record<string, string> = {
  "contact-form": "Contact form",
  assistant: "AI handoff",
  "human-support": "Human support",
  email: "Business email",
};

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
