/**
 * Analytics (owner, 24 October 2026): Google Tag Manager carries Google Analytics 4, and Microsoft
 * Clarity adds heatmaps and recordings. No analytics system of our own: the site only pushes named
 * events to the Tag Manager data layer.
 *
 * Analytics loads only on the live domain (never on localhost, Netlify previews, or the
 * dechy-site.netlify.app address), never for browsers marked as DECHY team traffic, and only as the
 * visitor's consent allows: Consent Mode v2 denies analytics storage by default in the EEA, the UK,
 * and Switzerland until the visitor accepts; advertising storage is always denied (we run no ads).
 * Browser only.
 */

/** Public container IDs (not secrets). Clarity stays off until its project ID is set. */
export const GTM_ID = "GTM-M7VGXV5C";
export const CLARITY_ID = "";

/** The hosts that may load analytics: the live domain only. */
export const ANALYTICS_HOSTS = ["www.dechytech.com", "dechytech.com"];

/** Where analytics storage is denied until the visitor accepts (EEA, UK, Switzerland). */
export const CONSENT_REGIONS = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT",
  "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE", "IS", "LI", "NO",
  "GB", "CH",
]; // prettier-ignore

/** AI assistants whose visitors are reported as AI referrals. */
export const AI_REFERRERS: Record<string, string> = {
  "chatgpt.com": "ChatGPT",
  "chat.openai.com": "ChatGPT",
  "perplexity.ai": "Perplexity",
  "www.perplexity.ai": "Perplexity",
  "claude.ai": "Claude",
  "gemini.google.com": "Gemini",
  "copilot.microsoft.com": "Copilot",
};

export type Consent = "granted" | "denied";

const CONSENT_KEY = "dechy-consent";
const INTERNAL_KEY = "dechy-internal";
const DEBUG_KEY = "dechy-analytics-debug";

function get(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function set(key: string, value: string | null) {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    // blocked storage: the choice lasts for this page only
  }
}

export function storedConsent(): Consent | null {
  const v = get(CONSENT_KEY);
  return v === "granted" || v === "denied" ? v : null;
}

export function saveConsent(c: Consent) {
  set(CONSENT_KEY, c);
}

/**
 * Team traffic: opening any page with ?dechy-internal=1 marks this browser as DECHY's own and turns
 * analytics off for it; ?dechy-internal=0 clears the mark. ?dechy-analytics-debug=1 logs events to
 * the console (for checking the events on the preview, where nothing is sent).
 */
export function readFlags() {
  const p = new URLSearchParams(window.location.search);
  if (p.get("dechy-internal") === "1") set(INTERNAL_KEY, "1");
  if (p.get("dechy-internal") === "0") set(INTERNAL_KEY, null);
  if (p.get("dechy-analytics-debug") === "1") set(DEBUG_KEY, "1");
  if (p.get("dechy-analytics-debug") === "0") set(DEBUG_KEY, null);
}

export function isInternal(): boolean {
  return get(INTERNAL_KEY) === "1";
}

/** True only on the live domain, for a browser not marked as team traffic. */
export function analyticsAllowed(): boolean {
  return ANALYTICS_HOSTS.includes(window.location.hostname) && !isInternal();
}

type DataLayerWindow = Window & {
  dataLayer?: unknown[];
  clarity?: (...args: unknown[]) => void;
};

/** Pushes one event to the Tag Manager data layer (a no-op where analytics is off). */
export function track(event: string, params: Record<string, string | number | boolean> = {}) {
  const w = window as DataLayerWindow;
  if (get(DEBUG_KEY) === "1") console.info("[analytics]", event, params);
  if (!w.dataLayer) return;
  w.dataLayer.push({ event, ...params });
}

/** Consent Mode v2 with gtag's argument-object form, which Tag Manager requires. */
function gtag(..._args: unknown[]) {
  const w = window as DataLayerWindow;
  // eslint-disable-next-line prefer-rest-params
  w.dataLayer?.push(arguments);
}

function addScript(src: string) {
  const s = document.createElement("script");
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

let started = false;

/** Sets the consent defaults, then loads Tag Manager (and Clarity when configured). */
export function startAnalytics() {
  if (started || !analyticsAllowed()) return;
  started = true;
  const w = window as DataLayerWindow;
  w.dataLayer = w.dataLayer ?? [];
  const denied = {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  };
  gtag("consent", "default", {
    ...denied,
    analytics_storage: "denied",
    region: CONSENT_REGIONS,
    wait_for_update: 500,
  });
  gtag("consent", "default", { ...denied, analytics_storage: "granted" });
  const choice = storedConsent();
  if (choice) gtag("consent", "update", { analytics_storage: choice });
  w.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  addScript(`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`);

  if (CLARITY_ID) {
    w.clarity =
      w.clarity ??
      function (...args: unknown[]) {
        const c = w.clarity as unknown as { q?: unknown[] };
        (c.q = c.q ?? []).push(args);
      };
    addScript(`https://www.clarity.ms/tag/${CLARITY_ID}`);
    if (choice) clarityConsent(choice);
  }
}

function clarityConsent(c: Consent) {
  (window as DataLayerWindow).clarity?.("consentv2", {
    ad_Storage: "denied",
    analytics_Storage: c,
  });
}

/** The visitor's choice from the banner: saved, then passed to Google and Clarity. */
export function updateConsent(c: Consent) {
  saveConsent(c);
  if (!started) return;
  gtag("consent", "update", { analytics_storage: c });
  track("consent_update", { analytics_storage: c });
  clarityConsent(c);
}
