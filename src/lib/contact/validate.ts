/**
 * Contact form validation (server authoritative). Only the minimum needed to respond is collected
 * (AGENTS 89). The shape is mirrored by light client-side checks in the form component.
 */
import { z } from "zod";

export const TIMELINES = ["asap", "one-to-three-months", "later", "exploring"] as const;

/**
 * Optional budget ranges as the owner specified (7 October 2026), written with "to" per the house
 * style (AGENTS 1A.16, no en dashes). Never required.
 */
export const BUDGETS = [
  "$2,000 to $4,999",
  "$5,000 to $9,999",
  "$10,000 to $14,999",
  "$15,000 to $19,999",
  "$20,000 to $29,999",
  "$30,000+",
  "Not sure yet",
] as const;

/** The "What can we help with?" choice when the visitor does not know which service fits. */
export const NOT_SURE = "Not sure yet";

export const ContactInput = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(120, "That name is too long."),
  email: z.string().trim().email("Please enter a valid email address.").max(200),
  organization: z.string().trim().max(160).optional().default(""),
  interest: z
    .string({ error: "Please choose what we can help with." })
    .trim()
    .min(1, "Please choose what we can help with.")
    .max(80),
  timeline: z.enum(TIMELINES).optional(),
  budget: z.enum(BUDGETS).optional(),
  message: z
    .string()
    .trim()
    .min(20, "Please tell us a little more (at least 20 characters).")
    .max(4000, "Please keep the message under 4,000 characters."),
  /** Honeypot. Real people never see or fill this field. */
  website: z.string().max(500).optional().default(""),
  /** Client timestamp (ms) when the form was rendered; used to reject instant bot submissions. */
  startedAt: z.number().int().positive().optional(),
});
export type ContactInput = z.infer<typeof ContactInput>;

export type FieldErrors = Partial<Record<keyof ContactInput, string>>;

/**
 * Validates a submission. When `interests` is given (the server passes the 15 service names plus
 * "Not sure yet"), the help-with choice must be one of them.
 */
export function validateContact(
  raw: unknown,
  interests?: readonly string[],
): { ok: true; data: ContactInput } | { ok: false; errors: FieldErrors } {
  const parsed = ContactInput.safeParse(raw);
  if (parsed.success) {
    if (interests && !interests.includes(parsed.data.interest))
      return { ok: false, errors: { interest: "Please choose what we can help with." } };
    return { ok: true, data: parsed.data };
  }
  const errors: FieldErrors = {};
  for (const issue of parsed.error.issues) {
    const key = issue.path[0] as keyof ContactInput | undefined;
    if (key && !errors[key]) errors[key] = issue.message;
  }
  return { ok: false, errors };
}

/** Minimum time between render and submit that a human could plausibly achieve. */
export const MIN_FILL_MS = 2500;
