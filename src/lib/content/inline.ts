/**
 * Inline markup used in content strings:
 *   **bold**
 *   [label](ref:svc.web-development)   link to an entity; plain text until its page exists
 *   [label](/contact/)                 link to an internal path; the path must exist
 *   [label](https://example.org/)      external link
 *   {{fact:company.statement}}         approved fact from the facts register
 * The same parser feeds the renderer, the metadata/JSON-LD text extractor, and the validator.
 */
import type { Fact } from "./schema";

export type InlineToken =
  | { kind: "text"; text: string }
  | { kind: "bold"; text: string }
  | { kind: "link"; label: string; target: string };

const FACT = /\{\{fact:([a-z0-9.-]+)\}\}/g;

export function expandFacts(input: string, facts: Map<string, Fact>): string {
  return input.replace(FACT, (_m, id: string) => {
    const f = facts.get(id);
    if (!f) throw new Error(`Unknown fact "${id}" in content: ${input.slice(0, 60)}`);
    return f.value;
  });
}

export function parseInline(input: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(input))) {
    if (m.index > last) tokens.push({ kind: "text", text: input.slice(last, m.index) });
    if (m[1] !== undefined) tokens.push({ kind: "bold", text: m[1] });
    else tokens.push({ kind: "link", label: m[2] ?? "", target: m[3] ?? "" });
    last = m.index + m[0].length;
  }
  if (last < input.length) tokens.push({ kind: "text", text: input.slice(last) });
  return tokens;
}

/** Plain text with markup removed (for meta text, JSON-LD answers, and word counts). */
/** A heading without its accent marks ([[words]] shown in the brand blue). */
export const plainHeading = (text: string) => text.replace(/\[\[|\]\]/g, "");

export function toPlainText(input: string, facts: Map<string, Fact>): string {
  return parseInline(expandFacts(plainHeading(input), facts))
    .map((t) => (t.kind === "link" ? t.label : t.text))
    .join("");
}

/** Every link target found in a string (used by the validator). */
export function linkTargets(input: string): string[] {
  return parseInline(input.replace(FACT, "FACT"))
    .filter((t): t is Extract<InlineToken, { kind: "link" }> => t.kind === "link")
    .map((t) => t.target);
}
