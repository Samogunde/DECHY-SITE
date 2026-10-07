import { describe, expect, it } from "vitest";
import { buildRegistry } from "@/lib/content/load";
import { outgoing } from "@/lib/content/graph";
import { validateRegistry } from "@/lib/content/validate";
import { connectionsFor } from "@/lib/connections";
import { publishedPath } from "@/lib/content/urls";

const registry = buildRegistry();

const GROUPS: [string, string][] = [
  ["fw.express", "tech.nodejs"],
  ["fw.nestjs", "tech.nodejs"],
  ["fw.django", "lang.python"],
  ["fw.fastapi", "lang.python"],
  ["fw.flask", "lang.python"],
  ["fw.spring-boot", "lang.java"],
  ["fw.laravel", "lang.php"],
  ["tech.elasticsearch", "tool.elk"],
];

const codes = (relations: typeof registry.relations) =>
  validateRegistry({ ...registry, relations }).map((i) => i.code);

describe("partOf grouping relation", () => {
  it("groups the eight accepted technologies under their approved parents", () => {
    for (const [child, parent] of GROUPS) {
      expect(registry.relations, child).toContainEqual({ from: child, type: "partOf", to: parent });
      expect(outgoing(registry, child, "partOf").map((n) => n.id)).toEqual([parent]);
      expect(outgoing(registry, parent, "hasPart").map((n) => n.id)).toContain(child);
    }
  });

  it("never gives a grouped technology a page, a URL, or a link on its parent page", () => {
    for (const [child, parent] of GROUPS) {
      expect(publishedPath(registry.nodes.get(child), registry), child).toBeNull();
      const page = registry.pages.find((p) => p.entityId === parent);
      if (!page) continue;
      const shown = connectionsFor(page, registry).flatMap((r) => r.items.map((i) => i.id));
      expect(shown, `${parent} rails must not name ${child}`).not.toContain(child);
    }
  });

  it("validates cleanly, and rejects a non-technology end, a cycle, or a stored hasPart", () => {
    expect(codes(registry.relations)).not.toContain("relation-type");
    const bad = (extra: (typeof registry.relations)[number]) => [...registry.relations, extra];
    expect(codes(bad({ from: "fw.express", type: "partOf", to: "svc.cloud" }))).toContain(
      "relation-type",
    );
    expect(codes(bad({ from: "tech.nodejs", type: "partOf", to: "fw.express" }))).toContain(
      "relation-type",
    );
    expect(codes(bad({ from: "tech.nodejs", type: "hasPart", to: "fw.express" }))).toContain(
      "relation-type",
    );
  });
});
