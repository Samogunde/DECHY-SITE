import fs from "node:fs";
import { describe, expect, it } from "vitest";

/**
 * Enforces the approved root layout (plan Appendix D item 7): application at the root, no
 * website/ subfolder, and a README stating what belongs in each top-level folder.
 */
const ALLOWED_ROOT = new Set([
  // governing documents
  "AGENTS.md",
  "CLAUDE.md",
  "DECHY_CONTENT_MASTER.md",
  "DECHY_CLAUDE_MASTER_HANDOFF.md",
  "README.md",
  // application folders
  "src",
  "content",
  "data",
  "brand",
  "docs",
  "tests",
  "scripts",
  "public",
  // tooling and configuration
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  "next.config.ts",
  "postcss.config.mjs",
  "eslint.config.mjs",
  "vitest.config.ts",
  "playwright.config.ts",
  "netlify.toml",
  ".gitignore",
  ".gitattributes",
  ".prettierrc.json",
  ".prettierignore",
  ".env.example",
  ".nvmrc",
  ".github",
  ".claude",
  ".git",
  // generated or local, never committed
  "node_modules",
  ".next",
  "next-env.d.ts",
  "test-results",
  "playwright-report",
  "coverage",
  ".env.local",
  "tsconfig.tsbuildinfo",
]);

describe("repository layout", () => {
  it("has no unexpected files or folders at the root, and no website/ subfolder", () => {
    const entries = fs.readdirSync(process.cwd());
    const unexpected = entries.filter((e) => !ALLOWED_ROOT.has(e) && !/^\.env\./.test(e));
    expect(unexpected).toEqual([]);
    expect(entries).not.toContain("website");
  });

  it("documents each application folder with a README", () => {
    for (const d of ["src", "content", "data", "brand", "tests", "scripts"]) {
      expect(fs.existsSync(`${d}/README.md`), d).toBe(true);
    }
  });

  it("keeps page copy and structured data out of src/", () => {
    const stray: string[] = [];
    const walk = (dir: string) => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = `${dir}/${e.name}`;
        if (e.isDirectory()) walk(p);
        else if (/\.(ya?ml|md|mdx)$/.test(e.name) && e.name !== "README.md") stray.push(p);
      }
    };
    walk("src");
    expect(stray).toEqual([]);
  });
});
