import crypto from "node:crypto";
import { NO_STORE } from "@/lib/server/http";
import { runMaintenance } from "@/lib/server/maintenance";
import { getStore } from "@/lib/server/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Retention cleanup, called daily by the Netlify scheduled function (netlify/functions/retention.mts)
 * with the shared secret in "x-dechy-maintenance-secret" (MAINTENANCE_SECRET, 32+ characters).
 */
export async function POST(request: Request) {
  const secret = process.env.MAINTENANCE_SECRET?.trim() ?? "";
  const given = request.headers.get("x-dechy-maintenance-secret") ?? "";
  const ok =
    secret.length >= 32 &&
    given.length === secret.length &&
    crypto.timingSafeEqual(Buffer.from(given), Buffer.from(secret));
  if (!ok) return Response.json({ ok: false }, { status: 401, headers: NO_STORE });
  const report = await runMaintenance(getStore());
  return Response.json({ ok: true, report }, { headers: NO_STORE });
}
