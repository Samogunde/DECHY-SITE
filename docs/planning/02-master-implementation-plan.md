# DECHY Master Implementation Plan (Revision 2)

Status: DRAFT FOR REVIEW. Nothing described here has been built. Production implementation starts only after you approve this plan and the decisions register.
Companion documents: `01-strategic-audit.md`, `03-decisions-register.md`, `04-work-architecture.md`, `05-country-architecture.md`, `06-article-plan-53.md`.
Labels: CONFIRMED (in the specifications or your instructions), VERIFIED (checked by me), RECOMMENDED, ASSUMPTION, DECISION REQUIRED (see register).

Revision 2 applies your corrections: the domain is deferred and not a blocker; the 53 articles are retained and fully planned; the full capability architecture is preserved with no public evidence disclaimers; the approved PNG logo is used; the project now lives at `C:\DECHY-SITE`; Work is a primary section with a full architecture; country-level pages are planned (10 to 15 countries, no cities).

House style follows AGENTS 1A.16: no em dashes, no en dashes, no emojis. Ranges are written with "to".

---


## 1. Executive summary

DECHY is to become a durable global platform presenting **DECHY: Technology, Software, AI & Digital Solutions** as a connected company whose differentiator is joining Software, AI, Automation, Integration, and Cloud, across the full 15-pillar service universe and the full technology ecosystem in the specifications.

The plan preserves the whole vision: every service, technology, language, platform, AI provider, automation tool, integration, industry, solution, and problem in AGENTS.md is seeded into the entity graph. What the plan controls is not *whether DECHY has a capability* but *how the architecture is published*: pages are created where real search intent and unique content exist, and everything else lives as connected entities that appear in matrices, relationships, and search/filter.

What decides success:

1. **Depth and variety of content**, because DECHY will publish a large, AI-assisted corpus (15 service pillars, Work, 10 to 15 countries, 53 articles, technology, industry, and solution pages). Quality systems (briefs, validators, review, batches) prevent sameness and thin pages.
2. **Information architecture precision**: one canonical home per concept, duplicates merged, URLs predictable.
3. **A Work section** that is real from day one (Work Areas) and grows through project entries as you supply facts, with no invented client details.
4. **Country architecture** that represents ability to serve markets with country-specific substance, not name swaps.
5. **Entity clarity** (consistent descriptor-paired naming, Organization schema, real external profiles).
6. **A reliable engineering and Git workflow**: local development at `C:\DECHY-SITE`, GitHub `Samogunde/DECHY-SITE` as source of truth, Netlify deployment.

Recommended path: approve this plan, then build the technical foundation and two representative pages (Home and Software Development) to the full standard, review them in a real browser, and scale only after that review.

Planning targets (RECOMMENDED, ASSUMPTION; not caps on the entity graph): about 30 pages after Phase 2 (15 pillars, Company, Contact, Work hub and areas, legal), growing through phases to a few hundred qualified pages including 53 articles, 10 to 15 country pages, and Work.

---


## 2. Business positioning

**CONFIRMED**
- Name DECHY; descriptor exactly "Technology, Software, AI & Digital Solutions".
- Global company; operating since 2010; statement: "Since 2010, DECHY has helped over 1,500 organizations, companies, firms, brands, businesses, individuals, professionals, teams, and other clients across a wide range of industries and business types." The figure is not to be raised or altered.
- DECHY has substantial experience across the complete capability set in the specifications. Those capabilities are approved and are presented professionally and without public caveats.
- No physical offices, addresses, local teams, or Google Business Profiles.
- Differentiator: connecting Software + AI + Automation + Integration + Cloud, inside a broader service universe. AI and Automation never outrank other services.

**Not generated (CONFIRMED):** specific client identities, project metrics, results, testimonials, awards, certifications, partnerships. Capability claims are approved; specific facts come only from you.

**RECOMMENDED positioning model**
- Category line (fixed): the descriptor.
- Organizing idea: *connected systems.* Software, intelligence, automation, integration, and infrastructure designed together.
- Proof posture: show the work (Work Areas, architecture, and entries as supplied); do not state outcomes that are not supplied.
- Tone: clear, technical, direct, evidence based (AGENTS 1A.15).

**Candidate positioning statements (DEC-23):**
1. "Software, AI, automation, integration, and cloud, designed to work as one system."
2. "We build and connect the software, data, and automation your organization runs on."
3. "One technology partner for building, connecting, automating, and securing digital systems."

