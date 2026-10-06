# Phase 2 implementation notes

Status: IMPLEMENTED. Authorized by the owner on 5 October 2026 as one continuous build. This file records what was built, how it is validated, and the decisions that were not obvious. Company facts are not recorded here; they live only in `data/facts/`.

## 1. What was built

53 pages in all (5 from Phase 1, 48 new):

| Group | Routes |
|---|---|
| Services (14 new, plus Software Development from Phase 1) | `/ai/`, `/automation/`, `/api-integration/`, `/data-analytics/`, `/cloud/`, `/cybersecurity/`, `/web-development/`, `/mobile-app-development/`, `/ecommerce/`, `/ui-ux/`, `/branding/`, `/seo-aeo-geo/`, `/digital-marketing/`, `/consulting/` |
| Hubs | `/services/`, `/solutions/`, `/technologies/`, `/work/` |
| Work Areas (25) | `/work/areas/{slug}/` using the owner's slugs |
| Company | `/company/`, `/company/how-we-work/`, `/company/who-we-work-with/` |
| Legal | `/terms/`, `/accessibility/` (with `/privacy/` and `/cookies/` from Phase 1) |

Not built, by instruction: technology pages, solution pages, industry, country and resource families, the 53 articles (briefs stored in `data/articles/briefs.yaml`), people, city and problem pages, and any client, case study, metric, or office claim.

## 2. Architecture added

- Data-driven teaching diagrams (`DiagramSpec`: flow, layers, before-after, hub, funnel, decision) rendered as HTML on the container-query diagram system, with a caption inside the same figure.
- Guidance blocks: At a glance (from each page's `comprehension` record), On this page, pathfinder, chooser (native radio inputs, no script), technical panels (progressive depth), callouts (limits, illustrative, note).
- Catch-all route `src/app/[...slug]/page.tsx` renders any registry page that has no dedicated route file.
- New entity type `work-area` (25 entities) and relation types `hasWorkArea` and `relatedWork`.
- Relations are derived from each page's `related` blocks by `scripts/derive-relations.ts` into `data/relations/derived.yaml`. Re-run it after editing a `related` block; the validator rejects a related link that has no graph edge.

## 3. Validation added (`npm run validate`)

Comprehension record and next step on every commercial page; jargon glossed at first body use; sentence length (40 words) and average (21); diagram clarity (purpose, takeaway, explanatory caption); similarity control across service pages and across Work Areas (block-sequence edit distance, 5-word shingle overlap, shared headings, identical diagrams, takeaways, or decision structures); Work Areas must be entity-backed and carry a labeled illustrative scenario; service pages need at least 1,500 words; links, anchors, and related edges must resolve; no orphan pages.

Deliberately not built, per the owner: a technology-coverage rule, and any `llms.txt` or AI-crawler policy.

## 4. Decisions worth knowing

- Unbuilt references render as plain text. `/solutions/` and `/technologies/` therefore list entity names that have no page yet without links, and say nothing about future pages.
- Work Area copy describes kinds of system. Every scenario is labeled illustrative and names no client.
- Terms and Accessibility are general website documents. They name no jurisdiction and make no conformance claim beyond the stated aim (WCAG 2.2 AA) and the checks actually run. They should be reviewed by the owner's legal adviser before launch.
- Statements about how DECHY prices and runs projects (`/company/how-we-work/`) describe practice in general terms and give no figures. The owner should confirm they match how the company wants to commit.
- Footer legal links now include Terms of use and Accessibility.

## 5. Tests

Unit: content and registry, validator, clarity and similarity, scope control, article briefs, SEO and structured data. End to end (Playwright, production build, 12 widths from 320 to 2560 px): page contract, responsive layout, alignment, navigation, motion and photographs, contact, security, and axe accessibility on every page.
