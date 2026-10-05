# DECHY Decisions Register (Revision 4, Phase 0 complete)

Status: PHASE 0 COMPLETE. Every decision that blocks Phase 1 is approved. Remaining open items are non-blocking and are listed in section B. The owner is the final product owner.
Priority: **P0** blocks Phase 1. **P1** blocks Phase 2 release. **P2** later. State: Resolved, Deferred, Open.

## A0. Approved by the owner (ADR 0001, first and second approval)

| ID | Decision | Approved as |
|---|---|---|
| DEC-01 | Working copy outside OneDrive | Done: `C:\DECHY-SITE`. |
| DEC-04 | 53-article architecture, six batches | Approved; articles written in the content phase; substantial, connected, not thin. |
| DEC-07 | Entity vs page principles | Approved, all four; full graph kept; explainers in Resources. |
| DEC-08 | URL rules | Approved; `/ai/` and `/cloud/` kept; Airtable merged into `/automation/airtable/`; slug registry; filter URLs noindex. |
| DEC-09 | Country pages only | Approved; 10 to 15 countries; no cities, addresses, or offices; service availability, not presence. |
| DEC-10 | Navigation and five families | Approved exactly as proposed, with the Talk to DECHY button; no service removed or merged. |
| DEC-11 | Root application layout | Approved; conceptual separation enforced (plan Appendix D item 7). |
| DEC-12 | Derived accessible colors | Approved; brand tokens unchanged. |
| DEC-13 | Typography system | Approved in principle; the measured system in `07` and `typography-tokens.css` is kept. |
| DEC-14 | Typed content architecture | Approved. |
| DEC-15 | Next.js, React, TypeScript, App Router, Tailwind | Approved; versions verified at scaffold. |
| DEC-16 | Locale-ready architecture, English-only publication | Covered by the original "internationalization readiness" requirement; applied. |
| DEC-20 | Image policy | Changed: Phase 1 is not diagram-only; purposeful original and properly licensed visuals, provenance tracked; per-batch download confirmation retained as procedure. |
| DEC-23 | Positioning | Approved as working copy (Option 1 plus breadth line); refined in Phase 1; descriptor unchanged. |
| DEC-24 | Homepage emphasis | Approved; structure not ranking; all 15 pillars in the index. |
| DEC-27 | Commit identity | Approved: `102127730+Samogunde@users.noreply.github.com`, configured for this repository and verified; existing commits not rewritten. |
| DEC-30 | CLAUDE.md governance | Approved; precedence updated to the owner's seven-level model. |
| DEC-31 | Phase 1 scope and handling points A, B, C | Approved; A: plain text for unbuilt pages; B: configurable secure contact destination, no fake inbox; C: imagery as DEC-20. |
| DEC-32 | Goals and markets | Resolved: global positioning for the listed client types; country set is not exclusive; detailed goals deferred. |
| DEC-33 | Final approver | The owner; Claude challenges and presents major changes for approval. |
| DEC-34 | Work Areas and Work Entries | Approved; Work stays a primary section, substantial and scalable. |
| DEC-36 | Seed all capabilities; internal classification only | Approved. |
| DEC-37 | Phase 0 research scope | Covered by the approved external-research policy. |
| DEC-40 | Push policy | Approved. |
| (new) | Repository visibility | Made private (verified: unauthenticated API returns 404). |

## A. Resolved or deferred by your corrections

| ID | State | Decision | Outcome |
|---|---|---|---|
| DEC-01 | Resolved | Working copy outside OneDrive | Moved to `C:\DECHY-SITE`; hashes, Git history, and remote verified. |
| DEC-02 | Deferred (P2) | Final domain (dechy.com is registered and parked for sale; alternatives dechytech.com, dechydev.com, others) | Not a blocker. Architecture uses a configurable `SITE_ORIGIN`; development on the Netlify subdomain with indexing blocked. Decide later. No brand change. |
| DEC-03 | Deferred (P2) | Vector logo, variants, brand guide | The approved PNG is used as supplied. Vector/reverse/favicon/brand guide are later recommendations; no invented assets. |
| DEC-06 | Withdrawn | Capability tiers that limit claims | Replaced by DEC-36. All specified capabilities are approved. |
| DEC-28 | Resolved | Push planning docs to GitHub | Per your workflow instruction, planning docs and source files are pushed to `Samogunde/DECHY-SITE`. |

