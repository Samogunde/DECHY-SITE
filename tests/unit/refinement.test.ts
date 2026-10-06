import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildRegistry, type Registry } from "@/lib/content/load";
import type { Page } from "@/lib/content/schema";
import { validateRegistry } from "@/lib/content/validate";

const base = buildRegistry();

function withPages(mutate: (pages: Page[]) => void): Registry {
  const pages = structuredClone(base.pages) as Page[];
  mutate(pages);
  return { ...base, pages, pageByPath: new Map(pages.map((p) => [p.path, p])) };
}
const codes = (r: Registry) =>
  validateRegistry(r)
    .filter((i) => i.level === "error")
    .map((i) => i.code);

const photos = base.assets.filter((a) => a.role === "photograph");

describe("photography: provenance is mandatory", () => {
  it("registers every photograph with source, license evidence, hash, size and alt text", () => {
    expect(photos.length).toBeGreaterThanOrEqual(4);
    expect(photos.length).toBeLessThanOrEqual(8);
    for (const a of photos) {
      expect(a.source, a.id).toBe("licensed-stock");
      expect(a.sourceUrl, a.id).toMatch(/^https:\/\/unsplash\.com\/photos\//);
      expect(a.licenseUrl, a.id).toBe("https://unsplash.com/license");
      expect(a.sha256, a.id).toMatch(/^[0-9a-f]{64}$/);
      expect(a.width && a.height, a.id).toBeTruthy();
      expect(a.alt.length, a.id).toBeGreaterThanOrEqual(20);
      const evidence = path.join(
        process.cwd(),
        "data/assets/licenses",
        `${a.id.replace(/^asset\./, "")}.md`,
      );
      expect(fs.existsSync(evidence), `license evidence for ${a.id}`).toBe(true);
    }
  });

  it("keeps stored photographs web-sized", () => {
    for (const a of photos) {
      const size = fs.statSync(path.join(process.cwd(), a.file)).size;
      expect(size, `${a.file} is ${Math.round(size / 1024)} KB`).toBeLessThan(900 * 1024);
      expect(a.width, a.id).toBeGreaterThanOrEqual(2400);
      expect(a.width, a.id).toBeLessThanOrEqual(3200);
    }
  });

  it("uses photographs only on the pages named in their registry usage", () => {
    for (const page of base.pages) {
      for (const block of page.sections) {
        if (!("photo" in block) || !block.photo) continue;
        const asset = base.assets.find((a) => a.id === block.photo!.asset)!;
        const slug = page.kind === "home" ? "home" : page.path.replace(/\//g, "");
        expect(asset.usage, `${asset.id} on ${page.path}`).toContain(slug);
      }
    }
  });

  it("the validator rejects an unregistered photograph reference", () => {
    const r = withPages((pages) => {
      const home = pages.find((p) => p.path === "/")!;
      const idx = home.sections.find((s) => s.type === "index" && s.photo);
      if (!idx || idx.type !== "index" || !idx.photo) throw new Error("no photo block");
      idx.photo.asset = "asset.photo-does-not-exist";
    });
    expect(codes(r)).toContain("photo-ref");
  });

  it("the validator caps photographs per page", () => {
    const r = withPages((pages) => {
      const home = pages.find((p) => p.path === "/")!;
      const withPhoto = home.sections.find((s) => s.type === "index" && s.photo);
      if (!withPhoto || withPhoto.type !== "index" || !withPhoto.photo) throw new Error("no photo");
      for (let i = 0; i < 3; i++) {
        home.sections.push({
          ...structuredClone(withPhoto),
          id: `extra-photo-${i}`,
        });
      }
    });
    expect(codes(r)).toContain("photo-count");
  });
});

describe("voice: DECHY speaks as a company", () => {
  const words = (page: Page) => JSON.stringify(page.sections).toLowerCase();
  const home = base.pages.find((p) => p.path === "/")!;
  const service = base.pages.find((p) => p.path === "/software-development/")!;

  it("uses first-person company language on Home and Software Development", () => {
    for (const page of [home, service]) {
      const text = words(page);
      const we = (text.match(/\b(we|our|us)\b/g) ?? []).length;
      expect(we, `${page.path} first-person count`).toBeGreaterThanOrEqual(25);
      expect(text, page.path).toMatch(/at dechy, we /);
    }
  });

  it("keeps the approved statement, descriptor and positioning exactly", () => {
    const statement = base.facts.get("company.statement")!.value;
    expect(statement).toBe(
      "Since 2010, DECHY has helped over 1,500 organizations, companies, firms, brands, businesses, individuals, professionals, teams, and other clients across a wide range of industries and business types.",
    );
    const hero = home.sections.find((s) => s.type === "hero");
    expect(hero && hero.type === "hero" ? hero.headline : "").toBe(
      "Software, AI, automation, integration, and cloud, designed to work as one system.",
    );
    expect(base.facts.get("company.descriptor")!.value).toBe(
      "Technology, Software, AI & Digital Solutions",
    );
  });

  it("avoids the generated-sounding phrases the owner named", () => {
    const banned =
      /seamless|cutting-edge|next-generation|revolutioniz|unlock your|empower(s|ing)? (businesses|organizations)|leverag(e|ing) technology|rapidly evolving/i;
    for (const page of base.pages) {
      expect(JSON.stringify(page.sections), page.path).not.toMatch(banned);
    }
  });
});

describe("motion: one small system, no libraries", () => {
  const css = fs.readFileSync(path.join(process.cwd(), "src/app/globals.css"), "utf8");
  const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8")) as {
    dependencies: Record<string, string>;
  };

  it("adds no animation library", () => {
    for (const lib of ["framer-motion", "motion", "gsap", "react-spring", "lottie-react", "aos"]) {
      expect(Object.keys(pkg.dependencies), lib).not.toContain(lib);
    }
  });

  it("defines the shared motion tokens and uses them for durations", () => {
    for (const token of ["--ease-out", "--dur-fast", "--dur-base", "--dur-slow", "--rise"]) {
      expect(css).toContain(token);
    }
  });

  it("honors prefers-reduced-motion by removing animation and transitions", () => {
    const block = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));
    expect(block).toMatch(/animation:\s*none\s*!important/);
    expect(block).toMatch(/transition:\s*none\s*!important/);
    expect(block).toMatch(/\[data-reveal\][^{]*\{[^}]*opacity:\s*1\s*!important/s);
  });

  it("only lifts buttons where hover exists", () => {
    expect(css).toMatch(/@media \(hover: hover\)\s*\{\s*\.btn:hover\s*\{\s*transform/);
  });
});
