import Link from "next/link";
import { Arrow } from "@/components/primitives/Arrow";
import { Photo } from "@/components/primitives/Photo";
import type { Registry } from "@/lib/content/load";
import { projectPath, projectPhoto, showResults, type Project } from "@/lib/content/portfolio";

/** A portfolio card: the project's screen, its industry and service, one headline result. */
export function PortfolioCard({
  project: p,
  registry,
  drafts,
}: {
  project: Project;
  registry: Registry;
  drafts: boolean;
}) {
  const industry = registry.nodes.get(p.industry)?.name;
  const service = registry.services.find((s) => s.slug === p.service)?.name;
  const r = showResults(p, drafts) ? p.results[0] : undefined;
  return (
    <Link href={projectPath(p)} className="pf-card">
      <span className="pf-shot">
        <Photo photo={projectPhoto(p.images[0]!)} />
      </span>
      <span className="pf-body">
        <span className="pf-meta">
          {industry}
          {service ? <span className="pf-dot">{service}</span> : null}
        </span>
        <span className="pf-name">{p.title}</span>
        <span className="pf-headline">{p.headline}</span>
        {r ? (
          <span className="pf-result">
            <strong>{r.value}</strong> {r.label}
          </span>
        ) : null}
        <span className="pf-go">
          View case study <Arrow />
        </span>
      </span>
    </Link>
  );
}
