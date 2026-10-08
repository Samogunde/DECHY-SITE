import { PublicShell } from "@/components/patterns/PublicShell";

/** The public website: header, footer, motion, and the assistant. Admin has its own layout. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <PublicShell>{children}</PublicShell>;
}
