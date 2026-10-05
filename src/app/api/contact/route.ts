import { deliver } from "@/lib/contact/deliver";
import { handleContact } from "@/lib/contact/handler";
import { siteOrigin } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

export async function POST(request: Request) {
  const res = await handleContact(request, siteOrigin(), {
    now: () => Date.now(),
    deliver: (data) => deliver(data),
  });
  return Response.json(res.body, { status: res.status, headers: NO_STORE });
}

export function GET() {
  return new Response(null, { status: 405, headers: { Allow: "POST", ...NO_STORE } });
}
