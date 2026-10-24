import { z } from "zod";
import { historyItem, visitorView } from "@/lib/assistant/session";
import { fail, json, readJson } from "@/lib/server/http";
import { clientAddress, overLimit } from "@/lib/server/ratelimit";
import { Repo } from "@/lib/server/records";
import { getStore } from "@/lib/server/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Id = z.string().uuid();
const Body = z.discriminatedUnion("action", [
  /** The history list: titles and states for the ids this browser holds. */
  z.object({ action: z.literal("list"), ids: z.array(Id).max(20) }),
  /** Reopen one conversation (the visitor's own, by its id). */
  z.object({ action: z.literal("open"), conversationId: Id }),
  /** The visitor went quiet (inactive) or started a new chat (closed). */
  z.object({
    action: z.literal("state"),
    conversationId: Id,
    state: z.enum(["inactive", "closed"]),
  }),
  /** Live chat: team replies (from Telegram) written after the given time. */
  z.object({ action: z.literal("poll"), conversationId: Id, after: z.string().max(40) }),
]);

/**
 * A visitor's own conversations. There are no accounts: a conversation id is a random, unguessable
 * id that only the visitor's browser holds, and it is the only way to read that conversation. Ids
 * travel in the request body (never in a URL), so they do not end up in links or logs. Expired
 * conversations simply stop being returned, and the browser drops them from its list.
 */
export async function POST(request: Request) {
  const raw = await readJson(request, 4 * 1024);
  if (raw instanceof Response) return raw;
  const parsed = Body.safeParse(raw);
  if (!parsed.success) return fail(400, "invalid", "Invalid request.");
  const store = getStore();
  // Live chat polls every few seconds while open, so it has its own, larger allowance.
  const poll = parsed.data.action === "poll";
  if (
    await overLimit(
      store,
      poll ? "conversation-poll" : "conversations",
      clientAddress(request.headers),
      poll ? 400 : 120,
      10 * 60 * 1000,
    )
  )
    return fail(429, "rate_limited", "Too many requests. Please wait a few minutes and try again.");
  const repo = new Repo(store);
  const body = parsed.data;
  try {
    if (body.action === "list") {
      const found = await Promise.all(body.ids.map((id) => repo.getConversation(id)));
      const items = found
        .filter((c): c is NonNullable<typeof c> => c !== null && c.messages.length > 0)
        .map(historyItem)
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
      return json({ ok: true, items });
    }
    const conv = await repo.getConversation(body.conversationId);
    if (!conv) return json({ ok: true, conversation: null });
    if (body.action === "open") return json({ ok: true, conversation: visitorView(conv) });
    if (body.action === "poll")
      return json({
        ok: true,
        replies: conv.messages
          .filter((m) => m.role === "team" && m.at > body.after)
          .map((m) => ({ text: m.text, at: m.at })),
      });
    // Idle states never touch a conversation that was handed to the team.
    if (!conv.supportRef && conv.status !== "escalated" && conv.status !== body.state) {
      conv.status = body.state;
      await repo.saveConversation(conv);
    }
    return json({ ok: true, conversation: { id: conv.id, state: visitorView(conv).state } });
  } catch {
    return fail(503, "unavailable", "Conversations are not available right now.");
  }
}

export function GET() {
  return new Response(null, {
    status: 405,
    headers: { Allow: "POST", "Cache-Control": "no-store" },
  });
}
