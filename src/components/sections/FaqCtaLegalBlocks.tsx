import { Inline } from "@/components/primitives/Inline";
import { LinkButton } from "@/components/primitives/LinkButton";
import { getRegistry } from "@/lib/content/load";
import type { Block } from "@/lib/content/schema";
import { pathExists } from "@/lib/content/urls";
import { Section, SectionHeader } from "./Section";

type Of<T extends Block["type"]> = Extract<Block, { type: T }>;

/**
 * Common questions: numbered question cards that open in place, with a standing invitation to ask
 * something else beside them.
 */
export function FaqBlock({ block }: { block: Of<"faq"> }) {
  const contact = pathExists("/contact/", getRegistry());
  return (
    <Section id={block.id} tone={block.tone}>
      <div className="faq-layout">
        <div className="faq-side">
          <SectionHeader
            id={block.id}
            label={block.label}
            heading={block.heading}
            intro={block.intro}
          />
        </div>
        <div className="faq faq-cards" data-reveal="group">
          {block.items.map((item, i) => (
            <details key={item.q}>
              <summary>
                <span className="faq-n" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="faq-q">{item.q}</span>
              </summary>
              <div className="answer t-body">
                {item.a.split("\n\n").map((para, k) => (
                  <p key={k}>
                    <Inline text={para} />
                  </p>
                ))}
              </div>
            </details>
          ))}
        </div>
        {contact ? (
          <div className="faq-ask" data-reveal="block">
            <p className="faq-ask-title">Have a different question?</p>
            <p className="faq-ask-text">
              Tell us what you are weighing up and we will answer it plainly.
            </p>
            <LinkButton href="/contact/" variant="secondary" arrow>
              Ask a question
            </LinkButton>
          </div>
        ) : null}
      </div>
    </Section>
  );
}

/** Closing conversion band. Dark surface; no logo on dark in Phase 1. */
export function CtaBlock({ block }: { block: Of<"cta"> }) {
  const registry = getRegistry();
  const primaryOk = pathExists(block.primary.href.split(/[?#]/)[0] ?? "", registry);
  const secondaryOk = block.secondary
    ? pathExists(block.secondary.href.split(/[?#]/)[0] ?? "", registry)
    : false;
  return (
    <section id={block.id} aria-labelledby={`${block.id}-h`} className="section tone-ink cta-band">
      <div className="container-site">
        <div className="grid items-end gap-10 lg:grid-cols-12" data-reveal="block">
          <div className="lg:col-span-8">
            <h2 id={`${block.id}-h`} className="t-h2 max-w-[24ch]">
              {block.heading}
            </h2>
            <p className="t-body-lg mt-5 max-w-[56ch]">
              <Inline text={block.body} />
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
            {primaryOk ? (
              <LinkButton href={block.primary.href} arrow>
                {block.primary.label}
              </LinkButton>
            ) : null}
            {block.secondary && secondaryOk ? (
              <LinkButton href={block.secondary.href} variant="secondary">
                {block.secondary.label}
              </LinkButton>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export function LegalBlock({ block }: { block: Of<"legal"> }) {
  return (
    <section id={block.id} aria-label="Policy text" className="section tone-paper">
      <div className="container-site">
        <div className="prose-article">
          {block.sections.map((s) => (
            <div key={s.heading} className="mb-10">
              <h2 className="t-h3 m-0 mb-3">{s.heading}</h2>
              {s.paragraphs.map((p, i) => (
                <p key={i} className="m-0 mb-4">
                  <Inline text={p} />
                </p>
              ))}
              {s.items.length > 0 ? (
                <ul className="m-0 mb-4 list-disc space-y-1.5 ps-6">
                  {s.items.map((it) => (
                    <li key={it}>
                      <Inline text={it} />
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
