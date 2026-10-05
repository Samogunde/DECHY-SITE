# DECHY Strategic and Technical Audit

Status: DRAFT FOR REVIEW. No production code exists. Nothing in this document has been built.
Date: 2026-10-04
Scope: AGENTS.md (4,357 lines), DECHY_CONTENT_MASTER.md, DECHY_CLAUDE_MASTER_HANDOFF.md, the supplied logo PNG, and the environment (local machine, Git, GitHub remote, domain).

Labels used throughout:

- CONFIRMED: stated explicitly in the supplied specifications or by the user.
- VERIFIED: I checked it myself in this audit and report the result.
- RECOMMENDED: my professional recommendation.
- ASSUMPTION: inferred; not to be treated as a DECHY fact.
- DECISION REQUIRED: needs your approval before the work that depends on it.

---

## 0. Environment and verification results (all VERIFIED)

| Check | Result |
|---|---|
| Working directory | `C:\Users\HP\OneDrive\Desktop\DECHY SITE` |
| Contents at start | 4 files: `AGENTS (1).md` (106 KB), `DECHY_CONTENT_MASTER.md`, `DECHY_CLAUDE_MASTER_HANDOFF.md`, `Minimalist DECHY Tech Logo.png` |
| Git at start | Not a repository. Initialized now with branch `main`. |
| Remote | `origin` set to `https://github.com/Samogunde/DECHY-SITE.git`. `git ls-remote` returned success with zero refs, so the repository exists and is empty (fresh). It is not the old Codex repository. |
| File naming | `AGENTS (1).md` is a browser-download artifact. Renamed to `AGENTS.md` (the name every spec document refers to). Content untouched. |
| Node / npm | Node 22.15.1, npm 11.4.2 (adequate for current Next.js). |
| GitHub CLI (`gh`) | Not installed. Not needed for plain Git over HTTPS; needed only for CLI-created pull requests. |
| Git identity | Global `user.name` = Samogunde, `user.email` = ssmmyjoy5@gmail.com. This differs from the email on the current Claude session (ssmmyjoy10@gmail.com). See DEC-27. |
| Local path | Inside OneDrive. This is a real engineering risk. See H-1. |
| Logo file | 1536 x 676 px, 32-bit PNG, fully opaque, near-white background (#FDFEFC). Raster only. |
| dechy.com registration | Registered 2009-03-04, expires **2027-03-04**, registrar-locked (client delete/renew/transfer/update prohibited), nameservers NS1/NS2.NAMEFIND.COM, last changed 2026-02-12. The domain is **not "available"; it is already registered**, and `http://dechy.com` and `https://www.dechy.com` respond HTTP 200. I could not read the page content (requests timed out), so what is currently being served is **unverified**. |
| Web presence of the name "DECHY" | A search for a technology company called DECHY returned no matching company. The name's dominant public meaning is **Dechy, a commune in the Nord department of France (about 5,300 inhabitants)**. See Section I. |

---

## A. What is already strong

1. **Positioning discipline.** The descriptor "Technology, Software, AI & Digital Solutions" is fixed, the rejected tagline is recorded, and the rule that AI and Automation must not outrank the other services is explicit. This prevents the most common drift.
2. **Anti-fabrication rules are unusually thorough** (AGENTS 46, 47, 64, 80A.7; Handoff 9, 19). They are the right rules for a site that will be heavily AI-assisted.
3. **The qualification mindset is correct.** "Entity universe is not a page list" (AGENTS 41, 94) and the 10-question Page Qualification Engine (AGENTS 27) are the right defense against thin-page SEO.
4. **Content depth model** (micro/short/medium/long/full) is practical and maps cleanly to a typed data model.
5. **The brand system is restrained and internally coherent.** Two typefaces, five core colors, explicit anti-patterns, and a rule that visual richness must come from content rather than gradients.
6. **Engineering quality gates are specific** (AGENTS 80A, Handoff 22). The automated QA list in AGENTS 62 is a ready-made specification for a content validator.
7. **Phasing is already the right shape** (Home plus Software Development first, then scale after review).
8. **The "Connected capability" thesis** (Software + AI + Automation + Integration + Cloud) is a genuine differentiator if it is demonstrated rather than asserted.

## B. What is missing

### B1. Facts DECHY needs before any page can be written truthfully
There is no **Approved Facts Register**. Only these facts are established: name, domain, descriptor, since-2010 and 1,500-clients statement (in the Handoff and your instruction, **not in AGENTS.md**), global positioning, no physical locations.

Missing and required:

- Legal entity name, jurisdiction, registration details (needed for Organization schema, privacy policy, terms, and in some countries mandatory site identification).
- Who actually delivers the work: headcount range, named leads, bios, photos (real ones only).
- Contact channels: email, phone, scheduling link, response expectations.
- Engagement models and pricing posture (fixed price, time and materials, retainer, price ranges or none).
- Which services and technologies DECHY **actually** delivers, at what depth (see C-3).
- Real proof: any permitted client names, logos, quotes, screenshots, repositories, certifications, partner status.
- Which external profiles exist (LinkedIn, GitHub, Upwork, Contra, Clutch, GoodFirms are listed as "potential" in AGENTS 36; none are confirmed).
- Basis of the 1,500 statement (internal records) so it can be substantiated if challenged.

### B2. Specification documents that AGENTS 79 says must exist, but do not
Of ten listed "master specification documents", only AGENTS.md exists. Missing: Master Brand Specification, Service and Technology Taxonomy, Entity and Search Architecture, SEO/AEO/GEO Specification, Content Architecture and Rules, URL and Internal Linking Specification, UX/UI Specification, Technical Architecture, Content Database. The accompanying Master Plan creates the architecture-level versions of these; the Content Database is Phase 0 work.

### B3. Brand assets
- No vector logo. No transparent-background version. No reverse (white) version for dark sections. No monogram, favicon, app icon, wordmark-only, or compact lockup. AGENTS 1A.3 lists all of these as part of the "logo system". Only one raster exists.
- No brand guide document. No Open Graph template.

### B4. Business and market inputs
- No keyword, SERP, or competitor data anywhere in the specs. Every search-intent statement is currently an **assumption**.
- No stated target customer priority, ideal client profile, deal size, geography priority, or revenue mix by service.
- No measurable goals (leads per month, qualified consultations, target markets).

### B5. Site capabilities not mentioned in the specs
Legal pages (privacy, terms, cookie policy), cookie consent, accessibility statement, `security.txt`, 404/500 pages, a contact form with spam protection and a data-retention rule, an author/reviewer model for E-E-A-T, a content change-log and "last reviewed" system, a redirect map for the existing live dechy.com, an AI-crawler policy (robots.txt), an RSS feed for knowledge content.

### B6. Governance
- No `CLAUDE.md`. Claude Code reads `CLAUDE.md`, not `AGENTS.md`; a one-line import fixes this.
- No architecture decision record (ADR) process, although the task requires me to challenge the specs and AGENTS.md says they may not be silently changed.
- No definition of who approves what (the Content Master refers to a "master planner" and "the user" as separate reviewers).

## C. What is unclear

1. **Who is the "master planner" and who gives final approval?** (Content Master 2, 14.) Needed for the review gates.
2. **Intended scale of the initial public launch.** "Launch content set" of 53 articles, 15 services, plus technologies/industries/solutions: is a single big-bang launch intended, or staged publication? (I recommend staged; see Plan section 36.)
3. **How much of the technology list is real capability?** AGENTS lists several hundred named technologies (e.g. Perl, Lua, MATLAB, Visual Basic, Objective-C, Couchbase, Cassandra, Milvus, Ember, Foundation, Bulma). AGENTS 46 forbids claiming "technology experience that has not been established". Nothing in the supplied material establishes any of it. The lists define the **entity universe**, not DECHY's capability. A per-entity capability tier is needed.
4. **The 1,500 statement versus the absence of proof.** It is an approved claim, but there are no clients, logos, case studies, reviews, team members, or public profiles to back it. How will visitors and search systems corroborate it?
5. **What currently lives at dechy.com** and whether it carries existing rankings, backlinks, or email (MX records) that a relaunch must preserve.
6. **Whether Netlify is decided or merely directed.** The Handoff states Netlify; AGENTS 85 says hosting "should be decided deliberately" and lists nine options.
7. **Lead handling.** Where do inquiries go (email, Airtable, CRM), who responds, and in what time?
8. **Languages.** AGENTS 25 lists 12 languages. Is any language planned within 12 months?

## D. What is contradictory

| # | Contradiction | Where | Resolution proposed |
|---|---|---|---|
| D-1 | Content Master 9 says the "53 approved launch articles **already defined in AGENTS.md**". AGENTS.md contains no such list (verified by search; the only "53" is a section heading number). | Content Master 9, 14 | The list is missing. Either supply it or approve a derived slate (Plan 14). I will not invent a list and call it approved. |
| D-2 | "Do not recreate the logo" versus AGENTS 1A.3 "must eventually be recreated as true vector artwork" and 1A.3's long list of variants. | Content Master 11, your instruction vs AGENTS 1A.3 | I will not redraw or alter it on my own. A vector master needs an explicit authorization path (DEC-03). |
| D-3 | Spec is "authoritative; do not reinterpret" versus Handoff and your instruction "challenge the specification". | AGENTS Status vs Handoff 6 | AGENTS Status itself says the most recent explicit user instruction wins. Your latest instruction authorizes challenge. Changes still go through an ADR and are approved by you. |
| D-4 | Three or four incompatible phase schemes: AGENTS 60 (6 batches, Batch 1 includes all core services), AGENTS 95 (9 phases), Handoff 23 (Phase 1 is only Home and Software Development), Content Master 14 (9 stages). | See left | Plan section 36 defines one canonical sequence and states how each source maps onto it. |
| D-5 | AGENTS 81 names **Codex** the primary engineering agent; AGENTS 79 item 10 is "DECHY Codex AGENTS.md". You have now made Claude Code the engineer and abandoned the Codex build. | AGENTS 79, 81 | Update on approval: keep content, retitle, remove tool-specific workflow. |
| D-6 | AGENTS 78 repository layout puts the site in a `website/` subfolder with `data/` at the top. Netlify and Next.js are simplest with the app at repository root. | AGENTS 78 | Recommend root-level app, content under `content/` and `data/`, docs under `docs/` (DEC-11). |
| D-7 | `/automation/airtable/` and `/automation/airtable-automation/` are both listed as example URLs. The spec's own rule (AGENTS 58) forbids two pages with essentially one intent. | AGENTS 29 | One page. See Plan section 20. |
| D-8 | Short service slugs (`/ai/`, `/cloud/`, `/ecommerce/`, `/ui-ux/`, `/branding/`, `/consulting/`) sit beside long slugs (`/software-development/`, `/web-development/`, `/seo-aeo-geo/`). The names of the services themselves ("AI & Machine Learning", "Cloud & DevOps") do not match their slugs. | AGENTS 29 | Keep the spec's slugs (they are CONFIRMED) but record the exact mapping in a slug registry and decide the two weak ones (DEC-08). |
| D-9 | The "one sentence" client journey (AGENTS 39) groups services by project stage, while navigation (AGENTS 66) is a different set of discovery paths, and the Content Master homepage (6.9) uses the journey again. | AGENTS 39, 66; Content Master 6 | Different jobs: nav groups by capability family; the homepage section shows the journey. Not truly contradictory but must be designed deliberately. |
| D-10 | Many concepts appear under several pillars with no declared owner: Web Design (Web and UI/UX), Marketplace Development (Software and Ecommerce), Business Dashboards (Software and Data), Solution Architecture (Software and Consulting), Cybersecurity Consulting (Cyber and Consulting), Payment Integration (Integration and Ecommerce), Marketing Automation (Automation and Marketing), AI Chatbots/Copilots (AI and Automation), Firebase/Supabase (Cloud and Data), Kotlin/Swift (Mobile and Languages), IAM (AWS and Cyber). | AGENTS 3 to 17 | Introduce a mandatory **canonical home** per concept. Others reference, never duplicate. |
| D-11 | "Service x Technology x Industry x Location" is listed twice in sequence. | AGENTS 24 | Typographical; ignore. |
| D-12 | Handoff 13 says "Do not use random stock photography simply to fill empty space", but the Content Master and AGENTS require every important page to have images ("must not launch as a text-only site"). | Handoff 13 vs AGENTS 1A.11 | Not a contradiction if every image has a job (AGENTS 1A.11 acceptance rule). Practical consequence: far fewer photos, many more purpose-built diagrams. |
| D-13 | AGENTS 1A.11 ranks AI-generated images as the fifth and last source, yet the same text expects most hero and article imagery to be non-photographic. | AGENTS 1A.11 | Plan section 25: diagrams and typographic/system graphics become the primary visual layer. |
| D-14 | The 1,500 statement and "since 2010" appear in the Handoff and your instruction but not in AGENTS.md, so AGENTS.md's "authoritative" facts are incomplete. | Handoff 2 | Create the Approved Facts Register as a first-class file and add these facts to it. |

## E. What I recommend changing

1. **Replace "technology list = capability" with a capability tier.** Each technology/platform/integration entity gets `capability: core | working | familiar | unverified`. Only `core` and `working` may appear in "what DECHY does with X" copy or schema. Everything else may exist as a neutral reference entity (for example in comparison guides) with no capability claim.
2. **Single canonical home per concept** (D-10), enforced by the content validator.
3. **Technology pages: entity does not equal page.** Where search intent is "X development services" (React, Python, WordPress, Shopify), the service-by-technology page is the canonical page. A separate "X" explainer is created only if it serves a different intent (informational), and then it lives in Knowledge. See Plan sections 6 to 8 and 20.
4. **Do not nest everything under a service.** Nested URLs (`/software-development/python/`) imply a single parent. Keep nesting only for qualified intersection pages. Single entity hubs use flat type folders (`/technologies/`, `/industries/`, `/solutions/`, `/integrations/`, `/platforms/`).
5. **Remove city-level pages from the default model.** Country pages only after the location rule (AGENTS 24) is satisfied with evidence. City pages: `DO NOT CREATE` by default for a company with no physical presence (doorway-page and scaled-content risk).
6. **Navigation: group the 15 services into five capability families** instead of listing them flat or by project stage. Hide "Case Studies / Work" from navigation until at least three real, permitted case studies exist.
7. **Reduce homepage promises to what can be shown.** Twelve sections is acceptable only if sections are visually and structurally varied (which the Content Master requires). Ship the proof section only with real proof (see F-6).
8. **Treat FAQ schema and Service schema as semantic aids, not rich-result tools.** Google restricted FAQ rich results in 2023 to well-known authoritative government and health sites, and HowTo rich results were retired. Keep question-answer content for users and answer engines; do not budget effort around SERP features.
9. **Do not plan `llms.txt` as a visibility lever.** No major search or answer engine has confirmed using it. If added, it is optional and cheap, never a deliverable that signals progress.
10. **Move the working copy out of OneDrive** (H-1).
11. **Rename and retitle** AGENTS.md references to Codex (D-5) once you approve.
12. **Add a `CLAUDE.md` that imports AGENTS.md**, so the specification is loaded in every session.

## F. What I recommend adding

1. **Approved Facts Register** (`data/facts/company.yaml`) with a stable ID for every claim. Page copy references fact IDs; a validator rejects numeric or historical claims that are not backed by a register entry.
2. **Capability register** (see E-1) and **proof register** (every case study, quote, logo, certification, with permission status, date, and source).
3. **Entity graph with typed edges** (`offers`, `usesTechnology`, `appliesToIndustry`, `solves`, `integratesWith`, `alternativeTo`, `migratesFrom`), stored as data and validated for orphans and impossible relationships.
4. **A Proof Pipeline.** The honest answer to "no case studies yet": build and publish a small number of **DECHY reference implementations**, clearly labeled as such (for example an Airtable plus n8n lead-qualification workflow with a public repository, or a retrieval-augmented question-answering demo with evaluation notes). These are real artifacts, real expertise signals, and real diagrams, and they are not fake client work. Three to five are enough to anchor Automation, AI, Integration, and Software pages.
5. **Named human authors and reviewers** with real bios and, where the people agree, real photographs. This is the single largest trust and E-E-A-T lever available, and it requires your input.
6. **Entity disambiguation plan** (see I-1): consistent brand phrasing, Organization schema with stable `@id`, real `sameAs` profiles, a Crunchbase/LinkedIn/GitHub footprint created from real information.
7. **Trademark clearance** for DECHY in the key markets (outside engineering scope, but cheap to do before heavy investment).
8. **Legal and compliance set:** privacy policy, cookie policy and consent, terms, accessibility statement, `security.txt`, and (if Germany or other Impressum-requiring markets are targeted) a compliant site-identification page.
9. **Redirect map** from whatever dechy.com currently serves.
10. **Measurement plan** with named goals, Search Console, Bing Webmaster Tools, privacy-respecting analytics, and an AI-referral report (see Plan section 32).
11. **Image asset registry** as typed data (`data/assets/images.yaml`) from day one, plus `data/assets/licenses/` for license evidence.
12. **Content linter** for house rules: no em or en dashes, no emojis, banned phrases (including "Technology. People. Progress."), banned unsupported-claim phrases, descriptor exactness.
13. **ADR log** (`docs/decisions/`) for every deviation from AGENTS.md.

## G. What I recommend removing or deferring

| Item | Recommendation |
|---|---|
| City pages (all) | Remove from the default model. Revisit only with evidence. |
| Language pages (all 12) | Defer. Build the architecture to be locale-ready; publish only genuinely localized, human-reviewed languages, and only after the English site has traffic and conversion data. |
| `/automation/airtable/` plus `/automation/airtable-automation/` | Merge to one. |
| Programming-language "entity pages" (24 languages) | Do not create by default. Python, TypeScript/JavaScript, PHP, Java, C#, Go are plausible later as service-by-technology pages if intent exists; the rest (Perl, Lua, MATLAB, Visual Basic, Objective-C, R, Scala, Bash, PowerShell) have no obvious client-service intent and should be entities only. |
| Stale or declining technologies in capability lists | Adobe XD is in maintenance mode, Gatsby has declined, Travis CI is largely displaced. Keep as entities for migration content ("migrating from Gatsby") but do not present as current offerings. (ASSUMPTION based on public information; re-verify when writing.) |
| Technology logo walls | Do not use third-party logos in "technologies" sections unless DECHY has the right to; logos imply partnership or certification. Use names and capability statements. |
| "Case Studies / Work" in primary navigation | Remove until real evidence exists. |
| FAQ blocks on every page | Add only where real questions exist. |

## H. Technical risks

| # | Risk | Severity | Detail and mitigation |
|---|---|---|---|
| H-1 | **Repository inside OneDrive** | High | `node_modules`, `.next`, and `.git` inside a synced folder cause sync storms, file locks, slow installs, and occasional repository corruption. The path also contains a space. Mitigation: work in a non-synced path such as `C:\Dev\dechy-site`; GitHub is the backup. Needs your approval because it moves the working directory. |
| H-2 | Dependency security of the chosen stack | High | Next.js and React Server Components had serious publicly disclosed vulnerabilities in 2025 (a middleware authorization bypass, and a critical remote code execution issue in React Server Components disclosed in December 2025). Mitigation: pin to patched versions, maximize static output so there is little server runtime, enable Dependabot and `npm audit` in CI, and re-check advisories at scaffold time. |
| H-3 | Strict CSP versus static rendering | Medium | Nonce-based CSP forces dynamic rendering in Next.js. Use hash-based or host-allowlist CSP delivered by Netlify headers, with `frame-ancestors 'none'`, HSTS, and the standard header set. Validate in the browser. |
| H-4 | Next.js feature support on Netlify | Medium | Netlify supports Next.js well but feature parity and pricing evolve. Mitigation: prefer static generation, avoid exotic runtime features, run the production build through Netlify preview from the first commit, and keep the content layer framework-independent so a host change is cheap. |
| H-5 | Content layer lock-in | Medium | Hard-coded pages would break the entity model. Mitigation: typed content (YAML/MDX plus Zod schemas) in the repository; every template reads from it. Headless CMS remains possible later because the model is portable. |
| H-6 | Internationalization retrofit cost | High if ignored | Adding `[locale]` routing, hreflang, RTL, and font fallbacks after launch is expensive. Mitigation: locale-aware content loader and a single URL builder from day one; logical (start/end) CSS properties; English-only publication. |
| H-7 | Build time and sitemap scale | Low now, medium later | Static generation of a few hundred pages is fine; thousands need incremental strategies and sitemap indexes. The qualification policy keeps this manageable. |
| H-8 | Image weight and repository bloat | Medium | Keep masters outside Git (or in Git LFS) and commit only optimized derivatives. Registry required. |
| H-9 | Forms and spam | Medium | Contact form needs a server endpoint, bot protection (honeypot plus a privacy-friendly challenge), rate limiting, validation, and a stated retention period. Do not claim an Airtable/CRM integration until it is live. |
| H-10 | Domain continuity | High | Registered domain expires 2027-03-04 and is registrar-locked; DNS is at NAMEFIND. Cutover to Netlify requires access to the registrar or DNS, MX/email records must be preserved, and the current site's URLs must be redirected. Confirm ownership and renewal. |
| H-11 | Environment gaps | Low | `gh` CLI missing (optional). No Netlify authentication from me (external, requires your login). Browser testing is available through the built-in browser. |
| H-12 | Fonts for non-Latin scripts | Medium | Manrope and Source Sans 3 do not cover Arabic, CJK. Locale-specific fallbacks (for example Noto families) must be chosen and tested before localized pages are published. |

## I. SEO, AEO, GEO risks

1. **I-1 Entity collision and zero external footprint.** "Dechy" resolves in public search to a French commune (Nord, population about 5,300), and I found no public web presence for DECHY as a technology company. A brand with no third-party mentions and a 2010/1,500 claim is a trust and disambiguation problem for both Google and AI systems. Mitigation: always pair the name with the descriptor in titles, Organization schema with stable `@id`, real `sameAs` profiles, consistent naming in every external profile, and the Proof Pipeline. This is the most important GEO risk in the project.
2. **I-2 Claim substantiation.** "Over 1,500 organizations" with no verifiable evidence is a credibility and, in some jurisdictions, an advertising-substantiation risk. Mitigation: keep the approved wording exactly, back it with an internal substantiation file, never repeat it in schema as a numeric property, and avoid pairing it with unverifiable outcomes.
3. **I-3 Scaled-content and thin-page policy exposure.** Google's spam policies target scaled, low-value content created primarily to rank. A site of many AI-assisted pages with no first-hand experience signals is exactly that profile. Mitigation: the qualification engine, human review, original diagrams and reference implementations, named authors, and slow batch publication.
4. **I-4 Duplicate intent.** Overlaps described in D-7 and D-10, and the service-versus-technology collision in E-3.
5. **I-5 Doorway-page risk** from Service x Location pages without a physical presence (E-5).
6. **I-6 No keyword or SERP evidence.** The architecture is currently informed by taxonomy, not demand. Mitigation: a Phase 0 SERP and competitor review using live search inspection, and Search Console data after launch to decide on expansion.
7. **I-7 Schema misuse.** `LocalBusiness`, ratings, reviews, `numberOfEmployees`, offices are all off-limits without evidence. Use `Organization` (or the more specific `ProfessionalService` only if it fits), `WebSite`, `WebPage`, `Service`, `BreadcrumbList`, `Article`, `ProfilePage` for real people.
8. **I-8 International SEO.** hreflang requires strict reciprocity and self-references; wrong implementation silently fails. Decide URL strategy now (default locale unprefixed, others in subdirectories).
9. **I-9 Redirects from the existing site.** Unknown inbound links and rankings on the live dechy.com could be lost.
10. **I-10 AI crawler policy.** You must decide which AI user agents to allow (search/retrieval versus model training). Blocking retrieval bots reduces AI-search visibility; allowing training bots is a business decision.
11. **I-11 Freshness signals.** AEO/GEO content decays; every page needs `datePublished`, `dateModified` (true values only), and a review owner.

## J. Content risks

1. Generic AI prose across 15 service pages, which the specs themselves warn about. Mitigation: per-service content briefs that vary structure and emphasis, human review, and the linter.
2. Capability claims DECHY cannot back (see C-3).
3. Competent-sounding but unverifiable technical statements. Mitigation: technical review step for each page, and prefer statements about method and trade-offs over claims about results.
4. Keyword-led headings producing robotic copy. Mitigation: plain-language headings; natural entity coverage.
5. Inconsistent descriptions across short, medium, and long forms. Mitigation: store all five lengths in one record and validate that they agree on the underlying claims.
6. Dash punctuation rule (AGENTS 1A.16) conflicts with common style, numeric ranges, and page-title conventions. Mitigation: lint, and use "to" in ranges, colons or commas elsewhere, and "|" or a colon in title separators.
7. Missing launch article list (D-1).

## K. Design risks

1. **Tension between "no gradients, minimal palette" and "visually rich, never sparse".** Richness must come from imagery, diagrams, typography scale, layout rhythm, and dark/light section changes, not from color effects. This is feasible but needs deliberate art direction.
2. **Contrast failures inside the approved palette** (VERIFIED by computation):

| Pair | Ratio | WCAG AA text (4.5) | Note |
|---|---|---|---|
| #111827 on #F7F6F2 | 16.4 | Pass | |
| #2F6FED on white | 4.55 | Pass (barely) | |
| #2F6FED on #F7F6F2 | **4.21** | **Fail for body-size links** | Needs a darker link blue or underline-plus-weight approach on Warm Off White |
| White on #2F6FED (buttons) | 4.55 | Pass (barely) | |
| #2F6FED on #111827 (links on dark) | **3.90** | **Fail** | Needs a lighter blue tint for dark sections |
| #6B7280 on white | 4.83 | Pass | |
| #6B7280 on #F7F6F2 | **4.47** | **Fail by 0.03** | Slate secondary text on the main background narrowly fails |
| #6B7280 on #E5E7EB | **3.90** | **Fail** | |
| Success #16A34A on white | **3.30** | **Fail as text** | Use a darker green for text; keep as icon/fill |
| Warning #F59E0B on white | **2.15** | **Fail as text** | Fill only; text needs a dark amber |
| Info #3B82F6 on white | **3.68** | **Fail as text** | |
| #E5E7EB border on #F7F6F2 | **1.14** | Fail non-text 3:1 for input borders | Form field borders need a darker neutral |

   The brand colors are fine as brand colors. The design tokens must add **derived** accessible variants (link blue, on-dark blue, slate-text, darker functional text colors, input border). These are derivations, not new brand colors, and need your approval (DEC-12).
3. **Logo colors differ from the tokens.** Sampled logo ink is about #0A1B30 (a deep navy) and the blue bar about #1B6BEE. The brand tokens are #111827 and #2F6FED. Placing the logo next to #111827 UI will show a slight mismatch. Not a defect if the logo is the master, but the vector logo should declare exact colors, and the tokens may need to follow the logo or vice versa (DEC-03).
4. **The raster logo has an opaque near-white background (#FDFEFC)** that will show as a faint box on #F7F6F2 and a bright rectangle on dark sections. It cannot be used on dark surfaces at all.
5. **The logo's E is drawn as three detached bars with no vertical stem**, so at small sizes it can read as "D=CHY". This is an observation about legibility at small sizes, not a challenge to approval; it is a reason to prioritize the favicon/monogram and minimum-size rules and to test the header lockup at real size.
6. **The descriptor is baked into the raster at a light weight.** It will be illegible at header size. The header needs a wordmark-only version; the descriptor can be live text set in Manrope.
7. **Source Sans 3 has a small x-height.** At 16px it will look "tiny", which is exactly the failure the Content Master warns about. Set long-form body text at 18 to 19px desktop, 17px minimum on mobile, 1.6 to 1.7 line height, 65 to 75 character measure.
8. **Card-grid fatigue.** Fifteen services plus many entity types invite uniform grids. Mitigation: a catalogue of layout patterns (see Plan section 23).
9. **Imagery without photography of real people** can feel cold and "human" is a stated trait. Real team photography, if available, is worth more than any stock.

## L. Decisions requiring approval

The complete numbered register (DEC-01 to DEC-33), with my recommendation for each, is in `03-decisions-register.md`. The ones that block Phase 0 or Phase 1:

1. DEC-01: relocate the working copy out of OneDrive.
2. DEC-02: confirm ownership, access, renewal, and current content of dechy.com.
3. DEC-03: logo master and variant authorization path.
4. DEC-04: supply or approve a derivation of the launch article list.
5. DEC-05: provide inputs for the Approved Facts Register.
6. DEC-06: capability tiers for technologies and services.
7. DEC-07 to DEC-12: the architecture and design amendments in Sections E and K.

## M. Recommended implementation sequence

| Phase | Name | Gate to exit |
|---|---|---|
| 0 | Foundation and specification | You approve this plan, the decisions register, and the facts register. |
| 1 | Technical foundation, design system, representative pages (Home and Software Development) | Browser review of both pages on desktop, tablet, mobile; all automated checks pass; you approve the standard. |
| 2 | Remaining 14 core services, Company, Contact, legal set | Each service reviewed for non-template structure. Production deployment and smoke test. |
| 3 | Technologies, platforms, AI and automation depth, integrations (qualified only) | Qualification table approved, capability tiers confirmed. |
| 4 | Industries, solutions, problems, business types, qualified intersections | Evidence of distinct intent per page. |
| 5 | Knowledge (articles, guides, comparisons, definitions) in controlled batches; case studies as real proof arrives | Per-batch editorial review. |
| 6 | Country and language expansion | Genuine localization and evidence per market. |

Details, exit criteria, and quantities are in `02-master-implementation-plan.md`.
