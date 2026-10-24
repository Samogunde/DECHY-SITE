import { sameOrigin } from "@/lib/contact/handler";
import { authorizeRequest } from "@/lib/server/auth";
import { connectWebhook } from "@/lib/server/telegram";
import { siteOrigin } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const back = (query: string) =>
  new Response(null, {
    status: 303,
    headers: { Location: `/admin/security/${query}#telegram`, "Cache-Control": "no-store" },
  });

/**
 * Connects Telegram replies (signed-in admin only): points the bot's webhook at this site, so a
 * team member's reply in Telegram reaches the visitor's chat. The token stays in the environment.
 */
export async function POST(request: Request) {
  if (!authorizeRequest(request.headers)) return new Response(null, { status: 401 });
  if (!sameOrigin(request.headers, siteOrigin())) return new Response(null, { status: 403 });
  const r = await connectWebhook();
  return back(r.ok ? "?tg=connected" : "?tg=failed");
}
