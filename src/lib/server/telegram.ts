/**
 * Live chat through Telegram (owner, 24 October 2026). Server-only.
 *
 * When a visitor hands a conversation to the team, the conversation is posted to the team's
 * Telegram chat. Anything the visitor writes afterwards is posted too. A team member replies to any
 * of those messages in Telegram (swipe to reply), and the reply appears in the visitor's chat
 * window. No paid tools: the bot and its webhook are free.
 *
 *   TELEGRAM_BOT_TOKEN   the bot (from @BotFather), the same one that sends alerts
 *   TELEGRAM_CHAT_ID     the chat the team works in; replies are accepted from this chat only
 *   SITE_ORIGIN          the public https address Telegram calls back (/api/telegram/)
 *
 * Telegram calls the webhook with a secret header derived from the bot token, so the endpoint
 * accepts nothing that did not come from Telegram for this bot. Unlike alerts, live chat carries
 * the visitor's messages: that is its purpose, and the visitor is told a person will read them.
 */
import crypto from "node:crypto";
import type { Conversation } from "./records";
import type { Store } from "./store";

type Env = Record<string, string | undefined>;
type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

/** What the visitor is told when live chat is on. Never a promised response time. */
export const LIVE_NOTE =
  "A person from the team can reply right here in this chat, and by email if you have gone.";

export function telegramConfigured(env: Env = process.env): boolean {
  return Boolean(env.TELEGRAM_BOT_TOKEN?.trim() && env.TELEGRAM_CHAT_ID?.trim());
}

/** The webhook secret Telegram sends back: derived from the token, never stored or shown. */
export function webhookSecret(env: Env = process.env): string {
  const token = env.TELEGRAM_BOT_TOKEN?.trim() ?? "";
  return crypto
    .createHmac("sha256", token)
    .update("dechy-telegram-webhook")
    .digest("hex")
    .slice(0, 48);
}

/** Constant-time comparison of the header Telegram sent with the expected secret. */
export function validWebhook(header: string | null, env: Env = process.env): boolean {
  if (!header || !telegramConfigured(env)) return false;
  const a = Buffer.from(header);
  const b = Buffer.from(webhookSecret(env));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

async function call<T>(
  method: string,
  body: Record<string, unknown>,
  env: Env,
  fetchImpl: FetchLike,
): Promise<T | null> {
  const token = env.TELEGRAM_BOT_TOKEN?.trim();
  if (!token) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetchImpl(`https://api.telegram.org/bot${token}/${method}`, {
      method: "POST",
      signal: controller.signal,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const j = (await res.json().catch(() => null)) as { ok?: boolean; result?: T } | null;
    return j?.ok ? (j.result ?? null) : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Posts text to the team chat; returns the Telegram message id, or null. Never throws. */
export async function sendToTeam(
  text: string,
  opts: { replyTo?: number } = {},
  env: Env = process.env,
  fetchImpl: FetchLike = fetch,
): Promise<number | null> {
  const chat = env.TELEGRAM_CHAT_ID?.trim();
  if (!chat) return null;
  const r = await call<{ message_id: number }>(
    "sendMessage",
    {
      chat_id: chat,
      text: text.slice(0, 4000),
      disable_web_page_preview: true,
      ...(opts.replyTo
        ? { reply_parameters: { message_id: opts.replyTo, allow_sending_without_reply: true } }
        : {}),
    },
    env,
    fetchImpl,
  );
  return r?.message_id ?? null;
}

/* Which conversation a Telegram message belongs to, so a reply finds its way back. */
const mapKey = (messageId: number) => `telegram/msg/${messageId}`;

export type LiveLink = { conversationId: string; ref: string };

export async function linkMessage(store: Store, messageId: number, link: LiveLink) {
  await store.set(mapKey(messageId), link);
}

export async function linkedConversation(store: Store, messageId: number) {
  return store.get<LiveLink>(mapKey(messageId));
}

const clean = (s: string, n: number) => s.replace(/\s+/g, " ").trim().slice(0, n);

/** The conversation so far, as plain lines (the newest kept when it is long). */
export function transcript(c: Conversation, max = 3000): string {
  const who = (r: string) =>
    r === "visitor" ? "Visitor" : r === "team" ? "DECHY team" : "Assistant";
  const lines = c.messages
    .filter((m) => m.kind !== "handoff" && m.text.trim())
    .map((m) => `${who(m.role)}: ${clean(m.text, 600)}`);
  let out = lines.join("\n");
  while (out.length > max && lines.length > 1) {
    lines.shift();
    out = `(earlier messages left out)\n${lines.join("\n")}`;
  }
  return out;
}

/** The first message of a live chat: who, where, the conversation, and how to reply. */
export function liveChatOpening(c: Conversation, name: string, ref: string, page: string): string {
  return [
    `Live chat from the website: ${clean(name, 80)} (${ref})`,
    page ? `Page: ${clean(page, 160)}` : null,
    "",
    transcript(c),
    "",
    "Reply to this message to answer in the visitor's chat. They also left an email, so you can follow up there later.",
  ]
    .filter((l) => l !== null)
    .join("\n");
}

/** Points the bot's webhook at this site (DECHY Admin, "Connect Telegram replies"). */
export async function connectWebhook(env: Env = process.env, fetchImpl: FetchLike = fetch) {
  const origin = (env.SITE_ORIGIN ?? "").trim().replace(/\/$/, "");
  if (!/^https:\/\//.test(origin))
    return { ok: false, message: "SITE_ORIGIN must be a public https address." };
  const r = await call<boolean>(
    "setWebhook",
    {
      url: `${origin}/api/telegram/`,
      secret_token: webhookSecret(env),
      allowed_updates: ["message"],
      drop_pending_updates: true,
    },
    env,
    fetchImpl,
  );
  return r
    ? { ok: true, message: "Telegram replies are connected." }
    : { ok: false, message: "Telegram did not accept the webhook. Check the bot token." };
}

/** Whether the webhook points here, and the last error Telegram reported. */
export async function webhookStatus(env: Env = process.env, fetchImpl: FetchLike = fetch) {
  const info = await call<{
    url?: string;
    last_error_message?: string;
    pending_update_count?: number;
  }>("getWebhookInfo", {}, env, fetchImpl);
  const origin = (env.SITE_ORIGIN ?? "").trim().replace(/\/$/, "");
  return {
    configured: telegramConfigured(env),
    connected: Boolean(info?.url && info.url === `${origin}/api/telegram/`),
    lastError: info?.last_error_message ?? "",
  };
}
