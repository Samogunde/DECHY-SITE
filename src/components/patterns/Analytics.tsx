"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AI_REFERRERS,
  analyticsAllowed,
  readFlags,
  startAnalytics,
  storedConsent,
  track,
  updateConsent,
  type Consent,
} from "@/lib/analytics";

const FILE = /\.(pdf|docx?|xlsx?|pptx?|csv|zip|txt)$/i;

/**
 * Analytics and the cookie choice (owner, 24 October 2026). Loads Tag Manager on the live domain
 * only, shows a one-line choice until the visitor answers, and reports the site-wide actions:
 * call-to-action clicks, email, phone, and WhatsApp links, outbound links, downloads, scroll depth
 * (read depth on articles), and visits from AI assistants. Page-specific events (forms, the
 * estimator, the assistant, case studies, 404) are reported where they happen.
 * Add ?consent-preview=1 to any preview page to see the banner (nothing is loaded or sent there).
 */
export function Analytics() {
  const pathname = usePathname();
  const [ask, setAsk] = useState(false);

  useEffect(() => {
    readFlags();
    const preview = new URLSearchParams(window.location.search).get("consent-preview") === "1";
    if (analyticsAllowed()) {
      startAnalytics();
      reportAiReferral();
    }
    // The banner appears only where analytics can run, or on request for review.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads browser-only state once
    setAsk((analyticsAllowed() || preview) && storedConsent() === null);
  }, []);

  // Cookie settings (footer) reopens the choice.
  useEffect(() => {
    const reopen = () => setAsk(true);
    window.addEventListener("dechy:consent", reopen);
    return () => window.removeEventListener("dechy:consent", reopen);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a, button");
      if (!a) return;
      const href = a instanceof HTMLAnchorElement ? (a.getAttribute("href") ?? "") : "";
      const text = (a.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 80);
      const page = window.location.pathname;
      if (href.startsWith("mailto:"))
        return track("email_click", { email_address: href.slice(7), page_path: page });
      if (href.startsWith("tel:")) return track("phone_click", { page_path: page });
      if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href))
        return track("whatsapp_click", { page_path: page });
      if (a instanceof HTMLAnchorElement && FILE.test(a.pathname))
        track("file_download", {
          file_name: a.pathname.split("/").pop() ?? "",
          file_extension: (a.pathname.split(".").pop() ?? "").toLowerCase(),
          page_path: page,
        });
      if (
        a instanceof HTMLAnchorElement &&
        /^https?:/.test(href) &&
        a.host !== window.location.host
      )
        track("outbound_click", { link_url: a.href, link_domain: a.hostname, page_path: page });
      if (a.matches(".btn, .cta-soft-link, [data-cta]"))
        track("cta_click", { cta_text: text, cta_url: href, page_path: page });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  // Scroll depth on every page; on articles, how far the article itself has been read.
  useEffect(() => {
    const marks = [25, 50, 75, 100];
    const seen = new Set<number>();
    const article = document.querySelector<HTMLElement>("[data-read-depth]");
    const measure = () => {
      let pct: number;
      if (article) {
        const r = article.getBoundingClientRect();
        pct = ((window.innerHeight - r.top) / Math.max(r.height, 1)) * 100;
      } else {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        pct = max > 0 ? (window.scrollY / max) * 100 : 100;
      }
      for (const m of marks)
        if (pct >= m && !seen.has(m)) {
          seen.add(m);
          if (article)
            track("article_read", {
              percent: m,
              article: article.dataset.readDepth ?? pathname,
            });
          else track("scroll_depth", { percent: m, page_path: pathname });
        }
    };
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [pathname]);

  if (!ask) return null;
  const choose = (c: Consent) => {
    updateConsent(c);
    setAsk(false);
  };
  return (
    <div className="consent" role="region" aria-label="Cookie choice">
      <p className="consent-text">
        We use analytics cookies to see how the site is used.{" "}
        <Link href="/cookies/">Cookie policy</Link>
      </p>
      <div className="consent-actions">
        <button type="button" className="consent-btn" onClick={() => choose("denied")}>
          Decline
        </button>
        <button type="button" className="consent-btn" onClick={() => choose("granted")}>
          Accept
        </button>
      </div>
    </div>
  );
}

/** Once per visit: a visitor who arrived from an AI assistant. */
function reportAiReferral() {
  try {
    if (window.sessionStorage.getItem("dechy-ai-ref")) return;
    const host = document.referrer ? new URL(document.referrer).hostname : "";
    const source = AI_REFERRERS[host];
    if (!source) return;
    window.sessionStorage.setItem("dechy-ai-ref", "1");
    track("ai_referral", { ai_source: source, referrer_host: host });
  } catch {
    // no referrer or blocked storage
  }
}

/** Reports one event when a page mounts (a case study, the 404 page). */
export function TrackOnMount({
  event,
  params = {},
}: {
  event: string;
  params?: Record<string, string>;
}) {
  useEffect(() => {
    track(event, { ...params, page_path: window.location.pathname });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once per page view
  }, [event]);
  return null;
}

/** The footer's Cookie settings link: reopens the analytics choice. */
export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event("dechy:consent"))}
    >
      Cookie settings
    </button>
  );
}
