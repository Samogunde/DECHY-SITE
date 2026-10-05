# DECHY Master Implementation Plan

Status: DRAFT FOR REVIEW. Nothing described here has been built. Production implementation starts only after you approve this plan and the decisions register.
Companion documents: `01-strategic-audit.md` (findings), `03-decisions-register.md` (decisions DEC-01 to DEC-33).
Labels: CONFIRMED (in the specifications), VERIFIED (checked by me), RECOMMENDED, ASSUMPTION, DECISION REQUIRED (see register).

House style in this document follows AGENTS 1A.16: no em dashes, no en dashes, no emojis. Ranges are written with "to".

---

## 1. Executive summary

DECHY is to become a durable global platform that presents **DECHY: Technology, Software, AI & Digital Solutions** as a connected company whose differentiator is joining Software, AI, Automation, Integration, and Cloud. The specifications are strong on principles (anti-fabrication, qualification before creation, entity thinking, quality gates). They are weak on four things that decide whether the project succeeds:

1. **Proof.** DECHY has an approved scale claim (since 2010; over 1,500 clients) but no verifiable public footprint. The name also collides with a French commune. The plan therefore treats *trust and entity establishment* as a first-class workstream (Proof Pipeline, named people, entity home, real external profiles), not decoration.
2. **Scope realism.** The entity universe contains several hundred technologies and thousands of possible intersections. DECHY's real capability for most of them is not established. The plan separates the **entity universe** from **published capability** with a capability tier and publishes only what can be supported.
3. **Information architecture precision.** The example URLs contain duplicate intents and ambiguous parents. The plan introduces one rule (canonical home) that resolves nearly all of them.
4. **Operational readiness.** The domain is already registered and live, the repository is in a synced OneDrive folder, there is no vector logo, and the brand palette fails WCAG in several necessary combinations. These are fixable, but they must be handled before building, not after.

Recommended path: approve the plan, resolve the Phase 0 decisions, then build a technical foundation and **two representative pages** (Home and Software Development) to the full standard, review them in a real browser, and scale only after that review.

Planning targets (RECOMMENDED, ASSUMPTION; not commitments): about 25 pages at the end of Phase 2, about 60 to 80 after Phase 3, about 150 to 200 after Phase 5, each page individually qualified. The conceptual universe is far larger and deliberately will not be published.

---

## 2. Business positioning

**CONFIRMED**
- Name DECHY; domain dechy.com; descriptor exactly "Technology, Software, AI & Digital Solutions".
- Global company; operating since 2010; statement: "Since 2010, DECHY has helped over 1,500 organizations, companies, firms, brands, businesses, individuals, professionals, teams, and other clients across a wide range of industries and business types." The number must not be raised or altered.
- No physical offices, addresses, local teams, or Google Business Profiles may be implied.
- Differentiator: connecting Software + AI + Automation + Integration + Cloud, inside a broader 15-pillar service universe. AI and Automation must not be presented as outranking other services.

**RECOMMENDED positioning model**

- Category line (fixed): the descriptor.
- Organizing idea: *connected systems.* DECHY's value is that software, intelligence, automation, integration, and infrastructure are designed together instead of bought as disconnected projects.
- Proof posture: show method, architecture, and reference implementations until client proof is available; state capability, not outcomes.
- Tone: clear, technical, direct, evidence based (AGENTS 1A.15).

**Candidate positioning statements (DECISION REQUIRED, DEC-23).** These contain no unsupported claim:

1. "Software, AI, automation, integration, and cloud, designed to work as one system."
2. "We build and connect the software, data, and automation your organization runs on."
3. "One technology partner for building, connecting, automating, and securing digital systems."

**Strategic challenge (for DEC-24).** Fifteen equal pillars can read as "does everything, specializes in nothing." The specification forbids ranking AI or Automation above the rest, and I will respect that. The mitigation is *structure, not hierarchy*: five capability families, the connected-systems narrative as the organizing idea, and depth of content per service. If your actual revenue is concentrated in a few services, the homepage emphasis (not the page set) should reflect the truth.

## 3. Website purpose

Primary: convert qualified visitors into discovery conversations. Secondary: establish DECHY as a recognizable, corroborated entity for people, search engines, and AI systems; give technical buyers enough substance to evaluate competence.

Goals to be set with you (DEC-32): target markets, primary service lines, monthly qualified inquiries, and definition of a qualified lead. No numeric target in this plan is a commitment.

## 4. Information architecture

Top level (RECOMMENDED):

- **Services** (15 pillars grouped in five families, section 6).
- **Solutions** (problem-first pages, section 10).
- **Technologies** (browse hub; individual technology pages live under their canonical service, section 20).
- **Industries** (qualified only).
- **Resources** (knowledge: guides, comparisons, definitions, articles).
- **Work** (hidden until at least three real, permitted case studies or reference implementations exist).
- **Company** (about, people, how we work, facts).
- **Contact**.

Page-type families (AGENTS 49): Service, Technology/Platform, Industry, Location (gated), Solution/Problem (merged), Integration, Case Study, Knowledge. Plus system pages: Home, Company, Contact, legal, 404.

Principles:
- A concept has **one canonical URL** and one **canonical home** service. Other pages link, never duplicate.
- Entity does not equal page (section 15).
- Every indexable page appears in the sitemap and is reachable from at least two parents (validator-enforced; orphans fail the build).

## 5. Navigation

Desktop: logo, Services (mega-menu), Solutions, Technologies, Industries (only once published), Resources, Company, primary CTA "Talk to DECHY" (final wording a copy decision). Footer: all 15 services, legal, company facts, contact.

Mobile: single full-screen menu, accordions for families, persistent CTA, 44px touch targets.

Mega-menu groups (RECOMMENDED capability families; ASSUMPTION about grouping logic):