**Strategic challenge (DEC-24).** Fifteen equal pillars can read as "does everything." The mitigation is structure, not hierarchy: five capability families, the connected-systems narrative, and Work that shows the built systems. If revenue is concentrated in some services, homepage emphasis (not the page set) can reflect that.

---


## 3. Website purpose

Primary: convert qualified visitors into discovery conversations. Secondary: establish DECHY as a recognizable, corroborated entity for people, search engines, and AI systems; give technical buyers enough substance to evaluate competence.

Goals to be set with you (DEC-32): target markets, primary service lines, monthly qualified inquiries, and definition of a qualified lead. No numeric target in this plan is a commitment.

## 4. Information architecture

Top level (RECOMMENDED):

- **Services** (15 pillars in five families, section 5).
- **Solutions** (problem-first pages, section 9).
- **Technologies** (browse hub; individual pages live under their canonical service, section 20).
- **Industries**.
- **Work** (Work Areas and Work Entries; see `04-work-architecture.md`).
- **Locations** (country pages; see `05-country-architecture.md`).
- **Resources** (53 launch articles, then guides, comparisons, definitions).
- **Company** (about, people, how we work, who we work with).
- **Contact**.

Page-type families (AGENTS 49) plus Work Area, Work Entry, and Country. System pages: Home, Company, Contact, legal, 404.

Principles:
- One canonical URL and one canonical home service per concept.
- Entity does not equal page: every entity stays in the graph; pages are created where intent and unique content exist (section 15).
- Every indexable page is in the sitemap and linked from at least two parents (orphans fail the build).

---


## 5. Navigation

Desktop: logo, Services (mega-menu), Solutions, Technologies, Industries, Work, Resources, Company, primary CTA "Talk to DECHY" (final wording a copy decision). Locations is reached from the footer, Company, and relevant content (too many top-level items hurt clarity). Footer: all 15 services, Work Areas, countries, legal, company facts, contact.

Mobile: full-screen menu, accordions for families, persistent CTA, 44px touch targets.

Mega-menu families (RECOMMENDED; ASSUMPTION about grouping logic):

| Family | Services |
|---|---|
| Build | Software Development, Web Development, Mobile App Development, Ecommerce Solutions |
| Intelligence and Automation | AI & Machine Learning, Automation, Workflows & AI Solutions, Data & Analytics, API & Systems Integration |
| Infrastructure and Security | Cloud & DevOps, Cybersecurity |
| Design and Growth | UI/UX & Product Design, Branding & Creative, SEO, AEO & GEO, Digital Marketing |
| Advisory | Consulting & Digital Transformation |

The nine-stage client journey (AGENTS 39) appears on the homepage as "How engagements work". Breadcrumbs follow the IA.

---


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

The technology, platform, language, AI, automation, cloud, data, and integration lists in AGENTS 4 to 19 are **preserved in full** and seeded 1:1 into `data/taxonomy/`. Nothing is removed, downgraded, or labeled unproven.

Each entity carries organizing fields (never public disclaimers):

| Field | Purpose |
|---|---|
| `role` | primary service, supporting capability, strategic technology, technology, platform, framework, language, integration, tool |
| `primaryService` | canonical home (resolves duplicates such as Firebase/Supabase, Kotlin/Swift, IAM) |
| `prominence` | how much page, navigation, and homepage weight it receives (`feature`, `standard`, `reference`), set by search intent and commercial value |
| `pagePolicy` | the five exact statuses (CREATE / INDEX, CREATE LATER, MERGE / CONSOLIDATE, REVIEW, DO NOT CREATE), reflecting search intent only |
| `evidenceLevel` | internal: none, work area, work entry, case study; controls which proof blocks may render next to the entity |
| `synonyms`, `relations`, `descriptions` | per the data model |

Rules:
1. Every listed capability is available to the content and entity architecture: it can appear in capability matrices, "technologies we work with" sections, relationship rails, schema `knowsAbout`, comparisons, and search/filter.
2. `pagePolicy` is about search intent, not capability. A language such as Perl may remain a reference entity because no one searches for a Perl service; that is a page decision, not a statement about DECHY.
3. Strategic technologies (feature prominence) get dedicated pages first, because their search demand is highest. Initial candidate list for Phase 3 (ASSUMPTION about demand; to be confirmed by the SERP review): Next.js, React, TypeScript, Python, Node.js, PHP, Java, .NET, WordPress, Shopify, Webflow, Airtable, Zapier, Make, n8n, OpenAI, Claude, Gemini, LangChain, AWS, Azure, Google Cloud, Flutter, React Native, Swift, Kotlin, PostgreSQL, MongoDB, Salesforce, HubSpot, Stripe, Docker, Kubernetes, Terraform.
4. Third-party logos are not used by default (they imply partnership or certification). Technology names appear as text, which preserves the full breadth without implying a vendor relationship.
5. Copy about any entity may describe what DECHY does with it (approved capability), without outcomes or client claims unless supplied.

