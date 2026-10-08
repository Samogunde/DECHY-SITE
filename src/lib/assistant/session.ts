/**
 * Conversation session helpers for the assistant routes. The server holds the conversation; the
 * browser keeps only its id for the session (sessionStorage) and asks for this visitor-safe view
 * to continue on another page. Server-only.
 */
import type { Conversation, Extracted } from "@/lib/server/records";
import {
  recommendationLinks,
  sourceLinks,
  wantsHuman,
  type AssistantResult,
  type Extraction,
} from "./engine";
import { classify, needFrom } from "./intent";
import { byId } from "./knowledge";

/** What the visitor sees about a conversation's state, in plain terms. */
export type VisitorState = "active" | "inactive" | "closed" | "handed-off";

export function visitorState(c: Conversation): VisitorState {
  if (c.supportRef || c.status === "escalated") return "handed-off";
  if (c.status === "inactive" || c.status === "closed") return c.status;
  return "active";
}

const tidy = (t: string) => {
  const s = t
    .replace(/^\s*(hi|hello|hey|good\s+\w+)[,!.\s]+/i, "")
    .replace(
      /^(i|we)(['\u2019]d| would)?\s+(really\s+)?(need|want|like|are looking for|am looking for|['\u2019]re looking for|have|run)\s+(to\s+)?/i,
      "",
    )
    .replace(/^(an?|the|some|our)\s+/i, "")
    .replace(/[.!?,;:]+$/, "")
    .trim();
  const capped = s.length <= 48 ? s : `${s.slice(0, s.lastIndexOf(" ", 46))}…`;
  return capped.charAt(0).toUpperCase() + capped.slice(1);
};

/**
 * A short title for the visitor's history list, from what they asked for: the first real need in
 * their own words, else a starting point they chose, else the solution or service it matched.
 * Greetings, questions about the assistant, and requests for a person never become the title.
 */
export function conversationTitle(c: Conversation): string {
  let starter = "";
  for (const m of c.messages) {
    if (m.role !== "visitor" || m.kind === "handoff" || wantsHuman(m.text)) continue;
    const intent = classify(m.text);
    if (intent.kind === "need") {
      const t = tidy(needFrom(m.text) || m.text);
      if (t.length >= 3) return t;
    }
    if (intent.kind === "definition") return tidy(intent.term);
    if (intent.kind === "starter" && !starter) starter = m.text;
  }
  if (starter) return tidy(starter);
  const known = byId(c.recommendedSolution) ?? byId(c.recommendedService);
  return known?.name ?? "New conversation";
}

/** One line of the visitor's history list (only conversations whose id this browser holds). */
export function historyItem(c: Conversation) {
  return {
    id: c.id,
    title: conversationTitle(c),
    updatedAt: c.updatedAt,
    state: visitorState(c),
    handoffRef: c.supportRef,
  };
}

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
    title: conversationTitle(c),
    state: visitorState(c),
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
  // Writing again reopens a paused or closed conversation (a handed-off one stays handed off).
  if (!after && c.status !== "escalated") c.status = "active";
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
