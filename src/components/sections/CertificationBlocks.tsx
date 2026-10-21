import Image from "next/image";
import Link from "next/link";
import { Arrow } from "@/components/primitives/Arrow";
import {
  certificationGroups,
  certificationSrc,
  featuredCertifications,
} from "@/lib/content/certifications";
import { getRegistry } from "@/lib/content/load";
import type { Block } from "@/lib/content/schema";
import { Section } from "./Section";

type Of<T extends Block["type"]> = Extract<Block, { type: T }>;

/** A badge on its dark tile. Badges keep their own artwork; only the background was removed. */
function Badge({ src, name, size }: { src: string; name: string; size: number }) {
  return (
    <span className="cert-tile">
      <Image src={src} alt={`${name} badge`} width={size} height={size} sizes={`${size}px`} />
    </span>
  );
}

/** Home and About us: a row of badges and a link to the full Certifications page. */
export function CertificationStripBlock({ block }: { block: Of<"certification-strip"> }) {
  const all = certificationGroups().flatMap((g) => g.items);
  const shown = featuredCertifications(block.limit);
  const href = "/company/certifications/";
  const live = getRegistry().pageByPath.has(href);
  return (
    <Section id={block.id} tone={block.tone} ruled={false} className="cert-strip-section">
      <div className="cert-strip-head">
        <div>
          <p className="t-eyebrow eyebrow-accent m-0">{block.label}</p>
          <h2 id={`${block.id}-h`} className="home-h2 mt-4">
            {block.heading}
          </h2>
        </div>
        {block.intro ? <p className="cert-strip-intro">{block.intro}</p> : null}
      </div>
      <ul className="cert-strip">
        {shown.map((c) => (
          <li key={c.file}>
            <Badge src={certificationSrc(c)} name={c.name} size={112} />
          </li>
        ))}
      </ul>
      {live ? (
        <div className="cert-strip-foot">
          <p className="m-0">
            <strong>{all.length} certifications</strong> from AWS, Microsoft, Google, Salesforce,
            Meta, PMI, and more.
          </p>
          <Link href={href} className="mega-foot-link">
            See all certifications <Arrow />
          </Link>
        </div>
      ) : null}
    </Section>
  );
}

/** The Certifications page: every badge, grouped by area, with what it proves. */
export function CertificationListBlock({ block }: { block: Of<"certification-list"> }) {
  const groups = certificationGroups();
  return (
    <Section id={block.id} tone={block.tone} ruled={false} className="cert-list-section">
      <h2 id={`${block.id}-h`} className="sr-only">
        {block.heading}
      </h2>
      <nav className="cert-nav" aria-label="Certification areas">
        {groups.map((g) => (
          <a key={g.id} href={`#cert-${g.id}`}>
            {g.label}
          </a>
        ))}
      </nav>
      {groups.map((g) => (
        <section
          key={g.id}
          id={`cert-${g.id}`}
          className="cert-group"
          aria-labelledby={`cert-${g.id}-h`}
        >
          <div className="cert-group-head">
            <h3 id={`cert-${g.id}-h`} className="cert-group-title">
              {g.label}
            </h3>
            <p className="cert-group-summary">{g.summary}</p>
          </div>
          <ul className="cert-rows">
            {g.items.map((c) => (
              <li key={c.file} className="cert-row">
                <Badge src={certificationSrc(c)} name={c.name} size={140} />
                <div className="cert-row-text">
                  <p className="cert-issuer">{c.issuer}</p>
                  <h4 className="cert-name">{c.name}</h4>
                  <p className="cert-text">{c.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </Section>
  );
}

/** The Certifications page hero figures: how many badges, from how many issuers, in which areas. */
export function CertificationFiguresBlock({ block }: { block: Of<"certification-figures"> }) {
  const groups = certificationGroups();
  const all = groups.flatMap((g) => g.items);
  const issuers = new Set(all.flatMap((c) => c.issuer.split(" and ")));
  const platforms = ["AWS", "Microsoft Azure", "Google Cloud", "Salesforce", "Meta", "GitHub"];
  return (
    <Section id={block.id} tone={block.tone} ruled={false} className="cert-figures-section">
      <h2 id={`${block.id}-h`} className="sr-only">
        {block.heading}
      </h2>
      <div className="cert-figures">
        <dl className="cert-figure-list">
          <div>
            <dt>Professional certifications held by our team</dt>
            <dd>{all.length}</dd>
          </div>
          <div>
            <dt>Certifying bodies, from AWS and Microsoft to PMI</dt>
            <dd>{issuers.size}</dd>
          </div>
          <div>
            <dt>Areas covered, from cloud and AI to delivery and search</dt>
            <dd>{groups.length}</dd>
          </div>
        </dl>
        <div className="cert-platforms">
          <p className="cert-platforms-title">Certified on</p>
          <ul>
            {platforms.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
