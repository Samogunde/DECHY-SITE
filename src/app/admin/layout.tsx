import type { Metadata } from "next";
// Admin styles load only on admin routes, never in the public site bundle.
import "@/styles/admin.css";

export const metadata: Metadata = {
  title: { absolute: "DECHY Admin" },
  robots: { index: false, follow: false, nocache: true },
  // Installable on a phone's home screen (owner, 24 October 2026), with its own name and scope.
  manifest: "/admin/manifest.webmanifest",
  appleWebApp: { capable: true, title: "DECHY Admin", statusBarStyle: "black" },
};

/** Private admin area: its own layout, outside the public site chrome and bundles. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin">{children}</div>;
}
