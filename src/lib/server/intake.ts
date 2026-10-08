/**
 * Intake: turns what arrives from the website into DECHY Admin records, activity, and
 * notifications. One place, so the contact form, the assistant, human support, and (later)
 * business email all land in the same data layer the same way. Server-only.
 */
import { getRegistry } from "@/lib/content/load";
import { NOT_SURE, type ContactInput } from "@/lib/contact/validate";
import { sendMessage } from "@/lib/contact/deliver";
import { emit } from "./events";
import { Repo, type Inquiry, type SupportRequest } from "./records";

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

export type SupportIntake = {
  origin: SupportRequest["origin"];
  channel: SupportRequest["channel"];
  name: string;
  email: string;
  organization: string;
  message: string;
  conversationId: string | null;
  summary: string;
  detectedNeed: string;
  recommendedService: string;
  recommendedSolution: string;
  urgency: SupportRequest["urgency"];
  escalationReason: string;
};

/** Stores the support request, records the event, and emails the business mailbox if configured. */
export async function recordSupport(
  input: SupportIntake,
  repo = new Repo(),
): Promise<{ ref: string; stored: boolean; delivered: boolean }> {
  let ref: string | null = null;
  let req: SupportRequest | null = null;
  if (repo.storeKind !== "none") {
    try {
      req = await repo.createSupportRequest(input);
      ref = req.ref;
      await emit(repo, {
        type: input.origin === "assistant-escalation" ? "assistant.escalated" : "support.requested",
        ref,
        title:
          input.origin === "assistant-escalation"
            ? "The assistant handed a conversation to the team"
            : "A visitor asked to speak to a person",
        actor: "visitor",
      });
    } catch {
      req = null;
    }
  }
  const lines = [
    `Reference: ${ref ?? "not stored"}`,
    `Origin: ${input.origin === "assistant-escalation" ? "assistant handoff" : "visitor asked for a person"}`,
    input.name ? `Name: ${input.name}` : null,
    input.email ? `Email: ${input.email}` : null,
    input.organization ? `Organization: ${input.organization}` : null,
    input.urgency === "stated" ? "The visitor said this is time-sensitive." : null,
    input.recommendedService ? `Likely service: ${input.recommendedService}` : null,
    input.recommendedSolution ? `Likely solution: ${input.recommendedSolution}` : null,
    "",
    input.summary ? `Summary: ${input.summary}` : null,
    input.message ? `Message: ${input.message}` : null,
  ].filter((l): l is string => l !== null);
  const sent = await sendMessage({
    kind: "support",
    subject: `Support request${ref ? ` ${ref}` : ""}${input.name ? ` from ${input.name}` : ""}`,
    text: lines.join("\n"),
    replyTo: input.email || undefined,
    payload: {
      ref,
      origin: input.origin,
      name: input.name,
      email: input.email,
      organization: input.organization,
      urgency: input.urgency,
      summary: input.summary,
      message: input.message,
      recommendedService: input.recommendedService,
      recommendedSolution: input.recommendedSolution,
    },
  });
  if (!ref && !sent.ok) throw new Error("support intake unavailable");
  return { ref: ref ?? "", stored: Boolean(req), delivered: sent.ok };
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
