import { describe, expect, it } from "vitest";
import { buildRegistry, type Registry } from "@/lib/content/load";
import type { Page } from "@/lib/content/schema";
import { validateRegistry } from "@/lib/content/validate";

const base = buildRegistry();

function withPages(mutate: (pages: Page[]) => void, extra?: Partial<Registry>): Registry {
  const pages = structuredClone(base.pages) as Page[];
  mutate(pages);
  return { ...base, pages, pageByPath: new Map(pages.map((p) => [p.path, p])), ...extra };
}

const codes = (r: Registry) =>
  validateRegistry(r)
    .filter((i) => i.level === "error")
    .map((i) => i.code);

describe("content validator: the shipped content", () => {
  it("has zero errors", () => {
    const errors = validateRegistry(base).filter((i) => i.level === "error");
    expect(errors, JSON.stringify(errors, null, 2)).toHaveLength(0);
  });
});

describe("content validator: it rejects what the architecture forbids", () => {
  const home = (pages: Page[]) => pages.find((p) => p.path === "/")!;
  const para = (pages: Page[]) => {
    const prose = home(pages).sections.find((s) => s.type === "prose");
    if (!prose || prose.type !== "prose") throw new Error("no prose block");
    return prose;
  };

  it("em and en dashes", () => {
    expect(codes(withPages((p) => (para(p).paragraphs[0] += " a \u2014 b")))).toContain("dash");
    expect(codes(withPages((p) => (para(p).paragraphs[0] += " 1\u20132")))).toContain("dash");
  });

  it("the rejected tagline and coming-soon language", () => {
    expect(
      codes(withPages((p) => (para(p).paragraphs[0] += " Technology. People. Progress."))),
    ).toContain("banned-phrase");
    expect(codes(withPages((p) => (para(p).paragraphs[0] += " Coming soon.")))).toContain(
      "banned-phrase",
    );
  });

  it("the company statistic outside the facts register", () => {
    expect(codes(withPages((p) => (para(p).paragraphs[0] += " We have 1,500 clients.")))).toContain(
      "fact-bypass",
    );
    expect(codes(withPages((p) => (para(p).paragraphs[0] += " Founded in 2010.")))).toContain(
      "fact-bypass",
    );
  });

  it("unsupported evidence claims", () => {
    for (const bad of [
      " Our offices are in Berlin.",
      " Read our testimonials.",
      " An award-winning team.",
      " See our case studies.",
      " Trusted by leading brands.",
    ]) {
      expect(codes(withPages((p) => (para(p).paragraphs[0] += bad))), bad).toContain(
        "unsupported-claim",
      );
    }
  });

  it("wrong descriptor wording and agency framing", () => {
    expect(
      codes(
        withPages((p) => (para(p).paragraphs[0] += " A Technology & Digital Solutions company.")),
      ),
    ).toContain("descriptor");
    expect(
      codes(withPages((p) => (para(p).paragraphs[0] += " We are a web agency, a Digital Agency."))),
    ).toContain("descriptor");
  });

  it("internal links to pages that do not exist and unknown entity references", () => {
    expect(codes(withPages((p) => (para(p).paragraphs[0] += " [x](/industries/)")))).toContain(
      "link-path",
    );
    expect(codes(withPages((p) => (para(p).paragraphs[0] += " [x](ref:svc.nope)")))).toContain(
      "link-ref",
    );
  });

  it("unknown facts", () => {
    expect(
      codes(withPages((p) => (para(p).paragraphs[0] += " {{fact:company.missing}}"))),
    ).toContain("fact-unknown");
  });

  it("duplicate titles and descriptions", () => {
    expect(
      codes(
        withPages((p) => {
          p[1]!.title = p[0]!.title;
        }),
      ),
    ).toContain("title-dup");
    expect(
      codes(
        withPages((p) => {
          p[1]!.description = p[0]!.description;
        }),
      ),
    ).toContain("desc-dup");
  });

  it("thin pages", () => {
    const thin = withPages((pages) => {
      const sd = pages.find((p) => p.path === "/software-development/")!;
      sd.sections = sd.sections
        .filter(
          (s) =>
            s.type === "hero" ||
            s.type === "cta" ||
            s.type === "faq" ||
            s.type === "table" ||
            s.type === "process" ||
            s.type === "diagram" ||
            s.type === "index" ||
            s.type === "entities",
        )
        .slice(0, 8);
      for (const s of sd.sections) if (s.type === "index") s.items = s.items.slice(0, 1);
    });
    expect(codes(thin)).toContain("thin-page");
  });

  it("template sameness: too few distinct block types on a service page", () => {
    const same = withPages((pages) => {
      const sd = pages.find((p) => p.path === "/software-development/")!;
      const hero = sd.sections[0]!;
      const prose = sd.sections.find((s) => s.type === "prose")!;
      sd.sections = [hero, { ...prose, id: "p1" }, { ...prose, id: "p2" }, { ...prose, id: "p3" }];
    });
    expect(codes(same)).toContain("template-sameness");
  });

  it("a page without an H1", () => {
    expect(
      codes(
        withPages((p) => {
          delete p.find((x) => x.path === "/contact/")!.h1;
        }),
      ),
    ).toContain("h1-missing");
  });

  it("FAQ schema without an FAQ block, and the reverse", () => {
    expect(
      codes(
        withPages((p) => {
          p.find((x) => x.path === "/privacy/")!.schemaTypes.push("FAQPage");
        }),
      ),
    ).toContain("faq-schema");
  });

  it("an entity page at the wrong canonical home", () => {
    expect(
      codes(
        withPages((p) => {
          p.find((x) => x.path === "/software-development/")!.entityId = "svc.web-development";
        }),
      ),
    ).toContain("canonical-home");
  });

  it("orphan pages (no inbound internal link)", () => {
    const orphan = withPages((pages) => {
      pages.push({
        ...structuredClone(pages.find((p) => p.path === "/cookies/")!),
        id: "page.orphan",
        path: "/orphan-page/",
        title: "Orphan Page Title | DECHY",
        description:
          "A page that nothing links to, used to prove that the orphan check fails the build when it should.",
        intent: { primary: "orphan page test", secondary: [] },
        breadcrumbLabel: "Orphan",
      });
    });
    expect(codes(orphan)).toContain("orphan");
  });

  it("related blocks that are not backed by graph edges", () => {
    const rel = withPages((pages) => {
      const sd = pages.find((p) => p.path === "/software-development/")!;
      const block = sd.sections.find((s) => s.type === "related");
      if (block && block.type === "related") block.groups[0]!.entityIds.push("svc.branding");
    });
    expect(codes(rel)).toContain("related-no-edge");
  });

  it("changes to the approved services or navigation", () => {
    const services = base.services.map((s, i) =>
      i === 3 ? { ...s, name: "Artificial Intelligence" } : s,
    );
    expect(codes({ ...base, services })).toContain("services-approved");
    const nav = { ...base.nav, primary: base.nav.primary.slice(1) };
    expect(codes({ ...base, nav })).toContain("nav-approved");
  });

  it("relations with missing endpoints or the wrong type", () => {
    const bad = {
      ...base,
      relations: [
        ...base.relations,
        { from: "svc.ai", type: "usesTechnology" as const, to: "does.not-exist" },
      ],
    };
    expect(codes(bad)).toContain("relation-endpoint");
    const wrongType = {
      ...base,
      relations: [
        ...base.relations,
        { from: "svc.ai", type: "appliesToIndustry" as const, to: "svc.cloud" },
      ],
    };
    expect(codes(wrongType)).toContain("relation-type");
  });
});

