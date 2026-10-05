# DECHY Strategic and Technical Audit (Revision 2)

Status: HISTORICAL ANALYSIS RECORD (Phase 0). Where it differs from the approved plan, decisions register, or decision records, those govern (CLAUDE.md section 2; ADR 0002). No production code exists.
Date: 2026-10-04
Scope: AGENTS.md, DECHY_CONTENT_MASTER.md, DECHY_CLAUDE_MASTER_HANDOFF.md, the approved logo PNG, and the working environment.

## Revision 2 summary: what your corrections changed

| Your correction | Effect on this audit |
|---|---|
| Domain is parked for sale; not a blocker | Removed from risks and blockers. The architecture is domain-independent (single configurable site origin). Final domain (dechy.com, dechytech.com, dechydev.com, other) is a later infrastructure decision. No name change is recommended. |
| 53 articles are approved | Retained in full. Missing list treated as a documentation gap. Complete 53-article architecture proposed in `06-article-plan-53.md`. |
| Capabilities listed in the specs are DECHY's capabilities | My "capability tier / only core and working may be claimed" proposal is **withdrawn**. The full capability architecture is preserved. Classification now organizes (primary service, supporting capability, strategic technology, and so on) and decides page priority; it never removes or discredits a capability. No public "no proof" messaging. |
| Use the PNG logo | PNG is the approved logo. No vector gate. Logo issues are reduced to usage notes and later recommendations. |
| Move out of OneDrive | Done and verified (section 0). |
| GitHub is the source of truth; Claude owns the Git workflow | Adopted. |
| Work must exist | "Hide Work" is **withdrawn**. Full Work architecture in `04-work-architecture.md`. |
| Country-level pages, 10 to 15 countries | Country architecture added in `05-country-architecture.md`. City pages remain out. |

Labels: CONFIRMED, VERIFIED (I checked), RECOMMENDED, ASSUMPTION, DECISION REQUIRED (see `03-decisions-register.md`).

---

## 0. Environment (all VERIFIED)

| Item | Result |
|---|---|
| New project path | **`C:\DECHY-SITE`** (outside OneDrive) |
| Move integrity | Copied, then all files compared by SHA-256: identical. Original OneDrive folder contents removed. An empty `DECHY SITE` folder may remain on the Desktop because this session had it open as its working directory; it is harmless and can be deleted. |
| Git | Repository intact at `C:\DECHY-SITE`; branch `main`; commit `a5e469a` preserved; `git fsck` clean. |
| Remote | `origin` = `https://github.com/Samogunde/DECHY-SITE.git`; `git ls-remote` succeeds with no refs, so the repo exists and is still empty. Not the old Codex repo. |
| Source files present | AGENTS.md, DECHY_CONTENT_MASTER.md, DECHY_CLAUDE_MASTER_HANDOFF.md, `Minimalist DECHY Tech Logo.png` |
| Toolchain | Node 22.15.1, npm 11.4.2, Git 2.49. `gh` CLI not installed (not required). |
| Git identity | `Samogunde` / `ssmmyjoy5@gmail.com` (see DEC-27). |
| Logo file | 1536 x 676 PNG, opaque near-white background. |

---

## A. What is already strong

1. Fixed descriptor and rejected tagline; explicit rule that AI and Automation do not outrank other services.
2. Thorough anti-fabrication rules (AGENTS 46, 47, 64; Handoff 9, 19). They align with your factuality rule: capabilities approved, specific evidence never invented.
3. Qualification mindset: entity universe is not a page list (AGENTS 41, 94, 27).
4. Content depth model (micro to full) maps cleanly to a typed data model.
5. A restrained, coherent brand system with explicit anti-patterns.
6. Specific engineering quality gates (AGENTS 80A, 62).
7. Correct phasing shape (representative pages first).
8. The "connected capability" thesis: Software + AI + Automation + Integration + Cloud.

## B. What is missing

1. **Approved Facts Register.** Only these company facts are established: name, descriptor, since 2010, 1,500+ statement (Handoff and your instruction, not in AGENTS.md), global positioning, no physical locations. Still needed: legal entity name and jurisdiction, contact channels, engagement models, markets and time zones, languages of delivery, real external profiles, named people. Capabilities are not "missing facts": they are approved.
2. **Work content inputs.** The Work architecture can be fully built (Work Areas), but project-level entries need facts only you hold. An intake form is provided (`docs/templates/work-intake.md`).
3. **Spec documents AGENTS 79 requires** (taxonomy, entity and search architecture, SEO/AEO/GEO spec, URL spec, UX/UI spec, technical architecture, content database). This planning set creates the architecture-level versions; the content database is built in Phase 0/1.
4. **The 53-article list** (documentation gap; now proposed in full).
5. **Brand extras (later, not blocking):** exact logo usage rules, favicon/monogram, dark-background treatment, Open Graph template, brand guide. Not to be invented now.
6. **Legal and site pages:** privacy, cookies, terms, accessibility statement, security.txt, 404/500.
7. **Market inputs:** no keyword or SERP data in the specs, so search intent is currently assumed. A SERP review is planned in Phase 0.
8. **Measurable goals and priority markets** (feeds country wave order and homepage emphasis).
9. **Governance:** no `CLAUDE.md`, no ADR log, review authority unnamed.

