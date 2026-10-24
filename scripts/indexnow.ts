/**
 * IndexNow (owner, 24 October 2026): tells Bing and other IndexNow engines that pages are new or
 * changed. Run only after launch, once SITE_INDEXING=true and the live domain serves the site:
 *   SITE_ORIGIN=https://www.dechytech.com SITE_INDEXING=true npx tsx scripts/indexnow.ts
 * The key file public/78ff486249908f57c9165e3948726855.txt proves we own the domain. It sends every URL in the
 * live sitemap; pass paths as arguments to send only those.
 */
const KEY = "78ff486249908f57c9165e3948726855";

async function main() {
  const origin = (process.env.SITE_ORIGIN ?? "").replace(/\/$/, "");
  if (process.env.SITE_INDEXING !== "true" || !/^https:\/\//.test(origin)) {
    console.error("Refusing: set SITE_INDEXING=true and SITE_ORIGIN to the live https domain.");
    process.exit(1);
  }
  const args = process.argv.slice(2);
  const urls = args.length
    ? args.map((p) => new URL(p, origin).toString())
    : [
        ...(await (await fetch(`${origin}/sitemap.xml`)).text()).matchAll(/<loc>([^<]+)<\/loc>/g),
      ].map((m) => m[1]!);
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: new URL(origin).host,
      key: KEY,
      keyLocation: `${origin}/${KEY}.txt`,
      urlList: urls.slice(0, 10000),
    }),
  });
  console.log(`IndexNow: ${res.status} for ${urls.length} URLs`);
  if (!res.ok && res.status !== 202) process.exit(1);
}

void main();
