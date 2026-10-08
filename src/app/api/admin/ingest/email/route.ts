import crypto from "node:crypto";
import { z } from "zod";
import { recordEmail } from "@/lib/server/intake";
import { NO_STORE } from "@/lib/server/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Inbound business email, ready for configuration. When the business mailbox is chosen, its
 * provider's inbound webhook (or a small forwarding rule) posts each message here as JSON with the
 * shared secret in "x-dechy-ingest-secret" (EMAIL_INGEST_SECRET). The message becomes an inquiry
 * on the "email" channel in DECHY Admin. Disabled until the secret is set.
 */
const Body = z.object({
  fromName: z.string().trim().max(200).default(""),
  fromEmail: z.string().trim().email().max(200),
  subject: z.string().trim().max(300).default(""),
  text: z.string().max(20000).default(""),
});

export async function POST(request: Request) {
  const secret = process.env.EMAIL_INGEST_SECRET?.trim();
  const given = request.headers.get("x-dechy-ingest-secret") ?? "";
  const ok =
    secret &&
    secret.length >= 32 &&
    given.length === secret.length &&
    crypto.timingSafeEqual(Buffer.from(given), Buffer.from(secret));
  if (!ok)
    return Response.json({ ok: false, code: "unauthorized" }, { status: 401, headers: NO_STORE });
  const raw = (await request.json().catch(() => null)) as unknown;
  const parsed = Body.safeParse(raw);
  if (!parsed.success)
    return Response.json({ ok: false, code: "invalid" }, { status: 400, headers: NO_STORE });
  const inquiry = await recordEmail(parsed.data);
  return Response.json({ ok: true, ref: inquiry.ref }, { headers: NO_STORE });
}
