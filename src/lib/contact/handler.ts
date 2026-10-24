/**
 * Contact request handler: all the policy lives here so it can be unit tested. The route file only
 * wires it to Next.js. Defenses: JSON content type, same-origin check, body size cap, per-client
 * rate limit, honeypot, minimum fill time, server-side validation, no-store responses.
 */
import { deliver, type DeliveryResult } from "./deliver";
import { MIN_FILL_MS, validateContact, type FieldErrors } from "./validate";

export type ContactResponse =
  | { status: 200; body: { ok: true; ref?: string } }
  | { status: 400; body: { ok: false; code: "invalid"; errors: FieldErrors } }
  | { status: 400; body: { ok: false; code: "too_fast" | "bad_request"; message: string } }
  | { status: 403; body: { ok: false; code: "forbidden"; message: string } }
  | { status: 413; body: { ok: false; code: "too_large"; message: string } }
  | { status: 415; body: { ok: false; code: "unsupported"; message: string } }
  | { status: 429; body: { ok: false; code: "rate_limited"; message: string } }
  | { status: 503; body: { ok: false; code: "delivery_unavailable"; message: string } }
  | { status: 502; body: { ok: false; code: "delivery_failed"; message: string } };

export type HandlerDeps = {
  now: () => number;
  deliver: (data: Parameters<typeof deliver>[0], ref?: string) => Promise<DeliveryResult>;
  /**
   * Saves the inquiry in the DECHY data layer (the source of truth for DECHY Admin) and returns
   * its reference, or null when storage is unavailable. When it succeeds, the visitor gets the
   * reference even if email delivery is not configured yet.
   */
  record?: (data: Parameters<typeof deliver>[0]) => Promise<{ ref: string } | null>;
  /** Allowed "What can we help with?" values (service names and "Not sure yet"). */
  interests?: readonly string[];
  /**
   * Shared rate limit across serverless instances (true when over the limit). The in-memory
   * window below still applies on its own.
   */
  overLimit?: (client: string) => Promise<boolean>;
  /** The Netlify Forms copy of the lead (email notification, dashboard, CSV export). */
  forward?: (
    data: Parameters<typeof deliver>[0],
    ref?: string,
  ) => Promise<{ ok: boolean; skipped?: boolean }>;
};

const MAX_BODY = 16 * 1024;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

/**
 * Best-effort in-memory limiter. On serverless hosts each instance has its own memory, so this
 * only slows naive abuse; a platform-level rate limit should back it up in production.
 */
const hits = new Map<string, number[]>();

export function resetRateLimit() {
  hits.clear();
}

function limited(key: string, now: number): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  return false;
}

export function clientKey(headers: Headers): string {
  return (
    headers.get("x-nf-client-connection-ip") ??
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

export function sameOrigin(headers: Headers, allowedOrigin: string): boolean {
  const origin = headers.get("origin");
  if (!origin) return true; // non-browser callers; the JSON content-type requirement still applies
  try {
    const host = new URL(origin).host;
    return host === headers.get("host") || host === new URL(allowedOrigin).host;
  } catch {
    return false;
  }
}

export async function handleContact(
  req: { headers: Headers; text: () => Promise<string> },
  allowedOrigin: string,
  deps: HandlerDeps,
): Promise<ContactResponse> {
  const ct = req.headers.get("content-type") ?? "";
  if (!ct.toLowerCase().startsWith("application/json")) {
    return {
      status: 415,
      body: { ok: false, code: "unsupported", message: "Unsupported content type." },
    };
  }
  if (!sameOrigin(req.headers, allowedOrigin)) {
    return { status: 403, body: { ok: false, code: "forbidden", message: "Request not allowed." } };
  }
  const now = deps.now();
  const client = clientKey(req.headers);
  if (
    limited(client, now) ||
    (deps.overLimit && (await deps.overLimit(client).catch(() => false)))
  ) {
    return {
      status: 429,
      body: {
        ok: false,
        code: "rate_limited",
        message: "Too many attempts. Please try again later.",
      },
    };
  }

  const text = await req.text();
  if (text.length > MAX_BODY) {
    return {
      status: 413,
      body: { ok: false, code: "too_large", message: "That message is too large." },
    };
  }
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { status: 400, body: { ok: false, code: "bad_request", message: "Invalid request." } };
  }

  const result = validateContact(raw, deps.interests);
  if (!result.ok) {
    return { status: 400, body: { ok: false, code: "invalid", errors: result.errors } };
  }
  const data = result.data;

  // Honeypot: pretend success so bots learn nothing; deliver nothing.
  if (data.website) return { status: 200, body: { ok: true } };

  if (!data.startedAt || now - data.startedAt < MIN_FILL_MS) {
    return {
      status: 400,
      body: { ok: false, code: "too_fast", message: "Please take a moment and try again." },
    };
  }

  let stored: { ref: string } | null = null;
  if (deps.record) {
    try {
      stored = await deps.record(data);
    } catch {
      stored = null;
    }
  }
  const delivered = await deps.deliver(data, stored?.ref);
  const forwarded = deps.forward
    ? await deps.forward(data, stored?.ref).catch(() => ({ ok: false }))
    : { ok: false };
  if (stored) return { status: 200, body: { ok: true, ref: stored.ref } };
  if (delivered.ok || forwarded.ok) return { status: 200, body: { ok: true } };
  if (delivered.reason === "unconfigured") {
    return {
      status: 503,
      body: {
        ok: false,
        code: "delivery_unavailable",
        message: "Messages cannot be delivered right now. Please try again later.",
      },
    };
  }
  return {
    status: 502,
    body: {
      ok: false,
      code: "delivery_failed",
      message: "Your message could not be sent. Please try again in a few minutes.",
    },
  };
}