## C. What is unclear

1. Who the final approver is and whether a separate "master planner" reviews content (Content Master 2, 14).
2. Real people to name as authors and reviewers (strong trust and E-E-A-T signal; no fabricated staff).
3. Lead handling: destination, owner, response time.
4. Engagement language and time-zone coverage (needed for country pages).
5. Which Work Areas are DECHY's strongest, for hub ordering.
6. Final production domain (deferred by you).

## D. What is contradictory

| # | Contradiction | Resolution |
|---|---|---|
| D-1 | Content Master says the 53 articles are defined in AGENTS.md; they are not. | Documentation gap. Full set proposed (`06`). If an original list exists, reconcile by mapping table. |
| D-2 | Handoff 13 warns against random stock imagery; AGENTS and Content Master require images on key pages. | Compatible if every image has a job. Practical effect: original diagrams plus purposeful, properly licensed imagery; no filler (ADR 0002). |
| D-3 | AGENTS 1A.3 lists a full logo system and says the raster should eventually become vector; your instruction is to use the PNG now. | Your latest instruction governs: PNG now; vector and variants are later recommendations. |
| D-4 | Four different phase schemes (AGENTS 60, AGENTS 95, Handoff 23, Content Master 14). | One canonical sequence in the plan (section 36). |
| D-5 | AGENTS 81 names Codex as the primary engineer. | Update on approval (DEC-30). |
| D-6 | AGENTS 78 puts the site in a `website/` subfolder. | Recommend app at repo root (DEC-11). |
| D-7 | `/automation/airtable/` and `/automation/airtable-automation/` both listed (same intent). | Merge to one page. |
| D-8 | Short slugs (`/ai/`, `/cloud/`, `/ecommerce/`, `/ui-ux/`, `/branding/`, `/consulting/`) beside long ones; names differ from slugs. | Keep the CONFIRMED slugs; record a slug registry (DEC-08). |
| D-9 | Many concepts appear under several pillars with no owner (Web Design, Marketplace Development, Business Dashboards, Solution Architecture, Cybersecurity Consulting, Payment Integration, Marketing Automation, AI Chatbots/Copilots, Firebase/Supabase, Kotlin/Swift, IAM). | Mandatory **canonical home** per concept. |
| D-10 | AGENTS 24 lists "Service x Technology x Industry x Location" twice. | Typographical. |
| D-11 | AGENTS 29/66 suggested no Work content until proof; your correction makes Work central. | Resolved by the two-layer Work model. |

## E. What I recommend changing

1. **Capability classification organizes; it does not remove.** Each entity carries `role` (primary service, supporting capability, strategic technology, technology, platform, framework, language, integration, tool), `prominence` (how much page and navigation weight it gets, driven by search intent and commercial value), and an internal `evidenceLevel` (none, work area, work entry, case study) used only to decide what proof can be shown next to it. None of these appear publicly as disclaimers. Every entity from AGENTS 3 to 23 is seeded into the taxonomy 1:1.
2. **One canonical home per concept** (D-9), enforced by a validator.
3. **Entity does not equal page.** This is a search-intent constraint, not a capability constraint: DECHY may offer Perl, but a Perl page is created only if people search for that service. All entities remain in the graph, appear in capability matrices and relationships, and can be promoted to pages later.
4. **Canonical-home URLs** for technologies (`/software-development/python/`), flat hubs for industries, solutions, resources, work, and locations (plan section 20).
5. **Country pages instead of "no locations":** 10 to 15 countries in waves, each with market-specific substance; no cities (`05`).
6. **Work stays in primary navigation** with Work Areas now and Work Entries as you supply facts (`04`).
7. **Navigation: five capability families** for the 15 services.
8. **Merge problem pages into solution pages** to avoid duplicate intent.
9. **Treat FAQ and Service schema as semantic aids.** Google restricted FAQ rich results in 2023 and retired HowTo rich results; no rich-result benefit should be budgeted.
10. **`llms.txt` is optional and unproven;** not a deliverable.
11. **Add `CLAUDE.md` importing AGENTS.md**, an ADR log, and rename Codex references (DEC-30).

## F. What I recommend adding