| Family | Services |
|---|---|
| Build | Software Development, Web Development, Mobile App Development, Ecommerce Solutions |
| Intelligence and Automation | AI & Machine Learning, Automation, Workflows & AI Solutions, Data & Analytics, API & Systems Integration |
| Infrastructure and Security | Cloud & DevOps, Cybersecurity |
| Design and Growth | UI/UX & Product Design, Branding & Creative, SEO, AEO & GEO, Digital Marketing |
| Advisory | Consulting & Digital Transformation |

The nine-stage client journey (AGENTS 39) is shown on the homepage as "How engagements work", not used as navigation. Breadcrumbs follow the IA (AGENTS 56).

## 6. Service architecture

The 15 pillars and URLs are CONFIRMED (AGENTS 2 and 29). Two slugs need confirming (DEC-08): `/ai/` (service named "AI & Machine Learning") and `/cloud/` (service named "Cloud & DevOps"). I recommend keeping both for brevity and using the full service names in titles and H1s.

**Pillar pages** are full-page treatments (Content Master 7). They are *not* one template. Each has a **content brief** declaring emphasis and section order; the section registry (section 27) supplies blocks. Indicative emphasis:

| Service | Emphasis and distinctive blocks |
|---|---|
| Software Development | Delivery model, architecture decision guide, build-vs-buy, system types matrix, modernization path |
| Web Development | Platform decision guide (custom vs CMS vs headless), performance and accessibility standards, migration |
| Mobile App Development | Native vs cross-platform decision guide, release and maintenance lifecycle |
| AI & Machine Learning | Capability map (assistants, RAG, agents, vision, speech), evaluation and governance, build/buy/integrate |
| Automation, Workflows & AI Solutions | Workflow anatomy (trigger, rules, data, human steps, monitoring), platform comparison, "not every automation needs AI" |
| Cloud & DevOps | Reference architectures, CI/CD pipeline diagram, reliability and cost |
| Cybersecurity | Threat-model-first approach, secure SDLC, assessment deliverables |
| Data & Analytics | Pipeline diagram, warehouse/BI choices, data quality and governance |
| API & Systems Integration | Integration patterns, data-flow diagrams, error handling and monitoring |
| Ecommerce Solutions | Platform fit by business type, integration map, migration |
| UI/UX & Product Design | Research-to-handoff process, design system artifacts |
| Branding & Creative | Strategy-to-system process, deliverables set |
| SEO, AEO & GEO | Three-layer model (rank, answer, be understood), measurement, honest limits (no guaranteed citations) |
| Digital Marketing | Channel map tied to measurement; links to automation and CRM |
| Consulting & Digital Transformation | Assessment methods, roadmap deliverable, engagement shapes |

**Sub-capability pages** (for example `/ai/ai-agents/`, `/ai/rag-development/`, `/automation/workflow-automation/`) exist only when they pass qualification (section 14, 19). Otherwise they are sections of the pillar.

**Canonical home registry** (`data/taxonomy/canonical-homes.yaml`): resolves the duplicate-ownership list in audit D-10. Examples (RECOMMENDED): Web Design → UI/UX & Product Design (Web Development links to it); Marketplace Development → Software Development (Ecommerce links); Business Dashboards → Data & Analytics; Solution Architecture → Consulting; Cybersecurity Consulting → Cybersecurity; Payment Integration → API & Systems Integration; Marketing Automation → Automation; AI Chatbots and Copilots → AI & Machine Learning; Firebase and Supabase → Cloud & DevOps; Kotlin and Swift → Mobile App Development.

## 7. Technology architecture (entities)

The technology list in AGENTS 4 to 19 is the **entity universe**. Rules:

1. Every technology is a data entity with `primaryService` (its canonical home), `kind` (language, framework, platform, cloud service, database, AI provider, tool, standard), and `capability` tier: `core`, `working`, `familiar`, `unverified` (DEC-06).
2. Only `core` and `working` entities may appear in "DECHY works with X" statements, technology matrices, and schema `knowsAbout`.
3. A technology receives an indexable page only when it passes the Page Qualification Engine, and its URL is `/{primaryService}/{slug}/`.
4. `unverified` technologies are used only in neutral reference content (comparisons, migrations) with no capability claim.
5. No third-party logos in technology sections without rights; names only (trademark and implied partnership risk).

Initial candidate shortlist for Phase 3 qualification (ASSUMPTION; depends on DEC-06): Next.js, React, TypeScript, Python, WordPress, Shopify, Airtable, Zapier, Make, n8n, OpenAI, Claude, Gemini, AWS, Flutter, React Native, PostgreSQL, Salesforce, HubSpot, Stripe. This shortlist reflects likely commercial intent, not confirmed DECHY capability.

## 8. Industry architecture

- Industries are entities. Indexable industry pages are created only when DECHY can state industry-specific substance (regulation, data sensitivity, typical systems, integration patterns) and has at least one legitimate proof element or reference implementation relevant to that industry. Otherwise the industry appears as a relationship chip on service pages.
- Candidate first wave (RECOMMENDED, ASSUMPTION): Healthcare, Financial services, Real estate, Logistics, Retail and ecommerce, Education, Professional services, Manufacturing. Maximum eight in Phase 4.
- Industry pages are **not** templates with a swapped noun. Each needs a distinct brief (for example healthcare: privacy, interoperability, auditability; logistics: tracking, integrations, exception handling).
- Service x Industry intersection pages (for example `/software-development/healthcare/`) follow the example in AGENTS 29 but require stronger evidence than the industry page itself.

## 9. Solution architecture

Solutions are the bridge between buyer language and DECHY services. A **Solution page begins with the business problem** (AGENTS 71) and connects problem, solution, technologies, services, workflow, outcome (qualitative only unless verified), implementation. The 22 solutions in AGENTS 23 are the candidate list; first wave (RECOMMENDED): Business Process Automation, Workflow Automation, Legacy System Modernization, Cloud Migration, API Integration, CRM Integration, Customer Portal Development, Internal Business Software, AI Customer Support, AI Agents, AI Knowledge Systems, Business Dashboards. Order and exact set to be finalized in Phase 3.

