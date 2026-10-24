/**
 * Newsletter signup handler (owner, 24 October 2026): email only. The same defenses as the contact
 * form (JSON only, same origin, size cap, rate limit, honeypot, minimum fill time, server-side
 * validation). A repeat signup answers like a new one, so the form never reveals who is subscribed.
 */
import { z } from "zod";
import { clientKey, sameOrigin } from "./handler";
import { LeadSource } from "./validate";

export const NewsletterInput = z.object({
  email: z.string().trim().email("Please enter a valid email address.").max(200),
  website: z.string().max(500).optional().default(""),
  startedAt: z.number().int().positive().optional(),
  source: LeadSource.optional(),
});
export type NewsletterInput = z.infer<typeof NewsletterInput>;

/** Faster than this between render and submit is not a person typing an address. */
export const NEWSLETTER_MIN_FILL_MS = 1500;

export type NewsletterDeps = {
  now: () => number;
  overLimit: (client: string) => Promise<boolean>;
  save: (data: NewsletterInput) => Promise<boolean | null>;
  forward: (data: NewsletterInput) => Promise<{ ok: boolean; skipped?: boolean }>;
};

export type NewsletterResponse = {
  status: number;
  body: { ok: true } | { ok: false; code: string; message: string };
};

const fail = (status: number, code: string, message: string): NewsletterResponse => ({
  status,
  body: { ok: false, code, message },
});

export async function handleNewsletter(
  req: { headers: Headers; text: () => Promise<string> },
  allowedOrigin: string,
  deps: NewsletterDeps,
): Promise<NewsletterResponse> {
  if (!(req.headers.get("content-type") ?? "").toLowerCase().startsWith("application/json"))
    return fail(415, "unsupported", "Unsupported content type.");
  if (!sameOrigin(req.headers, allowedOrigin))
    return fail(403, "forbidden", "Request not allowed.");
  if (await deps.overLimit(clientKey(req.headers)).catch(() => false))
    return fail(429, "rate_limited", "Too many attempts. Please try again later.");
  const text = await req.text();
  if (text.length > 4096) return fail(413, "too_large", "That request is too large.");
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return fail(400, "bad_request", "Invalid request.");
  }
  const parsed = NewsletterInput.safeParse(raw);
  if (!parsed.success) return fail(400, "invalid", "Please enter a valid email address.");
  const data = parsed.data;
  if (data.website) return { status: 200, body: { ok: true } };
  if (!data.startedAt || deps.now() - data.startedAt < NEWSLETTER_MIN_FILL_MS)
    return fail(400, "too_fast", "Please take a moment and try again.");
  const saved = await deps.save(data).catch(() => null);
  // A repeat signup is already on both lists; only new addresses are copied to Netlify Forms.
  const forwarded = saved === false ? { ok: true } : await deps.forward(data);
  if (saved !== null || forwarded.ok) return { status: 200, body: { ok: true } };
  return fail(503, "unavailable", "Signups are not available right now. Please try again later.");
}
