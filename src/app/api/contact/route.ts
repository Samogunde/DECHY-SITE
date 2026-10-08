import { deliver } from "@/lib/contact/deliver";
import { handleContact } from "@/lib/contact/handler";
import { interestChoices, recordInquiry } from "@/lib/server/intake";
import { siteOrigin } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

export async function POST(request: Request) {
  const res = await handleContact(request, siteOrigin(), {
    now: () => Date.now(),
    deliver: (data, ref) => deliver(data, process.env, fetch, undefined, ref),
    record: (data) => recordInquiry(data),
    interests: interestChoices(),
  });
  return Response.json(res.body, { status: res.status, headers: NO_STORE });
}

export function GET() {
  return new Response(null, { status: 405, headers: { Allow: "POST", ...NO_STORE } });
}
