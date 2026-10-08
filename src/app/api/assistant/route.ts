import { z } from "zod";
import {
  MAX_MESSAGE,
  MAX_TURNS,
  recommendationLinks,
  respond,
  type Turn,
} from "@/lib/assistant/engine";
import { clientAddress, overLimit } from "@/lib/server/ratelimit";
import { Repo, type Conversation } from "@/lib/server/records";
import { fail, json, readJson } from "@/lib/server/http";
import { getStore } from "@/lib/server/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  conversationId: z.string().uuid().optional(),
  message: z.string().trim().min(1).max(MAX_MESSAGE),
  /** Honeypot. */
  website: z.string().max(200).optional(),
});

/** One visitor message in, one assistant reply out. The conversation is kept server-side. */
export async function POST(request: Request) {
  const raw = await readJson(request, 6 * 1024);
  if (raw instanceof Response) return raw;
  const parsed = Body.safeParse(raw);
  if (!parsed.success)
    return fail(400, "invalid", `Please write a message of up to ${MAX_MESSAGE} characters.`);
  const { message, website } = parsed.data;
  if (website) return json({ ok: true, reply: "Thank you.", recommendations: [], mode: "guided" });

  const store = getStore();
  const client = clientAddress(request.headers);
  if (await overLimit(store, "assistant", client, 30, 10 * 60 * 1000))
    return fail(429, "rate_limited", "Too many messages. Please wait a few minutes and try again.");

  const repo = new Repo(store);
  let conv: Conversation | null = null;
  try {
    conv = parsed.data.conversationId
      ? await repo.getConversation(parsed.data.conversationId)
      : null;
  } catch {
    conv = null;
  }
  const history: Turn[] = conv ? conv.messages.map((m) => ({ role: m.role, text: m.text })) : [];
  if (history.filter((t) => t.role === "visitor").length >= MAX_TURNS)
    return json({
      ok: true,
      conversationId: conv?.id,
      reply:
        "We have covered a lot here. The DECHY team can take it from this point: ask to talk to a person, or send the details through the contact form.",
      mode: "guided",
      recommendations: [],
      offerHuman: true,
      humanRequested: false,
    });

  const result = await respond(message, history);

  try {
    if (!conv) conv = await repo.createConversation(result.mode);
    const at = new Date().toISOString();
    conv.mode = result.mode;
    conv.messages.push({ role: "visitor", text: message, at });
    conv.messages.push({
      role: "assistant",
      text: result.reply,
      at,
      recommendations: result.recommendations,
    });
    if (result.need) conv.detectedNeed = result.need;
    if (result.service) conv.recommendedService = result.service;
    if (result.solution) conv.recommendedSolution = result.solution;
    await repo.saveConversation(conv);
  } catch {
    // Storage problems never block the visitor's answer; the conversation is just not kept.
  }

  return json({
    ok: true,
    conversationId: conv?.id,
    reply: result.reply,
    mode: result.mode,
    recommendations: recommendationLinks(result.recommendations),
    offerHuman: result.offerHuman,
    humanRequested: result.humanRequested,
  });
}

export function GET() {
  return new Response(null, {
    status: 405,
    headers: { Allow: "POST", "Cache-Control": "no-store" },
  });
}
