import crypto from "node:crypto";
import { defineConfig, devices } from "@playwright/test";
import { hashPassword } from "./src/lib/server/auth";

const PORT = Number(process.env.E2E_PORT ?? 4310);
const ORIGIN = `http://localhost:${PORT}`;

// A fresh admin password for every run, shared with the test workers through the environment.
// Nothing here is a real credential, and nothing is committed.
process.env.E2E_ADMIN_EMAIL ??= "admin@dechy.test";
process.env.E2E_ADMIN_PASSWORD ??= crypto.randomBytes(18).toString("base64url");

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
    // Start from an empty test data folder so earlier runs never affect this one.
    command: `node -e "require('fs').rmSync('.data-e2e',{recursive:true,force:true})" && npm run start -- -p ${PORT}`,
    url: ORIGIN,
    reuseExistingServer: false, // never trust a server left over from an earlier build
    timeout: 120_000,
    env: {
      SITE_ORIGIN: ORIGIN,
      SITE_INDEXING: "false",
      CONTACT_DELIVERY: "log",
      DATA_STORE: "file",
      DATA_DIR: ".data-e2e",
      ADMIN_EMAIL: process.env.E2E_ADMIN_EMAIL,
      ADMIN_PASSWORD_HASH: hashPassword(process.env.E2E_ADMIN_PASSWORD),
      ADMIN_SESSION_SECRET: crypto.randomBytes(32).toString("base64url"),
      AI_PROVIDER: "",
      NOTIFICATION_PROVIDER: "log",
    },
  },
});
