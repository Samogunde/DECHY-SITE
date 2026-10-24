/**
 * Netlify Forms copy of every accepted lead (owner, 24 October 2026). Our own handler checks each
 * submission first (honeypot, minimum time, rate limit, validation) and stores it for DECHY Admin;
 * this module then forwards the same lead to Netlify Forms, which emails the business mailbox
 * (the destination is set in the Netlify UI, never in code), keeps a second copy, and exports CSV.
 *
 * Netlify only accepts a form it found at deploy time, so public/__forms.html holds a hidden copy of
 * each form below with exactly these field names (a unit test keeps them in step). Submissions are
 * URL-encoded and posted to that file, never to "/", which the Next.js server would intercept.
 *
 *   NETLIFY_FORMS = on    forward to Netlify Forms (set on the Netlify site only)
 *   URL                   the site's main address, set by Netlify; SITE_ORIGIN is the fallback
 */
import type { ContactInput, LeadSource } from "./validate";

export type NetlifyFormKey = "contact" | "quote" | "estimator" | "newsletter";

const SOURCE_FIELDS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "landing_page",
  "referrer",
] as const;

/** Each form's Netlify name, notification subject, and fields (order sets the summary line). */
export const NETLIFY_FORMS: Record<
  NetlifyFormKey,
  { name: string; subject: string; fields: readonly string[] }
> = {
  contact: {
    name: "contact",
    subject: "DECHY website: new message from the contact form",
    fields: [
      "name",
      "email",
      "organization",
      "interest",
      "timeline",
      "budget",
      "message",
      "reference",
      ...SOURCE_FIELDS,
    ],
  },
  quote: {
    name: "quote",
    subject: "DECHY website: new quote request",
    fields: [
      "name",
      "email",
      "organization",
      "interest",
      "timeline",
      "budget",
      "message",
      "reference",
      ...SOURCE_FIELDS,
    ],
  },
  estimator: {
    name: "estimator-lead",
    subject: "DECHY website: new cost estimator lead",
    fields: ["name", "email", "interest", "message", "reference", ...SOURCE_FIELDS],
  },
  newsletter: {
    name: "newsletter",
    subject: "DECHY website: new newsletter signup",
    fields: ["email", ...SOURCE_FIELDS],
  },
};

type Env = Record<string, string | undefined>;
type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

export function netlifyFormsOn(env: Env = process.env): boolean {
  return (env.NETLIFY_FORMS ?? "").trim().toLowerCase() === "on";
}

const sourceFields = (s: LeadSource | undefined): Record<string, string> =>
  Object.fromEntries(SOURCE_FIELDS.map((k) => [k, s?.[k] ?? ""]));

/** The Netlify fields for a contact, quote, or estimator lead. */
export function leadFields(d: ContactInput, ref?: string): Record<string, string> {
  return {
    name: d.name,
    email: d.email,
    organization: d.organization,
    interest: d.interest,
    timeline: d.timeline ?? "",
    budget: d.budget ?? "",
    message: d.message,
    reference: ref ?? "",
    ...sourceFields(d.source),
  };
}

export function newsletterFields(email: string, source?: LeadSource): Record<string, string> {
  return { email, ...sourceFields(source) };
}

/**
 * Posts one submission to Netlify Forms. Never throws: the lead is already stored, so a failed
 * copy is logged and the visitor still gets their confirmation.
 */
export async function forwardToNetlify(
  form: NetlifyFormKey,
  fields: Record<string, string>,
  env: Env = process.env,
  fetchImpl: FetchLike = fetch,
  log: (line: string) => void = (l) => console.warn(l),
): Promise<{ ok: boolean; skipped?: boolean }> {
  if (!netlifyFormsOn(env)) return { ok: false, skipped: true };
  const origin = (env.URL || env.SITE_ORIGIN || "").trim().replace(/\/$/, "");
  if (!/^https?:\/\//.test(origin)) {
    log(`[netlify-forms] ${form}: no site address configured`);
    return { ok: false };
  }
  const def = NETLIFY_FORMS[form];
  const body = new URLSearchParams({ "form-name": def.name, subject: def.subject });
  for (const f of def.fields) body.set(f, fields[f] ?? "");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetchImpl(`${origin}/__forms.html`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
      signal: controller.signal,
    });
    if (!res.ok) log(`[netlify-forms] ${form}: status ${res.status}`);
    return { ok: res.ok };
  } catch {
    log(`[netlify-forms] ${form}: request failed`);
    return { ok: false };
  } finally {
    clearTimeout(timer);
  }
}
