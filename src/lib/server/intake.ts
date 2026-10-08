/**
 * Intake: turns what arrives from the website into DECHY Admin records, activity, and
 * notifications. One place, so the contact form, the assistant, human support, and (later)
 * business email all land in the same data layer the same way. Server-only.
 */
import { getRegistry } from "@/lib/content/load";
import { NOT_SURE, type ContactInput } from "@/lib/contact/validate";
import { sendMessage } from "@/lib/contact/deliver";
import { emit } from "./events";
import { Repo, type HandoffContext, type Inquiry } from "./records";

/** "What can we help with?" choices: the 15 services in their navigation order, then "Not sure yet". */
export function interestChoices(): string[] {
  return [...getRegistry().services.map((s) => s.name), NOT_SURE];
}

export async function recordInquiry(
  data: ContactInput,
  repo = new Repo(),
): Promise<{ ref: string } | null> {
  if (repo.storeKind === "none") return null;
  const inquiry = await repo.createInquiry({
    channel: "contact-form",
    name: data.name,
    email: data.email,
    organization: data.organization,
    service: data.interest,
    timeline: data.timeline ?? "",
    budget: data.budget ?? "",
    subject: "",
    message: data.message,
  });
  await emit(repo, {
    type: "inquiry.created",
    ref: inquiry.ref,
    title: `New inquiry: ${data.interest}`,
    actor: "visitor",
  });
  return { ref: inquiry.ref };
}

export type HandoffIntake = {
  /** "existing" creates a Support Request; anything else an Inquiry (new business). */
  kind: "new" | "existing";
  /** True when the record comes from an assistant conversation. */
  fromConversation: boolean;
  name: string;
  email: string;
  organization: string;
  note: string;
  handoff: HandoffContext;
};

/**
 * A confirmed request to talk to the team: stores the record (Inquiry for new business, Support
 * Request for an existing client) with the conversation context, records the event, and emails the
 * business mailbox if configured. The notification carries only the reference and a title.
 */
export async function recordHandoff(
  input: HandoffIntake,
  repo = new Repo(),
): Promise<{ ref: string; kind: "inquiry" | "support"; stored: boolean; delivered: boolean }> {
  const h = input.handoff;
  let ref = "";
  let kind: "inquiry" | "support" = input.kind === "existing" ? "support" : "inquiry";
  if (repo.storeKind !== "none") {
    try {
      if (kind === "support") {
        const req = await repo.createSupportRequest({
          origin: input.fromConversation ? "assistant-escalation" : "visitor-request",
          channel: input.fromConversation ? "assistant" : "human-support",
          name: input.name,
          email: input.email,
          organization: input.organization,
          message: input.note,
          conversationId: h.conversationId,
          summary: [h.summary.need, h.summary.context].filter(Boolean).join(" "),
          detectedNeed: h.detectedNeed,
          recommendedService: h.recommendedService,
          recommendedSolution: h.recommendedSolution,
          urgency: h.urgency,
          escalationReason: h.reason,
          handoff: h,
        });
        ref = req.ref;
      } else {
        const inq = await repo.createInquiry({
          channel: input.fromConversation ? "assistant" : "human-support",
          name: input.name,
          email: input.email,
          organization: input.organization,
          service: h.recommendedService,
          timeline: "",
          budget: "",
          subject: "",
          message: input.note,
          handoff: h,
        });
        ref = inq.ref;
      }
      await emit(repo, {
        type: input.fromConversation
          ? "assistant.escalated"
          : kind === "support"
            ? "support.requested"
            : "inquiry.created",
        ref,
        title: input.fromConversation
          ? kind === "support"
            ? "An existing client asked DECHY AI for the team"
            : "DECHY AI handed a new inquiry to the team"
          : "A visitor asked to talk to the team",
        actor: "visitor",
      });
    } catch {
      ref = "";
    }
  }
  if (!ref) kind = input.kind === "existing" ? "support" : "inquiry";
  const lines = [
    `Reference: ${ref || "not stored"}`,
    `Type: ${kind === "support" ? "existing client" : "new inquiry"}${input.fromConversation ? " from the website assistant" : ""}`,
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    input.organization ? `Organization: ${input.organization}` : null,
    h.urgency === "stated" ? "The visitor said this is time-sensitive." : null,
    h.recommendedService ? `Likely service: ${h.recommendedService}` : null,
    "",
    `Need: ${h.summary.need}`,
    h.summary.context ? `Context: ${h.summary.context}` : null,
    h.summary.openQuestions.length ? `Open questions: ${h.summary.openQuestions.join("; ")}` : null,
    input.note ? `Note from the visitor: ${input.note}` : null,
  ].filter((l): l is string => l !== null);
  const sent = await sendMessage({
    kind: "support",
    subject: `${kind === "support" ? "Client request" : "New inquiry"}${ref ? ` ${ref}` : ""} from ${input.name}`,
    text: lines.join("\n"),
    replyTo: input.email,
    payload: {
      ref,
      type: kind,
      name: input.name,
      email: input.email,
      organization: input.organization,
      urgency: h.urgency,
      need: h.summary.need,
      context: h.summary.context,
      recommendedService: h.recommendedService,
      note: input.note,
    },
  });
  if (!ref && !sent.ok) throw new Error("handoff intake unavailable");
  return { ref, kind, stored: Boolean(ref), delivered: sent.ok };
}

/** Inbound business email (provider webhook), normalized into an inquiry. */
export async function recordEmail(
  e: { fromName: string; fromEmail: string; subject: string; text: string },
  repo = new Repo(),
): Promise<Inquiry> {
  const inquiry = await repo.createInquiry({
    channel: "email",
    name: e.fromName,
    email: e.fromEmail,
    organization: "",
    service: "",
    timeline: "",
    budget: "",
    subject: e.subject,
    message: e.text,
  });
  await emit(repo, {
    type: "email.received",
    ref: inquiry.ref,
    title: `New email: ${e.subject.slice(0, 80) || "(no subject)"}`,
    actor: "visitor",
  });
  return inquiry;
}
