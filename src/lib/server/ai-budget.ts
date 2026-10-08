/**
 * AI cost and abuse boundary. Before each model call: the site-wide daily call and output-token
 * budget, and a per-visitor daily allowance, must have room. When either is spent the assistant
 * answers in guided mode (and says so honestly). Usage is recorded per day without any personal
 * data; the first time a day's budget runs out, an activity entry tells the team. Server-only.
 *
 *   AI_DAILY_CALL_LIMIT          default 500 model calls per day (UTC), all visitors
 *   AI_DAILY_OUTPUT_TOKEN_LIMIT  default 300000 output tokens per day
 *   AI_VISITOR_DAILY_LIMIT       default 40 AI answers per visitor per day
 */
import { overLimit, peekLimit } from "./ratelimit";
import { Repo } from "./records";
import type { Store } from "./store";

type Env = Record<string, string | undefined>;

export type Usage = {
  calls: number;
  inputTokens: number;
  outputTokens: number;
  budgetReached?: boolean;
};

const num = (v: string | undefined, d: number) => {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : d;
};

export function limits(env: Env = process.env) {
  return {
    calls: num(env.AI_DAILY_CALL_LIMIT, 500),
    outputTokens: num(env.AI_DAILY_OUTPUT_TOKEN_LIMIT, 300_000),
    perVisitor: num(env.AI_VISITOR_DAILY_LIMIT, 40),
  };
}

const day = (now: number) => new Date(now).toISOString().slice(0, 10);
const usageKey = (now: number) => `usage/ai/${day(now)}`;

export async function todayUsage(store: Store, now = Date.now()): Promise<Usage> {
  try {
    return (await store.get<Usage>(usageKey(now))) ?? { calls: 0, inputTokens: 0, outputTokens: 0 };
  } catch {
    return { calls: 0, inputTokens: 0, outputTokens: 0 };
  }
}

/** True when this visitor may get an AI answer now (site budget and their own allowance). */
export async function aiAllowed(
  store: Store,
  client: string,
  env: Env = process.env,
  now = Date.now(),
): Promise<boolean> {
  const l = limits(env);
  const u = await todayUsage(store, now);
  if (u.calls >= l.calls || u.outputTokens >= l.outputTokens) {
    if (!u.budgetReached) {
      try {
        await store.set(usageKey(now), { ...u, budgetReached: true });
        await new Repo(store).logActivity({
          type: "ai.budget_reached",
          ref: null,
          summary:
            "The daily AI budget was reached; the assistant is answering in guided mode until tomorrow",
          actor: "system",
        });
      } catch {
        // best effort
      }
    }
    return false;
  }
  return !(await peekLimit(store, "ai-visitor-day", client, l.perVisitor, 86_400_000, now));
}

/** Records one model call against the site budget and the visitor's allowance. */
export async function recordUsage(
  store: Store,
  client: string,
  tokens: { input: number; output: number },
  env: Env = process.env,
  now = Date.now(),
): Promise<void> {
  try {
    const u = await todayUsage(store, now);
    await store.set(usageKey(now), {
      ...u,
      calls: u.calls + 1,
      inputTokens: u.inputTokens + tokens.input,
      outputTokens: u.outputTokens + tokens.output,
    });
  } catch {
    // usage accounting must never break an answer
  }
  await overLimit(store, "ai-visitor-day", client, limits(env).perVisitor, 86_400_000, now);
}
