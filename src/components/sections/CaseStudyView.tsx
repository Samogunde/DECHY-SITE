import Link from "next/link";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { Breadcrumbs } from "@/components/patterns/Breadcrumbs";
import { TechLogo } from "@/components/home/TechLogo";
import { Arrow } from "@/components/primitives/Arrow";
import { LinkButton } from "@/components/primitives/LinkButton";
import { Photo } from "@/components/primitives/Photo";
import { breadcrumbsFor } from "@/lib/content/breadcrumbs";
import { showDrafts, type Registry } from "@/lib/content/load";
import {
  projectPath,
  projectPhoto,
  projects,
  showResults,
  type Project,
} from "@/lib/content/portfolio";
import type { Page } from "@/lib/content/schema";
import { publishedPath } from "@/lib/content/urls";
import { PortfolioCard } from "./PortfolioCard";

/** A case study page: hero with the main screen, results, the story, what we built, more screens. */
export function CaseStudyView({ page, registry }: { page: Page; registry: Registry }) {
  const p = projects().find((x) => projectPath(x) === page.path);
  if (!p) return null;
  const drafts = showDrafts();
  const service = (slug: string) => registry.services.find((s) => s.slug === slug);
  const industry = registry.nodes.get(p.industry);
  const industryHref = publishedPath(industry, registry);
  const related = projects()
    .filter((x) => x.slug !== p.slug)
    .map((x) => ({
      x,
      score:
        (x.service === p.service ? 3 : 0) +
        (x.industry === p.industry ? 2 : 0) +
        x.services.filter((s) => p.services.includes(s)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((r) => r.x);
  const results = showResults(p, drafts);
  return (
    <>
      <section id="hero" className="page-hero cs-hero" aria-labelledby="hero-h">
        <div className="container-site">
          <div className="mb-8">
            <Breadcrumbs crumbs={breadcrumbsFor(page, registry)} />
          </div>
          <div className="cs-hero-grid">
            <div className="min-w-0">
              <p className="t-eyebrow eyebrow-accent m-0">Case study</p>
              <p className="cs-project">{p.title}</p>
              <h1 id="hero-h" className="cs-title">
                {p.headline}
              </h1>
              <p className="cs-client">{p.client}</p>
              <dl className="cs-meta">
                <div>
                  <dt>Industry</dt>
                  <dd>
                    {industryHref ? (
                      <Link href={industryHref}>{industry?.name}</Link>
                    ) : (
                      industry?.name
                    )}
                  </dd>
                </div>
                <div>
                  <dt>Timeline</dt>
                  <dd>{p.duration}</dd>
                </div>
                <div>
                  <dt>Services</dt>
                  <dd className="cs-services">
                    {p.services.map((s) => {
                      const svc = service(s);
                      return svc ? (
                        <Link key={s} href={`/${svc.slug}/`} className="cs-chip">
                          {svc.name}
                        </Link>
                      ) : null;
                    })}
                  </dd>
                </div>
              </dl>
              <div className="mt-8 flex flex-wrap gap-3">
                <LinkButton href="/contact/" arrow>
                  Start a similar project
                </LinkButton>
                <LinkButton href="/work/" variant="secondary">
                  See all work
                </LinkButton>
              </div>
            </div>
            <figure className="cs-screen">
              <Photo photo={projectPhoto(p.images[0]!)} priority />
            </figure>
          </div>
        </div>
      </section>

      {results ? (
        <section className="section cs-results" aria-label="Results">
          <div className="container-site">
            <p className="t-eyebrow eyebrow-accent m-0">The results</p>
            <ul className="cs-stats">
              {p.results.map((r) => (
                <li key={r.label}>
                  <span className="cs-stat-value">{r.value}</span>
                  <span className="cs-stat-label">{r.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="section cs-story" aria-labelledby="story-h">
        <div className="container-site">
          <p className="t-eyebrow eyebrow-accent m-0">The story</p>
          <h2 id="story-h" className="t-h2 mt-3 max-w-[24ch]">
            From the problem to a system that works
          </h2>
          <ol className="cs-steps">
            <li>
              <span className="cs-step-n">01</span>
              <h3>What the client wanted</h3>
              <p>{p.goal}</p>
            </li>
            <li>
              <span className="cs-step-n">02</span>
              <h3>The challenge</h3>
              <p>{p.problem}</p>
            </li>
            <li className="cs-step-solution">
              <span className="cs-step-n">03</span>
              <h3>What we built</h3>
              <p>{p.solution}</p>
            </li>
          </ol>
        </div>
      </section>

      <section className="section cs-build" aria-labelledby="build-h">
        <div className="container-site">
          <div className="cs-build-grid">
            <div>
              <p className="t-eyebrow eyebrow-accent m-0">Delivered</p>
              <h2 id="build-h" className="t-h2 mt-3">
                What {p.title} includes
              </h2>
              <ul className="cs-delivered">
                {p.delivered.map((d) => (
                  <li key={d}>
                    <CheckCircle aria-hidden="true" weight="fill" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="cs-stack">
              <p className="cs-stack-title">Built with</p>
              <ul>
                {p.stack.map((id) => {
                  const node = registry.nodes.get(id);
                  if (!node) return null;
                  const href = publishedPath(node, registry);
                  const body = (
                    <>
                      <span className="cs-stack-mark">
                        <TechLogo id={id} name={node.name} />
                      </span>
                      <span>{node.name}</span>
                    </>
                  );
                  return (
                    <li key={id}>
                      {href ? (
                        <Link href={href} className="cs-stack-item">
                          {body}
                        </Link>
                      ) : (
                        <span className="cs-stack-item">{body}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
              <p className="cs-stack-note">
                Timeline: <strong>{p.duration}</strong> from kickoff to launch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {p.images.length > 1 ? (
        <section className="section cs-more" aria-label={`More from ${p.title}`}>
          <div className="container-site">
            {p.images.slice(1).map((img) => (
              <figure key={img} className="cs-screen cs-screen-wide">
                <Photo photo={projectPhoto(img)} />
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      <section className="section cs-related" aria-labelledby="related-h">
        <div className="container-site">
          <div className="cs-related-head">
            <div>
              <p className="t-eyebrow eyebrow-accent m-0">More work</p>
              <h2 id="related-h" className="t-h2 mt-3">
                Related projects
              </h2>
            </div>
            <Link href="/work/" className="mega-foot-link">
              See all case studies <Arrow />
            </Link>
          </div>
          <ul className="pf-grid">
            {related.map((r: Project) => (
              <li key={r.slug}>
                <PortfolioCard project={r} registry={registry} drafts={drafts} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section tone-ink cta-band" aria-labelledby="cta-h">
        <div className="container-site">
          <div className="grid items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <h2 id="cta-h" className="t-h2 max-w-[24ch]">
                Want results like {p.title}?
              </h2>
              <p className="t-body-lg mt-5 max-w-[56ch]">
                Tell us what you need. We reply with a plan, a fixed quote, and a timeline.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
              <LinkButton href="/contact/" arrow>
                Start a similar project
              </LinkButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
