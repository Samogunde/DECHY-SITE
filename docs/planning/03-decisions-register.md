# DECHY Decisions Register (Revision 3, final Phase 0 package)

Status: FINAL PHASE 0 PACKAGE. Items approved in the Phase 0 approval message are marked Approved; the remainder are Open. Reply with the numbers you approve ("approve all remaining recommendations except DEC-xx") or change any. Authority model: the owner is the final product owner (DEC-33 resolved).
Priority: **P0** blocks Phase 1. **P1** blocks Phase 2 release. **P2** later. State: Resolved, Deferred, Open.

## A0. Approved by the owner (recorded in ADR 0001)

| ID | Decision | Approved as |
|---|---|---|
| DEC-04 | 53-article architecture and six-batch structure | Approved. Articles are written in the content phase, not now. |
| DEC-09 | Country pages only, no cities, no implied offices | Approved. Countries are for international search and content expansion and do not limit DECHY's global scope or imply priority markets. |
| DEC-12 | Derived accessible color variants | Approved. Brand tokens unchanged; derived colors documented. |
| DEC-13 | Larger, more readable typography | Approved in direction; full system in `07-typography-system.md` awaiting final review. |
| DEC-14 | Typed content architecture | Approved. |
| DEC-15 | Next.js, React, TypeScript, App Router, Tailwind | Approved. Exact versions verified at scaffold (`08`). |
| DEC-30 | CLAUDE.md with precedence model | Approved; created (`CLAUDE.md`). |
| DEC-33 | Final approver | Resolved: the owner is the final product owner; Claude challenges weak decisions and presents major changes for approval. |
| DEC-34 | Work Areas and Work Entries | Approved. Work Areas must be substantive, not thin SEO pages. |
| DEC-35 | Country pool (15 listed) | Pool retained; wave order still open. |
| DEC-36 | Seed all capabilities; internal classification only | Approved. |
| DEC-40 | Push policy | Approved: planning pushed after verification; code follows implement, test, inspect, fix, verify, commit, push. |

## A. Resolved or deferred by your corrections

| ID | State | Decision | Outcome |
|---|---|---|---|
| DEC-01 | Resolved | Working copy outside OneDrive | Moved to `C:\DECHY-SITE`; hashes, Git history, and remote verified. |
| DEC-02 | Deferred (P2) | Final domain (dechy.com is registered and parked for sale; alternatives dechytech.com, dechydev.com, others) | Not a blocker. Architecture uses a configurable `SITE_ORIGIN`; development on the Netlify subdomain with indexing blocked. Decide later. No brand change. |
| DEC-03 | Deferred (P2) | Vector logo, variants, brand guide | The approved PNG is used as supplied. Vector/reverse/favicon/brand guide are later recommendations; no invented assets. |
| DEC-06 | Withdrawn | Capability tiers that limit claims | Replaced by DEC-36. All specified capabilities are approved. |
| DEC-28 | Resolved | Push planning docs to GitHub | Per your workflow instruction, planning docs and source files are pushed to `Samogunde/DECHY-SITE`. |

## B. Open decisions

### Architecture and information design

| ID | Pri | Decision | Recommendation |
|---|---|---|---|
| DEC-04 | P0 | Approve the 53-article architecture in `06-article-plan-53.md` (titles, clusters, batches) as the launch set. If an original list exists, send it for reconciliation. | Approve; titles finalized per brief after a SERP check. |
| DEC-07 | P0 | Principles: entity does not equal page; one canonical home per concept; service x technology page is canonical when "X development" intent dominates. | Approve. |
| DEC-08 | P0 | URL rules: canonical-home URLs, flat hubs (`/industries/`, `/solutions/`, `/work/`, `/locations/`, `/resources/`), `trailingSlash: true`, merge `/automation/airtable-automation/` into `/automation/airtable/`, keep `/ai/` and `/cloud/`. | Approve. |
| DEC-09 | P0 | Locations: country pages only (no cities, addresses, offices, `LocalBusiness`), each with required country-specific substance, similarity validator, and sourced dated regulatory statements. | Approve (`05-country-architecture.md`). |
| DEC-10 | P0 | Navigation: five capability families; Work and Resources in the main menu; Locations from footer and Company. | Approve. |
| DEC-11 | P0 | Repository layout: app at repo root with `data/`, `content/`, `docs/` (deviates from AGENTS 78 `website/`). | Approve. |
| DEC-14 | P0 | Content store: typed YAML/MDX in Git, Zod validation, custom loader, no CMS at launch; image masters outside Git. | Approve. |
| DEC-15 | P0 | Stack: Next.js (latest stable, patched), React, TypeScript strict, Tailwind, npm, Node 22, static-first on Netlify. | Approve; versions and advisories verified at scaffold. |
| DEC-16 | P1 | Internationalization: locale-ready from day one, default locale unprefixed, English-only publishing initially. | Approve. |
| DEC-36 | P0 | Taxonomy seeding: every entity in AGENTS 3 to 23 is seeded 1:1; classification fields (`role`, `primaryService`, `prominence`, `pagePolicy`, `evidenceLevel`) organize the architecture and never remove capabilities or produce public disclaimers. | Approve. |

### Work, countries, articles

