import { sameOrigin } from "@/lib/contact/handler";
import { authorizeRequest } from "@/lib/server/auth";
import { NO_STORE } from "@/lib/server/http";
import {
  pushConfigured,
  removeSubscription,
  saveSubscription,
  sendPush,
  validSubscription,
} from "@/lib/server/push";
import { getStore } from "@/lib/server/store";
import { siteOrigin } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const json = (body: unknown, status = 200) => Response.json(body, { status, headers: NO_STORE });

/**
 * Phone notifications for DECHY Admin (owner, 24 October 2026), signed-in admin only:
 * POST { action: "subscribe", subscription, device }   turn this device on
 * POST { action: "unsubscribe", endpoint }              turn it off
 * POST { action: "test" }                               send a test to every device
 */
export async function POST(request: Request) {
  if (!authorizeRequest(request.headers)) return json({ ok: false, code: "unauthorized" }, 401);
  if (!sameOrigin(request.headers, siteOrigin()))
    return json({ ok: false, code: "forbidden" }, 403);
  if (!pushConfigured()) return json({ ok: false, code: "not_configured" }, 503);
  const body = (await request.json().catch(() => null)) as {
    action?: string;
    subscription?: unknown;
    endpoint?: unknown;
    device?: unknown;
  } | null;
  const store = getStore();
  if (body?.action === "subscribe" && validSubscription(body.subscription)) {
    await saveSubscription(store, body.subscription, String(body.device ?? "Device"));
    return json({ ok: true });
  }
  if (body?.action === "unsubscribe" && typeof body.endpoint === "string") {
    await removeSubscription(store, body.endpoint);
    return json({ ok: true });
  }
  if (body?.action === "test") {
    const r = await sendPush(store, {
      title: "DECHY Admin alerts are on",
      body: "New leads and requests for a person will appear here.",
      url: "/admin/",
      tag: "test",
    });
    return json({ ok: true, ...r });
  }
  return json({ ok: false, code: "bad_request" }, 400);
}
