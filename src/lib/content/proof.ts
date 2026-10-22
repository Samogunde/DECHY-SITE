import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { z } from "zod";
import { certificationGroups } from "./certifications";
import type { Registry } from "./load";
import type { Fact } from "./schema";

/** The proof counters (data/proof/counters.yaml), one wording everywhere they appear. */
const CounterFile = z.object({
  counters: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      value: z.string().optional(),
      href: z.string(),
      fallback: z.string().optional(),
      faces: z.boolean().optional(),
    }),
  ),
  team: z.string(),
});

let cache: z.infer<typeof CounterFile> | undefined;
function file() {
  cache ??= CounterFile.parse(
    YAML.parse(
      fs.readFileSync(
        path.join(/*turbopackIgnore: true*/ process.cwd(), "data/proof/counters.yaml"),
        "utf8",
      ),
    ),
  );
  return cache;
}

/** Fills {{fact:id}} from the facts register and {{count:certifications}} from the site's data. */
function fill(text: string, facts: Map<string, Fact>): string {
  return text
    .replace(/\{\{fact:([a-z.-]+)\}\}/g, (_, id: string) => {
      const f = facts.get(id);
      if (!f) throw new Error(`Unknown fact ${id} in data/proof/counters.yaml`);
      return f.value;
    })
    .replace(/\{\{count:certifications\}\}/g, () =>
      String(certificationGroups().reduce((n, g) => n + g.items.length, 0)),
    );
}

export type Counter = { id: string; label: string; value: string; href: string; faces: boolean };

/** The counters that have an approved value, each linking to a published page or section. */
export function proofCounters(registry: Registry): Counter[] {
  const exists = (href: string) => {
    const [page = "", anchor] = href.split("#");
    const target = registry.pageByPath.get(page);
    return Boolean(target && (!anchor || target.sections.some((b) => b.id === anchor)));
  };
  return file().counters.flatMap((c) => {
    if (!c.value) return [];
    const href = exists(c.href) ? c.href : (c.fallback ?? c.href);
    return [
      {
        id: c.id,
        label: c.label,
        value: fill(c.value, registry.facts),
        href,
        faces: Boolean(c.faces),
      },
    ];
  });
}

/** The sentence on team size and what it means for the client. */
export function proofTeamLine(registry: Registry): string {
  return fill(file().team, registry.facts);
}
