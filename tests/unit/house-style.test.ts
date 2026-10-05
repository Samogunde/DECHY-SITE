import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/** AGENTS 1A.16: no em dashes, en dashes, or emojis in DECHY content or project documentation. */
const BAD = /[\u2013\u2014\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;

function walk(dir: string, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.posix.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(md|ya?ml|tsx?|css|html)$/.test(e.name)) out.push(p);
  }
  return out;
}

describe("house style across the repository", () => {
  it("contains no em dashes, en dashes, or emojis in authored files", () => {
    const files = [
      "README.md",
      "CLAUDE.md",
      ...walk("docs"),
      ...walk("content"),
      ...walk("data"),
      ...walk("src"),
      ...walk("tests"),
      ...walk("scripts"),
    ].filter((f) => !f.includes("seed-taxonomy.ts"));
    const hits: string[] = [];
    for (const f of files) {
      fs.readFileSync(f, "utf8")
        .split(/\r?\n/)
        .forEach((line, i) => {
          if (BAD.test(line)) hits.push(`${f}:${i + 1}`);
        });
    }
    expect(hits).toEqual([]);
  });
});
