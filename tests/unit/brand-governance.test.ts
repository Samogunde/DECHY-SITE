import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildRegistry } from "@/lib/content/load";
import { DESCRIPTOR } from "@/lib/site";

const root = process.cwd();
const read = (p: string) => fs.readFileSync(path.join(root, p), "utf8");
const sha = (p: string) =>
  crypto
    .createHash("sha256")
    .update(fs.readFileSync(path.join(root, p)))
    .digest("hex");

/** SHA-256 of the approved logo (the wordmark without the descriptor) exactly as supplied. */
const LOGO_SHA256 = "2fb8f86734f4a1c8f03db09f73acf0ff8e8ae03091da6fe62e49d766c7054e36";
/** SHA-256 of the approved social sharing image exactly as supplied. */
const SOCIAL_SHA256 = "f1ddd90a80ed7394fe87618abdf598d34c2e813c34e425268fa564caae0dfa82";

describe("brand integrity", () => {
  it("keeps the approved logo byte-identical to the supplied file", () => {
    expect(sha("brand/logos/primary/dechy-logo.png")).toBe(LOGO_SHA256);
  });

  it("keeps the approved social sharing image byte-identical under its supplied name", () => {
    expect(sha("brand/social/DECHY Technology Solutions Social Image.png")).toBe(SOCIAL_SHA256);
  });

  it("serves a delivery copy of the logo that is byte-identical to the master", () => {
    expect(sha("public/brand/dechy-logo.png")).toBe(LOGO_SHA256);
  });

  it("keeps the five approved brand tokens unchanged", () => {
    const css = read("src/app/globals.css").toLowerCase();
    for (const [name, hex] of [
      ["ink", "#111827"],
      ["blue", "#2f6fed"],
      ["paper", "#f7f6f2"],
      ["line", "#e5e7eb"],
      ["slate", "#6b7280"],
    ] as const) {
      expect(css).toContain(`--color-${name}: ${hex}`);
    }
  });

  it("uses the exact official descriptor", () => {
    expect(DESCRIPTOR).toBe("Technology, Software, AI & Digital Solutions");
    expect(buildRegistry().facts.get("company.descriptor")?.value).toBe(DESCRIPTOR);
  });

  it("ships the production typography tokens identical to the approved specification", () => {
    const norm = (s: string) => s.replace(/\r\n/g, "\n");
    expect(norm(read("src/styles/typography-tokens.css"))).toBe(
      norm(read("docs/design/typography-tokens.css")),
    );
  });

  it("holds body text at or above 16px and nothing readable below 14px in the type tokens", () => {
    const css = read("src/styles/typography-tokens.css");
    // Owner direction, 7 October 2026: normal body 16 to 17px.
    expect(css).toMatch(/--fs-body: calc\(clamp\(1rem/); // 16px floor
    expect(css).toMatch(/--fs-body-lg: calc\(clamp\(1\.0625rem/); // 17px floor
    expect(css).toMatch(/--fs-caption: 0\.875rem/); // 14px
    expect(css).toMatch(/--fs-input: 1rem/); // 16px, no iOS zoom
  });
});

describe("governance files are never altered by tooling", () => {
  it("does not contain the Next.js auto-generated agent rules block", () => {
    for (const f of [
      "AGENTS.md",
      "CLAUDE.md",
      "DECHY_CONTENT_MASTER.md",
      "DECHY_CLAUDE_MASTER_HANDOFF.md",
    ]) {
      expect(read(f), f).not.toContain("nextjs-agent-rules");
    }
  });
  it("keeps Next.js agent file generation disabled", () => {
    expect(read("next.config.ts")).toContain("agentRules: false");
  });
  it("keeps the exact descriptor in the governing specification", () => {
    expect(read("AGENTS.md")).toContain(DESCRIPTOR);
  });
});

describe("capability architecture is preserved", () => {
  /** Every bullet in AGENTS.md sections 3 to 23 must exist as an entity or service. */
  it("represents every approved capability list item in the graph", () => {
    const registry = buildRegistry();
    const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9+#]+/g, "");
    const names = new Set([...registry.nodes.values()].map((n) => norm(n.name)));
    const lines = read("AGENTS.md").split(/\r?\n/);
    let section = 0;
    const missing: string[] = [];
    for (const line of lines) {
      const sec = /^# (\d+)\. /.exec(line);
      if (sec) {
        section = Number(sec[1]);
        continue;
      }
      if (/^# /.test(line)) {
        section = 0;
        continue;
      }
      if (section < 3 || section > 23) continue;
      const b = /^\s*-\s{1,4}(\S.*?)\s*$/.exec(line);
      const name = b?.[1];
      if (
        !name ||
        name.length > 70 ||
        / - /.test(name) ||
        name.endsWith(":") ||
        /^(and )?other /i.test(name)
      )
        continue;
      if (!names.has(norm(name))) missing.push(`${section}: ${name}`);
    }
    expect(missing).toEqual([]);
  });
});