---


## 8. Industry architecture

- All industries in AGENTS 20 are entities. Industry pages are created where industry-specific substance and search intent exist: industry context, regulation, data sensitivity, typical systems, integration patterns, security and compliance, relevant solutions.
- Candidate first wave (RECOMMENDED, ASSUMPTION): Healthcare, Financial services (finance, banking, insurance), Real estate and property management, Logistics and transportation, Retail and ecommerce, Education, Professional services, Manufacturing. Others follow by demand.
- Pages are not noun-swapped templates. Each industry has a distinct brief.
- Service x Industry intersections (for example `/software-development/healthcare/`) follow the CONFIRMED example in AGENTS 29 and require distinct substance beyond the industry page.
- Work Entries and Work Areas feed industry pages when supplied; until then the page stands on industry-specific substance.

---


## 9. Solution architecture

Solutions are the bridge between buyer language and DECHY services. A **Solution page begins with the business problem** (AGENTS 71) and connects problem, solution, technologies, services, workflow, outcome (qualitative only unless verified), implementation. The 22 solutions in AGENTS 23 are the candidate list; first wave (RECOMMENDED): Business Process Automation, Workflow Automation, Legacy System Modernization, Cloud Migration, API Integration, CRM Integration, Customer Portal Development, Internal Business Software, AI Customer Support, AI Agents, AI Knowledge Systems, Business Dashboards. Order and exact set to be finalized in Phase 3.

## 10. Problem architecture

The 30 problem statements in AGENTS 22 are search intents and entities. **Recommendation (MERGE / CONSOLIDATE):** do not create a separate `/problems/` page family. A problem is the opening of its solution page and a data entity with synonyms ("too many spreadsheets", "manual data entry") used in headings, FAQs, and internal-link anchors. This avoids duplicate intent between a problem page and its solution page.

## 11. Integration architecture

Integrations (Stripe, PayPal, Paystack, Flutterwave, Salesforce API, HubSpot API, Shopify API, Microsoft Graph, Google APIs, and the rest of AGENTS 11) are entities with `primaryService = api-integration` (or ecommerce for commerce-specific ones, per the canonical home registry). All are preserved. Pages follow AGENTS 76: systems connected, data flow, authentication, webhooks, synchronization, error handling, security, monitoring. A data-flow diagram is mandatory on each integration page. Integration pages are created by search intent (for example Salesforce, HubSpot, Stripe first); the rest remain entities linked from service pages, Work Areas, and comparison articles.

---


## 12. Business-type architecture

Fifteen business types (AGENTS 21). **Recommendation:** one "Who we work with" section on the Company page plus relationship data feeding service pages; **no** per-business-type landing pages in the first three phases (high duplicate-intent risk). Reconsider individual pages (for example Startups, Agencies, SaaS companies) only if Search Console shows distinct demand.

## 13. Location (country) architecture

Full detail in `05-country-architecture.md`. Summary:

- **Country level only**; no city pages, no addresses, no offices, no branches, no local teams, no Google Business Profiles, no `LocalBusiness` schema.
- 10 to 15 strategically selected countries. Candidate pool of 15 from your examples: United States, United Kingdom, Germany, France, Spain, Italy, Netherlands, Ireland, Switzerland, Sweden, Canada, Australia, United Arab Emirates, Belgium, Austria. Waves of 4 to 6 keep quality high (DEC-35).
- Each page represents DECHY's ability to serve clients in that market, remote-first, truthful to the global positioning.
- Each page needs market-specific substance: relevant services, technology capabilities, industries, common business needs, solutions, integrations, country-specific considerations (regulation, payments, e-invoicing, languages), FAQs, resources. A similarity validator and sourced, dated regulatory statements guard against thin pages.
- Pages connect to services, technologies, industries, solutions, business types, Work, and articles through typed edges.
- Country x service intersections (for example `/software-development/germany/`) are CREATE LATER.

---


## 14. Content architecture