## B. Remaining decisions (none blocks Phase 1)

### Architecture and information design

| ID | Pri | Decision | Recommendation |
|---|---|---|---|

### Work, countries, articles

| ID | Pri | Decision | Recommendation |
|---|---|---|---|
| DEC-35 | P1 | Country pool (15 listed) and waves: Wave 1 US, UK, Canada, Australia, Ireland; Wave 2 Germany, France, Netherlands, Switzerland, Belgium, Austria; Wave 3 Spain, Italy, Sweden, UAE. No cities. | Approve or reorder by where you want business. |
| DEC-39 | P1 | Work Area priority: which Work Areas are strongest and should lead the hub; which 20 to 25 become stand-alone pages first. | You tell me the strongest areas; I propose the rest. |
| DEC-38 | P1 | Who verifies regulatory and legal statements on country and industry pages (I source and date them; a qualified reviewer should confirm before publish). | Name a reviewer, or accept "considerations, not legal advice" wording with dated sources. |

### Facts, people, proof

| ID | Pri | Decision | Recommendation |
|---|---|---|---|
| DEC-05 | P1 | Approved Facts Register inputs: legal entity and jurisdiction; contact channels; engagement models; markets and time zones; languages of delivery; real external profiles (LinkedIn, GitHub, others). Capabilities are already approved. | Provide what exists; unknowns stay out of the site. |
| DEC-21 | P1 | Optional DECHY reference implementations (DECHY-built demos labeled as such). | Approve as an accelerator for original technical content and Work. |
| DEC-22 | P1 | Named real authors and reviewers (bios; photos only if real and consented). | Provide at least one. No staff are invented. |
| DEC-29 | P2 | Trademark clearance for DECHY in target markets. | Recommended before heavy investment; outside engineering. |

### Design

| ID | Pri | Decision | Recommendation |
|---|---|---|---|

### Operations and process

| ID | Pri | Decision | Recommendation |
|---|---|---|---|
| DEC-17 | P1 | Analytics and consent: Search Console, Bing, cookieless privacy-first analytics; GA4 later and consent-gated. | Approve. |
| DEC-18 | P1 | Contact and lead handling: form stack, email provider, storage, who responds and how fast. | Start with email plus an optional Airtable record; tell me the owner. |
| DEC-19 | P1 | AI crawler policy: allow retrieval/search agents; allow or block training agents. | Allow retrieval; training is your call (my lean: allow, since discoverability is a stated goal). |
| DEC-25 | P1 | Git workflow: `main` protected and deployed; short-lived branches; GitHub Actions CI; Dependabot. | Approve. |
| DEC-26 | P1 | Netlify: you authorize the account and plan; I configure the rest. | Needed at first preview deployment. |

### Notes on what remains

- DEC-26 (Netlify authorization) is needed when Phase 1 reaches the Netlify preview step. Not needed to start.
- DEC-18 (contact delivery destination) is configured when authorization is available; Phase 1 builds the form without it.
- DEC-25: CI is part of Phase 1. GitHub branch protection may be unavailable on a free private repository.
- DEC-05, DEC-17, DEC-19, DEC-21, DEC-22, DEC-29, DEC-35 (wave order), DEC-38, DEC-39 are non-blocking.

## C. Defaults I will apply unless you object

- No em dashes, en dashes, emojis, or the rejected tagline anywhere (enforced by lint).
- No public "no proof" or capability disclaimers; capability and evidence are separate internal concepts.
- Illustrative examples are labeled illustrative; no invented clients, metrics, results, testimonials, awards, certifications, or partnerships.
- No third-party technology logos by default (implies partnership).
- Sections without data do not render.
- Preview deployments are `noindex`.
- No DNS or domain action without your explicit go-ahead.