| ID | Pri | Decision | Recommendation |
|---|---|---|---|
| DEC-34 | P0 | Work two-layer model: Work Areas (system-centric, writable now) plus Work Entries (from facts you supply; summary, detailed, case-study depth). | Approve. |
| DEC-35 | P1 | Country pool (15 listed) and waves: Wave 1 US, UK, Canada, Australia, Ireland; Wave 2 Germany, France, Netherlands, Switzerland, Belgium, Austria; Wave 3 Spain, Italy, Sweden, UAE. No cities. | Approve or reorder by where you want business. |
| DEC-39 | P1 | Work Area priority: which Work Areas are strongest and should lead the hub; which 20 to 25 become stand-alone pages first. | You tell me the strongest areas; I propose the rest. |
| DEC-37 | P0 | Phase 0 research scope: SERP and competitor inspection per pillar and strategic technology (live search, no paid keyword tool connected). | Approve. Tell me if you have a keyword tool export to use. |
| DEC-38 | P1 | Who verifies regulatory and legal statements on country and industry pages (I source and date them; a qualified reviewer should confirm before publish). | Name a reviewer, or accept "considerations, not legal advice" wording with dated sources. |

### Facts, people, proof

| ID | Pri | Decision | Recommendation |
|---|---|---|---|
| DEC-05 | P1 | Approved Facts Register inputs: legal entity and jurisdiction; contact channels; engagement models; markets and time zones; languages of delivery; real external profiles (LinkedIn, GitHub, others). Capabilities are already approved. | Provide what exists; unknowns stay out of the site. |
| DEC-21 | P1 | Optional DECHY reference implementations (DECHY-built demos labeled as such). | Approve as an accelerator for original technical content and Work. |
| DEC-22 | P1 | Named real authors and reviewers (bios; photos only if real and consented). | Provide at least one. No staff are invented. |
| DEC-29 | P2 | Trademark clearance for DECHY in target markets. | Recommended before heavy investment; outside engineering. |
| DEC-32 | P0 | Goals and priority markets: target customers, top service lines by revenue, definition of a qualified lead. | Provide; drives homepage emphasis and country wave order. |
| DEC-24 | P0 | Homepage emphasis within the five families, given your revenue mix (no ranking of AI or Automation above others). | Tell me the mix. |
| DEC-23 | P0 | Positioning statement (three candidates in plan section 2). | Choose one; my lean is option 1. |

### Design

| ID | Pri | Decision | Recommendation |
|---|---|---|---|
| DEC-12 | P0 | Derived accessible tokens (link blue #2A62D8, on-dark blue #7AA5F8, slate text #5B6472, darker functional text colors; computed). Brand values unchanged. | Approve. |
| DEC-13 | P0 | Typography system (revised): approve `07-typography-system.md` as the standard (fluid roles, fixed UI sizes, measures, breakpoints). | Approved in direction; confirm the full specification. |
| DEC-20 | P1 | Image policy: diagrams first; licensed photography sparingly; AI imagery conceptual only; per-batch download approval; masters outside Git. | Approve. |
| DEC-31 | P0 | Phase 1 scope: Home + Software Development + working Contact + header/footer + 404 + minimum legal pages (flagged for qualified review before launch). | Approve. |

### Operations and process

| ID | Pri | Decision | Recommendation |
|---|---|---|---|
| DEC-17 | P1 | Analytics and consent: Search Console, Bing, cookieless privacy-first analytics; GA4 later and consent-gated. | Approve. |
| DEC-18 | P1 | Contact and lead handling: form stack, email provider, storage, who responds and how fast. | Start with email plus an optional Airtable record; tell me the owner. |
| DEC-19 | P1 | AI crawler policy: allow retrieval/search agents; allow or block training agents. | Allow retrieval; training is your call (my lean: allow, since discoverability is a stated goal). |
| DEC-25 | P1 | Git workflow: `main` protected and deployed; short-lived branches; GitHub Actions CI; Dependabot. | Approve. |
| DEC-26 | P1 | Netlify: you authorize the account and plan; I configure the rest. | Needed at first preview deployment. |
| DEC-27 | P0 | Commit identity: configured `Samogunde` / `ssmmyjoy5@gmail.com`. Is that email attached to the Samogunde GitHub account? | Confirm; otherwise I switch to the right email or a GitHub noreply address. |
| DEC-30 | P0 | Governance: add `CLAUDE.md` importing AGENTS.md; replace Codex references in AGENTS.md (sections 79, 81); add `docs/decisions/` ADR log. AGENTS.md edits are listed in an ADR for your approval first. | Approve. |
| DEC-40 | P0 | Push policy: after each verified milestone I push to `main` for planning/docs; for code, short-lived branches merged after CI and your milestone approval. | Approve. |

## C. Defaults I will apply unless you object

- No em dashes, en dashes, emojis, or the rejected tagline anywhere (enforced by lint).
- No public "no proof" or capability disclaimers; capability and evidence are separate internal concepts.
- Illustrative examples are labeled illustrative; no invented clients, metrics, results, testimonials, awards, certifications, or partnerships.
- No third-party technology logos by default (implies partnership).
- Sections without data do not render.
- Preview deployments are `noindex`.
- No DNS or domain action without your explicit go-ahead.