describe("asset registry and provenance", () => {
  const asset = base.assets[0]!;

  it("rejects a registered file that does not exist", () => {
    const r = {
      ...base,
      assets: [
        ...base.assets,
        { ...asset, id: "asset.ghost", file: "public/ghost.png", sha256: undefined },
      ],
    };
    expect(codes(r)).toContain("asset-missing");
  });

  it("rejects a file whose hash no longer matches the record", () => {
    const r = {
      ...base,
      assets: base.assets.map((a, i) => (i === 0 ? { ...a, sha256: "0".repeat(64) } : a)),
    };
    expect(codes(r)).toContain("asset-hash");
  });

  it("requires source and license URLs for licensed stock, and approval for anything registered", () => {
    const stock = {
      ...asset,
      id: "asset.stock",
      source: "licensed-stock" as const,
      sha256: undefined,
      sourceUrl: undefined,
      licenseUrl: undefined,
    };
    expect(codes({ ...base, assets: [...base.assets, stock] })).toContain("asset-license");
    const pending = {
      ...asset,
      id: "asset.pending",
      approval: "pending" as const,
      sha256: undefined,
    };
    expect(codes({ ...base, assets: [...base.assets, pending] })).toContain("asset-approval");
  });

  it("rejects an image in public/ that is not registered", async () => {
    const fs = await import("node:fs");
    const tmp = "public/zz-unregistered-test.png";
    fs.writeFileSync(tmp, "x");
    try {
      expect(codes(base)).toContain("asset-unregistered");
    } finally {
      fs.rmSync(tmp);
    }
  });

  it("registers every original diagram", () => {
    const ids = base.assets.map((a) => a.id);
    for (const f of [
      "system-map",
      "connected-flow",
      "software-anatomy",
      "quality-layers",
      "modernization-path",
      "portal-wireframe",
    ]) {
      expect(ids).toContain(`asset.fig-${f}`);
    }
  });
});
