/**
 * Daily retention cleanup for DECHY Admin data (see src/lib/server/maintenance.ts). Netlify runs this
 * on its schedule; it calls the site's maintenance endpoint with the shared secret. Without
 * MAINTENANCE_SECRET it does nothing (the site also cleans up opportunistically).
 */
async function retention(): Promise<Response> {
  const secret = process.env.MAINTENANCE_SECRET;
  const origin = process.env.URL;
  if (!secret || !origin) return new Response("not configured", { status: 200 });
  const res = await fetch(`${origin}/api/maintenance/`, {
    method: "POST",
    headers: { "x-dechy-maintenance-secret": secret },
  });
  return new Response(res.ok ? "ok" : `failed ${res.status}`, { status: 200 });
}

export default retention;

export const config = { schedule: "@daily" };
