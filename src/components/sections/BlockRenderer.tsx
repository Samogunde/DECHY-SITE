import type { ReactNode } from "react";
import { Photo } from "@/components/primitives/Photo";
import { getRegistry } from "@/lib/content/load";
import type { Block, Page } from "@/lib/content/schema";
import { CONNECTS_KINDS } from "@/lib/connections";
import { ContactForm } from "./ContactForm";
import { ArticlesBlock, BrowseBlock, ConnectsBlock, DirectoryBlock } from "./DiscoveryBlocks";
import { DefinitionBlock, IndexBlock, ProseBlock, StatementBlock } from "./EditorialBlocks";
import { CtaBlock, FaqBlock, LegalBlock } from "./FaqCtaLegalBlocks";
import { CalloutBlock, ChooserBlock, PathFinderBlock, TechnicalBlock } from "./GuidanceBlocks";
import { Hero } from "./Hero";
import { ColumnsBlock, EntitiesBlock, RelatedBlock, ServiceIndexBlock } from "./ListBlocks";
import { DiagramBlock, ProcessBlock, TableBlock } from "./ProcessTableBlocks";
import { Section, SectionHeader } from "./Section";

function ContactFormBlock({ block }: { block: Extract<Block, { type: "contact-form" }> }) {
  const options = getRegistry().services.map((s) => ({ value: s.slug, label: s.name }));
  return (
    <Section id={block.id} tone={block.tone}>
      <div className="editorial">
        <div className="rail">
          <SectionHeader
            id={block.id}
            label={block.label}
            heading={block.heading}
            intro={block.intro}
          />
          {block.photo ? <Photo photo={block.photo} className="mt-8" /> : null}
        </div>
        <div className="max-w-[40rem]">
          <ContactForm services={options} />
        </div>
      </div>
    </Section>
  );
}

export function BlockRenderer({
  block,
  breadcrumbs,
  page,
  aside,
  visual,
}: {
  block: Block;
  breadcrumbs?: ReactNode;
  /** Hero only: the page family visual beside the headline. */
  aside?: ReactNode;
  /** Opening definition or prose only: a visual set beside the text. */
  visual?: ReactNode;
  /** The page being rendered, for blocks that depend on it (the connections rails). */
  page?: Page;
}) {
  switch (block.type) {
    case "hero":
      return <Hero block={block} breadcrumbs={breadcrumbs} aside={aside} />;
    case "statement":
      return <StatementBlock block={block} />;
    case "definition":
      return <DefinitionBlock block={block} visual={visual} />;
    case "prose":
      return <ProseBlock block={block} visual={visual} />;
    case "index":
      return <IndexBlock block={block} />;
    case "service-index":
      return <ServiceIndexBlock block={block} />;
    case "entities":
      return <EntitiesBlock block={block} page={page} />;
    case "process":
      return <ProcessBlock block={block} />;
    case "table":
      return <TableBlock block={block} page={page} />;
    case "diagram":
      return <DiagramBlock block={block} />;
    case "columns":
      return <ColumnsBlock block={block} />;
    case "faq":
      return <FaqBlock block={block} />;
    case "related":
      return page && CONNECTS_KINDS.has(page.kind) ? (
        <ConnectsBlock block={block} page={page} />
      ) : (
        <RelatedBlock block={block} />
      );
    case "browse":
      return <BrowseBlock block={block} />;
    case "directory":
      return <DirectoryBlock block={block} />;
    case "articles":
      return <ArticlesBlock block={block} />;
    case "cta":
      return <CtaBlock block={block} />;
    case "legal":
      return <LegalBlock block={block} />;
    case "pathfinder":
      return <PathFinderBlock block={block} />;
    case "chooser":
      return <ChooserBlock block={block} />;
    case "technical":
      return <TechnicalBlock block={block} />;
    case "callout":
      return <CalloutBlock block={block} />;
    case "contact-form":
      return <ContactFormBlock block={block} />;
    default: {
      const never: never = block;
      throw new Error(`Unhandled block: ${JSON.stringify(never)}`);
    }
  }
}
