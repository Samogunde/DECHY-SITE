# DECHY Phase 0 Package (final, for owner review)

Status: complete and awaiting owner review. **Phase 1 is not started and not authorized.**
Date: 2026-10-04. Local path: `C:\DECHY-SITE`. Remote: `https://github.com/Samogunde/DECHY-SITE.git`.

## 1. Contents

| # | Deliverable | File |
|---|---|---|
| 1 | Final strategic audit | `01-strategic-audit.md` |
| 2 | Final master implementation plan (40 sections plus appendices, including the homepage hierarchy) | `02-master-implementation-plan.md` |
| 3 | Final decisions register | `03-decisions-register.md` |
| 4 | Final Work architecture (Work Areas and Work Entries; intake form in `docs/templates/work-intake.md`) | `04-work-architecture.md` |
| 5 | Final country architecture | `05-country-architecture.md` |
| 6 | Final 53-article architecture (six batches) | `06-article-plan-53.md` |
| 7 | Responsive typography system (design specification; tokens in `docs/design/typography-tokens.css`; review page `docs/design/typography-specimen.html`) | `07-typography-system.md` |
| 8 | External research log (technology, SEO, AI search facts, kept separate from company facts) | `08-external-research-log.md` |
| 9 | Governance: precedence model | `CLAUDE.md` |
| 10 | Record of approvals and proposed amendments | `docs/decisions/0001-phase-0-approvals.md` |

Items 7 to 12 requested in the approval message are summarized below with pointers to the authoritative sections.

## 2. Final technical architecture (summary; plan sections 26 to 33, 35)

- Next.js 16.x (newest patched; 16.3.8 current on 2026-10-04), React 19.2.1 or later, TypeScript strict, App Router, Tailwind CSS 4.x, npm, Node 22 LTS. Versions and advisories re-verified at scaffold.
- Static-first rendering (`generateStaticParams`, `dynamicParams = false`); server code only for the contact endpoint and a health check. Reason: smaller attack surface after the 2025 React Server Components advisory, best performance and SEO.
- Typed content in Git: YAML for data, MDX for long-form, Zod validation, a thin custom loader. No CMS at launch; the model is portable to a headless CMS later.
- Entity graph: stable IDs, typed relation files, build-time validator (orphans, canonical-home conflicts, broken edges, duplicate intent, forbidden punctuation, claims without facts, country-page similarity, unsupported location claims).
- Site origin is one setting (`SITE_ORIGIN`), so the final domain is a configuration change.
- Tests: tsc, ESLint, Vitest, Playwright at 11 widths, axe, Lighthouse CI budgets, link crawl, security headers check, production smoke test.
- Hosting: Netlify via its OpenNext-based adapter (supports App Router, ISR, Server Components, Server Actions); previews are noindex.
- Security: hardened headers, hash/allowlist CSP, no secrets in Git, Dependabot and npm audit, form protection, security.txt.
- Open technical risk: Netlify's Next.js adapter is changing during 2026; static-first design limits exposure.

## 3. Final content architecture (summary; plan sections 14, 15, 26; files 04, 05, 06)

- Classes: Commercial, Informational, Proof, Authority.
- Entity universe: every capability in AGENTS.md is seeded 1:1; classification fields (`role`, `primaryService`, `prominence`, `pagePolicy`, `evidenceLevel`) organize it and never remove or discredit anything.
- Pages: 15 service pillars, Company, Contact, Work hub with Work Areas (about 20 to 25) and Work Entries as supplied, 10 to 15 country pages in waves, 53 launch articles in six batches, then technology, industry, solution, and integration pages by search intent.
- Factuality: capability claims approved; specific project facts, clients, metrics, results, testimonials, awards, certifications, partnerships, and dates only when supplied. Illustrative examples are labeled illustrative.

## 4. Final design direction (summary; plan sections 23 to 25, 30; file 07)

- Brand tokens unchanged; derived accessible colors for failing combinations only (link blue #2A62D8, on-dark blue #7AA5F8, slate text #5B6472, darker functional text colors).
- Typography: Manrope for headings and UI, Source Sans 3 for body; fluid roles between 360 and 1440px with scale steps at 1920 and 2560; body large 17.5 to 20px, body 17 to 18.5px; fixed UI sizes; prose measures of 62 and 64ch giving about 69 to 71 characters per line (browser verified).
- Visual language: restrained, editorial, diagram-first; no gradients, glow, or AI clichés; varied layout patterns instead of card walls; one logo as supplied (PNG) on light surfaces.
- Homepage hierarchy per owner direction in plan Appendix C.

## 5. Final SEO, AEO, GEO architecture (summary; plan sections 16 to 22; file 08)

- SEO: one primary intent per page; canonical-home URLs with trailing slash; sitemap index generated from approved indexable records; robots.txt; hreflang when locales exist; Core Web Vitals budgets; Search Console and Bing Webmaster Tools.
- AEO: answer-first definition blocks, real question headings, semantic tables and lists, visible review dates. FAQPage remains valid markup but has no rich results since 7 May 2026.
- GEO: consistent descriptor-paired entity naming, Organization schema with stable `@id`, real `sameAs` profiles only, original diagrams and technical material, internal linking from typed edges. No promises about rankings or AI citations. Google states `llms.txt` and special AI markup are unnecessary.
- International: locale-ready from day one, English-only publication, country pages as separate documents, genuine localization before any translation is published.

## 6. Final Git and GitHub workflow (plan section 34; CLAUDE.md section 6)

- `C:\DECHY-SITE` is the working copy; GitHub `Samogunde/DECHY-SITE` is the permanent source of truth; remote verified before every push; the old Codex repository is not used.
- Planning and documents: commit and push after verification.
- Production (after authorization): implement, test, inspect, fix, verify, commit, push; short-lived branches and CI; no knowingly broken work on `main`; no secrets; conventional commits.
- Netlify connects to the repository at the first preview deployment (needs the owner's authorization).

## 7. Remaining decisions

See `03-decisions-register.md`. Needed before Phase 1 starts: DEC-07 (entity and canonical-home principles), DEC-08 (URL rules), DEC-10 (navigation families), DEC-11 (app at repository root), DEC-23 (positioning statement), DEC-24 (homepage emphasis by revenue), DEC-27 (commit email), DEC-31 (Phase 1 scope), DEC-32 (goals and markets). Everything else can follow in later phases. Also needed whenever convenient: Work intake forms for real projects.

## 8. Recommended implementation sequence

Phase 0 review and approval, then Phase 1 (foundation, Home, Software Development, Contact, minimum legal pages, browser review), Phase 2 (remaining pillars, Company, Work hub and Work Areas, launch candidate), Phase 3 (technology, platform, and integration pages by intent; article Batch 1), Phase 4 (industries, solutions, country Wave 1, article Batches 2 to 3), Phase 5 (country Waves 2 and 3, article Batches 4 to 6, Work Entries), Phase 6 (localization and country x service pages). Details in plan section 36.
