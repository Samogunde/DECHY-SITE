import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? 4310);
const ORIGIN = `http://localhost:${PORT}`;

/**
 * End-to-end tests run against the production build (`next start`), because that is what ships:
 * real security headers, real static output, real fonts. Build first with SITE_ORIGIN=${ORIGIN}
 * so canonical URLs match (CI does this).
 *
 * Locally the installed Chrome is used (no browser download). In CI Playwright's Chromium is used.
 */
export default defineConfig({
  testDir: "tests/e2e",
  timeout: 90_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  outputDir: "test-results",
  use: {
    baseURL: ORIGIN,
    channel: process.env.CI ? undefined : "chrome",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], channel: process.env.CI ? undefined : "chrome" },
    },
  ],
  webServer: {
    command: `npm run start -- -p ${PORT}`,
    url: ORIGIN,
    reuseExistingServer: false, // never trust a server left over from an earlier build
    timeout: 120_000,
    env: {
      SITE_ORIGIN: ORIGIN,
      SITE_INDEXING: "false",
      CONTACT_DELIVERY: "log",
    },
  },
});
