# DECHY website

**DECHY: Technology, Software, AI & Digital Solutions.** The website application for DECHY, a global technology company.

Governance and architecture are defined before code. Start with [`CLAUDE.md`](CLAUDE.md) (precedence and source-of-truth map), then [`docs/planning/00-phase-0-package.md`](docs/planning/00-phase-0-package.md). Decisions are recorded in [`docs/decisions/`](docs/decisions/).

## Stack

Next.js (App Router) on React and TypeScript, Tailwind CSS 4, typed content in YAML validated with Zod, Vitest, Playwright with axe, deployed from GitHub to Netlify. Static-first: every page is prerendered; the only server code is the contact endpoint.

## Getting started

```bash
npm ci
cp .env.example .env.local   # then edit; never commit real values
npm run dev                  # http://localhost:3000
```

| Command                                       | What it does                                                                                                                                                                |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`                                 | Development server                                                                                                                                                          |
| `npm run build`                               | Validates all content, then builds for production                                                                                                                           |
| `npm run start`                               | Serves the production build                                                                                                                                                 |
| `npm run typecheck` / `lint` / `format:check` | Static checks                                                                                                                                                               |
| `npm test`                                    | Unit tests (loader, validator, SEO, contact policy, brand integrity)                                                                                                        |
| `npm run validate`                            | Content and entity-graph validation (also part of `build`)                                                                                                                  |
| `npm run e2e`                                 | Browser tests against the production build: routes, 12 responsive widths, navigation, accessibility, security headers. Build first with `SITE_ORIGIN=http://localhost:4310` |
| `npm run check`                               | Typecheck, lint, tests, and build                                                                                                                                           |

## Repository layout

| Folder               | Holds                                                                      |
| -------------------- | -------------------------------------------------------------------------- |
| `src/`               | Application code only (routes, components, libraries, styles)              |
| `content/`           | Page and article copy (typed YAML records)                                 |
| `data/`              | Structured data: facts, taxonomy (the entity graph), relations, navigation |
| `brand/`             | The approved logo, exactly as supplied                                     |
| `docs/`              | Planning, decisions, design specification, templates                       |
| `public/`            | Static files served as-is (delivery copy of the logo, Open Graph image)    |
| `tests/`, `scripts/` | Tests; build-time tooling                                                  |

## Configuration

All configuration is by environment variable (see `.env.example`). The public origin (`SITE_ORIGIN`) is one setting because the final domain is undecided. Search indexing is off unless `SITE_INDEXING=true`. The contact form destination is configured with `CONTACT_DELIVERY` and provider variables; nothing is hard-coded and no secrets live in the repository.

The data layer (inquiries, support requests, assistant conversations) uses Netlify Blobs on Netlify and a local `.data/` folder elsewhere (`DATA_STORE`). The website assistant runs in guided mode until `AI_API_KEY` is set. DECHY Admin (`/admin/`) stays locked until `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` (create it with `npm run admin:hash`), and `ADMIN_SESSION_SECRET` are set on the host. Notifications for a future mobile app use `NOTIFICATION_PROVIDER`. Details: `docs/planning/21-platform-contact-assistant-admin.md`. Brand derivatives (icons, social image) are rebuilt with `npm run brand:derivatives`.

## Content rules that the build enforces

Exact descriptor; no em or en dashes or emojis; the company statistic only through the approved facts register; no unsupported evidence claims; unbuilt pages render as plain text, never as dead links; no thin or template-identical pages. See `src/lib/content/validate.ts`.
