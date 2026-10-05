import Link from "next/link";
import { getRegistry } from "@/lib/content/load";
import { expandFacts, parseInline } from "@/lib/content/inline";
import { pathExists, publishedPath } from "@/lib/content/urls";

/**
 * Renders inline content markup. References to entities whose page does not exist yet render as
 * plain text (approved rule: no dead links, no fake routes, no "coming soon").
 */
export function Inline({ text }: { text: string }) {
  const registry = getRegistry();
  const tokens = parseInline(expandFacts(text, registry.facts));
  return (
    <>
      {tokens.map((t, i) => {
        if (t.kind === "text") return <span key={i}>{t.text}</span>;
        if (t.kind === "bold") return <strong key={i}>{t.text}</strong>;
        const { label, target } = t;
        if (target.startsWith("ref:")) {
          const node = registry.nodes.get(target.slice(4));
          const href = publishedPath(node, registry);
          return href ? (
            <Link key={i} href={href}>
              {label}
            </Link>
          ) : (
            <span key={i}>{label}</span>
          );
        }
        if (target.startsWith("/")) {
          return pathExists(target, registry) ? (
            <Link key={i} href={target}>
              {label}
            </Link>
          ) : (
            <span key={i}>{label}</span>
          );
        }
        return (
          <a key={i} href={target} rel="noopener noreferrer">
            {label}
          </a>
        );
      })}
    </>
  );
}

/** An entity's name: a link when its page exists, plain text otherwise. */
export function EntityName({ id, className }: { id: string; className?: string }) {
  const registry = getRegistry();
  const node = registry.nodes.get(id);
  if (!node) throw new Error(`EntityName: unknown entity ${id}`);
  const href = publishedPath(node, registry);
  return href ? (
    <Link href={href} className={className}>
      {node.name}
    </Link>
  ) : (
    <span className={className}>{node.name}</span>
  );
}

/** Custom text for an entity reference: a link when the page exists, plain text otherwise. */
export function EntityLink({
  id,
  children,
  className,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  const registry = getRegistry();
  const node = registry.nodes.get(id);
  if (!node) throw new Error(`EntityLink: unknown entity ${id}`);
  const href = publishedPath(node, registry);
  return href ? (
    <Link href={href} className={className}>
      {children}
    </Link>
  ) : (
    <span className={className}>{children}</span>
  );
}
