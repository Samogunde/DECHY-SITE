/**
 * Conversation session helpers for the assistant routes. The server holds the conversation; the
 * browser keeps only its id for the session (sessionStorage) and asks for this visitor-safe view
 * to continue on another page. Server-only.
 */
import type { Conversation, Extracted } from "@/lib/server/records";
import { recommendationLinks, sourceLinks, type AssistantResult, type Extraction } from "./engine";
import { byId } from "./knowledge";

/** What the visitor may see of their own conversation (no internal fields, no summary). */
export function visitorView(c: Conversation) {
  return {
    id: c.id,
    mode: c.mode,
    messages: c.messages.map((m) => ({
      role: m.role,
      text: m.text,
      kind: m.kind ?? "message",
      afterHandoff: Boolean(m.afterHandoff),
      recommendations: m.recommendations
        ? recommendationLinks(m.recommendations, m.reasons ?? {})
        : [],
      sources: m.sources ? sourceLinks(m.sources) : [],
    })),
    handoffRef: c.supportRef,
    personRequested: Boolean(c.personRequestedAt),
  };
}

export type Prefill = {
  name: Extracted | null;
  email: Extracted | null;
  organization: Extracted | null;
  need: string;
  service: string;
  intent: Conversation["intent"];
};

/** What the handoff card shows: what the visitor already told us, marked with where it came from. */
export function prefill(c: Conversation | null): Prefill {
  const firstVisitor = c?.messages.find((m) => m.role === "visitor" && !m.afterHandoff)?.text ?? "";
  return {
    name: c?.extracted.name ?? null,
    email: c?.extracted.email ?? null,
    organization: c?.extracted.organization ?? null,
    need: c?.detectedNeed || firstVisitor.slice(0, 160),
    service: c?.recommendedService ? (byId(c.recommendedService)?.name ?? "") : "",
    intent: c?.intent ?? "unclear",
  };
}

/** Merges details the visitor stated in this turn. Later statements replace earlier ones. */
export function mergeExtraction(c: Conversation, e: Extraction) {
  for (const k of ["name", "email", "organization"] as const) {
    const v = e[k];
    if (v) c.extracted[k] = { value: v, source: "conversation" };
  }
  if (e.intent && c.intent !== "existing") c.intent = e.intent;
}

/** Records one exchange on the conversation. */
export function applyTurn(
  c: Conversation,
  message: string,
  r: AssistantResult,
  page: string,
  at: string,
) {
  const after = Boolean(c.supportRef);
  c.mode = r.mode;
  c.lastPage = page || c.lastPage;
  c.messages.push({
    role: "visitor",
    text: message,
    at,
    page,
    ...(after ? { afterHandoff: true } : {}),
  });
  c.messages.push({
    role: "assistant",
    text: r.reply,
    at,
    recommendations: r.recommendations,
    reasons: r.reasons,
    sources: r.sources,
    ...(after ? { afterHandoff: true } : {}),
  });
  if (r.need) c.detectedNeed = r.need;
  if (r.service) c.recommendedService = r.service;
  if (r.solution) c.recommendedSolution = r.solution;
  mergeExtraction(c, r.extracted);
  if (r.humanRequested && !c.personRequestedAt) {
    c.personRequestedAt = at;
    c.handoffPage = page;
  }
}