## 10. Problem architecture

The 30 problem statements in AGENTS 22 are search intents and entities. **Recommendation (MERGE / CONSOLIDATE):** do not create a separate `/problems/` page family. A problem is the opening of its solution page and a data entity with synonyms ("too many spreadsheets", "manual data entry") used in headings, FAQs, and internal-link anchors. This avoids duplicate intent between a problem page and its solution page.

## 11. Integration architecture

Integrations (Stripe, Salesforce API, HubSpot API, Shopify API, Microsoft Graph, and so on) are technology entities with `primaryService = api-integration` (or ecommerce for commerce-specific ones, per the canonical home registry). Pages follow AGENTS 76: systems connected, data flow, authentication, webhooks, synchronization, error handling, security, monitoring. A data-flow diagram is mandatory. Do not claim a specific integration has been delivered unless evidence exists; "supports" language requires `core` or `working` capability.

## 12. Business-type architecture

Fifteen business types (AGENTS 21). **Recommendation:** one "Who we work with" section on the Company page plus relationship data feeding service pages; **no** per-business-type landing pages in the first three phases (high duplicate-intent risk). Reconsider individual pages (for example Startups, Agencies, SaaS companies) only if Search Console shows distinct demand.

## 13. Location architecture

CONFIRMED: Global > Country > Region > City concept, strict location rule, no fake presence.

RECOMMENDED:
- Model locations as data. Distinguish `presence: none` (default, always currently true) from `serves: true/false`.
- **City pages: DO NOT CREATE** by default.
- **Country pages: CREATE LATER**, only when all of the following hold: documented clients or delivery in that country; country-specific substance (regulation such as GDPR or national identity rules, local payment methods, languages, data residency, procurement norms); content that cannot be produced by swapping the country name; and human review. A page must say DECHY serves clients in the country remotely and must never imply an office.
- Mandatory site-identification and privacy requirements of target countries (for example Germany) are handled in legal pages before any country content.
- No `LocalBusiness` schema, no maps, no local phone numbers, no Google Business Profile.

## 14. Content architecture

Four classes (CONFIRMED, AGENTS 31): Commercial, Informational, Proof, Authority.

**Launch articles (DECISION REQUIRED, DEC-04).** The Content Master refers to 53 approved articles "defined in AGENTS.md"; no list exists. Options: (a) you supply the list; (b) I derive a proposed slate from the entity graph, each article tied to a service, a real question, and an interlink plan, for your approval. I recommend (b) with at most 8 to 10 articles per publication batch, and no batch published until the previous batch has been human-reviewed. I will not label an invented list "the 53".

**Content depth model** (micro/short/medium/long/full) is stored as fields on one entity record with a validator that checks the five lengths do not contradict each other.

**Authoring workflow** (AGENTS 59 refined): define entity and intent, define relationships, select approved claims from the facts register, write the brief, draft, technical review, editorial review (house-style linter), schema and metadata, link candidates, QA, human approval, publish. Every page records `reviewer`, `lastReviewed`, and `claims[]` (fact IDs).

**Proof Pipeline** (RECOMMENDED, DEC-21): until real client case studies are cleared for publication, DECHY publishes a few **reference implementations**, each labeled "DECHY reference implementation", with a public repository or documented architecture, diagrams, trade-offs, and limits. These are legitimate, original, technical proof of capability. They are not presented as client work. Initial candidates: lead-qualification workflow (Airtable + n8n + an LLM with human review); retrieval-augmented document Q&A with evaluation notes; API integration with robust retry and monitoring. Each directly supports AGENTS 38 and 92 without claiming those systems were delivered.

## 15. Entity architecture

Entity types and default page policy:

| Entity | Default policy | Becomes a page when |
|---|---|---|
| Company | Page (Home, Company) | always |
| Service pillar | Page | always (15) |
| Service sub-capability | Section | distinct search intent and enough unique substance |
| Technology / platform / provider | Data | service x technology intent exists AND capability is `core` or `working` |
| Language | Data | commercial intent as "X development", capability confirmed |
| Architecture concept | Data / glossary | high-intent definition or guide |
| Industry | Data + relationship chip | industry-specific substance and evidence |
| Business type | Data | distinct demand shown by data (not before Phase 5) |
| Problem | Data (opens a solution page) | merged into solution page |
| Solution | Page | passes qualification |
| Integration | Data | system pair has intent and data-flow content |
| Use case | Section of services/solutions | rarely a page |
| Location | Data | country gate in section 13 |
| Comparison, migration | Page | real buyer decision and balanced content |
| Article / guide / definition | Page | real question, answer-first, original value |
| Case study / reference implementation | Page | real work, permission, evidence |
| Person (author, reviewer, lead) | Profile page | real person with consent |
| External reference | Data | cited in content and `sameAs` where it is DECHY's own profile |

**Schema of the graph.** Entities have stable IDs (`svc.software-development`, `tech.python`, `ind.healthcare`). Edges are typed and live in `data/relations/*.yaml` (not buried in prose). A build-time validator checks that edge endpoints exist, inverse edges are generated, there are no orphans, and no canonical home conflicts exist.

**Entity disambiguation (RECOMMENDED).** Always pair the brand with its descriptor in titles and Organization description ("DECHY: Technology, Software, AI & Digital Solutions"). Use a stable Organization `@id` (`https://dechy.com/#organization`), real `sameAs` profiles only (those that exist; DEC-05), and avoid the bare word "Dechy" in isolation in contexts where the town could be meant.

## 16. SEO architecture

