/**
 * Shared guards for public JSON endpoints: JSON content type, same origin, size cap, safe errors,
 * no-store responses. Visitors never see internal error details. Server-only.
 */
import { sameOrigin } from "@/lib/contact/handler";
import { siteOrigin } from "@/lib/site";

export const NO_STORE = { "Cache-Control": "no-store" } as const;

export function json(body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: NO_STORE });
}

export function fail(status: number, code: string, message: string): Response {
  return json({ ok: false, code, message }, status);
}

/** Reads a JSON body from a same-origin request, or returns the Response to send instead. */
export async function readJson(request: Request, maxBytes: number): Promise<unknown | Response> {
  const ct = request.headers.get("content-type") ?? "";
  if (!ct.toLowerCase().startsWith("application/json"))
    return fail(415, "unsupported", "Unsupported content type.");
  if (!sameOrigin(request.headers, siteOrigin()))
    return fail(403, "forbidden", "Request not allowed.");
  const text = await request.text();
  if (text.length > maxBytes) return fail(413, "too_large", "That message is too large.");
  try {
    return JSON.parse(text);
  } catch {
    return fail(400, "bad_request", "Invalid request.");
  }
}
