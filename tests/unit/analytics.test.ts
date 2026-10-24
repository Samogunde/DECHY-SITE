import { afterEach, describe, expect, it } from "vitest";
import { CLARITY_ID, GTM_ID, analyticsAllowed } from "../../src/lib/analytics";

// Tracking loads only on the live domain (owner, 24 October 2026): never on localhost, the Netlify
// address, deploy previews, or branch deploys, and never for a browser marked as team traffic.

const g = globalThis as unknown as { window?: unknown };

function at(hostname: string, storage: Record<string, string> = {}) {
  g.window = {
    location: { hostname, search: "" },
    localStorage: { getItem: (k: string) => storage[k] ?? null },
  };
}

afterEach(() => {
  delete g.window;
});

describe("analytics host rule", () => {
  it("loads on dechytech.com and www.dechytech.com only", () => {
    for (const host of ["dechytech.com", "www.dechytech.com"]) {
      at(host);
      expect(analyticsAllowed(), host).toBe(true);
    }
    for (const host of [
      "localhost",
      "127.0.0.1",
      "dechy-site.netlify.app",
      "6ac80a525525bac8f418980e--dechy-site.netlify.app",
      "deploy-preview-12--dechy-site.netlify.app",
      "homepage-redesign-sample--dechy-site.netlify.app",
      "staging.dechytech.com",
      "dechytech.com.evil.example",
    ]) {
      at(host);
      expect(analyticsAllowed(), host).toBe(false);
    }
  });

  it("stays off for a browser marked as team traffic", () => {
    at("www.dechytech.com", { "dechy-internal": "1" });
    expect(analyticsAllowed()).toBe(false);
  });

  it("uses the owner's container and Clarity project", () => {
    expect(GTM_ID).toBe("GTM-M7VGXV5C");
    expect(CLARITY_ID).toBe("z2m5oecdku");
  });
});