- One primary intent per page, recorded in the page record, with secondary intents. Duplicate-intent detection compares intents and titles.
- Metadata generated from the content model: title (descriptor suffix on Home and Company only; service pages use "{Service} Services | DECHY"), meta description, canonical, robots, Open Graph, Twitter card.
- `trailingSlash: true`; canonical includes the trailing slash; HTTP to HTTPS and `www` to apex (or the reverse; DEC-02) via a single redirect rule.
- Sitemaps: generated from approved indexable records only; sitemap index split by entity type; accurate `lastmod` (true modification dates only); `hreflang` annotations when locales exist. `changefreq` and `priority` omitted (ignored).
- robots.txt generated; staging and preview deployments `noindex` and password-protected where possible.
- Internal linking engine generated from typed edges (section 21).
- Core Web Vitals budgets (section 29).
- Evidence of demand: Phase 0 includes a live SERP and competitor review of each pillar and shortlisted entity to convert assumptions into evidence. No keyword-volume tool is connected; I will use SERP inspection and, after launch, Google Search Console and Bing Webmaster Tools.

## 17. AEO architecture

- Answer-first pattern: each page opens with a one to two sentence definition or direct answer (a `DefinitionLead` block), then depth.
- Question headings only where a real question exists; each question has a direct answer paragraph before elaboration.
- Comparison tables in semantic `<table>` markup; definition lists in `<dl>`; ordered steps in `<ol>`.
- Stable heading anchors so passages can be cited.
- `FAQPage` markup is allowed where the questions are real, with the understanding that no SERP rich result is expected for commercial sites since 2023. It is retained for semantic clarity only.
- Freshness: visible "last reviewed" date and reviewer.

## 18. GEO architecture

Goal: make DECHY a coherent, corroborated entity. Honest limits: no outcome (citation, recommendation, ranking) is promised or claimed.

1. **Entity home:** the Company page, declaring who DECHY is, with facts from the register only.
2. **Organization schema** with stable `@id`, `name`, `url`, `logo`, `description` (exact descriptor), `foundingDate` (only if you confirm 2010 as the founding or start date; DEC-05), `areaServed` "Worldwide", `knowsAbout` (core and working capabilities only), `contactPoint`, `sameAs` (existing profiles only). Excluded: `numberOfEmployees`, `aggregateRating`, `address`, `award`, anything unverified.
3. **External corroboration:** create or claim real profiles (LinkedIn company page, GitHub organization, others you confirm), consistent naming and descriptor, link both directions. Directories such as Clutch and GoodFirms rely on real client reviews, so they come after real clients consent. Wikidata/Wikipedia are not targets (notability requirements cannot be met honestly without third-party coverage).
4. **Original material:** reference implementations, architecture diagrams, evaluation notes, and method documents are the types of first-hand content that others cite.
5. **Digital PR (later):** publish original technical research or data only when DECHY actually has it.
6. **Crawl policy:** robots.txt allows major search and AI retrieval user agents; policy for AI training crawlers is a business decision (DEC-19). `llms.txt` optional and low priority; not relied upon.
7. **Consistency:** the facts register is the only source for company statements; descriptions are generated from it.

## 19. International architecture

- English only at launch. Architecture must be locale-ready from day one (DEC-16): content records keyed by locale, a single URL builder, locale-aware metadata and sitemap, `lang` attribute, logical CSS properties (start and end instead of left and right) for future RTL.
- URL strategy: default locale unprefixed (matches CONFIRMED URLs); other locales in subdirectories (`/de/...`). Language is not country: country targeting uses separate location pages when justified.
- hreflang with reciprocal links and self reference, `x-default`, mirrored in sitemaps.
- No machine-translated pages published without human editorial review and genuine localization (CONFIRMED).
- Fonts: define fallbacks (for example Noto families) for Arabic, CJK, and test before any such locale ships.
- Legal pages and consent per jurisdiction are part of each market launch.

## 20. URL architecture

Rules (RECOMMENDED, extending AGENTS 29):

1. Lowercase, hyphenated, no dates, no IDs, trailing slash, stable forever. Changes require a redirect entry.
2. Pillars at the root as CONFIRMED.
3. **Canonical home rule:** a technology, platform, integration, or sub-capability lives under its `primaryService`: `/software-development/python/`, `/web-development/nextjs/`, `/mobile-app-development/flutter/`, `/automation/n8n/`, `/cloud/aws/`, `/api-integration/stripe/`, `/ai/rag-development/`.
4. Industry hubs at `/industries/{slug}/`; service x industry intersections at `/{service}/{industry}/` (matches the CONFIRMED example `/software-development/healthcare/`).
5. Solutions at `/solutions/{slug}/`. No separate problem URLs.
6. Browse hubs `/services/`, `/technologies/`, `/industries/`, `/solutions/`, `/resources/` are real pages (matrices and guided choosers), not thin lists.
7. Knowledge: `/resources/{type}/{slug}/` where type is `guides`, `comparisons`, `definitions`, `articles`.
8. Work: `/work/{slug}/`.
9. Locations (reserved, gated): `/locations/{country}/` and `/{service}/{country}/`.
10. People: `/company/team/{slug}/` when real profiles exist.
11. A **slug registry** enforces uniqueness inside each parent and flags collisions across entity types (for example a technology named like an industry).
12. Resolved duplicate: `/automation/airtable/` is the single Airtable page; `/automation/airtable-automation/` is `MERGE / CONSOLIDATE`.
13. Parameterized or filter URLs (search, filters) are `noindex, follow` and never in the sitemap; the clean list pages are the indexable ones.
14. Every renamed or removed URL gets a 301 in `data/redirects.yaml`, tested in CI.

## 21. Internal-linking architecture

- Links come from typed edges: parent, children, siblings, `relatedService`, `usesTechnology`, `appliesToIndustry`, `solves`, `integratesWith`, `alternativeTo`, `furtherReading`, `evidence`.
- Each page template declares its required link slots (for example a service page: 3 to 6 technologies, 3 to 6 solutions, 2 to 4 related services, 2 to 4 resources, 1 proof or reference item when it exists).
- Anchor text variants stored on the target entity (synonyms), rotated to read naturally; no exact-match repetition.
- Validators: no orphans, no broken links, minimum inbound links (2), maximum outbound links per section to avoid link walls, no redirect links in navigation, no links to `noindex` pages from the sitemap.
- Breadcrumbs mirror canonical home.

