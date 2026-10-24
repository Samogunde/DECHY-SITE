import { forwardToNetlify, newsletterFields } from "@/lib/contact/netlify-forms";
import { handleNewsletter } from "@/lib/contact/newsletter";
import { overLimit } from "@/lib/server/ratelimit";
import { Repo } from "@/lib/server/records";
import { getStore } from "@/lib/server/store";
import { siteOrigin } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

function store() {
  try {
    return getStore();
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const res = await handleNewsletter(request, siteOrigin(), {
    now: () => Date.now(),
    overLimit: (client) => overLimit(store(), "newsletter", client, 5, 10 * 60 * 1000),
    save: async (data) => {
      const repo = new Repo();
      if (repo.storeKind === "none") return null;
      return repo.addSubscriber(data.email, data.source ?? null);
    },
    forward: (data) => forwardToNetlify("newsletter", newsletterFields(data.email, data.source)),
  });
  return Response.json(res.body, { status: res.status, headers: NO_STORE });
}

export function GET() {
  return new Response(null, { status: 405, headers: { Allow: "POST", ...NO_STORE } });
}
