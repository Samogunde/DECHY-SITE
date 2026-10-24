/**
 * Public business addresses (owner, 24 October 2026). Every address lands in the one business
 * mailbox, which itself never appears on the site. These four are the only addresses the site may
 * show; the validator rejects any other mailto link in content.
 *
 *   hello    general contact: contact page, footer, error pages, privacy policy
 *   sales    quotes and new projects: estimator, cost guides, service pages
 *   support  existing clients: questions sections, footer support link, assistant fallback
 *   billing  invoices and payments only: terms and the payment question; never in navigation
 */
export const EMAILS = {
  hello: "hello@dechytech.com",
  sales: "sales@dechytech.com",
  support: "support@dechytech.com",
  billing: "billing@dechytech.com",
} as const;

export type EmailKind = keyof typeof EMAILS;

export const PUBLIC_EMAILS: ReadonlySet<string> = new Set(Object.values(EMAILS));

export const mailto = (kind: EmailKind) => `mailto:${EMAILS[kind]}`;
