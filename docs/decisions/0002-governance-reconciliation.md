# ADR 0002: Governance reconciliation and amendment ledger

Status: Accepted by the owner (reconciliation instruction, 2026-10-04).
Purpose: ensure no document in the repository can lead an implementation agent to follow an older, superseded decision. Original wording is preserved; superseded text is marked in place and points here.

## 1. How to read this repository

1. The precedence model in `CLAUDE.md` section 2 decides which document wins: owner instruction, then AGENTS.md, then DECHY_CONTENT_MASTER.md, then DECHY_CLAUDE_MASTER_HANDOFF.md, then the approved Phase 0 plan (`docs/planning/`), then decision records (`docs/decisions/`), then implementation details.
2. Where an amendment below has been approved by the owner, the amendment governs that specific point even though it comes from a lower-ranked file, because the owner's instruction (rank 1) created it. The source document is annotated in place with an `AMENDED` or `SUPERSEDED` note that cites the amendment number.
3. The topic-to-file source-of-truth map is in `CLAUDE.md` section 3.
4. Nothing was deleted. Historical planning documents remain and carry a status banner.

## 2. Standing authorizations and rules recorded here

1. **Imagery.** The owner authorizes the agent to source, download, and use properly licensed imagery that serves the approved visual rules, without per-image or per-batch owner approval. Conditions: reputable source with a clear commercial license (for example Unsplash, Pexels, Wikimedia Commons where the license permits); license and provenance recorded in the asset registry before an image is used; image files only (no executables or archives from untrusted sources); no fabricated evidence (offices, employees, client meetings, client projects, client screenshots, results, testimonials); no generic AI-looking imagery, neon aesthetics, or filler stock. The normal review process catches problems. Supersedes the "confirm each download batch" procedure in earlier drafts.
2. **Normal implementation decisions** (component structure, library choices within the approved stack, copy refinements, image selection, test design) are the agent's to make. The agent escalates only items on the "approval required" list in `CLAUDE.md` section 4.
3. **Netlify.** Phase 1 foundation work is not blocked by missing Netlify authorization. When a step truly requires authorization (creating or linking the Netlify site, deploy previews), the agent stops at that specific dependency and states exactly what is needed.
4. **Contact form.** Built with a securely configurable destination; no invented production inbox or contact destination; no credentials in the repository.
5. **Capability and evidence.** Approved capabilities may be described with legitimate generalized descriptions. Specific evidence (clients, projects, people, locations, metrics, testimonials, awards, certifications, case-study outcomes) appears only where actually known or supplied.
6. **Git.** Repository `Samogunde/DECHY-SITE` stays private; local path `C:\DECHY-SITE`; commits use `102127730+Samogunde@users.noreply.github.com`; existing commits are never rewritten or force-pushed; flow is local implementation, tests, browser inspection, fixes, commit, push, then Netlify deployment or preview. The owner does not manually download or upload files.

## 3. Amendment ledger

