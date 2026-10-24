import { EMAILS, mailto, type EmailKind } from "@/lib/contact/emails";

/** A public business address shown as plain text with a matching mailto link. */
export function EmailLink({ kind, className }: { kind: EmailKind; className?: string }) {
  return (
    <a href={mailto(kind)} className={className}>
      {EMAILS[kind]}
    </a>
  );
}
