import type { CSSProperties } from "react";
import type { DiagramSpec, FigureId } from "@/lib/content/schema";
import { ConnectedFlow } from "./ConnectedFlow";
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
  "portal-wireframe": { Component: PortalWireframe },
};

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
      <figcaption className="figure-caption t-caption">{caption}</figcaption>
    </figure>
  );
}
