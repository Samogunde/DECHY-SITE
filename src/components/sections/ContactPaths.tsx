"use client";

import { openAssistant } from "@/components/assistant/AssistantLauncher";

/**
 * Three ways to reach DECHY, each a different intent: work out the need with the assistant, send
 * a project inquiry, or ask for a person. All three are real controls; nothing depends on hover.
 */
export function ContactPaths({ formId }: { formId: string }) {
  return (
    <ul className="contact-paths" aria-label="Ways to reach DECHY">
      <li>
        <button type="button" className="contact-path" onClick={() => openAssistant("guide")}>
          <span className="contact-path-n" aria-hidden="true">
            01
          </span>
          <span className="contact-path-title">Help me figure out what I need</span>
          <span className="contact-path-body">
            Describe the situation to our assistant and see which service or solution fits.
          </span>
        </button>
      </li>
      <li>
        <a
          href={`#${formId}`}
          className="contact-path"
          onClick={() => {
            requestAnimationFrame(() =>
              document.querySelector<HTMLElement>(`#${formId} input[name="name"]`)?.focus(),
            );
          }}
        >
          <span className="contact-path-n" aria-hidden="true">
            02
          </span>
          <span className="contact-path-title">I know what I need</span>
          <span className="contact-path-body">
            Send the project details through the form below. Budget is optional.
          </span>
        </a>
      </li>
      <li>
        <button type="button" className="contact-path" onClick={() => openAssistant("human")}>
          <span className="contact-path-n" aria-hidden="true">
            03
          </span>
          <span className="contact-path-title">I want to speak to someone</span>
          <span className="contact-path-body">
            Leave your details and a person from the DECHY team will reply by email.
          </span>
        </button>
      </li>
    </ul>
  );
}
