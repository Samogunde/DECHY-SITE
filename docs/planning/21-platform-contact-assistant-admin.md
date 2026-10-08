# Brand assets, images, contact, assistant, human support, and DECHY Admin

Status: implemented 7 to 8 October 2026 (owner brief "Next production implementation pass"). Implementation reference; company facts stay in `data/facts/`.

## 1. Brand assets (`brand/README.md`)

| Asset | Role |
|---|---|
| `brand/logos/primary/dechy-logo.png` (supplied as "DECHY Geometric Logo on White.png") | The site logo: header, footer, Organization logo (`/brand/dechy-logo.png`). Wordmark without the descriptor. Shown by framing the untouched file with `mix-blend-mode: darken`, so its white background disappears on Warm Off White without editing pixels. |
| `brand/social/DECHY Technology Solutions Social Image.png` | Default Open Graph and X image, served as `/og/dechy-technology-solutions-social-image.png` (scaled to 1200 wide and padded with its own background to 1200 x 630 so platforms that crop to 1.91:1 never cut the wordmark or descriptor). Never the site logo. |
| `brand/monogram/DECHY_Monogram_On_Dark_Background.png` | favicon.ico (16, 32, 48) and icon.png (96), surround made transparent. |
| `brand/monogram/Minimalist Navy D Emblem with Blue Accent.png` | apple-icon (180) and manifest icons (192, 512, maskable). |

All derivatives are rebuilt by `npm run brand:derivatives`. Masters are byte-checked in `tests/unit/brand-governance.test.ts`.

## 2. Images

Every image under `public/` and `brand/` is registered in `data/assets/images.yaml` (source, license or provenance, SHA-256, size, alt text, usage); the build fails otherwise. Owner-supplied photographs carry provenance notes in `data/assets/licenses/`. No credit is ever shown on the site.

Resolution rule (validator): the stored width must be at least twice the widest the photograph renders in each layout it is placed in: rail 848 px, aside 1120 px, split 1536 px, band 2400 px.

Placements (7 October 2026): Contact (consultation conversation, rail); Consulting (process-mapping review, split); AI Customer Support (support team, opening aside); Cloud & DevOps (infrastructure review, opening aside); Data & Analytics (team reviewing reports, opening aside); Company (team working session, opening aside). Kept: port operations, warehouse aisle, manufacturing line, phone dashboard, wireframes desk. Not used: "Modern Workspace Dashboards in Warm Sunlight" (invented client names, project dates, and figures that would read as DECHY project evidence, plus a visible generation artifact); the team-at-workflow-screens image (national flags would imply offices; cropping them leaves it too small to stay sharp). The notebook-desk photograph was replaced on Contact and removed.

## 3. Data layer (`src/lib/server/`)

One key-value interface (`store.ts`) with backends: `netlify-blobs` (production, chosen automatically on Netlify), `file` (local and browser tests, `DATA_DIR`), `memory` (unit tests), `none`. Records (`records.ts`): Inquiry, SupportRequest (an AIHandoff is a support request with origin `assistant-escalation`), Conversation with ConversationMessage, Contact (one per email), Activity. References look like `DECHY-7F42K9` (30 unambiguous characters). Conversations are deleted after `CONVERSATION_RETENTION_DAYS` (default 90) unless escalated. Records and contacts can be deleted permanently from the admin (deletion requests).

## 4. Contact form

Fields: name, work email, what can we help with (the 15 services or "Not sure yet"), project description; optional organization, timeline, and budget ($2,000 to $4,999; $5,000 to $9,999; $10,000 to $14,999; $15,000 to $19,999; $20,000 to $29,999; $30,000+; Not sure yet). The owner's ranges are written with "to" because the house style forbids en dashes (AGENTS 1A.16); switch in `src/lib/contact/validate.ts` and `ContactForm.tsx` if the dash is wanted.

Flow: browser, `/api/contact` (JSON only, same origin, 16 KB cap, rate limit, honeypot, minimum fill time, server validation), the inquiry stored as the source of truth, an `inquiry.created` event, then email through the configured delivery (`CONTACT_DELIVERY`: none, log, webhook, resend) with the visitor as Reply-To. The visitor gets the reference as soon as the inquiry is stored, even before email is configured.

## 5. Assistant and human support

