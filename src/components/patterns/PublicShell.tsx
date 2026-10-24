import { AssistantLauncher } from "@/components/assistant/AssistantLauncher";
import { SiteFooter } from "@/components/patterns/SiteFooter";
import { SiteHeader } from "@/components/patterns/SiteHeader";
import { LeadSourceCapture } from "@/components/patterns/LeadSourceCapture";
import { MotionProvider } from "@/components/primitives/MotionProvider";
import { aiConfigured } from "@/lib/assistant/engine";
import { Analytics } from "@/components/patterns/Analytics";

/**
 * The public website's chrome, in one place: skip link, header, footer, motion, and the DECHY
 * assistant. Every public page gets the assistant through this shell (the (site) layout and the
 * 404 page), so new pages have it automatically. DECHY Admin has its own layout and never shows it.
 * The launcher is a few kilobytes; the conversation panel loads only when a visitor opens it.
 */
export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="theme-dark outline-none">
        {children}
      </main>
      <SiteFooter />
      <MotionProvider />
      <LeadSourceCapture />
      <Analytics />
      {/* The label says "AI" only when real AI answers are configured on the server. */}
      <AssistantLauncher ai={aiConfigured()} />
    </>
  );
}
