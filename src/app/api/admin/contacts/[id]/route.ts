import { sameOrigin } from "@/lib/contact/handler";
import { authorizeRequest } from "@/lib/server/auth";
import { NO_STORE } from "@/lib/server/http";
import { Repo } from "@/lib/server/records";
import { siteOrigin } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Deletes a contact and every record linked to them (deletion requests). */
export async function DELETE(request: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!authorizeRequest(request.headers))
    return Response.json({ ok: false, code: "unauthorized" }, { status: 401, headers: NO_STORE });
  const { id } = await ctx.params;
  const ok = await new Repo().deleteContact(id, "admin");
  return Response.json({ ok }, { status: ok ? 200 : 404, headers: NO_STORE });
}

/** Form version for the admin web app (requires the confirmation checkbox). */
export async function POST(request: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!authorizeRequest(request.headers) || !sameOrigin(request.headers, siteOrigin()))
    return Response.json({ ok: false, code: "unauthorized" }, { status: 401, headers: NO_STORE });
  const { id } = await ctx.params;
  const form = await request.formData().catch(() => null);
  if (form?.get("confirm") === "yes") await new Repo().deleteContact(id, "admin");
  return new Response(null, {
    status: 303,
    headers: { Location: "/admin/contacts/", "Cache-Control": "no-store" },
  });
}
