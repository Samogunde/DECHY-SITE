import Link from "next/link";
import type { ReactNode } from "react";
import { Figure } from "@/components/figures/Figure";
import { Inline } from "@/components/primitives/Inline";
import { LinkButton } from "@/components/primitives/LinkButton";
import { getRegistry } from "@/lib/content/load";
import type { Block } from "@/lib/content/schema";
import { pathExists } from "@/lib/content/urls";
import { RotatingHero } from "@/components/home/RotatingHero";
import { Photo } from "@/components/primitives/Photo";
import { ClientFaces } from "@/components/primitives/ClientFaces";

type HeroBlock = Extract<Block, { type: "hero" }>;

export function Hero({
  block,
  breadcrumbs,
  aside,
}: {
  block: HeroBlock;
  breadcrumbs?: ReactNode;
  /** A page family visual that replaces the hero figure (technology profile, solution blueprint). */
  aside?: ReactNode;
}) {
  const registry = getRegistry();
  const isHome = block.variant === "home";
  const hasVisual = Boolean(aside || block.photo || block.figure || block.spec);
  if (isHome && block.slides.length > 0) {
    // Each slide: its own offer button, and a link to the service page it belongs to.
    const live = (href: string) => pathExists(href.split(/[?#]/)[0] ?? "", registry);
    const explore = (label: string) =>
      `Explore ${/^[A-Z]{2}/.test(label) ? label : label[0]!.toLowerCase() + label.slice(1)}`;
    const actions = block.slides.map((s) => (
      <>
        {live(s.cta.href) ? (
          <LinkButton href={s.cta.href} arrow>
            {s.cta.label}
          </LinkButton>
        ) : null}
        {live(s.href) ? (
          <Link href={s.href} className="hero-explore">
            {explore(s.label)}
          </Link>
        ) : null}
      </>
    ));
    return (
      <RotatingHero
        eyebrow={block.eyebrow}
        title={block.headline}
        slides={block.slides.map((s) => ({
          label: s.label,
          headline: s.headline,
          lead: s.lead,
          offer: s.offer,
          chips: s.chips,
        }))}
        actions={actions}
        visuals={block.slides.map((s, i) =>
          s.photo ? (
            <Photo key={s.label} photo={s.photo} className="hero-photo" priority={i === 0} />
          ) : s.figure ? (
            <Figure
              key={s.label}
              id={s.figure}
              uid={`hero-${i}`}
              caption={`${s.label}: a conceptual interface.`}
            />
          ) : null,
        )}
      />
    );
  }
  return (
    <section
      id={block.id}
      aria-labelledby={`${block.id}-h`}
      className={
        isHome
          ? "tone-ink hero-home overflow-hidden pb-14 pt-6 min-[48rem]:pb-20 lg:pb-24"
          : "tone-paper page-hero overflow-hidden pb-14 pt-6 min-[48rem]:pb-20 lg:pb-24"
      }
    >
      <div className="container-site">
        {breadcrumbs ? (
          <div className="mb-8 min-[48rem]:mb-12">{breadcrumbs}</div>
        ) : (
          <div className="h-4 min-[48rem]:h-8" />
        )}
        <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-16">
          <div className={hasVisual ? "min-w-0 lg:col-span-7" : "min-w-0 lg:col-span-9"}>
            {block.eyebrow ? (
              <p className={`t-eyebrow m-0${isHome ? " hero-eyebrow" : ""}`}>{block.eyebrow}</p>
            ) : null}
            <h1
              id={`${block.id}-h`}
              className={`${isHome ? "t-display" : "t-h1"} mt-4 ${isHome ? "max-w-[22ch]" : "max-w-[19ch]"}`}
            >
              {block.headline}
            </h1>
            <p className="t-lead mt-6 min-[48rem]:mt-8">
              <Inline text={block.lead} />
            </p>
            {block.support ? (
              <p
                className={`t-body mt-4 ${isHome ? "hero-support max-w-[46rem]" : "text-slate-text max-w-[52ch]"}`}
              >
                <Inline text={block.support} />
              </p>
            ) : null}
            <div className="mt-9 flex flex-wrap gap-3">
              {block.ctas.map((cta, i) => {
                const internal =
                  cta.href.startsWith("#") || pathExists(cta.href.split(/[?#]/)[0] ?? "", registry);
                if (!internal) return null;
                return cta.href.startsWith("#") ? (
                  <a
                    key={cta.label}
                    href={cta.href}
                    className={`btn w-full min-[30rem]:w-auto ${i === 0 ? "btn-primary" : "btn-secondary"}`}
                  >
                    {cta.label}
                  </a>
                ) : (
                  <LinkButton
                    key={cta.label}
                    href={cta.href}
                    variant={i === 0 ? "primary" : "secondary"}
                    className="w-full min-[30rem]:w-auto"
                    arrow={i === 0}
                  >
                    {cta.label}
                  </LinkButton>
                );
              })}
            </div>
            {!isHome ? (
              <ul className="hero-proof" aria-label="DECHY in brief">
                <li className="hero-proof-clients">
                  <ClientFaces size="md" />
                  <span>
                    <strong>
                      <Inline text="{{fact:company.clients}}" />
                    </strong>{" "}
                    clients helped
                  </span>
                </li>
                <li>
                  Building since{" "}
                  <strong>
                    <Inline text="{{fact:company.founded}}" />
                  </strong>
                </li>
                <li>
                  <strong>15</strong> services, one team
                </li>
                <li>
                  <strong>50+</strong> technologies
                </li>
              </ul>
            ) : null}
            {isHome && block.stats.length > 0 ? (
              <dl className="hero-stats">
                {block.stats.map((st) => (
                  <div key={st.label}>
                    <dt>
                      <Inline text={st.label} />
                    </dt>
                    <dd>
                      <Inline text={st.value} />
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
          {aside ? (
            <div className="min-w-0 lg:col-span-5">{aside}</div>
          ) : block.photo && !isHome ? (
            <div className="min-w-0 lg:col-span-5">
              <figure className="page-hero-photo">
                <Photo photo={block.photo} priority />
              </figure>
            </div>
          ) : hasVisual ? (
            <div className={`min-w-0 lg:col-span-5${isHome ? " hero-visual" : ""}`}>
              <Figure
                id={block.figure}
                spec={block.spec}
                title={block.visualTitle ?? block.headline}
                uid={block.id}
                caption={block.figureCaption ?? ""}
                max={block.spec ? "34rem" : isHome ? "36rem" : undefined}
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