Four classes (CONFIRMED, AGENTS 31): Commercial, Informational, Proof, Authority. Proof is delivered by the Work architecture.

**Work.** A full section with two layers: Work Areas (system-centric explanations of what DECHY builds, with original architecture diagrams, writable now) and Work Entries (project-level, from facts you supply; summary, detailed, or case-study depth). See `04-work-architecture.md`. Case study = a Work Entry with verified detail.

**The 53 launch articles.** Retained in full. Complete architecture in `06-article-plan-53.md`: 53 articles in 6 clusters mapped to all 15 pillars, with search intent, canonical home, entities, linking, and a six-batch publication plan (9, 9, 9, 9, 9, 8). The missing source list is treated as a documentation gap; if an original list exists it is reconciled against this set.

**Country pages.** 10 to 15 (section 13).

**Content depth model** (micro to full) is stored as fields on one record; a validator checks the lengths agree.

**Authoring workflow** (AGENTS 59 refined): define entity and intent, relationships, select approved claims, write the brief, draft, technical review, editorial review (house-style linter), schema and metadata, link candidates, QA, human approval, publish. Every page records `reviewer`, `lastReviewed`, and `claims[]`.

**Factuality rule (CONFIRMED).** Content distinguishes: (1) DECHY capability claims (approved), (2) specific project facts, (3) client identities, (4) measurable results, (5) testimonials, certifications, awards, partnerships (2 to 5 only when supplied). Illustrative examples are labeled illustrative.

**Reference implementations** (optional accelerator, DEC-21): DECHY-built demonstrations (for example a lead-qualification workflow, a document Q&A system) published as Work Entries labeled as DECHY-built, with architecture and trade-offs. They add original, citable material without needing client permissions.

---


## 15. Entity architecture

Entity types and default page policy (all entities live in the graph; page policy is about search intent):

| Entity | Default policy | Becomes a page when |
|---|---|---|
| Company | Page (Home, Company) | always |
| Service pillar | Page | always (15) |
| Service sub-capability | Section | distinct intent and substantial unique content |
| Technology / platform / provider / language | Data (appears in matrices and relations) | service x technology intent exists (canonical-home URL) |
| Architecture concept | Data / glossary | high-intent definition or guide |
| Industry | Data + relationship chip | industry-specific substance and demand |
| Business type | Data + "Who we work with" | distinct demand shown by data |
| Problem | Data (opens a solution page) | merged into solution page |
| Solution | Page | passes qualification |
| Integration | Data | system pair has intent and data-flow content |
| Use case | Section of services/solutions/Work Areas | rarely a page |
| Country | Page (10 to 15, in waves) | country substance requirements met |
| City | DO NOT CREATE | n/a |
| Work Area | Page (about 20 to 25) | system-centric substance and diagram |
| Work Entry / case study | Page | facts supplied and permissions recorded |
| Comparison, migration | Page | real buyer decision, balanced content |
| Article / guide / definition | Page | the 53 launch articles, then qualified additions |
| Person (author, reviewer, lead) | Profile page | real person with consent |
| External reference | Data | cited; `sameAs` for DECHY's own profiles |

**Graph.** Stable IDs (`svc.software-development`, `tech.python`, `ind.healthcare`, `workarea.rag-knowledge-systems`, `loc.germany`, `art.017`). Typed edges in `data/relations/*.yaml`. Required chain support (CONFIRMED by you): Work → Service → Technology → Industry → Problem → Solution → Integration → Related article → Related service → Related technology. The build validator checks endpoints, generates inverse edges, rejects orphans and canonical-home conflicts.

**Entity disambiguation (RECOMMENDED).** Pair the brand with the descriptor in titles and the Organization description; stable Organization `@id`; real `sameAs` profiles; consistent naming everywhere. This addresses the shared name "Dechy" (also a French commune) without any rename.

---


## 16. SEO architecture

