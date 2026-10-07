/**
 * Entity graph queries. Edges are typed and live in data/relations. Inverse edges are derived,
 * so each relationship is stored once.
 */
import type { Node, Registry } from "./load";
import type { Relation } from "./schema";

const INVERSE: Partial<Record<Relation["type"], Relation["type"]>> = {
  solves: "solvedBy",
  solvedBy: "solves",
  partOf: "hasPart",
  hasPart: "partOf",
};

export function outgoing(registry: Registry, fromId: string, type?: Relation["type"]): Node[] {
  const out: Node[] = [];
  for (const r of registry.relations) {
    const direct = r.from === fromId && (!type || r.type === type);
    const inverse = r.to === fromId && INVERSE[r.type] && (!type || INVERSE[r.type] === type);
    const targetId = direct ? r.to : inverse ? r.from : undefined;
    const target = targetId ? registry.nodes.get(targetId) : undefined;
    if (target && !out.includes(target)) out.push(target);
  }
  return out;
}

export function nodeById(registry: Registry, id: string): Node {
  const n = registry.nodes.get(id);
  if (!n) throw new Error(`Unknown entity: ${id}`);
  return n;
}

/** Children whose canonical home is the given service. */
export function childrenOf(registry: Registry, serviceId: string): Node[] {
  return [...registry.nodes.values()].filter((n) => n.primaryService === serviceId);
}
