/**
 * Where a visitor came from (owner, 24 October 2026): UTM tags, the first page of the visit, and the
 * referring site, kept for the visit in sessionStorage and sent with every form, so each lead shows
 * its source. A later page that carries new UTM tags (a different campaign) replaces them. Nothing
 * is sent anywhere until the visitor submits a form. Browser only; every storage call is guarded.
 */
export type LeadSourceFields = {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  landing_page: string;
  referrer: string;
};

const KEY = "dechy-lead-source";
const EMPTY: LeadSourceFields = {
  utm_source: "",
  utm_medium: "",
  utm_campaign: "",
  landing_page: "",
  referrer: "",
};

function read(): LeadSourceFields | null {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    return raw ? { ...EMPTY, ...(JSON.parse(raw) as Partial<LeadSourceFields>) } : null;
  } catch {
    return null;
  }
}

function write(v: LeadSourceFields) {
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(v));
  } catch {
    // private windows and blocked storage: the form still sends what this page knows
  }
}

/** The referring site, only when it is another site (our own pages are not a source). */
function externalReferrer(): string {
  try {
    if (!document.referrer) return "";
    const ref = new URL(document.referrer);
    return ref.host === window.location.host ? "" : `${ref.origin}${ref.pathname}`.slice(0, 500);
  } catch {
    return "";
  }
}

/** Called on every page view: saves the visit's source on its first page. */
export function captureLeadSource() {
  const params = new URLSearchParams(window.location.search);
  const utm = {
    utm_source: (params.get("utm_source") ?? "").slice(0, 200),
    utm_medium: (params.get("utm_medium") ?? "").slice(0, 200),
    utm_campaign: (params.get("utm_campaign") ?? "").slice(0, 200),
  };
  const existing = read();
  if (!existing) {
    write({
      ...utm,
      landing_page: `${window.location.pathname}${window.location.search}`.slice(0, 500),
      referrer: externalReferrer(),
    });
  } else if (utm.utm_source || utm.utm_campaign) {
    write({ ...existing, ...utm });
  }
}

/** The visit's source for a form submission. */
export function leadSource(): LeadSourceFields {
  return (
    read() ?? {
      ...EMPTY,
      landing_page: `${window.location.pathname}${window.location.search}`.slice(0, 500),
      referrer: externalReferrer(),
    }
  );
}
