/**
 * Captures viewport screenshots of the production build for visual review.
 * Usage: npx tsx scripts/capture-views.ts <outDir> [baseUrl]   (server must be running)
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";

async function main() {
  const out = process.argv[2] ?? "test-results/views";
  const base = process.argv[3] ?? "http://localhost:4310";
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ channel: "chrome" });
  const shots: { name: string; w: number; h: number; url: string; y?: number; sel?: string }[] = [];
  for (const [w, h] of [
    [320, 700],
    [390, 844],
    [768, 1000],
    [1024, 768],
    [1440, 900],
    [1920, 1080],
    [2560, 1300],
  ] as const) {
    shots.push({ name: `home-top-${w}`, w, h, url: "/" });
    shots.push({ name: `sd-top-${w}`, w, h, url: "/software-development/" });
  }
  for (const w of [390, 1440]) {
    shots.push({
      name: `sd-interfaces-${w}`,
      w,
      h: w < 800 ? 900 : 1000,
      url: "/software-development/",
      sel: "#interfaces",
    });
    shots.push({
      name: `sd-delivery-${w}`,
      w,
      h: w < 800 ? 900 : 1000,
      url: "/software-development/",
      sel: "#delivery",
    });
    shots.push({
      name: `sd-quality-${w}`,
      w,
      h: w < 800 ? 900 : 1000,
      url: "/software-development/",
      sel: "#quality",
    });
    shots.push({
      name: `home-flow-${w}`,
      w,
      h: w < 800 ? 900 : 1000,
      url: "/",
      sel: "#connected-systems",
    });
    shots.push({
      name: `home-services-${w}`,
      w,
      h: w < 800 ? 900 : 1000,
      url: "/",
      sel: "#services",
    });
    shots.push({ name: `contact-${w}`, w, h: w < 800 ? 900 : 1000, url: "/contact/" });
  }
  for (const s of shots) {
    const page = await browser.newPage({ viewport: { width: s.w, height: s.h } });
    await page.goto(base + s.url, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    if (s.sel) {
      await page.evaluate((sel) => document.querySelector(sel)?.scrollIntoView(), s.sel);
      await page.evaluate(() => window.scrollBy(0, -70));
    }
    await page.waitForTimeout(150);
    await page.screenshot({ path: path.join(out, `${s.name}.png`) });
    await page.close();
  }
  await browser.close();
  console.log(`captured ${shots.length} views to ${out}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
