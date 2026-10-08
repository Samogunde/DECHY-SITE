import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageView } from "@/components/sections/PageView";
import { getRegistry } from "@/lib/content/load";
import { pageMetadata } from "@/lib/seo/metadata";

/**
 * Renders every page record that does not have its own route file. Routes come from the content
 * registry, so a page exists exactly when its record does; nothing is hand-listed. Unknown paths
 * return the 404 page.
 */
export const dynamicParams = false;

/** Pages with their own route files (Phase 1). */
const DEDICATED = new Set(["/", "/software-development/", "/contact/", "/privacy/", "/cookies/"]);

type Props = { params: Promise<{ slug: string[] }> };

function pathFor(slug: string[]): string {
  return `/${slug.join("/")}/`;
}

export function generateStaticParams() {
  return getRegistry()
    .pages.filter((p) => !DEDICATED.has(p.path))
    .map((p) => ({ slug: p.path.split("/").filter(Boolean) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = getRegistry().pageByPath.get(pathFor((await params).slug));
  if (!page) notFound();
  return pageMetadata(page);
}

export default async function Page({ params }: Props) {
  const path = pathFor((await params).slug);
  if (!getRegistry().pageByPath.has(path)) notFound();
  return <PageView path={path} />;
}
