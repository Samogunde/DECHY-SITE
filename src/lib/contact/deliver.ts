/**
 * Email delivery adapters for contact inquiries and support requests. The destination is
 * configuration, never code: nothing here names a mailbox, and no secret is stored in the
 * repository. The business mailbox is CONTACT_TO_EMAIL (aliases: BUSINESS_EMAIL,
 * NOTIFICATION_EMAIL), so the final address can be set later without code changes. See
 * .env.example for the variables.
 *
 *   none     (default) validation works; delivery reports "unavailable"
 *   log      redacted server log line only (local testing)
 *   webhook  POST JSON to CONTACT_WEBHOOK_URL (works with automation platforms)
 *   resend   email through the Resend HTTP API
 */
import type { ContactInput } from "./validate";

export type DeliveryResult = { ok: true } | { ok: false; reason: "unconfigured" | "failed" };

type Env = Record<string, string | undefined>;
type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

const clean = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

function summary(d: ContactInput, ref?: string): string {
  const lines = [
    `Name: ${clean(d.name)}`,
    `Email: ${clean(d.email)}`,
    d.organization ? `Organization: ${clean(d.organization)}` : null,
    d.interest ? `Interested in: ${clean(d.interest)}` : null,
    d.timeline ? `Timeline: ${d.timeline}` : null,
    d.budget ? `Estimated budget: ${d.budget}` : null,
    ref ? `Reference: ${ref}` : null,
    "",
    d.message,
  ].filter((l): l is string => l !== null);
  return lines.join("\n");
}

async function withTimeout<T>(ms: number, run: (signal: AbortSignal) => Promise<T>): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await run(controller.signal);
  } finally {
    clearTimeout(timer);
  }
}

/** The business mailbox, from configuration only. */
export function businessEmail(env: Env = process.env): string | undefined {
  return (
    (env.CONTACT_TO_EMAIL || env.BUSINESS_EMAIL || env.NOTIFICATION_EMAIL)?.trim() || undefined
  );
}

export type OutboundMessage = {
  kind: "support";
  subject: string;
  text: string;
  replyTo?: string;
  /** Structured fields for webhook destinations. */
  payload: Record<string, unknown>;
};

/** Delivers a support request (or any non-contact message) through the same configured channel. */
export async function sendMessage(
  msg: OutboundMessage,
  env: Env = process.env,
  fetchImpl: FetchLike = fetch,
  log: (line: string) => void = (l) => console.info(l),
): Promise<DeliveryResult> {
  const mode = (env.CONTACT_DELIVERY ?? "none").trim().toLowerCase();
  if (mode === "log") {
    log(`[${msg.kind}] message received (${msg.text.length} chars)`);
    return { ok: true };
  }
  if (mode === "webhook") {
    const url = env.CONTACT_WEBHOOK_URL?.trim();
    if (!url) return { ok: false, reason: "unconfigured" };
    try {
      const res = await withTimeout(8000, (signal) =>
        fetchImpl(url, {
          method: "POST",
          signal,
          headers: {
            "content-type": "application/json",
            ...(env.CONTACT_WEBHOOK_SECRET
              ? { "x-webhook-secret": env.CONTACT_WEBHOOK_SECRET }
              : {}),
          },
          body: JSON.stringify({
            source: `dechy-site-${msg.kind}`,
            receivedAt: new Date().toISOString(),
            ...msg.payload,
          }),
        }),
      );
      return res.ok ? { ok: true } : { ok: false, reason: "failed" };
    } catch {
      return { ok: false, reason: "failed" };
    }
  }
  if (mode === "resend") {
    const key = env.RESEND_API_KEY?.trim();
    const to = businessEmail(env);
    const from = env.CONTACT_FROM_EMAIL?.trim();
    if (!key || !to || !from) return { ok: false, reason: "unconfigured" };
    try {
      const res = await withTimeout(8000, (signal) =>
        fetchImpl("https://api.resend.com/emails", {
          method: "POST",
          signal,
          headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
          body: JSON.stringify({
            from,
            to: [to],
            ...(msg.replyTo ? { reply_to: clean(msg.replyTo) } : {}),
            subject: clean(msg.subject).slice(0, 200),
            text: msg.text,
          }),
        }),
      );
      return res.ok ? { ok: true } : { ok: false, reason: "failed" };
    } catch {
      return { ok: false, reason: "failed" };
    }
  }
  return { ok: false, reason: "unconfigured" };
}

export async function deliver(
  data: ContactInput,
  env: Env = process.env,
  fetchImpl: FetchLike = fetch,
  log: (line: string) => void = (l) => console.info(l),
  ref?: string,
): Promise<DeliveryResult> {
  const mode = (env.CONTACT_DELIVERY ?? "none").trim().toLowerCase();

  if (mode === "log") {
    // Redacted on purpose: no message body, no email address.
    log(
      `[contact] submission received (name ${data.name.length} chars, message ${data.message.length} chars, interest "${clean(data.interest)}")`,
    );
    return { ok: true };
  }

  if (mode === "webhook") {
    const url = env.CONTACT_WEBHOOK_URL?.trim();
    if (!url) return { ok: false, reason: "unconfigured" };
    try {
      const res = await withTimeout(8000, (signal) =>
        fetchImpl(url, {
          method: "POST",
          signal,
          headers: {
            "content-type": "application/json",
            ...(env.CONTACT_WEBHOOK_SECRET
              ? { "x-webhook-secret": env.CONTACT_WEBHOOK_SECRET }
              : {}),
          },
          body: JSON.stringify({
            source: "dechy-site-contact",
            receivedAt: new Date().toISOString(),
            name: data.name,
            email: data.email,
            organization: data.organization,
            interest: data.interest,
            timeline: data.timeline ?? "",
            budget: data.budget ?? "",
            ...(ref ? { ref } : {}),
            message: data.message,
          }),
        }),
      );
      return res.ok ? { ok: true } : { ok: false, reason: "failed" };
    } catch {
      return { ok: false, reason: "failed" };
    }
  }

  if (mode === "resend") {
    const key = env.RESEND_API_KEY?.trim();
    const to = businessEmail(env);
    const from = env.CONTACT_FROM_EMAIL?.trim();
    if (!key || !to || !from) return { ok: false, reason: "unconfigured" };
    try {
      const res = await withTimeout(8000, (signal) =>
        fetchImpl("https://api.resend.com/emails", {
          method: "POST",
          signal,
          headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
          body: JSON.stringify({
            from,
            to: [to],
            reply_to: clean(data.email),
            subject:
              `New inquiry from ${clean(data.name)}${data.interest ? ` (${clean(data.interest)})` : ""}`.slice(
                0,
                200,
              ),
            text: summary(data, ref),
          }),
        }),
      );
      return res.ok ? { ok: true } : { ok: false, reason: "failed" };
    } catch {
      return { ok: false, reason: "failed" };
    }
  }

  return { ok: false, reason: "unconfigured" };
}
