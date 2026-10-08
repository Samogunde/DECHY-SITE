import { authorizeRequest } from "@/lib/server/auth";
import { NO_STORE } from "@/lib/server/http";
import { Repo, STATUSES, type Channel, type Status } from "@/lib/server/records";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CHANNELS: Channel[] = ["contact-form", "assistant", "human-support", "email"];

/**
 * Admin inbox as JSON, for the admin web app and a future mobile app.
 * GET /api/admin/records?kind=inquiry|support&channel=...&status=...
 * GET /api/admin/records?view=overview   (counts and recent activity)
 */
export async function GET(request: Request) {
  if (!authorizeRequest(request.headers))
    return Response.json({ ok: false, code: "unauthorized" }, { status: 401, headers: NO_STORE });
  const url = new URL(request.url);
  const repo = new Repo();
  if (url.searchParams.get("view") === "overview")
    return Response.json({ ok: true, ...(await repo.overview()) }, { headers: NO_STORE });
  const kind = url.searchParams.get("kind");
  const channel = url.searchParams.get("channel") as Channel | null;
  const status = url.searchParams.get("status") as Status | null;
  const records = await repo.listInbox({
    kind: kind === "inquiry" || kind === "support" ? kind : undefined,
    channel: channel && CHANNELS.includes(channel) ? channel : undefined,
    status: status && STATUSES.includes(status) ? status : undefined,
  });
  return Response.json({ ok: true, records }, { headers: NO_STORE });
}
