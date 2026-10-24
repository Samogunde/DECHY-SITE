import { conversationIdOf, Repo } from "@/lib/server/records";
import { getStore } from "@/lib/server/store";
import { linkedConversation, sendToTeam, validWebhook } from "@/lib/server/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Update = {
  message?: {
    message_id: number;
    chat?: { id: number | string };
    text?: string;
    reply_to_message?: { message_id: number };
  };
};

const ok = () => new Response(null, { status: 200, headers: { "Cache-Control": "no-store" } });
const REF = /\b(DECHY-[A-Z0-9]{6})\b/;

/**
 * Telegram webhook: a team member's reply in the team chat goes to the visitor's chat window.
 * Only Telegram knows the secret header, and only the team chat (TELEGRAM_CHAT_ID) is heard. A reply
 * is matched to its conversation by the message it replies to, or by a reference at the start
 * ("DECHY-ABC123 your text"). Telegram always gets 200, so it never retries a message forever.
 */
export async function POST(request: Request) {
  if (!validWebhook(request.headers.get("x-telegram-bot-api-secret-token")))
    return new Response(null, { status: 401 });
  const update = (await request.json().catch(() => null)) as Update | null;
  const msg = update?.message;
  const text = msg?.text?.trim();
  if (!msg || !text || String(msg.chat?.id) !== (process.env.TELEGRAM_CHAT_ID ?? "").trim())
    return ok();
  if (text.startsWith("/")) {
    if (/^\/(start|help)\b/.test(text))
      await sendToTeam(
        "To answer a visitor, reply to their live chat message (swipe left on it, or long-press and choose Reply). You can also start a message with their reference, for example: DECHY-ABC123 Thanks, we can help.",
        { replyTo: msg.message_id },
      );
    return ok();
  }

  const store = getStore();
  const repo = new Repo(store);
  let conversationId: string | null = null;
  let body = text;
  if (msg.reply_to_message)
    conversationId =
      (await linkedConversation(store, msg.reply_to_message.message_id))?.conversationId ?? null;
  if (!conversationId) {
    const ref = REF.exec(text)?.[1];
    if (ref) {
      const record = await repo.getByRef(ref).catch(() => null);
      conversationId = record ? conversationIdOf(record) : null;
      body = text.replace(REF, "").replace(/^[\s:,-]+/, "");
    }
  }
  if (!conversationId || !body) {
    await sendToTeam(
      "Not delivered: reply to a visitor's live chat message, or start with their reference (DECHY-ABC123).",
      { replyTo: msg.message_id },
    );
    return ok();
  }
  const conv = await repo.getConversation(conversationId).catch(() => null);
  if (!conv) {
    await sendToTeam("Not delivered: that conversation has expired.", { replyTo: msg.message_id });
    return ok();
  }
  conv.messages.push({ role: "team", text: body.slice(0, 2000), at: new Date().toISOString() });
  await repo.saveConversation(conv);
  await sendToTeam("Delivered to the visitor's chat.", { replyTo: msg.message_id });
  return ok();
}

export function GET() {
  return new Response(null, {
    status: 405,
    headers: { Allow: "POST", "Cache-Control": "no-store" },
  });
}
