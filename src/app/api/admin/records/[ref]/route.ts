import { sameOrigin } from "@/lib/contact/handler";
import { authorizeRequest } from "@/lib/server/auth";
import { notify } from "@/lib/server/events";
import { NO_STORE } from "@/lib/server/http";
import { Repo, STATUSES, type Status } from "@/lib/server/records";
import { siteOrigin } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const unauthorized = () =>
  Response.json({ ok: false, code: "unauthorized" }, { status: 401, headers: NO_STORE });

/** One record with its conversation, as JSON. */
export async function GET(request: Request, ctx: { params: Promise<{ ref: string }> }) {
  if (!authorizeRequest(request.headers)) return unauthorized();
  const { ref } = await ctx.params;
  const repo = new Repo();
  const record = await repo.getByRef(ref);
  if (!record)
    return Response.json({ ok: false, code: "not_found" }, { status: 404, headers: NO_STORE });
  const conversation =
    record.kind === "support" && record.conversationId
      ? await repo.getConversation(record.conversationId)
      : null;
  return Response.json({ ok: true, record, conversation }, { headers: NO_STORE });
}

/**
 * Change status, read state, or who is handling it.
 * JSON (mobile/API): PATCH {"status": "open", "read": true, "handledBy": "..."}
 * Form (admin web): POST status=...&read=...&handledBy=...  then redirect back to the record.
 */
async function update(request: Request, ref: string, input: Record<string, unknown>) {
  const repo = new Repo();
  const status =
    typeof input.status === "string" && STATUSES.includes(input.status as Status)
      ? (input.status as Status)
      : undefined;
  const read =
    input.read === true || input.read === "true"
      ? true
      : input.read === false || input.read === "false"
        ? false
        : undefined;
  const handledBy = typeof input.handledBy === "string" ? input.handledBy : undefined;
  const rec = await repo.updateRecord(ref, { status, read, handledBy }, "admin");
  if (rec && status)
    await notify({
      type: "record.status_changed",
      ref,
      title: `${ref} is now ${status}`,
      actor: "admin",
    });
  return rec;
}

export async function PATCH(request: Request, ctx: { params: Promise<{ ref: string }> }) {
  if (!authorizeRequest(request.headers)) return unauthorized();
  if (!(request.headers.get("content-type") ?? "").startsWith("application/json"))
    return Response.json({ ok: false, code: "unsupported" }, { status: 415, headers: NO_STORE });
  const { ref } = await ctx.params;
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body)
    return Response.json({ ok: false, code: "bad_request" }, { status: 400, headers: NO_STORE });
  const rec = await update(request, ref, body);
  if (!rec)
    return Response.json({ ok: false, code: "not_found" }, { status: 404, headers: NO_STORE });
  return Response.json({ ok: true, record: rec }, { headers: NO_STORE });
}

export async function POST(request: Request, ctx: { params: Promise<{ ref: string }> }) {
  if (!authorizeRequest(request.headers) || !sameOrigin(request.headers, siteOrigin()))
    return unauthorized();
  const { ref } = await ctx.params;
  const form = await request.formData().catch(() => null);
  const input = Object.fromEntries(form?.entries() ?? []);
  if (input.action === "delete") {
    if (input.confirm === "yes") await new Repo().deleteRecord(ref, "admin");
    return new Response(null, {
      status: 303,
      headers: { Location: "/admin/inbox/", "Cache-Control": "no-store" },
    });
  }
  await update(request, ref, input);
  return new Response(null, {
    status: 303,
    headers: { Location: `/admin/inbox/${encodeURIComponent(ref)}/`, "Cache-Control": "no-store" },
  });
}

/** Permanently deletes a record (deletion requests). */
export async function DELETE(request: Request, ctx: { params: Promise<{ ref: string }> }) {
  if (!authorizeRequest(request.headers)) return unauthorized();
  const { ref } = await ctx.params;
  const ok = await new Repo().deleteRecord(ref, "admin");
  return Response.json({ ok }, { status: ok ? 200 : 404, headers: NO_STORE });
}
