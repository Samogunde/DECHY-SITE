import { z } from "zod";
import { aiConfigured, summarize, wantsHuman, type Turn } from "@/lib/assistant/engine";
import { byId } from "@/lib/assistant/knowledge";
import { prefill } from "@/lib/assistant/session";
import { aiAllowed } from "@/lib/server/ai-budget";
import { fail, json, readJson } from "@/lib/server/http";
import { recordHandoff } from "@/lib/server/intake";
import { clientAddress, overLimit } from "@/lib/server/ratelimit";
import {
  Repo,
  type Conversation,
  type FieldSource,
  type HandoffContext,
} from "@/lib/server/records";
import { getStore } from "@/lib/server/store";
import { notify } from "@/lib/server/events";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Prepare = z.object({
  action: z.literal("prepare"),
  conversationId: z.string().uuid().optional(),
  page: z.string().max(200).optional(),
});

const Confirm = z.object({
  action: z.literal("confirm"),
  conversationId: z.string().uuid().optional(),
  page: z.string().max(200).optional(),
  name: z.string().trim().min(2, "Please enter your name.").max(120),
  email: z.string().trim().email("Please enter a valid email address.").max(200),
  organization: z.string().trim().max(160).optional().default(""),
  note: z.string().trim().max(2000).optional().default(""),
  /** Only what the visitor states: a checkbox, never inferred. */
  timeSensitive: z.boolean().optional().default(false),
  /** New project or existing work, when the visitor chose it in the card. */
  kind: z.enum(["new", "existing"]).optional(),
  /** How the visitor got here: the header button, the assistant's offer, a message, or the contact page. */
  via: z.enum(["header", "offer", "message", "contact"]).optional(),
  website: z.string().max(200).optional(),
});

const REASON: Record<string, string> = {
  offer: "The assistant could not place the request and offered the team; the visitor accepted",
  message: "The visitor asked for a person in the conversation",
  contact: "The visitor chose to speak to someone on the contact page",
  header: "The visitor asked to talk to the team",
};

const safePage = (p: string | undefined) => (p && /^\/[a-z0-9/-]*$/i.test(p) ? p : "");

async function load(repo: Repo, id: string | undefined): Promise<Conversation | null> {
  try {
    return id ? await repo.getConversation(id) : null;
  } catch {
    return null;
  }
}

/**
 * Talking to the team, without leaving the conversation.
 *   prepare   the visitor asked for a person: mark the conversation PERSON REQUESTED (kept even if
 *             they never finish) and return what we already know for the inline card
 *   confirm   the visitor reviewed the card and gave an email: create the record (Inquiry for new
 *             business, Support Request for an existing client), link the conversation, notify
 */