1. Approved Facts Register with fact IDs; copy cites facts by ID.
2. Typed entity graph with relation files and a build-time validator.
3. Work model and intake process (`04`), country model (`05`), 53-article plan (`06`).
4. DECHY reference implementations (optional proof accelerator; clearly labeled as DECHY-built demonstrations), because original technical artifacts are the strongest GEO and E-E-A-T assets and remove reliance on client permissions.
5. Named real authors and reviewers.
6. Entity disambiguation plan: always pair the brand with its descriptor in titles and Organization description; stable Organization `@id`; real `sameAs` profiles (LinkedIn, GitHub, others you confirm); consistent naming everywhere. This is a GEO measure, not a rename: "Dechy" is also a French commune, so context pairing helps search and AI systems.
7. Legal and compliance set; accessibility statement; security.txt.
8. Domain-agnostic configuration (`SITE_ORIGIN`) so the final domain can change with one setting plus a redirect map if a domain ever changes after launch.
9. Image asset registry, license evidence folder, content linter (no em or en dashes, no emojis, banned phrases, descriptor exactness).
10. Measurement plan (Search Console, Bing, privacy-first analytics, AI-referral segmentation).

## G. What I recommend removing or deferring

| Item | Recommendation |
|---|---|
| City pages | Removed (your instruction). |
| Language pages (all 12) | Deferred until genuine localization; architecture is locale-ready from day one. |
| Duplicate Airtable URL | Merge. |
| Separate `/problems/` page family | Merge into solutions. |
| Per-business-type landing pages | Defer; business types appear as relationships and a "Who we work with" section until data shows distinct demand. |
| Third-party technology logo walls | Avoid by default: logos imply partnership or certification rights DECHY has not claimed. Use names. (Presentation choice, not a capability downgrade.) |
| Technologies whose public status is declining (for example Adobe XD, Gatsby, Travis CI) | Keep in the graph; present with accurate current framing (migration, maintenance). Re-verify when writing. |
| Any "coming soon", placeholder, or apology text | None. Sections without data do not render. |

Nothing is removed from the capability architecture.

## H. Technical risks

| # | Risk | Severity | Mitigation |
|---|---|---|---|
| H-1 | Repository in OneDrive | Resolved | Moved to `C:\DECHY-SITE`. |
| H-2 | Dependency security: Next.js/React had serious public vulnerabilities in 2025 (middleware authorization bypass; critical React Server Components RCE disclosed in December 2025) | High | Pin patched versions, static-first output, Dependabot and `npm audit` in CI, re-check advisories at scaffold time. |
| H-3 | Strict CSP vs static rendering | Medium | Hash/allowlist CSP via Netlify headers; test in browser. |
| H-4 | Next.js feature coverage on Netlify | Medium | Prefer static generation; deploy previews from the first commit; keep content layer framework-independent. |
| H-5 | Content layer lock-in/hard-coded pages | Medium | Typed content (YAML/MDX + Zod) read by templates. |
| H-6 | i18n retrofit cost | High if ignored | Locale-ready loader and URL builder now; English-only publishing. |
| H-7 | Build time/sitemap scale | Low now | Qualification keeps counts controlled; sitemap index per type. |
| H-8 | Image weight/repo bloat | Medium | Masters outside Git or LFS; commit optimized derivatives only. |
| H-9 | Contact form abuse and data handling | Medium | Server validation, bot challenge, rate limit, stated retention. |
| H-10 | Final domain undecided | Low | Configurable origin; Netlify subdomain for previews; redirects if domain changes. |
| H-11 | Fonts for non-Latin scripts | Medium | Fallbacks defined before localized or Arabic (UAE) content ships. |
| H-12 | Size of the Work + Country + 53-article + entity corpus | Medium | Strong validators, batch publication, templates that vary by page. |
| H-13 | Netlify authorization and DNS are outside my access | External | Needs you at the time of deployment. |

## I. SEO, AEO, GEO risks

1. **Entity establishment.** A new brand with a shared name needs consistent descriptor-paired naming, Organization schema, real external profiles, and original content. Not a reason to change the name.
2. **Scaled-content exposure.** Google's spam policies target scaled content created mainly to rank. The mitigation is quality, not volume: unique briefs, human review, original figures, named authors, batch publication, and the validator suite.
3. **Duplicate intent** (D-7, D-9, and service-vs-technology collisions). Canonical-home rule and intent registry.
4. **Country page similarity.** Doorway-page risk if pages differ only by name. Mitigation: required country-specific sections, similarity validator, wave publication, sourced regulatory statements with last-verified dates.
5. **No demand data.** Phase 0 SERP/competitor review; Search Console after launch drives consolidation and expansion.
6. **Schema misuse.** No `LocalBusiness`, no addresses, no ratings, no unsupported awards.
7. **hreflang correctness** when locales start.
8. **Statement freshness** (regulatory and market facts, AI search behavior): dated, sourced, reviewed on a schedule.
9. **AI crawler policy** needs a decision (DEC-19).
10. **Honest limits:** no promise of rankings or AI citations anywhere.

