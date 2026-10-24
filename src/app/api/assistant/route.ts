import { after } from "next/server";
import { z } from "zod";
import {
  aiConfigured,
  turnsOf,
  MAX_MESSAGE,
  MAX_TURNS,
  recommendationLinks,
  respond,
  sourceLinks,
  type AssistantResult,
  type Turn,
} from "@/lib/assistant/engine";
import { pageContext } from "@/lib/assistant/knowledge";
import { applyTurn, prefill } from "@/lib/assistant/session";
import { aiAllowed, recordUsage } from "@/lib/server/ai-budget";
import { fail, json, NO_STORE, readJson } from "@/lib/server/http";
import { maybeMaintain } from "@/lib/server/maintenance";
import { clientAddress, overLimit } from "@/lib/server/ratelimit";
import { Repo, type Conversation } from "@/lib/server/records";
import { getStore } from "@/lib/server/store";
import { linkMessage, sendToTeam, telegramConfigured } from "@/lib/server/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  conversationId: z.string().uuid().optional(),
  message: z.string().trim().min(1).max(MAX_MESSAGE),
  /** The path the visitor is on; mapped server-side to a known page or ignored. */
  page: z.string().max(200).optional(),
  /** Honeypot. */
  website: z.string().max(200).optional(),
});

/** Work after the response (retention). Outside a Next.js request (unit tests) it runs detached. */
function later(task: () => Promise<void>) {
  try {
    after(task);
  } catch {
    void task();
  }
}

const safePage = (p: string | undefined) => (p && /^\/[a-z0-9/-]*$/i.test(p) ? p : "");

/**
 * Page awareness: GET /api/assistant/?page=/cloud/ returns the context for the optional suggestion
 * in the first state, and whether real AI answers are on. Conversations are read and reopened
 * through POST /api/assistant/conversations/ (ids in the body, never in a URL).
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = safePage(url.searchParams.get("page") ?? undefined);
  return Response.json(
    { ok: true, ai: aiConfigured(), page: pageContext(page) },
    { headers: NO_STORE },
  );
}

type Payload = {
  ok: true;
  conversationId?: string;
  reply: string;
  mode: AssistantResult["mode"];
  recommendations: ReturnType<typeof recommendationLinks>;
  sources: ReturnType<typeof sourceLinks>;
  offerHuman: boolean;
  humanRequested: boolean;
  handoffRef: string | null;
  handoff?: ReturnType<typeof prefill>;
  suggestions: string[];
  /** Pages the answer came from. */
  links: AssistantResult["links"];
  /** Live chat: the message went to the team, with no automated reply. */
  forwarded?: boolean;
};

/** One visitor message in, one reply out. Streams (server-sent events) when the client asks. */
export async function POST(request: Request) {
  const raw = await readJson(request, 8 * 1024);
  if (raw instanceof Response) return raw;
  const parsed = Body.safeParse(raw);
  if (!parsed.success)
    return fail(400, "invalid", `Please write a message of up to ${MAX_MESSAGE} characters.`);
  const { message, website } = parsed.data;
  const page = safePage(parsed.data.page);
  if (website)
    return json({
      ok: true,
      reply: "Thank you.",
      recommendations: [],
      sources: [],
      mode: "guided",
    });

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
  const history: Turn[] = conv ? turnsOf(conv.messages) : [];
  if (history.filter((t) => t.role === "visitor").length >= MAX_TURNS)
    return json({
      ok: true,
      conversationId: conv?.id,
      reply:
        "We have covered a lot here. The DECHY team can take it from this point: talk to the team, or start a new topic.",
      mode: "guided",
      recommendations: [],
      sources: [],
      offerHuman: true,
      humanRequested: false,
      handoffRef: conv?.supportRef ?? null,
      suggestions: [],
    });

  // After a handoff with live chat on, the visitor is talking to the team: the message goes to the
  // team's Telegram, and no automated reply is added.
  if (conv?.supportRef && telegramConfigured()) {
    const ref = conv.supportRef;
    conv.messages.push({
      role: "visitor",
      text: message,
      at: new Date().toISOString(),
      page,
      afterHandoff: true,
    });
    conv.lastPage = page || conv.lastPage;
    try {
      await repo.saveConversation(conv);
      await repo.markFollowUp(ref);
    } catch {
      // the message still reaches the team
    }
    const name = conv.extracted.name?.value ?? "Visitor";
    const id = await sendToTeam(`${name} (${ref}): ${message}`);
    if (id) await linkMessage(store, id, { conversationId: conv.id, ref }).catch(() => undefined);
    const live: Payload = {
      ok: true,
      conversationId: conv.id,
      reply: "",
      mode: conv.mode,
      recommendations: [],
      sources: [],
      links: [],
      offerHuman: false,
      humanRequested: false,
      handoffRef: ref,
      suggestions: [],
      forwarded: true,
    };
    return json(live);
  }

  const allowAI = aiConfigured() && (await aiAllowed(store, client));
  const streaming = (request.headers.get("accept") ?? "").includes("text/event-stream");

  const pending: Promise<void>[] = [];
  const finish = async (result: AssistantResult): Promise<Payload> => {
    await Promise.all(pending);
    try {
      if (!conv) conv = await repo.createConversation(result.mode, page);
      applyTurn(conv, message, result, page, new Date().toISOString());
      await repo.saveConversation(conv);
      if (conv.supportRef) await repo.markFollowUp(conv.supportRef);
      if (result.humanRequested)
        await repo.logActivity({
          type: "person.requested",
          ref: null,
          summary: "A visitor asked DECHY AI to talk to the team",
          actor: "visitor",
        });
    } catch {
      // Storage problems never block the visitor's answer.
    }
    return {
      ok: true,
      conversationId: conv?.id,
      reply: result.reply,
      mode: result.mode,
      recommendations: recommendationLinks(result.recommendations, result.reasons),
      sources: result.recommendations.length ? sourceLinks(result.sources) : [],
      offerHuman: result.offerHuman,
      humanRequested: result.humanRequested,
      handoffRef: conv?.supportRef ?? null,
      suggestions: result.suggestions,
      links: result.links,
      ...(result.humanRequested ? { handoff: prefill(conv) } : {}),
    };
  };

  const ctx = {
    page: pageContext(page),
    handoffRef: conv?.supportRef ?? null,
    allowAI,
    // What earlier turns established (never the current page).
    known: conv ? { service: conv.recommendedService, need: conv.detectedNeed } : null,
    onUsage: (u: { input: number; output: number }) => {
      pending.push(recordUsage(store, client, u));
    },
  };

  if (!streaming) {
    const payload = await finish(await respond(message, history, ctx));
    later(() => maybeMaintain(store));
    return json(payload);
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) =>
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      try {
        send("start", { mode: allowAI ? "ai" : "guided" });
        const result = await respond(message, history, {
          ...ctx,
          onDelta: (text) => send("delta", { text }),
        });
        send("done", await finish(result));
        // Retention runs after the response is complete, never holding the stream open.
        later(() => maybeMaintain(store));
      } catch {
        send("error", {
          message: "The assistant is not available right now. You can still talk to the team.",
        });
      } finally {
        controller.close();
      }
    },
  });
  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-store, no-transform",
      "x-accel-buffering": "no",
    },
  });
}
