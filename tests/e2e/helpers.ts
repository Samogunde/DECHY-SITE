import type { ConsoleMessage, Page } from "@playwright/test";
import { buildRegistry } from "../../src/lib/content/load";

export const registry = buildRegistry();

/** Every page that exists in Phase 1. */
export const PAGES = registry.pages.map((p) => ({
  path: p.path,
  title: p.title,
  description: p.description,
  kind: p.kind,
}));

/** The widths the owner asked to be tested (phones through very large desktop). */
export const WIDTHS = [320, 360, 375, 390, 430, 768, 820, 1024, 1280, 1440, 1920, 2560];

export const HEIGHT_FOR = (w: number) => (w < 768 ? 800 : w < 1280 ? 1000 : 1000);

/** Collect console errors and uncaught page errors while a test runs. */
export function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (m: ConsoleMessage) => {
    if (m.type() === "error") errors.push(`console: ${m.text()}`);
  });
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("requestfailed", (r) => {
    // Chromium can report a fully read streamed response (the assistant's server-sent events) as
    // ERR_ABORTED when the reader finishes before the loader's completion signal arrives. The
    // assistant tests assert the complete reply on screen, so only that case is ignored here.
    const streamed =
      r.method() === "POST" &&
      new URL(r.url()).pathname === "/api/assistant/" &&
      (r.headers()["accept"] ?? "").includes("text/event-stream") &&
      r.failure()?.errorText === "net::ERR_ABORTED";
    if (!streamed) errors.push(`requestfailed: ${r.url()} ${r.failure()?.errorText ?? ""}`);
  });
  page.on("response", (r) => {
    const url = new URL(r.url());
    if (r.status() >= 400 && url.pathname !== "/favicon.ico")
      errors.push(`http ${r.status()}: ${r.url()}`);
  });
  return errors;
}