- One primary intent per page, recorded in the page record, with secondary intents. Duplicate-intent detection compares intents and titles.
- Metadata generated from the content model: title (descriptor suffix on Home and Company only; service pages use "{Service} Services | DECHY"), meta description, canonical, robots, Open Graph, Twitter card.
- `trailingSlash: true`; canonical includes the trailing slash; HTTP to HTTPS and one preferred host variant via a single redirect rule; every absolute URL derives from the configurable `SITE_ORIGIN` so the final domain (DEC-02, deferred) is a setting, not a rewrite.
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
2. **Organization schema** with stable `@id`, `name`, `url`, `logo`, `description` (exact descriptor), `foundingDate` 2010 (CONFIRMED statement), `areaServed` "Worldwide", `knowsAbout` (drawn from the capability architecture), `contactPoint`, `sameAs` (existing profiles only). Excluded: `numberOfEmployees`, `aggregateRating`, `address`, `award`, anything unverified.
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
8. Work: `/work/` hub, `/work/areas/{slug}/` for Work Areas, `/work/{slug}/` for Work Entries and case studies.
9. Countries: `/locations/` hub and `/locations/{country-slug}/`; qualified country x service pages `/{service}/{country-slug}/` are CREATE LATER. No city URLs.
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
| Work Area / Work Entry | `WebPage` (+ `Service` where apt); case-study depth uses `Article`; see `04-work-architecture.md` |
| Country | `WebPage` + `Service` with `areaServed` = Country; no `LocalBusiness`, no address |
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

**Shape and surface.** Radius scale 0, 2, 4, 6, 8 (no pills; buttons 6). Hairline 1px borders instead of shadows; shadows only for floating layers (menus, dialogs). No gradients, no glassmorphism, no glow (CONFIRMED). Section rhythm alternates Paper, white, and Ink surfaces; Dark sections do not carry the logo in Phase 1; header and footer logo sit on light surfaces.

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

**Logo usage (CONFIRMED: use the approved PNG as supplied).** The PNG is placed on white or Warm Off White with CSS blending so its near-white background is not visible; it is never redrawn, recolored, cropped without your approval, stretched, or given effects. The descriptor stays inside the artwork where legible; elsewhere it is live text in Manrope. A favicon or social mark derived by faithful crop of the approved artwork is proposed for your approval before use. A vector master, reverse version, and brand guide are later recommendations (DEC-03).

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
    taxonomy/           services, technologies, industries, business-types, canonical-homes
    countries/          country records (05-country-architecture.md)
    work/               areas/ and entries/ (04-work-architecture.md)
    articles/           53 article briefs (06-article-plan-53.md)
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

**Core record fields** (a superset of AGENTS 28, 32, 34): `id`, `type`, `slug`, `canonicalHome`, `parents[]`, `name`, `synonyms[]`, `descriptions{micro,short,medium,long}`, `intent{primary,secondary[]}`, `status` (the five exact statuses), `indexing`, `role`, `primaryService`, `prominence`, `pagePolicy`, `evidenceLevel`, `claims[]` (fact IDs), `evidence[]`, `sections[]` (ordered, typed blocks), `faqs[]`, `relations` (via edge files), `seo`, `schema`, `i18n{locale,translationOf}`, `reviewer`, `lastReviewed`, `datePublished`, `dateModified`.

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
- The first commits contain the specification documents and the planning set, pushed to GitHub as the source of truth. Production code is not written or pushed before you approve this plan. Work is pushed whenever a meaningful, verified unit is complete (DEC-27 covers commit identity).
- The working copy is at `C:\DECHY-SITE` (moved out of OneDrive and verified; history and remote intact).

## 35. Netlify deployment strategy

- Netlify site connected to the GitHub repo; `main` deploys to production; branches and pull requests produce deploy previews; previews are `noindex`.
- Build: `npm ci && npm run build`; Node 22 pinned.
- **Domain-independent (DEC-02, deferred):** the public origin is one setting (`SITE_ORIGIN`) used for canonicals, sitemaps, Open Graph, and schema `@id`. Until the domain is chosen (dechy.com if acquired, dechytech.com, dechydev.com, or another), development and review use the Netlify-provided subdomain with search indexing blocked. When the domain is chosen: add it in Netlify, set `SITE_ORIGIN`, configure DNS and HTTPS, run the production smoke test, and only then allow indexing. If a domain ever changes after launch, a redirect map handles it.
- Things I cannot do alone: Netlify authorization/plan and DNS/registrar access at deployment time. They need you.
- Rollback: Netlify atomic deploys.

---


## 36. Future expansion strategy and canonical phase sequence

This reconciles AGENTS 60 and 95, the Handoff, the Content Master, and your instructions.

