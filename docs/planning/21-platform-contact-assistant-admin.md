# Brand assets, images, contact, assistant, human support, and DECHY Admin

Status: implemented 7 to 8 October 2026 (owner briefs "Next production implementation pass" and "Final AI assistant UX, human handoff, image replacement, and production refinement"). Implementation reference; company facts stay in `data/facts/`.

## 1. Brand assets (`brand/README.md`)

| Asset | Role |
|---|---|
| `brand/logos/primary/dechy-logo.png` (supplied as "DECHY Geometric Logo on White.png") | The site logo: header, footer, Organization logo (`/brand/dechy-logo.png`). Wordmark without the descriptor. Shown by framing the untouched file with `mix-blend-mode: darken`, so its white background disappears on Warm Off White without editing pixels. |
| `brand/social/DECHY Technology Solutions Social Image.png` | Default Open Graph and X image, served as `/og/dechy-technology-solutions-social-image.png` (scaled to 1200 wide and padded with its own background to 1200 x 630 so platforms that crop to 1.91:1 never cut the wordmark or descriptor). Never the site logo. |
| `brand/monogram/DECHY_Monogram_On_Dark_Background.png` | favicon.ico (16, 32, 48), icon.png (96), and `/brand/dechy-monogram.png` (128, the assistant's identity in the launcher and panel), surround made transparent. Never redrawn. |
| `brand/monogram/Minimalist Navy D Emblem with Blue Accent.png` | apple-icon (180) and manifest icons (192, 512, maskable). |

All derivatives are rebuilt by `npm run brand:derivatives`. Masters are byte-checked in `tests/unit/brand-governance.test.ts`.

## 2. Images

Every image under `public/` and `brand/` is registered in `data/assets/images.yaml` (source, license or provenance, SHA-256, size, alt text, usage); the build fails otherwise. Owner-supplied photographs carry provenance notes in `data/assets/licenses/`. No credit is ever shown on the site.

Resolution rule (validator): the stored width must be at least twice the widest the photograph renders in each layout it is placed in: rail 848 px, aside 1120 px, split 1536 px, band 2400 px.

Placements (8 October 2026, every older photograph replaced by the owner's set): Home "Who we help" (team working session, rail), "What usually brings people to us" (process-mapping review, split; was a full-width band, which no supplied photo is wide enough for), "The kinds of systems we build" (team reviewing reports, split); Contact (consultation conversation, rail); Consulting (process-mapping review, split); AI Customer Support (support team, opening aside); Cloud & DevOps (infrastructure review, opening aside); Data & Analytics (team reviewing reports, opening aside); Company (team working session, opening aside); UI/UX (team reviewing process workflows on screens, rail); Logistics (support team at shared screens, rail); Retail (team working session, rail); Manufacturing (infrastructure review, rail). Removed with their registry entries and provenance files: port operations, warehouse aisle, manufacturing line, phone dashboard, wireframes desk. The team-at-workflow-screens image is cropped from the left to 940 x 832 to leave out the desk flags (which would imply offices) and is used only in a rail, where it renders at most 424 px wide. Not used: "Modern Workspace Dashboards in Warm Sunlight" (invented client names, project dates, and figures that would read as DECHY project evidence, plus a visible generation artifact).

## 3. Data layer (`src/lib/server/`)

One key-value interface (`store.ts`) with backends: `netlify-blobs` (production, chosen automatically on Netlify), `file` (local and browser tests, `DATA_DIR`), `memory` (unit tests), `none`. Records (`records.ts`): Inquiry (new business) and SupportRequest (an existing client), each with internal notes, an assignee, and an optional `handoff` context (structured summary, where each field came from, start and handoff pages, reason, urgency as stated, key messages); an AI handoff is either kind arriving from an assistant conversation (channel `assistant`). Conversation (messages with the page, reasons, sources, and an after-handoff marker; the moment a person was requested; details the visitor stated, each with its source; new, existing, or unclear intent), Contact (one per email), Activity. References look like `DECHY-7F42K9` (30 unambiguous characters). Records and contacts can be deleted permanently from the admin (deletion requests); deleting a record also deletes its conversation. On Netlify set `DATA_STORE=netlify-blobs` explicitly.

Retention (`maintenance.ts`): conversations after `CONVERSATION_RETENTION_DAYS` (default 90) unless handed to the team (then kept with the record); activity after `ACTIVITY_RETENTION_DAYS` (default 365); rate-limit entries after a day; AI usage counters after 90 days. Enforced daily by the scheduled function `netlify/functions/retention.mts`, which calls `POST /api/maintenance/` with `MAINTENANCE_SECRET`, and lazily at most every six hours when the assistant is used (after the response, through `after()`), so the policy holds even without the schedule. Inquiries, support requests, and contacts are kept until deleted.

## 4. Contact form

Fields: name, work email, what can we help with (the 15 services or "Not sure yet"), project description; optional organization, timeline, and budget ($2,000 to $4,999; $5,000 to $9,999; $10,000 to $14,999; $15,000 to $19,999; $20,000 to $29,999; $30,000+; Not sure yet). The owner's ranges are written with "to" because the house style forbids en dashes (AGENTS 1A.16); switch in `src/lib/contact/validate.ts` and `ContactForm.tsx` if the dash is wanted.

Flow: browser, `/api/contact` (JSON only, same origin, 16 KB cap, rate limit, honeypot, minimum fill time, server validation), the inquiry stored as the source of truth, an `inquiry.created` event, then email through the configured delivery (`CONTACT_DELIVERY`: none, log, webhook, resend) with the visitor as Reply-To. The visitor gets the reference as soon as the inquiry is stored, even before email is configured.

## 5. Assistant and human support

Identity and honesty. The launcher is the approved monogram (unchanged) with a typographic "AI" mark and the label "Ask DECHY AI" only when real AI answers are configured on the server; otherwise the monogram alone and "Ask DECHY", and the panel says "Automated assistant, not a person." The label shows once on a first visit (local storage remembers it) and then folds to the compact mark, also on phones after scrolling. No auto-open, pulsing, or unread counts. The launcher stays off the contact page, which has its own three paths.

Panel. About 420 x 680 floating on larger screens, with a button that widens it into a right-side drawer; full screen on phones with safe areas, the input pinned above the keyboard (visual viewport), and clear Minimize and Close. Not modal. Minimize keeps the draft; Escape minimizes and returns focus to the launcher. The first state is "Tell me what you're trying to do. I'll point you to the right part of DECHY.", a suggestion for the page the visitor is on (worded by page kind: service, technology, solution, industry, Work Area), four starting points (Build something new; Add AI or automation; Connect our systems; Improve or modernize what we have; "modernize" follows the site's spelling), and free text.

Answers. The engine (`src/lib/assistant/`) answers from the site's own pages and the approved facts. AI mode (`AI_PROVIDER=anthropic`, `AI_API_KEY`, `AI_MODEL`, default `claude-haiku-5-5`) streams the model's words to the browser as server-sent events (no artificial delays): the reply comes first, then a `@@META@@` marker and JSON (service, solution, related, one-line reasons, sources, need, wants-human, intent, and any name, organization, or email the visitor stated) that is validated against known ids and never streamed. Links are built by the server; replies are plain text. While waiting, the panel shows a thin progress line and "Reading DECHY's pages…". Recommendation cards carry a one-line reason; sources appear only when they add pages beyond the cards. Guided mode (no key, budget reached, or model failure) answers from the same catalog with short replies. Prompt-injection protections are unchanged (visitor text and page context never in the system prompt; the page note is marked as website context).

Continuity. The server holds the conversation; the browser keeps only its random id in session storage and restores the thread with `GET /api/assistant/?conversationId=&page=` after a reload or on another page. The panel stays open when a recommendation is followed (minimized on phones).

Talking to the team. "Talk to the team" is always in the panel header; the assistant also offers it after two unplaced answers, and a message such as "can someone contact me" opens it straight away. The visitor stays in the conversation: an inline card shows what will be passed on and is filled in from the conversation (name, email, organization when stated; each marked with its source), asking only for what is missing. Email is required; name is required but pre-filled; organization, "Anything else?", and "This is time-sensitive" (never inferred) are optional; no budget or timeline. If it is not clear whether this is new work, the card asks "Is this about a new project or something we're already working on together?". `POST /api/assistant/handoff` with `action: "prepare"` marks the conversation PERSON REQUESTED at once (kept even if the visitor never finishes); `action: "confirm"` creates the record only then: an Inquiry (channel `assistant`) for new business or a Support Request for an existing client, with the handoff context and a structured summary (need, context, suggestion, open questions; AI-written when allowed, otherwise deterministic). The thread then shows "Sent to the DECHY team. Reference: DECHY-XXXXXX. A person will reply by email." No response time is promised. Later messages attach to the same record, marked after handoff, and mark it unread; "Start a new topic" and "Close" are offered.

AI cost (`src/lib/server/ai-budget.ts`). Before each model call: a site-wide daily call limit (`AI_DAILY_CALL_LIMIT`, 500) and output-token limit (`AI_DAILY_OUTPUT_TOKEN_LIMIT`, 300000), and a per-visitor daily allowance (`AI_VISITOR_DAILY_LIMIT`, 40, keyed by a salted hash of the address), on top of the 30 messages per 10 minutes rate limit and the 24-turn cap. When a limit is reached the assistant answers in automated mode and the panel says so; the first time a day's budget runs out, an `ai.budget_reached` activity entry tells the team. Usage is stored as daily totals without personal data and shown on the admin overview.

Contact page paths: "Help me figure out what I need" (assistant), "I know what I need" (form), "I want to speak to someone" (the assistant panel opens on the team card).

## 6. DECHY Admin (`/admin/`)

Private, server-rendered, outside the public layout and bundles (its stylesheet loads only on admin routes), `noindex`, disallowed in robots. Pages: Overview (new inquiries, unread, open support, AI handoffs, person requested but not yet sent, AI conversations, AI use today, recent activity, connection status), Inbox (filters: inquiries, support requests, AI handoffs, contact form, business email; status; each row labeled Inquiry or Support request, AI handoff when it came from a conversation), record detail (summary first: need, context, suggestion, open questions, and a flag for messages after the handoff; details with the source of each field; start and handoff pages; reason; in the visitor's words; note from the visitor; full transcript collapsed, with pages and after-handoff markers; internal notes; status and assignee; mark unread; reply by email; delete), AI conversations (labeled AI conversation, AI handoff, or Person requested; a filter for people who asked but never sent), Contacts (with delete).

Authentication (`src/lib/server/auth.ts`): locked until `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` (scrypt, from `npm run admin:hash`), and `ADMIN_SESSION_SECRET` (32+ characters) are set. HMAC-signed, HttpOnly, SameSite=Strict, Secure session cookie (eight hours); sign-in rate limited; every page and endpoint checks on the server. A dedicated identity provider can replace this module later without touching the pages.

API for the admin web app and a future mobile app (session cookie or `Authorization: Bearer ADMIN_API_TOKEN`): `GET /api/admin/records` (filters; `?view=overview`), `GET|PATCH|DELETE /api/admin/records/{ref}` (PATCH: status, read, assignedTo, note; `handledBy` is accepted as an older name), `DELETE /api/admin/contacts/{id}`. Inbound business email (ready for configuration): `POST /api/admin/ingest/email` with `x-dechy-ingest-secret` (`EMAIL_INGEST_SECRET`).

## 7. Notifications

Every event (`inquiry.created`, `support.requested`, `assistant.escalated`, `email.received`, `record.status_changed`) is recorded as Activity (with `person.requested`, `conversation.followup`, and `ai.budget_reached` recorded as activity only) and sent to `NOTIFICATION_PROVIDER` (none, log, webhook). The webhook receives `{type, ref, title, at, adminPath}` signed with `x-dechy-signature: sha256=HMAC(NOTIFICATION_WEBHOOK_SECRET)`; no message bodies or email addresses, so a push service holds no more personal data than it needs.

## 8. Security summary

Server-side secrets only; JSON-only public endpoints with same-origin checks, size caps, schema validation, honeypots, and rate limits (salted hashes of client addresses; addresses never stored); safe errors with no internal detail; no-store responses; prompt-injection resistance (visitor text never in the system prompt, validated JSON output, allow-listed recommendations, server-built links, plain-text rendering); admin authorization on the server for every page and endpoint; no credentials in the repository (test runs generate a random admin password).

## 9. Status

| Item | State |
|---|---|
| Brand assets, icons, social image, structured-data logo, assistant monogram | Implemented |
| Photographs: all older photos replaced by the owner's set | Implemented |
| Contact form, storage, references | Implemented |
| Assistant UX (launcher, panel, first state, page awareness, streaming, cards, continuity) | Implemented |
| Talk to the team in the conversation (prepare, prefill, confirm, reference, follow-up) | Implemented |
| Assistant AI mode | Ready for configuration (`AI_API_KEY`); guided mode is live until then |
| AI cost limits | Implemented (defaults apply; adjust with the `AI_*_LIMIT` variables) |
| Retention enforcement | Implemented; the daily schedule needs `MAINTENANCE_SECRET` on the host (lazy cleanup runs regardless) |
| DECHY Admin web, API, notes, assignment, deletion | Implemented; ready for configuration (admin environment variables on the host) |
| Netlify Blobs storage | See the production verification notes in the final report of this pass |
| Email to the business mailbox | Ready for configuration; blocked by the owner's pending email and domain decision |
| Inbound business email | Ready for configuration (provider webhook plus `EMAIL_INGEST_SECRET`) |
| Push notifications and mobile admin app | Event boundary and webhook ready; no provider chosen; no app built |
