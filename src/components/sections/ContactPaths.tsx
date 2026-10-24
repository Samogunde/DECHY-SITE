"use client";

import { openAssistant } from "@/components/assistant/AssistantLauncher";
import { EmailLink } from "@/components/primitives/EmailLink";

/**
 * Three ways to reach DECHY, each a different intent: work out the need with the assistant, send
 * a project inquiry, or ask for a person. All three are real controls; nothing depends on hover.
 */
export function ContactPaths({
  formId,
  channels,
}: {
  formId: string;
  /** Booking link and phone, each shown only when the owner has configured it. */
  channels: { booking?: string; phone?: string };
}) {
  return (
    <>
      <dl className="contact-emails">
        <div>
          <dt>General questions</dt>
          <dd>
            <EmailLink kind="hello" />
          </dd>
        </div>
        <div>
          <dt>Quotes and new projects</dt>
          <dd>
            <EmailLink kind="sales" />
          </dd>
        </div>
        <div>
          <dt>Existing clients</dt>
          <dd>
            <EmailLink kind="support" />
          </dd>
        </div>
      </dl>
      {channels.booking || channels.phone ? (
        <div className="contact-direct">
          {channels.booking ? (
            <a href={channels.booking} className="btn btn-primary" target="_blank" rel="noopener">
              Book a 30-minute call
            </a>
          ) : null}
          {channels.phone ? (
            <a
              href={`tel:${channels.phone.replace(/[^+\d]/g, "")}`}
              className="contact-direct-link"
            >
              {channels.phone}
            </a>
          ) : null}
        </div>
      ) : null}
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
    </>
  );
}