| Phase | Scope | Exit gate |
|---|---|---|
| 0 | Plan approval; Approved Facts Register; taxonomy seeded 1:1 from AGENTS; SERP review; Work, country, and article briefs scaffolded | You approve the revised plan |
| 1 | Foundation (scaffold, tokens, content loader, graph, validators, CI, Netlify preview) + **Home** + **Software Development**, plus working Contact page, header/footer, 404, minimum legal pages | Real-browser review at desktop/tablet/mobile; all gates pass; your approval |
| 2 | Remaining 14 pillars; Company; Work hub with Work Areas (about 20 to 25); full legal set; production launch candidate | Per-page review for non-template structure; production smoke test; your go-ahead |
| 3 | Technology, platform, AI, automation, and integration pages by search intent (strategic list in section 7); article Batch 1 | Qualification table approved |
| 4 | Industries; solutions; qualified intersections; country Wave 1 (US, UK, Canada, Australia, Ireland); article Batches 2 to 3; Work Entries as you supply them | Per-batch review |
| 5 | Country Waves 2 and 3 (DE, FR, NL, CH, BE, AT, ES, IT, SE, AE); article Batches 4 to 6; case studies as verified detail arrives | Per-batch review |
| 6 | Language localization (locale versions of country and core pages); country x service intersections | Genuine localization and evidence per market |

Article Batch 1 may begin in Phase 2 once the pillar pages it reports to exist. Page count is never a KPI; quarterly consolidation reviews use Search Console data. Applications, portals, dashboards, or AI tools later live on separate routes or subdomains, noindexed behind authentication, sharing design tokens.

---


## 37. Risks

Detail in audit sections H to K. Top ten, ranked:

1. Sameness and thinness across a very large AI-assisted corpus (J-1, I-2).
2. Duplicate intent and cannibalization (D-7, D-9).
3. Country-page similarity and stale regulatory statements (I-4, I-8).
4. Dependency/security exposure of the stack (H-2).
5. Accessibility defects from the approved palette without derived tokens (K-2).
6. Entity establishment for a shared name (section 15).
7. Work section depth: breadth without substance (J-6).
8. i18n retrofit cost if not designed in now (H-6).
9. Review bottleneck: one approver for hundreds of pages. Mitigation: briefs, validators, batches.
10. Deployment dependencies outside my access: Netlify authorization, DNS (H-13).

---


## 38. Missing requirements

Approved Facts Register inputs (legal entity, contact channels, engagement models, time zones, languages, real external profiles); named authors/reviewers; Work intake information for project entries (not blocking); lead handling process and owner; measurable goals and priority markets; review authority; Netlify authorization; AI crawler policy; analytics choice; legal texts reviewed by a qualified person; image licensing preferences; later: vector logo and brand guide, favicon/monogram derived from the approved logo, final domain.

---


## 39. Recommended improvements (summary)

1. Canonical-home rule; merged problem and solution pages (sections 6, 9, 20).
2. Classification that organizes, never removes (section 7).
3. Two-layer Work architecture (section 14; `04`).
4. Country architecture in waves with required country-specific substance (section 13; `05`).
5. A complete 53-article plan with overlap control and batches (`06`).
6. Five-family navigation with Work and Resources prominent (section 5).
7. Derived accessible color tokens; 18px body type (section 23).
8. Diagram-first visual system (section 25).
9. Typed, Git-based content with graph validation, facts macro, and content linter (sections 26, 33).
10. Static-first Next.js on Netlify with hardened headers (sections 28, 31).
11. Locale-ready from day one, English-only publishing (section 19).
12. Domain-independent configuration (section 35).
13. CLAUDE.md importing AGENTS.md; ADR log.
14. Privacy-first analytics (section 32).
15. Optional DECHY reference implementations (section 14).

---


## 40. Decisions requiring human approval

Full register with recommendations: `03-decisions-register.md` (DEC-01 to DEC-40). Before Phase 1 starts: DEC-04, DEC-07 to DEC-15, DEC-23, DEC-24, DEC-30, DEC-31, DEC-34, DEC-36. Before Phase 2 ships: DEC-05, DEC-17 to DEC-22, DEC-26. Later: DEC-02 (domain), DEC-03 (vector logo), DEC-35 (country order), DEC-16 detail.

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
7. Technology approach: stack categories and selection criteria; technology names drawn from the capability architecture.
8. Modernizing legacy software: assessment, strangler approach, data migration, risk.
9. Integration, AI, and automation inside software (connected-systems thesis, labeled conceptual diagram).
10. Industries and business types (relationship strip; no unsupported industry claims).
11. Common questions (real, answer-first).
12. Related services, solutions, resources.
13. Next step: discovery conversation CTA.

Related Work Areas appear as soon as they exist; Work Entries appear only if supplied; otherwise that block is absent.
