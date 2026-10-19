import type { ReactNode } from "react";
import { Figure } from "@/components/figures/Figure";
import { Inline } from "@/components/primitives/Inline";
import { LinkButton } from "@/components/primitives/LinkButton";
import { getRegistry } from "@/lib/content/load";
import type { Block } from "@/lib/content/schema";
import { pathExists } from "@/lib/content/urls";
import { RotatingHero } from "@/components/home/RotatingHero";

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
  const hasVisual = Boolean(aside || block.figure || block.spec);
  if (isHome && block.slides.length > 0) {
    const actions = block.ctas
      .filter((c) => c.href.startsWith("#") || pathExists(c.href.split(/[?#]/)[0] ?? "", registry))
      .map((c, i) =>
        c.href.startsWith("#") ? (
          <a key={c.label} href={c.href} className="btn btn-ghost">
            {c.label}
          </a>
        ) : (
          <LinkButton
            key={c.label}
            href={c.href}
            variant={i === 0 ? "primary" : "secondary"}
            arrow={i === 0}
          >
            {c.label}
          </LinkButton>
        ),
      );
    return (
      <RotatingHero
        eyebrow={block.eyebrow}
        title={block.headline}
        slides={block.slides.map((s) => ({
          label: s.label,
          word: s.word,
          lead: s.lead,
          chips: s.chips,
        }))}
        visuals={block.slides.map((s, i) => (
          <Figure
            key={s.label}
            id={s.figure}
            uid={`hero-${i}`}
            caption={`${s.label}: a conceptual interface.`}
          />
        ))}
        actions={actions}
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
          : "tone-paper overflow-hidden pb-14 pt-6 min-[48rem]:pb-20 lg:pb-24"
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
