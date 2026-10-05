/**
 * Generates public/og/dechy-og.png (1200 x 630): the approved logo PNG, unmodified, composed on
 * Warm Off White with the working positioning line. Uses the installed Chrome via Playwright and
 * Google Fonts for Manrope (a one-off build asset, not a runtime dependency).
 * Run: npx tsx scripts/generate-og.ts
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";

const root = process.cwd();
const logo = fs
  .readFileSync(path.join(root, "brand/logos/primary/dechy-logo-primary.png"))
  .toString("base64");

const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@600;700&display=swap" rel="stylesheet">
<style>
  html,body{margin:0;width:1200px;height:630px;background:#F7F6F2;font-family:'Manrope',system-ui,sans-serif;color:#111827;overflow:hidden}
  .wrap{position:relative;width:1200px;height:630px}
  .logo{position:absolute;left:64px;top:34px;width:1000px;mix-blend-mode:darken}
  .line{position:absolute;left:96px;top:392px;width:960px;font-weight:700;font-size:44px;line-height:1.18;letter-spacing:-0.015em}
  .bar{position:absolute;left:0;right:0;bottom:0;height:14px;background:#111827}
  .accent{position:absolute;left:0;bottom:0;width:240px;height:14px;background:#2F6FED}
</style></head><body><div class="wrap">
  <img class="logo" src="data:image/png;base64,${logo}" alt="">
  <div class="line">Software, AI, automation, integration, and cloud, designed to work as one system.</div>
  <div class="bar"></div><div class="accent"></div>
</div></body></html>`;

async function main() {
  const out = path.join(root, "public/og/dechy-og.png");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const browser = await chromium.launch({ channel: "chrome" });
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: out, type: "png" });
  await browser.close();
  console.log("wrote", out, fs.statSync(out).size, "bytes");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