export async function POST(request: Request) {
  const raw = await readJson(request, 8 * 1024);
  if (raw instanceof Response) return raw;
  const store = getStore();
  const repo = new Repo(store);
  const client = clientAddress(request.headers);

  if ((raw as { action?: string })?.action === "prepare") {
    const p = Prepare.safeParse(raw);
    if (!p.success) return fail(400, "bad_request", "Invalid request.");
    if (await overLimit(store, "handoff-prepare", client, 20, 10 * 60 * 1000))
      return fail(
        429,
        "rate_limited",
        "Too many requests. Please wait a few minutes and try again.",
      );
    const conv = await load(repo, p.data.conversationId);
    if (conv && !conv.personRequestedAt) {
      conv.personRequestedAt = new Date().toISOString();
      conv.handoffPage = safePage(p.data.page);
      try {
        await repo.saveConversation(conv);
        await repo.logActivity({
          type: "person.requested",
          ref: null,
          summary: "A visitor asked DECHY AI to talk to the team",
          actor: "visitor",
        });
        // Alert at once: the visitor may still be on the site while the team picks it up.
        await notify({
          type: "person.requested",
          ref: null,
          title: "A visitor asked DECHY AI for a person",
          actor: "visitor",
          page: conv.handoffPage,
          adminPath: `/admin/conversations/${conv.id}/`,
        });
      } catch {
        // the card still works without storage
      }
    }
    return json({ ok: true, prefill: prefill(conv), handoffRef: conv?.supportRef ?? null });
  }

  const parsed = Confirm.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) {
      const k = String(i.path[0] ?? "form");
      if (!errors[k]) errors[k] = i.message;
    }
    return json({ ok: false, code: "invalid", errors }, 400);
  }
  const d = parsed.data;
  if (d.website) return json({ ok: true, ref: "" });
  if (await overLimit(store, "handoff", client, 5, 10 * 60 * 1000))
    return fail(429, "rate_limited", "Too many requests. Please wait a few minutes and try again.");

  const conv = await load(repo, d.conversationId);
  if (conv?.supportRef) return json({ ok: true, ref: conv.supportRef, kind: "existing-handoff" });
  const page = safePage(d.page);
  const history: Turn[] = conv
    ? conv.messages.filter((m) => m.kind !== "handoff").map((m) => ({ role: m.role, text: m.text }))
    : [];
  const service = conv?.recommendedService ? byId(conv.recommendedService) : undefined;
  const solution = conv?.recommendedSolution ? byId(conv.recommendedSolution) : undefined;
  const allowAI = aiConfigured() && (await aiAllowed(store, client));
  const summary = await summarize(
    history,
    {
      need: conv?.detectedNeed ?? "",
      suggested: [service?.name, solution?.name].filter(Boolean).join(", "),
    },
    allowAI,
  );
  const known = conv?.extracted ?? {};
  const source = (field: "name" | "email" | "organization", value: string): FieldSource =>
    known[field] && known[field]!.value.toLowerCase() === value.toLowerCase()
      ? "conversation"
      : "visitor";
  const visitorMsgs = conv ? conv.messages.filter((m) => m.role === "visitor") : [];
  const keyMessages = [
    visitorMsgs[0]?.text,
    visitorMsgs.find((m) => wantsHuman(m.text))?.text,
    visitorMsgs.at(-1)?.text,
  ]
    .filter((t, i, a): t is string => Boolean(t) && a.indexOf(t) === i)
    .map((t) => t.slice(0, 600));
  const handoff: HandoffContext = {
    conversationId: conv?.id ?? null,
    summary,
    fieldSources: {
      name: source("name", d.name),
      email: source("email", d.email),
      ...(d.organization ? { organization: source("organization", d.organization) } : {}),
      ...(conv?.detectedNeed ? { need: "conversation" as const } : {}),
      ...(service ? { service: "conversation" as const } : {}),
    },
    startPage: conv?.startPage ?? page,
    handoffPage: conv?.handoffPage || page,
    reason:
      REASON[d.via ?? (visitorMsgs.some((m) => wantsHuman(m.text)) ? "message" : "header")] ??
      REASON.header!,
    detectedNeed: conv?.detectedNeed ?? "",
    recommendedService: service?.name ?? "",
    recommendedSolution: solution?.name ?? "",
    urgency: d.timeSensitive ? "stated" : "not-stated",
    keyMessages,
  };
  const kind = d.kind ?? (conv?.intent === "existing" ? "existing" : "new");
  // Someone who asks for the team before chatting still gets a thread, so anything they add
  // afterwards attaches to the same record.
  const chatted = Boolean(conv?.messages.some((m) => m.role === "visitor"));
  let thread = conv;
  if (!thread) {
    try {
      thread = await repo.createConversation("guided", page);
    } catch {
      thread = null;
    }
  }
  handoff.conversationId = thread?.id ?? null;

  try {
    const result = await recordHandoff(
      {
        kind,
        fromConversation: chatted,
        name: d.name,
        email: d.email,
        organization: d.organization,
        note: d.note,
        handoff,
      },
      repo,
    );
    const conv = thread;
    if (conv && result.ref) {
      const at = new Date().toISOString();
      conv.status = "escalated";
      conv.supportRef = result.ref;
      conv.summary = summary.need;
      conv.intent = kind;
      conv.personRequestedAt ??= at;
      conv.handoffPage ||= page;
      conv.extracted.email = { value: d.email, source: source("email", d.email) };
      conv.extracted.name = { value: d.name, source: source("name", d.name) };
      if (d.organization)
        conv.extracted.organization = {
          value: d.organization,
          source: source("organization", d.organization),
        };
      conv.messages.push({
        role: "assistant",
        kind: "handoff",
        at,
        text: `Sent to the DECHY team. Your reference is ${result.ref}. A person will reply by email.`,
      });
      await repo.saveConversation(conv);
    }
    return json({
      ok: true,
      ref: result.ref,
      kind: result.kind,
      conversationId: thread?.id ?? null,
    });
  } catch {
    return fail(
      503,
      "unavailable",
      "We could not pass this on right now. Please try again shortly, or use the contact form.",
    );
  }
}

export function GET() {
  return new Response(null, {
    status: 405,
    headers: { Allow: "POST", "Cache-Control": "no-store" },
  });
}