## 22. Schema architecture

| Page | JSON-LD |
|---|---|
| Site-wide | `Organization` (stable `@id`), `WebSite` (with `SearchAction` only if site search exists) |
| Home | `WebPage` + Organization reference |
| Service pillar and sub-capability | `Service` (`provider` references Organization, `areaServed`, `serviceType`), `WebPage`, `BreadcrumbList` |
| Technology / intersection page | `Service` + `WebPage` + `BreadcrumbList` |
| Solution page | `WebPage` + `Service` where it describes a service |
| Article / guide | `Article` or `TechArticle`, `author` Person (real), `datePublished`, `dateModified` |
| Comparison / definition | `Article`; `DefinedTerm` for definitions (optional) |
| Case study / reference implementation | `Article` (and `SoftwareSourceCode` or `SoftwareApplication` for a real repo or product) |
| FAQ sections | `FAQPage` only for real questions |
| People | `ProfilePage` + `Person` |
| Contact | `ContactPage` |

Excluded unless evidenced: `LocalBusiness`, `Review`, `AggregateRating`, `Offer` with prices, employee counts, awards. Schema types come from `schema-dts`; JSON-LD is generated from the content model, never hand-typed per page, and validated in CI. `Service` and `Organization` do not produce rich results; their purpose is entity clarity.

## 23. Design system

Tokens (CONFIRMED values from AGENTS 1A.5, 1A.7):

| Token | Value |
|---|---|
| `--color-ink` (Deep Charcoal) | #111827 |
| `--color-blue` (DECHY Blue) | #2F6FED |
| `--color-paper` (Warm Off White) | #F7F6F2 |
| `--color-line` (Light Gray) | #E5E7EB |
| `--color-slate` | #6B7280 |
| Functional | success #16A34A, warning #F59E0B, error #DC2626, info #3B82F6 |
| Headings | Manrope (300 to 800; use sparingly) |
| Body | Source Sans 3 |
| Mono | system or a restrained monospace, code only |

**Derived accessible tokens (DECISION REQUIRED, DEC-12).** The CONFIRMED palette fails WCAG in necessary combinations (audit K-2). I propose derivations, each computed and verified:

| Derived token | Value | Verified ratio |
|---|---|---|
| `--color-link` (link and small blue text on Off White or white) | #2A62D8 | 5.06 on #F7F6F2, 5.47 on white |
| `--color-blue-hover` (button hover and pressed) | #2A62D8 | white on it 5.47 |
| `--color-blue-on-dark` (links and accents on Charcoal) | #7AA5F8 | 7.24 on #111827 |
| `--color-slate-text` (secondary text on Off White and Light Gray) | #5B6472 | 5.53 on Off White, 4.83 on Light Gray |
| `--color-slate-on-dark` | #9CA3AF | 6.99 on #111827 |
| `--color-success-text` | #15803D | 5.02 on white |
| `--color-warning-text` | #92400E | 7.09 on white |
| `--color-info-text` | #1D4ED8 | 6.70 on white |
| `--color-input-border` | to be computed at build to reach 3:1 on Off White and white | not yet verified |
| Focus ring | #2F6FED 2px with 2px offset on light; white on Charcoal | 4.21 and 17.74 |

The brand blue and slate remain the brand; the derivations are used for text and states only. The CONFIRMED brand values are untouched.

**Typography (RECOMMENDED, DEC-13).** Long-form body 18px desktop (17px minimum on mobile), line-height 1.65, measure 65 to 75 characters, Source Sans 3. Lead paragraph 21 to 22px. Headings in Manrope with a fluid scale (`clamp`): H1 about 40 to 60px, H2 about 30 to 40px, H3 about 22 to 26px, no oversize startup headlines (AGENTS 1A.8). Table and UI text 15 to 16px minimum. Variable fonts through `next/font`, self-hosted, preloaded, `font-display: swap` with size-adjusted fallbacks to prevent layout shift.

**Shape and surface.** Radius scale 0, 2, 4, 6, 8 (no pills; buttons 6). Hairline 1px borders instead of shadows; shadows only for floating layers (menus, dialogs). No gradients, no glassmorphism, no glow (CONFIRMED). Section rhythm alternates Paper, white, and Ink surfaces; Ink sections need the reverse logo (DEC-03).

**Layout pattern catalogue** (to avoid repetitive card grids):
1. Split hero with a system diagram.
2. Editorial two-column (sticky label left, content right).
3. Index list: hairline-separated rows with title, one line, arrow (replaces card walls for the 15 services).
4. Numbered process rail.
5. Full-bleed Ink band with architecture or data-flow diagram.
6. Capability matrix table.
7. Comparison table.
8. Sticky-sidebar long-form (articles and guides).
9. Definition plus figure.
10. Related-content rail, text-forward.

Cards are allowed only where items are genuinely parallel and short.

**Iconography.** One line-icon family (candidate: Lucide, MIT licensed; decision at build), used sparingly. No emoji.

**Motion.** Subtle, state-driven, honors `prefers-reduced-motion`; no parallax, particles, or looping decoration.

## 24. UX system

- Primary conversion path: any page → "Talk to DECHY" → short contact form (name, email, organization optional, what you want to build or fix, timeline optional). Collect the minimum (AGENTS 89).
- Secondary paths: service-specific inquiry prefill (query param carrying only the service slug, no personal data), email link.
- Progressive disclosure for dense pages: table of contents (sticky on desktop), collapsible technical detail, tabbed technology matrix.
- On-page search/filter for Technologies and Resources hubs (client-side over a build-time index).
- Error states, empty states, 404 with search and top links.
- Content that must exist or be absent: sections whose data is missing (for example proof) do not render at all, rather than showing an apology (CONFIRMED rule against "coming soon").

## 25. Image and media system

Priority (adjusts AGENTS 1A.11 for reality, DECISION REQUIRED DEC-20):