| ID | Older instruction (where) | Status | Current source of truth |
|---|---|---|---|
| AMD-01 | Domain is dechy.com; do not substitute another (AGENTS section 1, Domain) | Superseded for now: final domain deferred; candidates dechy.com, dechytech.com, dechydev.com, others; architecture uses one configurable site origin | Plan section 35; register DEC-02; ADR 0001 |
| AMD-02 | Logo must eventually be recreated as vector with a full variant set (AGENTS 1A.3) | Amended: the supplied PNG is used as provided; vector master and variants are later recommendations, never a gate | ADR 0001; plan section 23 (logo usage) |
| AMD-03 | Brand colors and type hierarchy exact sizes "may be adjusted" (AGENTS 1A.5, 1A.8) | Clarified: brand tokens unchanged; documented derived accessible variants; responsive type system adopted | `docs/planning/07-typography-system.md`; `docs/design/typography-tokens.css`; plan section 23 |
| AMD-04 | Image workflow and approval steps (AGENTS 1A.11; earlier drafts of plan section 25) | Amended: Phase 1 is not diagram-only; purposeful original and properly licensed visuals; standing authorization in section 2 item 1 | This ADR; plan section 25 |
| AMD-05 | Problems as page-level search intents (AGENTS 22, 23, 71) | Clarified: problems stay entities and search intents; they open Solution pages; no separate problem page family | Register DEC-07; plan sections 9, 10, 15 |
| AMD-06 | City level in the location hierarchy and city intersections (AGENTS 24, 26) | Amended: country level only; no city pages at this stage; examples with cities are illustrations of the intersection engine, not pages to create | `docs/planning/05-country-architecture.md`; plan section 13 |
| AMD-07 | URL examples including both Airtable URLs (AGENTS 29) | Amended: `/automation/airtable/` is canonical; `/automation/airtable-automation/` merged; approved URL rules and hubs apply | Plan section 20; register DEC-08 |
| AMD-08 | Phase and batch schemes (AGENTS 60 and 95; Content Master 14; Handoff 23) | Superseded as sequencing instructions: one canonical sequence, including country waves and article batches | Plan section 36 |
| AMD-09 | Primary navigation item "Case Studies/Work" (AGENTS 66) | Amended: item is "Work"; navigation is Services, Solutions, Technologies, Industries, Work, Resources, Company, and the Talk to DECHY button, with five service families | Plan Appendix D item 4 |
| AMD-10 | Technology page principle (AGENTS 69) | Clarified: the technology template renders at the canonical-home URL (service-by-technology page) | Plan sections 7 and 20 |
| AMD-11 | Repository structure with a `website/` subfolder (AGENTS 78) | Superseded: Next.js app at repository root with enforced folder separation | Plan section 26 and Appendix D item 7 |
| AMD-12 | Codex as primary engineering agent; "DECHY Codex AGENTS.md" (AGENTS 79 item 10, 81) | Superseded: Claude Code is the primary engineering agent; the Codex build and repository are abandoned | `CLAUDE.md` |
| AMD-13 | Hosting "decided deliberately" among many options (AGENTS 85) | Decided: Netlify | Plan sections 28 and 35 |
| AMD-14 | 53 launch articles "already defined in AGENTS.md" (Content Master 9) | Gap filled: the list is not in AGENTS.md; the approved 53-article architecture is in the article plan | `docs/planning/06-article-plan-53.md` |
| AMD-15 | "Expand to the remaining 15 service pages" (Content Master 14, Stage 5) | Corrected: 14 remaining pillars after Software Development | Plan section 36 |
| AMD-16 | Case studies as the proof surface (AGENTS 31 and 72) | Extended: Work (Work Areas and Work Entries) is the primary proof architecture; a case study is a verified, detailed Work Entry | `docs/planning/04-work-architecture.md` |
| AMD-17 | Brand asset library under `brand/` (AGENTS 1A.22) | Clarified: `brand/` lives at the repository root; the supplied PNG stays unmodified and moves there in Phase 1 with an unchanged hash | Plan Appendix D item 7 |
| AMD-18 | International expansion as the last phase (Handoff 23, Phase 6) | Amended: country pages (waves) start in Phase 4; language localization stays last | Plan section 36 |
| AMD-19 | Plan section 9 and Phase 2 plan: first-wave Solutions are twelve | Superseded 2026-10-06: the canonical first-wave Solution architecture is six standalone pages; nine concepts are represented through Work Areas, one is merged, five deferred, one graph-only | ADR 0006; `docs/planning/14-technology-and-solutions-qualification.md` sections 10 and 11 |
| AMD-20 | Entity relations had no grouping relation (plan sections 15 and 21) | Extended 2026-10-06: `partOf` (child to parent) with derived inverse `hasPart`, semantic only; never implies a page or a URL | ADR 0006; `src/lib/content/schema.ts`; `data/relations/part-of.yaml` |
| AMD-21 | Technology entities seeded from capability categories (AGENTS 3 to 23; ADR 0005 decision 10) | Clarified 2026-10-06: a technology is a recognized entity only on named evidence or owner confirmation; the nine unconfirmed named products are REVIEW / CONFIRMATION REQUIRED; a recognized entity still earns a page only by the qualification standard | ADR 0006; doc 14 sections 2, 3 and 10.3 |

## 4. Intentionally unchanged

The exact descriptor; the company statement; brand colors and fonts; the 15 service pillars (none removed, merged, downgraded, or hidden; families only organize navigation); the entity-versus-page rule; anti-fabrication rules; the no-offices and no-physical-presence rule; punctuation rules; engineering quality gates (AGENTS 80A); the Content Master depth model and quality gates; the Handoff role, audit, and approval-gate principles; the 53-article requirement; the Work two-layer model; the country-page quality rules.

## 5. Remaining contradictions

None known that would change implementation. Items to be aware of, all resolved by this ADR: AGENTS 1A.3 variants versus the PNG-only instruction (AMD-02); AGENTS city examples versus the country-only rule (AMD-06); competing phase schemes (AMD-08). Phase 1 production deployment checks in AGENTS 80A.5 depend on Netlify authorization and are performed when that dependency is met.
