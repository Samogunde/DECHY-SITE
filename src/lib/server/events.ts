/**
 * Event boundary for DECHY Admin. Every important event is recorded as Activity (visible in the
 * admin) and handed to the configured notification provider, so a future mobile admin app or push
 * service can subscribe without touching the website code.
 *
 *   NOTIFICATION_PROVIDER = none (default) | log | webhook
 *   NOTIFICATION_WEBHOOK          URL that receives a POST per event (JSON)
 *   NOTIFICATION_WEBHOOK_SECRET   signs the body: header x-dechy-signature = sha256=<hex HMAC>
 *
 * Payloads carry the reference, the event type, and a short title, never message bodies, so a
 * notification service never holds more personal data than it needs.
 */
import crypto from "node:crypto";
import type { Activity } from "./records";
import { Repo } from "./records";

export type EventType =
  | "inquiry.created"
  | "support.requested"
  | "assistant.escalated"
  | "email.received"
  | "record.status_changed";

export type DechyEvent = {
  type: EventType;
  ref: string | null;
  title: string;
  actor: Activity["actor"];
};

type Env = Record<string, string | undefined>;
type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

export function signBody(body: string, secret: string): string {
  return `sha256=${crypto.createHmac("sha256", secret).update(body).digest("hex")}`;
}

/** Sends the notification. Never throws: a failed notification must not fail the visitor's request. */
export async function notify(
  event: DechyEvent,
  env: Env = process.env,
  fetchImpl: FetchLike = fetch,
  log: (line: string) => void = (l) => console.info(l),
): Promise<"sent" | "skipped" | "failed"> {
  const provider = (env.NOTIFICATION_PROVIDER ?? "none").trim().toLowerCase();
  if (provider === "log") {
    log(`[event] ${event.type} ${event.ref ?? ""}`.trim());
    return "sent";
  }
  if (provider !== "webhook") return "skipped";
  const url = env.NOTIFICATION_WEBHOOK?.trim();
  if (!url || !/^https:\/\//.test(url)) return "skipped";
  const body = JSON.stringify({
    source: "dechy-admin",
    type: event.type,
    ref: event.ref,
    title: event.title,
    at: new Date().toISOString(),
    adminPath: event.ref ? `/admin/inbox/${event.ref}/` : "/admin/",
  });
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetchImpl(url, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "content-type": "application/json",
        ...(env.NOTIFICATION_WEBHOOK_SECRET
          ? { "x-dechy-signature": signBody(body, env.NOTIFICATION_WEBHOOK_SECRET) }
          : {}),
      },
      body,
    });
    return res.ok ? "sent" : "failed";
  } catch {
    return "failed";
  } finally {
    clearTimeout(timer);
  }
}

/** Records the event as activity and notifies. */
export async function emit(repo: Repo, event: DechyEvent, env: Env = process.env) {
  try {
    await repo.logActivity({
      type: event.type,
      ref: event.ref,
      summary: event.title,
      actor: event.actor,
    });
  } catch {
    // Activity is best effort; the record itself is already stored.
  }
  await notify(event, env);
}