1. **Purpose-built visuals as the primary layer:** original SVG/HTML diagrams (system maps, architecture, data flow, workflow, process), data visualizations from real data, typographic and structural graphics in the brand palette. Rendered as live SVG or components so text is real, accessible, translatable, and crisp. These are original work for DECHY and carry no licensing risk.
2. **Real DECHY material when available:** actual team photography (real people with consent), screenshots of real reference implementations, public repositories.
3. **Licensed editorial photography** from reputable libraries with clear commercial licenses (candidates: Unsplash, Pexels; others per case), used sparingly for atmosphere, never to imply DECHY people, places, or clients. License terms captured at acquisition.
4. **AI-generated imagery** only for non-photographic conceptual use, art directed, never as people or evidence, with the AGENTS 1A.11 inspection checklist. Disclosure obligations for synthetic media (including emerging EU rules) to be reviewed before use.

Process: image brief → source → license evidence saved in `data/assets/licenses/` → registry entry → optimized derivatives → alt text and caption → review. Registry fields per AGENTS 1A.11 (id, filename, source, URL, creator, license, date, page usage, role, dimensions, format, alt, caption, focal point, approval, expiry).

Roles and ratios: hero 16:9 and 3:2 crops; service 3:2; article cover 16:9; Open Graph 1200x630 generated at build from templates; icons SVG. Responsive `srcset`, AVIF/WebP, explicit `width` and `height`, `fetchpriority="high"` only for the one LCP image, lazy elsewhere.

Download rule: any image acquisition is batch-approved by you (source, filename, size, license stated) before download. Masters stay outside Git or in LFS; only optimized derivatives are committed (DEC-14).

## 26. Content and data architecture

Structure (RECOMMENDED, replaces AGENTS 78 layout only where noted, DEC-11):

```text
/                       Next.js app at repository root
  AGENTS.md  CLAUDE.md  README.md
  docs/                 planning, architecture, brand, seo, decisions (ADRs)
  data/
    facts/              company.yaml (approved facts + IDs), proof.yaml
    taxonomy/           services, technologies, industries, business-types, locations, canonical-homes
    relations/          typed edges
    assets/             images.yaml, licenses/
    redirects.yaml
  content/
    pages/{locale}/     MDX/YAML page records (home, services, solutions, ...)
    resources/{locale}/ articles, guides, comparisons, definitions
    work/{locale}/
  src/
    app/                routes (App Router)
    components/         primitives, patterns, sections, templates
    lib/                content loader, graph, seo, schema, links
    styles/             tokens
  tests/  scripts/      validators, build checks
  public/               optimized assets
```

**Content store:** typed files in Git (YAML for structured data, MDX for long-form), validated with Zod schemas, loaded by a thin custom loader. No CMS at launch (DEC-14): one owner, AI-assisted drafting, and Git review make a CMS unnecessary overhead. The model is portable to a headless CMS later (Sanity, Contentful, or a Git-based one) if non-technical editors join.

**Core record fields** (a superset of AGENTS 28, 32, 34): `id`, `type`, `slug`, `canonicalHome`, `parents[]`, `name`, `synonyms[]`, `descriptions{micro,short,medium,long}`, `intent{primary,secondary[]}`, `status` (the five exact statuses), `indexing`, `capability`, `claims[]` (fact IDs), `evidence[]`, `sections[]` (ordered, typed blocks), `faqs[]`, `relations` (via edge files), `seo`, `schema`, `i18n{locale,translationOf}`, `reviewer`, `lastReviewed`, `datePublished`, `dateModified`.

**Fact register discipline:** copy references facts through a macro (for example `{{fact:company.founded}}`). The validator fails any occurrence of the company statistic or historical claims not produced by a fact, and any change to a fact requires an ADR note.

## 27. Component architecture

Layers: tokens → primitives (Button, Link, Heading, Text, Icon, Figure, Table) → patterns (Header, MegaMenu, Footer, Breadcrumbs, CTA, FormField) → **section blocks** → page templates.

Section block catalogue (pages choose and order; no template uses all): `Hero`, `DefinitionLead`, `ProblemList`, `Capabilities`, `Deliverables`, `UseCases`, `TechnologyMatrix`, `IntegrationMap`, `IndustryStrip`, `ProcessRail`, `ArchitectureFigure`, `ComparisonTable`, `DecisionGuide`, `QualityAndSecurity`, `ProofBlock`, `ReferenceImplementation`, `RelatedRail`, `FAQ`, `CTA`, `ArticleBody`, `TableOfContents`.

Rules: Server Components by default; Client Components only for interaction (menu, filters, form). Each block has typed props, a Storybook-free visual test route (`/__kit` noindex, behind a flag), and an accessibility test. Blocks whose required data is missing return `null` by design (`requires` metadata).

## 28. Technical architecture

- **Framework:** Next.js (latest stable at scaffold time, patched for current security advisories), React, TypeScript strict, App Router, Tailwind CSS (v4 style, tokens in CSS variables), npm, Node 22 LTS. **CONFIRMED direction; versions to be verified at scaffold.**
- **Rendering:** static generation for all content routes (`generateStaticParams`, `dynamicParams = false`), minimal server runtime. Server endpoints only for the contact form and health check.
- **Validation:** Zod for content and form input.
- **Schema:** `schema-dts` types, generated JSON-LD component.
- **Testing:** Vitest (unit and validators), Playwright (routes, responsive, keyboard), `@axe-core/playwright` (accessibility), Lighthouse CI (performance budgets), link checker, custom content-graph validator.
- **CI:** GitHub Actions runs install, typecheck, lint, tests, content validation, build, link check, a11y, Lighthouse on key routes. Netlify builds previews for branches and pull requests.
- **Dependencies:** a deliberate short list; Dependabot and `npm audit` in CI; lockfile committed; no unused packages.
- **Not adopted unless justified:** a database, a CMS, a state library, a UI kit, animation libraries, an AI SDK on the public site. Anything added needs an ADR.
- **Architecture amendments requiring approval:** app at repository root (DEC-11), canonical-home URLs (DEC-08), `trailingSlash: true` (DEC-08).