The launcher ("Ask DECHY") is a few kilobytes on every public page; the panel loads only when opened. The engine (`src/lib/assistant/`) answers from the site's own pages (services, solutions, Work Areas, industries, technologies, and their "what we do / problem / who it helps / how to choose" answers) and the approved facts. AI mode (`AI_PROVIDER=anthropic`, `AI_API_KEY`, `AI_MODEL`) calls the model server-side with a fixed system prompt, a 20 s timeout, 600 output tokens, and JSON output that is validated: recommendations must be known ids, links are built by the server, replies become plain text without URLs. Without a key, or if the model fails, guided mode answers from the same catalog. The panel says it is an automated (or AI) assistant, not a person.

A request for a person ("I'd rather talk to someone", "can someone contact me") is honored immediately in either mode. `/api/assistant/handoff` creates a SupportRequest with a reference, the conversation, a neutral summary (no guessed mood, urgency, or personal details), the detected need and recommendations, urgency only when the visitor ticks "This is time-sensitive", and the reason; emits `assistant.escalated` or `support.requested`; emails the business mailbox if configured; and shows "Your request has been sent to the DECHY team. Your reference is DECHY-XXXXXX." No response time is promised.

Contact page paths: "Help me figure out what I need" (assistant), "I know what I need" (form), "I want to speak to someone" (person form).

## 6. DECHY Admin (`/admin/`)

Private, server-rendered, outside the public layout and bundles (its stylesheet loads only on admin routes), `noindex`, disallowed in robots. Pages: Overview (new inquiries, unread, open support, AI escalations, conversations, recent activity, connection status), Inbox (filters: contact form, AI handoffs, human support, business email; status), record detail (details, summary, message, conversation, status, handled by, mark unread, reply by email, delete), AI conversations, Contacts (with delete).

Authentication (`src/lib/server/auth.ts`): locked until `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` (scrypt, from `npm run admin:hash`), and `ADMIN_SESSION_SECRET` (32+ characters) are set. HMAC-signed, HttpOnly, SameSite=Strict, Secure session cookie (eight hours); sign-in rate limited; every page and endpoint checks on the server. A dedicated identity provider can replace this module later without touching the pages.

API for the admin web app and a future mobile app (session cookie or `Authorization: Bearer ADMIN_API_TOKEN`): `GET /api/admin/records` (filters; `?view=overview`), `GET|PATCH|DELETE /api/admin/records/{ref}`, `DELETE /api/admin/contacts/{id}`. Inbound business email (ready for configuration): `POST /api/admin/ingest/email` with `x-dechy-ingest-secret` (`EMAIL_INGEST_SECRET`).

## 7. Notifications

Every event (`inquiry.created`, `support.requested`, `assistant.escalated`, `email.received`, `record.status_changed`) is recorded as Activity and sent to `NOTIFICATION_PROVIDER` (none, log, webhook). The webhook receives `{type, ref, title, at, adminPath}` signed with `x-dechy-signature: sha256=HMAC(NOTIFICATION_WEBHOOK_SECRET)`; no message bodies or email addresses, so a push service holds no more personal data than it needs.

## 8. Security summary

Server-side secrets only; JSON-only public endpoints with same-origin checks, size caps, schema validation, honeypots, and rate limits (salted hashes of client addresses; addresses never stored); safe errors with no internal detail; no-store responses; prompt-injection resistance (visitor text never in the system prompt, validated JSON output, allow-listed recommendations, server-built links, plain-text rendering); admin authorization on the server for every page and endpoint; no credentials in the repository (test runs generate a random admin password).

## 9. Status

| Item | State |
|---|---|
| Brand assets, icons, social image, structured-data logo | Implemented |
| Image audit and placements | Implemented |
| Contact form, storage, references | Implemented |
| Assistant (guided mode) and human handoff | Implemented |
| Assistant AI mode | Ready for configuration (`AI_API_KEY`) |
| DECHY Admin web, API, deletion | Implemented; ready for configuration (admin environment variables on the host) |
| Netlify Blobs storage | Implemented; automatic on Netlify, needs a deploy to take effect |
| Email to the business mailbox | Ready for configuration; blocked by the owner's pending email and domain decision |
| Inbound business email | Ready for configuration (provider webhook plus `EMAIL_INGEST_SECRET`) |
| Push notifications and mobile admin app | Event boundary and webhook ready; no provider chosen; no app built |
