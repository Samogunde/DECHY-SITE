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
    { title: "People", text: "Customers, staff, and partners who use the system.", support: [] },
    {
      title: "Screens",
      text: "What people see and use: web, mobile, and admin.",
      support: [{ title: "Sign-in and permissions", text: "Who is allowed to do what." }],
    },
    {
      title: "Rules and processes",
      text: "The steps and rules working behind the screens.",
      support: [
        { title: "Background tasks", text: "Work that runs on its own, such as reminders." },
        { title: "Links to other tools", text: "Sending and receiving information." },
      ],
    },
    {
      title: "Stored information",
      text: "Databases, search, files, and reports.",
      support: [{ title: "Records and alerts", text: "A log of what happened, and warnings." }],
    },
  ],
  base: {
    title: "Build, test, release, look after",
    text: "The delivery process that builds, checks, releases, and maintains the whole system.",
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