## 29. Performance strategy

Budgets (RECOMMENDED; measured on the Netlify production build): LCP under 2.5s, INP under 200ms, CLS under 0.1 at p75 field data; Lighthouse mobile lab performance 90 or higher on templates, 95 or higher as target. Initial JS per route about 100 KB gzipped or less (target), no render-blocking third-party scripts, analytics loaded after interaction/idle. Two variable font families subset to Latin (plus Latin Extended), preloaded. One prioritized image per page. SVG diagrams inline or optimized. CDN caching with immutable hashed assets; HTML revalidated. No layout shift from images, fonts, or consent banner.

## 30. Accessibility strategy

Target: WCAG 2.2 AA. Semantic landmarks; one H1; logical headings; visible focus (2px ring, 3:1); skip link; keyboard-operable mega-menu with correct ARIA or plain disclosure pattern; touch targets at least 44px; reduced motion; 4.5:1 text contrast (using derived tokens); form labels, error association, and live announcements; table headers; accessible SVG diagrams (title, desc, text alternative); no information by color alone. Automated axe checks on every template plus manual keyboard and screen reader passes on the two representative pages. An accessibility statement is published with contact route.

## 31. Security strategy

- Headers via Netlify (`netlify.toml` or `_headers`): HSTS (with preload only after verifying all subdomains), `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` (deny by default), `frame-ancestors 'none'`, a CSP built on hashes/allowlists suited to static output, COOP/CORP as compatible.
- No secrets in the repo; secrets scanning on; environment variables only in Netlify; server-only variables never exposed to the client.
- Contact form: server-side validation, honeypot plus a privacy-friendly bot challenge, rate limit, no storing beyond the stated retention, no logging of message bodies in third-party tools by default, outbound email through a transactional provider.
- Supply chain: pinned patched versions of Next.js and React, Dependabot, `npm audit` gate, review of any postinstall scripts.
- `security.txt` (RFC 9116) with a real monitored contact.
- Preview deployments protected from indexing.
- Threat model note for the form and any future API.

## 32. Analytics strategy

- Search: Google Search Console and Bing Webmaster Tools (domain verification via DNS).
- Product analytics: privacy-first, cookieless first-party style analytics at launch (for example Plausible, Umami, or Netlify analytics) so that no consent banner is needed for analytics (DEC-17). Optional consent-gated GA4 later if marketing requires.
- Events: contact form submission, CTA clicks by location, outbound clicks to profiles, scroll depth on long pages (aggregate only).
- AI referral reporting: segment referrals from AI assistants where referrers are visible; supplement with manual prompt sampling. Do not report this as proof of recommendation.
- Dashboard of content KPIs: indexed pages, impressions, queries per cluster, conversion by landing page.
- Collect no more personal data than necessary; privacy policy states exactly what runs.

## 33. Testing strategy

| Layer | Tooling | Gate |
|---|---|---|
| Type safety | `tsc --noEmit` strict | blocks merge |
| Lint and format | ESLint, Prettier | blocks merge |
| Unit | Vitest (loaders, URL builder, link engine, schema builders) | blocks merge |
| Content validation | custom graph validator implementing AGENTS 62 and 63: titles, descriptions, H1, canonical, duplicates, orphans, sitemap/index mismatch, claims without facts, unsupported location claims, forbidden punctuation, banned phrases, empty sections | blocks merge |
| Schema | JSON-LD generation tests and structural validation | blocks merge |
| Build | `next build` | blocks merge |
| E2E and responsive | Playwright at 375, 768, 1280, 1536 widths | blocks merge |
| Accessibility | axe in Playwright + manual checklist | blocks merge |
| Performance | Lighthouse CI budgets | warns, blocks on regression |
| Links | internal link crawl of the built site | blocks merge |
| Security | `npm audit`, headers check against production | blocks release |
| Production smoke | scripted checks after deploy | gates milestone |

Visual review is not automated: each milestone requires screenshots and a real-browser inspection (desktop, tablet, mobile) by me, then your review.

## 34. Git and GitHub workflow

- Remote `origin` = `https://github.com/Samogunde/DECHY-SITE.git` (VERIFIED, empty).
- `main` is production-ready and deploys to Netlify. Work happens on short-lived branches (`feat/...`, `content/...`, `fix/...`); each merges to `main` after CI passes. Netlify deploy previews per branch.
- Conventional commit messages (`feat:`, `fix:`, `content:`, `docs:`, `chore:`), small coherent commits, no known-broken commits to `main`.
- Branch protection on `main` (CI required, no force-push) once CI exists.
- `.gitignore` for `node_modules`, `.next`, env files, OS files; `.env.example` only.
- Releases: milestone tags (`v0.1-foundation`, `v0.2-representative-pages`).
- The first commit contains the specification documents and this planning set. I will not push production code before approval. Commit identity and pushing the planning docs are in DEC-27 and DEC-28.
- Working copy moves out of OneDrive (DEC-01); Git history stays intact because it is moved before any commit is relied upon.

## 35. Netlify deployment strategy

- Netlify site connected to the GitHub repo; `main` → production; PRs and branches → deploy previews; preview URLs `noindex`.
- Build: `npm ci && npm run build`; Node 22 pinned through `.nvmrc`/`netlify.toml`.
- Domain: dechy.com is registered (VERIFIED) with DNS at NAMEFIND. Before cutover: confirm control of the registrar and DNS (DEC-02), inventory all DNS records (including MX/SPF/DKIM for email), record what the current site serves and its inbound URLs, build a redirect map, lower TTL, switch DNS, verify HTTPS, then run the production smoke test. Do not point DNS until the production candidate passes all gates and you approve.
- External blockers I cannot resolve on my own: Netlify authorization/login and plan, DNS/registrar access, and any account creation. These require you.
- Rollback: Netlify atomic deploys allow instant rollback; DNS change documented with the previous records.

