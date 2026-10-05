/**
 * Netlify build entry. The public origin is configuration, not code: until the final domain is
 * chosen, previews and the default site use the deploy URL Netlify provides. Set SITE_ORIGIN in
 * Netlify's site settings to override (for the chosen production domain). Indexing stays off
 * unless SITE_INDEXING=true is set explicitly, so previews and the pre-domain site are never indexed.
 */
import { spawnSync } from "node:child_process";

const origin =
  process.env.SITE_ORIGIN?.trim() ||
  process.env.DEPLOY_PRIME_URL?.trim() ||
  process.env.URL?.trim() ||
  "http://localhost:3000";

console.log(
  `[netlify-build] SITE_ORIGIN=${origin} SITE_INDEXING=${process.env.SITE_INDEXING ?? "false"}`,
);

const result = spawnSync("npm", ["run", "build"], {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, SITE_ORIGIN: origin },
});
process.exit(result.status ?? 1);
