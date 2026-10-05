import type { ReactNode } from "react";
import { Figure } from "@/components/figures/Figure";
import { Inline } from "@/components/primitives/Inline";
import { LinkButton } from "@/components/primitives/LinkButton";
import { getRegistry } from "@/lib/content/load";
import type { Block } from "@/lib/content/schema";
import { pathExists } from "@/lib/content/urls";

type HeroBlock = Extract<Block, { type: "hero" }>;

export function Hero({ block, breadcrumbs }: { block: HeroBlock; breadcrumbs?: ReactNode }) {
  const registry = getRegistry();
  const isHome = block.variant === "home";
  return (
    <section
      id={block.id}
      aria-labelledby={`${block.id}-h`}
      className="tone-paper overflow-hidden pb-14 pt-6 min-[48rem]:pb-20 lg:pb-24"
    >
      <div className="container-site">
        {breadcrumbs ? (
          <div className="mb-8 min-[48rem]:mb-12">{breadcrumbs}</div>
        ) : (
          <div className="h-4 min-[48rem]:h-8" />
        )}
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-16">
          <div className="lg:col-span-7">
            {block.eyebrow ? <p className="t-eyebrow m-0">{block.eyebrow}</p> : null}
            <h1
              id={`${block.id}-h`}
              className={`${isHome ? "t-display" : "t-h1"} mt-4 max-w-[19ch] ${isHome ? "min-[48rem]:max-w-[17ch]" : ""}`}
            >
              {block.headline}
            </h1>
            <p className="t-lead mt-6 min-[48rem]:mt-8">
              <Inline text={block.lead} />
            </p>
            {block.support ? (
              <p className="t-body mt-4 max-w-[52ch] text-slate-text">
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
          </div>
          <div className="lg:col-span-5">
            <Figure id={block.figure} uid={block.id} caption={block.figureCaption} />
          </div>
        </div>
      </div>
    </section>
  );
}