## 36. Future expansion strategy and canonical phase sequence

This sequence reconciles AGENTS 60 and 95, the Handoff, the Content Master, and your instruction (audit D-4).

| Phase | Scope | Gate to exit |
|---|---|---|
| 0 | Approve plan and decisions; facts register; domain/Git/OneDrive resolution; SERP/competitor review; logo path; extended brand tokens spec; launch article derivation | You approve in writing |
| 1 | Foundation (scaffold, tokens, content loader, graph, validators, CI, Netlify preview) + **Home** + **Software Development**, plus working Contact page, header/footer, 404, and the minimum legal pages | Browser review desktop/tablet/mobile, all automated checks pass, your approval |
| 2 | Remaining 14 service pillars, Company, People (if real), Knowledge index, full legal set, production launch candidate and smoke test | Each service page reviewed for non-template structure; production deploy only when you approve |
| 3 | Technologies, platforms, AI and automation depth, integrations; Proof Pipeline items 1 to 3 | Qualification table (each page: intent, uniqueness, capability, evidence) approved |
| 4 | Industries, solutions, qualified intersections | Distinct-intent evidence per page |
| 5 | Knowledge batches (8 to 10 per batch), comparisons, definitions, case studies as real proof arrives | Per-batch editorial review |
| 6 | Country and language expansion (qualified only) | Genuine localization and evidence per market |

Guardrails for expansion: page count is never a KPI; consolidation and pruning are scheduled (quarterly) from Search Console data; new entity types need an ADR; applications, portals, dashboards, or AI tools later live on separate subdomains or routes behind authentication and `noindex`, and share the design tokens as a package.

## 37. Risks

See audit sections H to K. Top ten, ranked:

1. Entity weakness: no public footprint, name collision (I-1).
2. Unsubstantiated capability and scale claims (C-3, I-2).
3. Thin or scaled-content exposure (I-3).
4. Domain ownership/continuity and existing live site (H-10).
5. Logo deliverables incomplete (B3) blocking dark sections, favicon, and Open Graph.
6. Dependency/security exposure of the stack (H-2).
7. Accessibility defects from the CONFIRMED palette (K-2).
8. Repository in OneDrive (H-1).
9. i18n retrofit cost (H-6).
10. Template sameness across 15 services (J-1).

## 38. Missing requirements

Approved facts register inputs; legal entity details; people and bios; contact channels; engagement and pricing posture; capability tiers; real external profiles; proof; launch article list; vector logo set and brand guide; measurable goals and target markets; lead handling process and ownership; review authority; Netlify account and plan; domain/DNS access; policy on AI crawlers; analytics choice; legal texts reviewed by a qualified person; image licensing preferences.

## 39. Recommended improvements (summary)

1. Canonical-home rule and merged problem/solution pages (sections 6, 10, 20).
2. Capability tiers; neutral entities (section 7).
3. Proof Pipeline and named people (sections 14, 18).
4. Country pages gated; no city pages (section 13).
5. Five-family navigation; hide Work until evidence (section 5).
6. Derived accessible tokens; larger body type (section 23).
7. Diagram-first visual system (section 25).
8. Typed, Git-based content with graph validation, facts macro, and content linter (sections 26, 33).
9. Static-first Next.js on Netlify with hardened headers (sections 28, 31).
10. Locale-ready from day one, English-only publication (section 19).
11. Move out of OneDrive; CLAUDE.md importing AGENTS.md; ADR log.
12. Privacy-first analytics (section 32).

## 40. Decisions requiring human approval

The full register with options and my recommendation is in `03-decisions-register.md`. Required before Phase 1 starts: DEC-01 to DEC-14, DEC-23, DEC-27, DEC-28. Required before Phase 2 ships: DEC-05, DEC-17 to DEC-22, DEC-26, DEC-29. Phase 6 only: DEC-16 detail and market selection.

---

## Appendix A. Phase 1 definition of done (representative pages)

Home and Software Development, each:
- Full content per the Content Master blueprints, every claim traced to the facts register or written as method/capability language only.
- Layout built from at least five distinct patterns; no section is a repeated card grid; at least two original diagrams per page.
- Real browser inspection at 375, 768, 1280, 1536 with screenshots; no horizontal scroll; readable body type.
- Metadata, canonical, Open Graph, JSON-LD, sitemap entry, robots, breadcrumbs, internal links verified.
- axe: zero serious or critical issues; keyboard walkthrough passed.
- Lighthouse mobile budgets met on the Netlify preview.
- Zero placeholder text, images, or links; contact path works end to end in preview.
- Content linter: zero dash characters, zero banned phrases.
- Written self-review against AGENTS 80A.8, then your review.

## Appendix B. Phase 1 content blueprint outline (Software Development)

For approval before drafting. Section order is deliberately different from the other pillars.

1. Hero with a system diagram (application, API, data, cloud, automation) and a plain definition of custom software.
2. Definition lead: what custom software is and when it is the right answer.
3. Decision guide: build, buy, or integrate (honest, includes cases where DECHY would recommend not building).
4. System types DECHY builds (business applications, SaaS, portals, dashboards, marketplaces, booking, membership/subscription, internal tools) presented as an index list, not cards.
5. Delivery approach: discovery, architecture, build, test, release, maintain (numbered rail with real artifacts per stage).
6. Architecture and engineering quality: testing, security, performance, observability, documentation (full-bleed Ink band with figure).
7. Technology approach: stack categories and selection criteria; names only for `core` and `working` capabilities.
8. Modernizing legacy software: assessment, strangler approach, data migration, risk.
9. Integration, AI, and automation inside software (connected-systems thesis, labeled conceptual diagram).
10. Industries and business types (relationship strip; no unsupported industry claims).
11. Common questions (real, answer-first).
12. Related services, solutions, resources.
13. Next step: discovery conversation CTA.

Proof elements appear only if a reference implementation or permitted case exists by then; otherwise the section is absent.
