/**
 * Event boundary for DECHY Admin. Every important event is recorded as Activity (visible in the
 * admin) and handed to the configured notification provider, so a future mobile admin app or push
 * service can subscribe without touching the website code.
 *
 *   NOTIFICATION_PROVIDER = none (default) | log | webhook | telegram
 *   NOTIFICATION_WEBHOOK          URL that receives a POST per event (JSON)
 *   NOTIFICATION_WEBHOOK_SECRET   signs the body: header x-dechy-signature = sha256=<hex HMAC>
 *   TELEGRAM_BOT_TOKEN            the bot that posts alerts (from @BotFather)
 *   TELEGRAM_CHAT_ID              the chat or group that receives them
 *
 * Payloads carry the reference, the event type, a short title, the visitor's name, and the page,
 * never an email address or message text (owner, 24 October 2026), so a notification service
 * never holds more personal data than it needs. The full record opens in DECHY Admin.
 */
import crypto from "node:crypto";
import type { Activity } from "./records";
import { Repo } from "./records";

export type EventType =
  | "inquiry.created"
  | "support.requested"
  | "assistant.escalated"
  | "email.received"
  | "person.requested"
  | "record.status_changed";

export type DechyEvent = {
  type: EventType;
  ref: string | null;
  title: string;
  actor: Activity["actor"];
  /** The visitor's name when known (alerts only). */
  name?: string;
  /** The page the visitor was on (alerts only). */
  page?: string;
  /** The DECHY Admin path to open, when it is not the record's own page. */
  adminPath?: string;
};

/** Events that reach the team's phone: new leads and requests for a person. */
const ALERTS = new Set<EventType>([
  "inquiry.created",
  "support.requested",
  "assistant.escalated",
  "person.requested",
  "email.received",
]);

const adminPathOf = (e: DechyEvent) =>
  e.adminPath ?? (e.ref ? `/admin/inbox/${e.ref}/` : "/admin/");

/** The alert text: what happened, the name, the page, and the reference. Never email or message. */
export function alertText(e: DechyEvent): string {
  const clean = (s: string, n: number) => s.replace(/\s+/g, " ").trim().slice(0, n);
  return [
    clean(e.title, 120),
    e.name ? `Name: ${clean(e.name, 80)}` : null,
    e.page ? `Page: ${clean(e.page, 160)}` : null,
    e.ref ? `Reference: ${e.ref}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

async function telegram(
  event: DechyEvent,
  env: Env,
  fetchImpl: FetchLike,
): Promise<"sent" | "skipped" | "failed"> {
  const token = env.TELEGRAM_BOT_TOKEN?.trim();
  const chat = env.TELEGRAM_CHAT_ID?.trim();
  if (!token || !chat) return "skipped";
  if (!ALERTS.has(event.type)) return "skipped";
  const origin = (env.SITE_ORIGIN ?? "").trim().replace(/\/$/, "");
  const link = `${origin}${adminPathOf(event)}`;
  // Telegram buttons need a public https address; anywhere else the link goes in the text.
  const button = /^https:\/\//.test(origin);
  const body = JSON.stringify({
    chat_id: chat,
    text: button ? alertText(event) : `${alertText(event)}\n${link}`,
    disable_web_page_preview: true,
    ...(button
      ? { reply_markup: { inline_keyboard: [[{ text: "Open in DECHY Admin", url: link }]] } }
      : {}),
  });
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetchImpl(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      signal: controller.signal,
      headers: { "content-type": "application/json" },
      body,
    });
    return res.ok ? "sent" : "failed";
  } catch {
    return "failed";
  } finally {
    clearTimeout(timer);
  }
}

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
  if (provider === "telegram") return telegram(event, env, fetchImpl);
  if (provider !== "webhook") return "skipped";
  const url = env.NOTIFICATION_WEBHOOK?.trim();
  if (!url || !/^https:\/\//.test(url)) return "skipped";
  const body = JSON.stringify({
    source: "dechy-admin",
    type: event.type,
    ref: event.ref,
    title: event.title,
    at: new Date().toISOString(),
    adminPath: adminPathOf(event),
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
