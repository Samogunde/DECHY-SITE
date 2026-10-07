import type { DiagramSpec } from "@/lib/content/schema";
import { SpecDiagram } from "./SpecDiagram";

/**
 * Conceptual diagram: anatomy of a custom business application. Original artwork. It shows the
 * parts a delivered system typically has; it is not a depiction of any client system. Built on the
 * generic layers diagram: every supporting part sits in the same row as the layer it supports.
 * Labels are plain words, each with a short explanation (clarity standard section 6).
 */
const SPEC: DiagramSpec = {
  kind: "layers",
  layerLabel: "Layers of the application",
  supportLabel: "Supporting parts",
  layers: [
    { title: "People", text: "Customers, staff, partners", support: [] },
    {
      title: "Screens",
      text: "Web, mobile, admin",
      support: [{ title: "Access control", text: "Sign-in and permissions" }],
    },
    {
      title: "Rules and processes",
      text: "The logic behind the screens",
      support: [
        { title: "Background tasks", text: "Reminders, scheduled jobs" },
        { title: "Integrations", text: "APIs and other tools" },
      ],
    },
    {
      title: "Data",
      text: "Databases, files, reports",
      support: [{ title: "Logs and alerts", text: "What happened, and warnings" }],
    },
  ],
  base: {
    title: "Build, test, release, maintain",
    text: "One delivery process for the whole system",
  },
};

export function SoftwareAnatomy({ titleId }: { titleId: string }) {
  return (
    <SpecDiagram
      spec={SPEC}
      titleId={titleId}
      title="The parts of a typical business application"
    />
  );
}
