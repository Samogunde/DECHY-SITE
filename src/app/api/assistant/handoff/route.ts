import { z } from "zod";
import { byId } from "@/lib/assistant/knowledge";
import { summarize, type Turn } from "@/lib/assistant/engine";
import { recordSupport } from "@/lib/server/intake";
import { clientAddress, overLimit } from "@/lib/server/ratelimit";
import { Repo } from "@/lib/server/records";
import { fail, json, readJson } from "@/lib/server/http";
import { getStore } from "@/lib/server/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  conversationId: z.string().uuid().optional(),
  name: z.string().trim().min(2, "Please enter your name.").max(120),
  email: z.string().trim().email("Please enter a valid email address.").max(200),
  organization: z.string().trim().max(160).optional().default(""),
  message: z.string().trim().max(2000).optional().default(""),
  /** Only what the visitor states: a checkbox, never inferred. */
  timeSensitive: z.boolean().optional().default(false),
  /** Why the handoff happened. */
  reason: z.enum(["visitor-request", "assistant-suggested"]).default("visitor-request"),
  website: z.string().max(200).optional(),
});

/** A visitor asks for a person, from the assistant or directly. Creates a support request. */
export async function POST(request: Request) {
  const raw = await readJson(request, 8 * 1024);
  if (raw instanceof Response) return raw;
  const parsed = Body.safeParse(raw);
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

  const store = getStore();
  if (await overLimit(store, "handoff", clientAddress(request.headers), 5, 10 * 60 * 1000))
    return fail(429, "rate_limited", "Too many requests. Please wait a few minutes and try again.");

  const repo = new Repo(store);
  let history: Turn[] = [];
  let conv = null;
  try {
    conv = d.conversationId ? await repo.getConversation(d.conversationId) : null;
    history = conv ? conv.messages.map((m) => ({ role: m.role, text: m.text })) : [];
  } catch {
    conv = null;
  }
  const service = conv?.recommendedService ? byId(conv.recommendedService) : undefined;
  const solution = conv?.recommendedSolution ? byId(conv.recommendedSolution) : undefined;
  const summary = conv ? await summarize(history, { need: service?.name ?? "" }) : "";

  try {
    const result = await recordSupport(
      {
        origin: conv ? "assistant-escalation" : "visitor-request",
        channel: conv ? "assistant" : "human-support",
        name: d.name,
        email: d.email,
        organization: d.organization,
        message: d.message,
        conversationId: conv?.id ?? null,
        summary,
        detectedNeed: conv?.detectedNeed ?? "",
        recommendedService: service?.name ?? "",
        recommendedSolution: solution?.name ?? "",
        urgency: d.timeSensitive ? "stated" : "not-stated",
        escalationReason:
          d.reason === "assistant-suggested"
            ? "The assistant could not resolve the request and suggested a person"
            : "The visitor asked to speak to a person",
      },
      repo,
    );
    if (conv && result.ref) {
      conv.status = "escalated";
      conv.supportRef = result.ref;
      conv.summary = summary;
      await repo.saveConversation(conv);
    }
    return json({ ok: true, ref: result.ref });
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
