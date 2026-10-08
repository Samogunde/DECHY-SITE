import { SiteFooter } from "@/components/patterns/SiteFooter";
import { SiteHeader } from "@/components/patterns/SiteHeader";
import { AssistantLauncher } from "@/components/assistant/AssistantLauncher";
import { MotionProvider } from "@/components/primitives/MotionProvider";
import { aiConfigured } from "@/lib/assistant/engine";

/** The public website: header, footer, motion, and the assistant launcher. Admin has its own layout. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <SiteFooter />
      <MotionProvider />
      {/* The label says "AI" only when real AI answers are configured on the server. */}
      <AssistantLauncher ai={aiConfigured()} />
    </>
  );
}