## J. Content risks

1. Generic AI prose across 15 services, 53 articles, and many entity pages. Mitigation: per-page briefs with varied structure and emphasis, technical review, house-style linter.
2. Plausible-sounding but wrong technical detail. Mitigation: reviewer sign-off and source links for standards and vendor facts.
3. Over-claiming outcomes. Capability language is approved; outcomes, metrics, client names, testimonials, awards, certifications, partnerships are not generated.
4. Illustrative examples mistaken for real projects. Mitigation: labeled "illustrative" consistently.
5. Dash punctuation rule (AGENTS 1A.16) in titles, ranges, and quotes. Mitigation: lint and style guide.
6. Work breadth vs depth: a broad Work section with thin entries reads as padding. Mitigation: Work Areas are substantive system explanations with original diagrams; project entries appear only with real facts.

## K. Design risks

1. "No gradients, minimal palette" vs "rich, not sparse." Richness comes from diagrams, typography, imagery, layout rhythm, and light/dark sections.
2. **Contrast of the approved palette (VERIFIED by calculation)**

| Pair | Ratio | Text AA (4.5) |
|---|---|---|
| #111827 on #F7F6F2 | 16.4 | Pass |
| #2F6FED on white | 4.55 | Pass (barely) |
| #2F6FED on #F7F6F2 | 4.21 | **Fail for small text/links** |
| White on #2F6FED | 4.55 | Pass (barely) |
| #2F6FED on #111827 | 3.90 | **Fail** |
| #6B7280 on white | 4.83 | Pass |
| #6B7280 on #F7F6F2 | 4.47 | **Fail by 0.03** |
| #6B7280 on #E5E7EB | 3.90 | **Fail** |
| #16A34A, #F59E0B, #3B82F6 as text on white | 3.30, 2.15, 3.68 | **Fail as text** |
| #E5E7EB on #F7F6F2 | 1.14 | Too light for input borders |

   The brand colors stay. Derived text/state variants are proposed (plan section 23, DEC-12), each computed to pass.
3. **Logo usage notes (PNG is approved and used as supplied):**
   - The PNG has an opaque near-white background (#FDFEFC). On Warm Off White (#F7F6F2) it can show a faint box. Technical handling without altering the artwork: place it on white or use CSS blending so the background disappears on light surfaces. No redesign.
   - Dark sections: the PNG is intended for light backgrounds; in Phase 1 the header and footer use light surfaces so no new logo variant is needed.
   - The descriptor inside the PNG is small. In the header, show the logo at a size where it remains legible, or crop only if you approve a crop; otherwise set the descriptor as live text beside the logo.
   - Favicon and social image: need a mark derived from the approved logo; I will propose a faithful crop of the approved artwork for your approval rather than inventing anything.
   - A vector master, reverse version, and brand guide are later recommendations (DEC-03 reduced to a later item).
   - Logo ink (about #0A1B30) and blue (about #1B6BEE) differ slightly from tokens #111827 and #2F6FED. No action needed; noted for the later brand guide.
4. Body type: Source Sans 3 has a small x-height. Use 18px desktop, 17px minimum mobile, line-height 1.65 to avoid "tiny text."
5. Card-grid fatigue with 15 services plus Work plus 53 articles. Use the layout pattern catalogue (plan section 23).
6. Photography of real people helps "human"; none will be fabricated. Real team photos, if you supply them, are the best asset.

## L. Decisions requiring approval

Full register: `03-decisions-register.md`. Every decision that blocked Phase 1 has since been approved (register section A0, ADR 0001 and 0002). Remaining items are non-blocking: final domain, vector logo, legal text review, Netlify authorization, country wave order.

## M. Recommended implementation sequence

| Phase | Name | Exit gate |
|---|---|---|
| 0 | Planning approval; facts register; taxonomy seeded from AGENTS; SERP review; Work and country models; 53 briefs started | You approve the revised plan |
| 1 | Foundation + Home + Software Development (+ Contact, header/footer, 404, minimum legal) | Real-browser review on desktop, tablet, mobile; all automated gates pass; your approval |
| 2 | Remaining 14 service pillars, Company, Work hub with Work Areas, legal set, production launch candidate | Per-page review; production smoke test |
| 3 | Technologies, platforms, AI and automation depth, integrations (by intent); Work Areas expanded | Qualification table approved |
| 4 | Industries, solutions, qualified intersections; country Wave 1 (5 English-market pages); article Batches 1 to 2 | Per-batch review |
| 5 | Country Waves 2 and 3; article Batches 3 to 6; Work Entries as supplied; case studies when verified | Per-batch review |
| 6 | Language localization and qualified country x service pages | Genuine localization per market |

Article batches may begin earlier once service parents exist (details in plan section 36).
