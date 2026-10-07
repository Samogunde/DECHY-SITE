import type { CSSProperties } from "react";
import type { DiagramSpec, FigureId } from "@/lib/content/schema";
import { ConnectedFlow } from "./ConnectedFlow";
import {
  AnalyticsUi,
  AssistantUi,
  CrmUi,
  DashboardUi,
  InterfaceSet,
  MobileAppUi,
  SiteBuilder,
  StoreUi,
  WorkflowUi,
} from "./Mockups";
import { ModernizationPath } from "./ModernizationPath";
import { PortalWireframe } from "./PortalWireframe";
import { QualityLayers } from "./QualityLayers";
import { SoftwareAnatomy } from "./SoftwareAnatomy";
import { SpecDiagram, defaultMax } from "./SpecDiagram";
import { SystemMap } from "./SystemMap";

/**
 * Every figure is  .figure > .figure-frame > diagram  followed by its caption inside the same
 * .figure. The figure owns the width (max), so the diagram and caption share one left edge and one
 * right edge at every viewport. Never size a diagram or position a caption independently.
 * `max` is the widest the figure may be; omit it for diagrams that fill their column.
 */
const FIGURES: Record<
  FigureId,
  { Component: (p: { titleId: string }) => React.JSX.Element; max?: string }
> = {
  "system-map": { Component: SystemMap, max: "34rem" },
  "connected-flow": { Component: ConnectedFlow },
  "software-anatomy": { Component: SoftwareAnatomy, max: "34rem" },
  "quality-layers": { Component: QualityLayers },
  "modernization-path": { Component: ModernizationPath },
  "portal-wireframe": { Component: PortalWireframe, max: "46rem" },
  // Conceptual interface mockups (Phase 5)
  "site-builder": { Component: SiteBuilder, max: "40rem" },
  "store-ui": { Component: StoreUi, max: "44rem" },
  "dashboard-ui": { Component: DashboardUi, max: "40rem" },
  "mobile-app-ui": { Component: MobileAppUi, max: "20rem" },
  "crm-ui": { Component: CrmUi, max: "42rem" },
  "analytics-ui": { Component: AnalyticsUi, max: "38rem" },
  "assistant-ui": { Component: AssistantUi, max: "28rem" },
  "workflow-ui": { Component: WorkflowUi, max: "42rem" },
  "interface-set": { Component: InterfaceSet },
};

/** Conceptual interface mockups sit beside their text instead of under it (see DiagramBlock). */
export const MOCKUP_FIGURES = new Set<FigureId>([
  "site-builder",
  "store-ui",
  "dashboard-ui",
  "mobile-app-ui",
  "crm-ui",
  "analytics-ui",
  "assistant-ui",
  "workflow-ui",
]);

export function Figure({
  id,
  spec,
  title,
  uid,
  caption,
  className = "",
  max,
}: {
  /** A named, bespoke diagram (Phase 1 diagrams). */
  id?: FigureId;
  /** A data-driven teaching diagram. Exactly one of id or spec is given. */
  spec?: DiagramSpec;
  title?: string;
  uid: string;
  caption: string;
  className?: string;
  /** Override the widest the figure may be (for example in a narrow hero column). */
  max?: string;
}) {
  const named = id ? FIGURES[id] : undefined;
  const widest = max ?? (spec ? defaultMax(spec) : named?.max);
  const style = widest ? ({ "--fig-max": widest } as CSSProperties) : undefined;
  return (
    <figure className={`figure ${className}`.trim()} style={style} data-reveal="figure">
      <div className="figure-frame">
        {spec ? (
          <SpecDiagram spec={spec} titleId={`fig-${uid}`} title={title ?? caption} />
        ) : named ? (
          <named.Component titleId={`fig-${uid}`} />
        ) : null}
      </div>
      {/* The caption stays in the markup for assistive technology and search; it is not shown. */}
      <figcaption className="visually-hidden">{caption}</figcaption>
    </figure>
  );
}
