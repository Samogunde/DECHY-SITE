/**
 * CLI: loads and validates all content and graph data. Exits non-zero on any error so a bad
 * edit cannot reach a build. Run with: npm run validate
 */
import { buildRegistry } from "../src/lib/content/load";
import { validateRegistry } from "../src/lib/content/validate";

try {
  const registry = buildRegistry();
  const issues = validateRegistry(registry);
  const errors = issues.filter((i) => i.level === "error");
  const warnings = issues.filter((i) => i.level === "warn");
  for (const i of [...errors, ...warnings]) {
    console.error(
      `${i.level === "error" ? "ERROR" : "warn "} [${i.code}] ${i.where}: ${i.message}`,
    );
  }
  console.log(
    `content validation: ${registry.pages.length} pages, ${registry.nodes.size} entities, ${registry.relations.length} relations, ${registry.facts.size} facts; ${errors.length} errors, ${warnings.length} warnings`,
  );
  process.exit(errors.length > 0 ? 1 : 0);
} catch (e) {
  console.error(`content validation failed to load: ${(e as Error).message}`);
  process.exit(1);
}
