import { sameOrigin } from "@/lib/contact/handler";
import { authorizeRequest } from "@/lib/server/auth";
import { clientAddress, overLimit } from "@/lib/server/ratelimit";
import { getStore } from "@/lib/server/store";
import { activeTotpSecret, confirmTotpSetup, disableTotp, matchTotp } from "@/lib/server/totp";
import { siteOrigin } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const back = (query: string) =>
  new Response(null, {
    status: 303,
    headers: { Location: `/admin/security/${query}`, "Cache-Control": "no-store" },
  });

/** Turns two-step sign-in on (confirm a code from the new secret) or off (a current code). */
export async function POST(request: Request) {
  if (!authorizeRequest(request.headers)) return new Response(null, { status: 401 });
  if (!sameOrigin(request.headers, siteOrigin())) return new Response(null, { status: 403 });
  const store = getStore();
  if (await overLimit(store, "admin-2fa", clientAddress(request.headers), 10, 15 * 60 * 1000))
    return back("?error=1");
  const form = await request.formData().catch(() => null);
  const action = String(form?.get("action") ?? "");
  const code = String(form?.get("code") ?? "")
    .replace(/\s/g, "")
    .slice(0, 6);
  if (action === "confirm")
    return (await confirmTotpSetup(store, code)) ? back("?done=1") : back("?error=1");
  if (action === "disable") {
    const secret = await activeTotpSecret(store);
    if (!secret || process.env.ADMIN_TOTP_SECRET?.trim()) return back("");
    if (matchTotp(code, { ADMIN_TOTP_SECRET: secret }) === null) return back("?error=1");
    await disableTotp(store);
    return back("?off=1");
  }
  return back("");
}
