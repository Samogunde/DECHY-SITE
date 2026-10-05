/**
 * Contact form validation (server authoritative). Only the minimum needed to respond is collected
 * (AGENTS 89). The shape is mirrored by light client-side checks in the form component.
 */
import { z } from "zod";

export const TIMELINES = ["asap", "one-to-three-months", "later", "exploring"] as const;

export const ContactInput = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(120, "That name is too long."),
  email: z.string().trim().email("Please enter a valid email address.").max(200),
  organization: z.string().trim().max(160).optional().default(""),
  interest: z.string().trim().max(80).optional().default(""),
  timeline: z.enum(TIMELINES).optional(),
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

export function validateContact(
  raw: unknown,
): { ok: true; data: ContactInput } | { ok: false; errors: FieldErrors } {
  const parsed = ContactInput.safeParse(raw);
  if (parsed.success) return { ok: true, data: parsed.data };
  const errors: FieldErrors = {};
  for (const issue of parsed.error.issues) {
    const key = issue.path[0] as keyof ContactInput | undefined;
    if (key && !errors[key]) errors[key] = issue.message;
  }
  return { ok: false, errors };
}

/** Minimum time between render and submit that a human could plausibly achieve. */
export const MIN_FILL_MS = 2500;
