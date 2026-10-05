import type { FigureId } from "@/lib/content/schema";
import { ConnectedFlow } from "./ConnectedFlow";
import { ModernizationPath } from "./ModernizationPath";
import { PortalWireframe } from "./PortalWireframe";
import { QualityLayers } from "./QualityLayers";
import { SoftwareAnatomy } from "./SoftwareAnatomy";
import { SystemMap } from "./SystemMap";

const MAP: Record<FigureId, (p: { titleId: string }) => React.JSX.Element> = {
  "system-map": SystemMap,
  "connected-flow": ConnectedFlow,
  "software-anatomy": SoftwareAnatomy,
  "quality-layers": QualityLayers,
  "modernization-path": ModernizationPath,
  "portal-wireframe": PortalWireframe,
};

export function Figure({
  id,
  uid,
  caption,
  className = "",
}: {
  id: FigureId;
  uid: string;
  caption: string;
  className?: string;
}) {
  const Cmp = MAP[id];
  return (
    <figure className={`figure ${className}`.trim()} data-reveal="figure">
      <Cmp titleId={`fig-${uid}`} />
      <figcaption className="t-caption mt-3">{caption}</figcaption>
    </figure>
  );
}
