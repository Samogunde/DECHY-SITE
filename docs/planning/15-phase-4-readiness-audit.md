# Phase 4 readiness audit

Status: AUDIT AND RECOMMENDATION. Written 6 October 2026 against the repository at commit `66972b0`. Nothing here builds a page, changes a route, rewrites content or redesigns navigation. The only repository changes made by this audit are this document and two pointer lines (`CLAUDE.md`, doc 14).

**Method.** Every number below was measured from the repository, not copied from earlier summaries: the entity registry and relation graph were queried with throwaway scripts (not committed), the production build was started and probed (headers, robots, sitemap, search index, rendered metadata and structured data), the browser test list was enumerated, CI history was read from the GitHub API, and the planning and governance documents were searched for contradictions. Where a fact could not be measured (search demand, real-user performance, how a page looks to the owner) it is marked **Not measured** or **Inferred**.

Evidence labels: **Measured** (from the repository or a probe), **Documented** (stated in an approved document), **Inferred** (my judgment from measured facts), **Not measured**.

## 1. Executive Summary

**Readiness status: B. READY WITH PRECONDITIONS** for a narrowed Phase 4 (the Solutions layer, with an optional companion technology batch). **NOT READY** for the other items the master plan bundles into Phase 4 (Industries, Country Wave 1, article Batches 2 and 3, Work Entries); those need their own qualification gates first (section 17).

What is sound:

- The four-axis model (Services, Work Areas, Solutions, Technologies) is consistent in URLs, page types, breadcrumbs, navigation and rails for the three axes that have pages. Validators pass with 85 pages, 804 entities, 901 relations, 0 errors, 0 warnings. There are no duplicate relations, no cycles, and no orphan pages.
- The technology architecture is qualified: 32 published, 11 next-wave candidates (4 HIGH, 7 MEDIUM), 8 grouped with `partOf`, 9 held for confirmation, and 21 later candidates, with no page created to raise a count.
- The test and governance system is strong: 150 unit tests, 2,461 browser tests (axe on all 85 pages at two widths, 12 responsive widths, alignment checks), a content validator suite, security headers, `npm audit` clean.

What stands between the repository and Phase 4 (details in section 19):

1. **CI integrity.** Two commits on `main` (`357dadf`, `ff20a47`) have no completed CI run because the workflow cancels in-progress runs when the next push arrives. The commit that added the schema and validator change (`66972b0`) did complete green, in 33.5 minutes, but only because no later push arrived while it ran. Fix the concurrency rule on `main` so a green run is guaranteed for every commit before Phase 4 starts.
2. **A documented rule contradicts the approved architecture.** The Phase 2 plan says each service page links 3 to 6 Solutions and each Work Area links 2 Solutions. Six of 15 services and seven of 25 Work Areas have none, and the six-Solution architecture means they never will. The validator does not enforce the rule (despite the plan saying it does). Amend the rule before building Solutions.
3. **The Solutions layer needs capabilities that do not exist yet:** a `solution` page kind and validators, a rule for the 16 Solutions that will never have a page (87 of the 130 Solution references on published pages point at them and render as plain text), a corrected `/solutions/` hub, and a Solutions menu decision.
4. **The owner must approve the narrowed Phase 4 scope** (section 18), because it differs from the master plan's Phase 4 row.

Phase 4 recommendation: **Phase 4 is the Solutions layer** (six Solution pages, the corrected hub, rails and navigation), preceded by a short preparation step and, if the owner agrees, a companion batch of the four HIGH technology pages. It excludes Industries, countries, articles, Work Entries, the MEDIUM technology wave, deferred Solutions and the open-model group.

## 2. Current Architecture Snapshot

| Measure | Value | Evidence |
|---|---|---|
| Published pages | 85: home 1, services 15, hubs 3 (Services, Solutions, Technologies), Work hub 1, Work Areas 25, technology 32, company 3, contact 1, legal 4 | Measured |
| Entities | 804: capability 316, technology-like 329 (technology 111, platform 59, framework 31, language 22, provider 11, tool 45, integration 15, ecosystem 11, concept 24), industry 37, problem 30, solution 22, Work Area 25, service 15, business type 15, country 15 | Measured |
| Relations | 901: usesTechnology 209, integratesWith 135, offersSolution 133, appliesToIndustry 109, relatedService 86, relatedWork 69, alternativeTo 49, hasWorkArea 45, addressesProblem 31, solves 27, partOf 8. No duplicates | Measured |
| Entities with a public page | 72 (15 services, 25 Work Areas, 32 technologies); the other 13 pages are hubs, company, contact, legal and home | Measured |
| Page policy, technology-like | CREATE / INDEX 32, CREATE LATER 2 (Node.js, .NET), MERGE / CONSOLIDATE 8, REVIEW 252 (includes the 9 confirmation-required) | Measured |
| Page policy, Solutions | CREATE LATER 12, REVIEW 10 (pending policy changes held, doc 14 section 10.2) | Measured |
| Industries | 37 entities (13 CREATE LATER, 24 REVIEW); 26 have a relation, 11 have none | Measured |
| Countries | 15 entities, wave 1 to 3, `presence: none`; no relations, no pages | Measured |
| Article briefs | 53, batches 9, 9, 9, 9, 9, 8; stored as data, not read by the build | Measured |
| Page word counts (median) | services 1,520; technology 983; Work Areas 729 (minimum 620); hubs 880; home 2,082 | Measured |
| Tests | Unit 150 in 13 files; browser 2,461 in 8 files | Measured |
| Completed CI runs | `0957aac`: success in 25.1 minutes; `66972b0`: success in 33.5 minutes (same suite size within 2 percent, so the spread is runner variance); an earlier run was cut off at the old 30 minute limit | Measured |
| Security | Headers present on every page (CSP, HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy, COOP); `npm audit --omit=dev`: 0 vulnerabilities | Measured |
| Indexing | `robots.txt` disallows all crawlers while `SITE_INDEXING` is not true; every page is `noindex` | Measured |
| Open external dependencies | Netlify authorization (DEC-26), final domain (DEC-02), contact destination (DEC-18) | Documented |

## 3. Information Architecture Audit

| Axis | Defined? | Discoverable? | Distinct purpose? | Overlap or duplication | Orphans | Gaps and contradictions |
|---|---|---|---|---|---|---|
| Services (15) | Yes (plan 5, AGENTS) | Header menu, hub, footer, rails | Yes | Cluster overlap with Work Areas and technologies is deliberate and linked | None | Link-slot rule for Solutions unmet by 6 services (section 19, B3) |
| Work Areas (25) | Yes (doc 04) | Header menu (5 groups), hub directory, rails, Services pages | Yes | Nine Solutions name the same thing as a Work Area; resolved by representation (ADR 0006) | None | 7 have no Solution relation; 5 have a single technology relation (API Integrations links only Stripe although HubSpot, Salesforce, Zapier and Make pages exist) |
| Technologies (32 pages, 329 entities) | Yes (docs 12 to 14) | Header menu, directory, rails, Services pages, search | Yes | Intended: comparison tables name alternatives; no page repeats another (validator) | None | Next-wave candidates have no Work Area relations; .NET and Supabase have no relations at all |
| Solutions (22 entities, 0 pages) | Defined (doc 14, ADR 0006) | Header link and hub only; all 22 appear as inert text | Yes, once the six exist | 9 concepts duplicate Work Areas by name; resolved | n/a | No `solution` page kind; hub does not match the architecture (section 5) |
| Industries (37 entities, 0 pages) | Defined (plan section 8) | Plain text in header and footer; 3 inert nav items | Not yet distinct from Services by evidence | n/a | 11 entities have no relation | Only technology pages (and the Software Development service) carry industry edges; Work Areas, Solutions and 14 services carry none |
| Company (3), Contact, Legal (4) | Yes | Header, footer | Yes | None | None | The Cookies page exists although the code sets no cookies (harmless; it states the policy) |
| Resources and articles (0 pages) | 53 briefs in data | Inert nav item and footer text | n/a | n/a | n/a | Briefs have free-text entity references, not IDs; phasing is contradictory (section 14) |
| Locations (0 pages, 15 entities) | Defined (doc 05) | Inert footer text | n/a | n/a | 15 entities with no relation | DEC-35 (country pool and waves) still open |
| Problems (30) | Yes; no page family (AMD-05) | Via Solutions and Work Areas | Yes | None | 0 without a service; 8 without a Solution | Intentional: those open a service or Work Area |
| Capabilities (316), business types (15) | Internal classification | Not public | n/a | n/a | No relations by design | None |

Unnecessary pages: none found. Every published page has a distinct primary intent (validator), a canonical home, and at least one inbound link. Pages that are **entity-only by design** (not unnecessary): the 8 grouped technologies, the 9 confirmation-required ones, the 21 later candidates, the 16 Solutions without pages.

Orphan check (Measured): zero published pages without an inbound internal link (the `orphan` validator rule is active). Orphan entities: 80 technology entities, 18 concepts, 11 industries and 15 countries have no relations at all; this is acceptable for graph-only entities, and the 11 industries should gain relations only through the qualification gate in section 13.

Plain-text reference load (Measured): of 877 entity references in the related blocks of published pages, 342 (39 percent) render as plain text because the target has no page: Solutions 130, industries 96, technologies and integrations 116. That is the approved handling rule, but it means roughly two in five "Where this connects" items are inert today.

## 4. Services / Work / Solutions / Technologies Audit

The model: Services are what DECHY does; Work Areas are the kinds of system DECHY builds; Solutions are the business problem or outcome; Technologies are what a system can be built with.

| Dimension | Services | Work Areas | Solutions | Technologies | Consistent? |
|---|---|---|---|---|---|
| Page type | `service` | `work-area` | none yet | `technology` | Yes, but no `solution` kind exists |
| URL | `/{service}/` | `/work/areas/{slug}/` | `/solutions/{slug}/` (rule defined) | `/{service}/{slug}/` | Yes |
| Breadcrumb parent | Home | Work hub | Solutions hub (rule defined) | Its service | Yes |
| Navigation | Menu with groups | Menu "What we build" | Plain link | Menu with categories | Solutions is the only axis without a menu |
| Structured data | `WebPage` + `Service` + FAQ | `WebPage` (+ FAQ on 8 of 25) | `WebPage` + `Service` where it describes one (plan) | `WebPage` + FAQ | Yes; uneven FAQ on Work Areas |
| Rails (Where this connects) | Yes | Yes | Not applicable | Yes | Yes |
| Hub | `/services/` | `/work/` | `/solutions/` | `/technologies/` | Solutions hub off-model (section 5) |

Places where two axes are still treated as the same thing (Measured):

| # | Finding | Evidence | Severity |
|---|---|---|---|
| 1 | The relation `offersSolution` is used for technology to Solution (64 edges) and Work Area to Solution (41 edges), as well as service to Solution (28). A technology does not offer a Solution and a Work Area is not a Solution provider. The rails read both directions so nothing displays wrongly, but the vocabulary conflates the axes | Relation pairs measured | Important, fix during Phase 4 preparation |
| 2 | Sixteen Solutions will never be pages, and nine of them share a name with a Work Area (for example Customer Portal Development and Customer Portals). Together they account for 87 plain-text references on published pages | 87 of 130 Solution references point at the 16 non-page Solutions | Important, rule needed before the first Solution page |
| 3 | The `/solutions/` definition block contrasts a Solution with a Service only; it never distinguishes it from a Work Area | Hub content | Important, fix with the hub |
| 4 | The plan's link-slot rule treats Solutions as a required slot on every service page | Phase 2 plan line 177 | Blocker for Solutions build until amended (B3) |

No other conflation was found: technology pages sit under their service and say what DECHY builds with them, Work Area pages describe systems and link technologies, and services describe the work.

## 5. Solutions Hub Audit

`/solutions/` currently has: a hub hero with a four-step diagram; a definition ("A solution is not a service"); an eight-path finder ("Which of these sounds like you?"); a "Solution areas" list that names all 22 Solutions as chips in seven groups; a "One problem, several services" diagram; the four-ways strip; and a FAQ. Every chip is inert text because no Solution page exists.

**What is wrong now (exactly):**

| # | Problem |
|---|---|
| 1 | The chip list presents all 22 as equals. Sixteen are not going to be pages (9 represented through Work Areas, AI Automation merged, 5 deferred, Customer Experience Systems graph-only), so visitors see names that lead nowhere and never will |
| 2 | The definition distinguishes Solution from Service but not from Work Area, which is the distinction that makes the six-page architecture legible |
| 3 | Three of the six approved Solutions have no matching finder path (Cloud Migration, CRM Integration, Business Dashboards), and three paths point at a service or Work Area where a Solution will be the better destination (software is old and risky, customers wait too long, repeated manual tasks) |
| 4 | The "One problem, several services" example is fine, but it explains Solutions through Services only |
| 5 | There is no Solutions menu; the header item is a plain link, unlike Services, Technologies and Work |

**What the final hub should contain** (information architecture, from doc 14 section 11.2; not built):

| Part | Content | Links |
|---|---|---|
| 1. What a Solution means at DECHY | The four axes in plain words and one diagram of problem to solution to service to Work Area to technology | The three other hubs |
| 2. The six standalone Solutions | One entry per Solution, led by the problem in plain words (for example "We do the same tasks by hand, again and again"), the outcome, and its Services, Work Areas and Technologies | The six Solution pages |
| 3. Other needs, answered through Work Areas | A problem-led finder. Customer portals, internal tools, workflow, API integration, data systems, ecommerce, subscriptions, AI agents and digital transformation are shown as needs with the Work Area or service that answers them | Work Area and service pages |
| 4. Where this connects | The same rails used elsewhere, for the six Solutions | Services, Work Areas, Technologies |
| 5. Next step | Describe-your-problem call to action and FAQ | Contact |

**How each class is handled:**

| Class | On the hub |
|---|---|
| Six standalone Solutions | Presented as destinations, each with its connections |
| Nine represented concepts | Appear only as needs in part 3, linking to the Work Area. Never as Solution cards |
| AI Automation (merged) | Appears inside Business Process Automation, not separately |
| Five deferred | Not listed. They return when a page exists |
| Customer Experience Systems (graph-only) | Not listed |

**Should NOT appear as equal standalone Solutions:** any of the sixteen above; any list that mixes pages and non-pages in one visual set; any card that repeats a Services or Work Areas hub card.

**Internal links the hub should provide:** the six Solution pages; Work Area pages for each represented need; the Services, Work and Technologies hubs (four-ways strip); Contact.

**Is the hub correction part of the next phase?** Yes. It must ship in the same release as the first Solution pages, because a corrected hub that lists six unbuilt Solutions would show six inert names. Design the hub first, build it last in the Solutions batch.

## 6. Technology Inventory Audit

Measured state of the 329 technology-like entities:

| Class | Count | Notes |
|---|---|---|
| Published page | 32 | Each has a service, 2 or more Work Areas, 1 to 3 Solutions and 3 industries, 5 to 17 related technologies, and appears in exactly one menu category (validator) |
| Next-wave candidate, HIGH | 4 | Node.js, .NET, Power Automate, WooCommerce |
| Next-wave candidate, MEDIUM | 7 | BigQuery, MySQL, Vue, Angular, Firebase, Supabase, Snowflake |
| Group candidate, pending decision | 1 | Open models (Llama, Mistral, Hugging Face; Together AI and Groq as hosting) |
| Grouped with `partOf` | 8 | Express, NestJS, Django, FastAPI, Flask, Spring Boot, Laravel, Elasticsearch |
| Confirmation required | 9 | Rails, Power BI, Tableau, Looker, Kafka, RabbitMQ, OpenSearch, Datadog, Sentry |
| Later, graph-only, merged groups | the rest | Doc 14 section 2.3 lists every entity |

**Checks.** Service relationships: every published page has at least one (Measured). Work Area relationships: every published page has 2 or more. Technology to technology: every published page has at least 5 related technologies. Navigation: a validator requires one category per page, and the menu shows at most 8 per category with the directory as the full list. URL structure: `/{service}/{slug}/` throughout, canonical home per entity. `partOf`: 8 edges, validated, ignored by rails and never rendered (a unit test and a build check confirm the parent pages do not name the grouped technologies). `hasPart` is derived only.

**The candidates, individually** (relations Measured; readiness Inferred):

| Candidate | Relations today | Missing before a page can be built | Status for the next wave |
|---|---|---|---|
| Node.js | 2 (both `partOf` from Express and NestJS); no service, no Work Area | Service edge, Work Areas, alternatives, solutions, industries | Ready for data work; approved candidate, HIGH |
| .NET | 0 (C# has 2 and links Software Development) | Everything; and a decision on whether C# is `partOf` .NET (C# is a language, .NET a platform) | Ready for data work; approved candidate, HIGH |
| MySQL | 5, with Data and Analytics and Software Development; no Work Area | Work Areas; conditional on content that differs from PostgreSQL | Conditional, MEDIUM |
| WooCommerce | 4, Ecommerce service; no Work Area | Work Areas, solutions | Ready for data work, HIGH |
| Power Automate | 4, Automation service; no Work Area | Work Areas, solutions | Ready for data work, HIGH |
| Vue, Angular | 2 each; assigned to Software Development although their canonical home is Web Development | Service reconciliation (canonical home versus edge), Work Areas | MEDIUM |
| Firebase | 1 (Mobile App Development); canonical home Cloud and DevOps | Work Areas; parent and menu category settled in doc 14 section 4.4 | MEDIUM |
| Supabase | 0 | Everything | MEDIUM |
| BigQuery, Snowflake | 3 each, Data and Analytics | Work Areas, alternatives | MEDIUM |
| Open models | Llama 1, Mistral 2, Hugging Face 0, Together AI 0, Groq 0 | The group entity, `partOf` edges, services, Work Areas | Pending architecture decision; not approved |
| The nine confirmation-required | 0 relations each (Elasticsearch has 1, `partOf` ELK) | Nothing, until the capability is confirmed | Held; no work |

**Is the technology architecture ready for the next wave?** Yes for the four HIGH pages: the entities exist, canonical homes are set, the rules are tested, and the missing work is relations and content, which is the normal first step of a page build and not another qualification step. No further qualification is needed for them. The MEDIUM candidates should be re-confirmed one by one when they are scheduled (MySQL carries a content condition; the open-model group needs an owner decision). Noted for whoever builds the pages: `tests/unit/phase3-technology.test.ts` hard-codes the 32-page set and asserts that `tech.mysql` and `fw.vue` have no page, so each new technology page needs a deliberate test update.

## 7. Entity Graph Audit

| Check | Result | Evidence |
|---|---|---|
| Relation vocabulary | 14 types after `partOf` and `hasPart`; one semantic misuse (`offersSolution`, section 4) | Measured |
| Relation validation | Endpoints exist, no self relation, type rules for nine types including `partOf` (technology endpoints only, no cycle) and `hasPart` (derived, never stored) | `validate.ts`, unit tests |
| Duplicate relations | 0 | Measured |
| Inverse relations | `solves`/`solvedBy` and `partOf`/`hasPart` derived; others are used as undirected by the rails | Measured |
| Cycles | None (`partOf` checked by the validator; the other types are not hierarchical) | Measured |
| Orphan entities | 80 technology, 18 concept, 11 industry, 15 country, 15 business type, 316 capability have no relation. Intended for graph-only and later items. The 11 industries are the only group that should gain edges, via the industry gate | Measured |
| Service to technology | All services except Consulting have 2 to 21 technology edges; Branding has 1 published technology page, SEO 2, Digital Marketing 2 | Measured |
| Service to Work Area | 45 edges, every Work Area belongs to one service | Measured |
| Problem to Solution | 14 of 22 Solutions have a problem edge; 22 of 30 problems have a Solution; all 30 have a service. The 8 unconnected Solutions are listed with their closest candidates in doc 14 section 10.5. The 8 problems without a Solution open a service or Work Area | Measured |
| Solution to Service | Every Solution has at least one service edge | Measured |
| Solution to Work Area | Every Solution has at least one Work Area edge; each of the six has 1 to 3 | Measured |
| Work Area to Technology | 24 of 25 have at least one; Digital Transformation has none (by nature); 5 disciplines have exactly one | Measured |
| Technology to technology | `integratesWith` 135, `alternativeTo` 49; every published page well connected | Measured |
| Industry relations | 109 edges, all from technologies (96) and the Software Development service (13); none from Work Areas, Solutions or 14 services. Solution to Industry is deferred (ADR 0006) | Measured |

**Meaningful missing relationships** (only these; the graph is not to be densified for its own sake):

| # | Relationship | Why it is meaningful | Where it lands |
|---|---|---|---|
| 1 | API Integrations Work Area to HubSpot, Salesforce, Zapier, Make, Stripe | The Work Area describes exactly these systems and the pages exist | A related-block edit; Phase 4 preparation or content refinement |
| 2 | Next-wave candidates to services, Work Areas and solutions | Required by the technology page tests | In each page's build |
| 3 | A precise relation for page to Solution (`offersSolution` today) | The vocabulary is wrong for 105 of 133 edges | Phase 4 preparation |
| 4 | Vue and Angular to Web Development (their canonical home) | Currently linked to Software Development | When their pages are built |
| 5 | Industries to services, Work Areas and Solutions | Only after the industry gate | Later |

Inappropriate relationships: none found beyond the `offersSolution` usage.

## 8. Navigation / Discoverability Audit

| Item | Desktop | Mobile | Finding |
|---|---|---|---|
| Services | Link plus chevron menu, five families | Drill-down | Reachable, maintainable (data-driven), no entity-only concepts |
| Solutions | Plain link to the hub | Plain link | No menu; decision needed once pages exist (D2) |
| Technologies | Link plus category rail and panel (8 categories, 8 items per category) | Two-level drill-down | Scales by data; the directory is the full list |
| Industries | Plain text, not a link | Plain text | 1 of 7 primary items is inert until industry pages exist |
| Work | Link plus "What we build" menu, five groups holding all 25 Work Areas | Drill-down | Every Work Area placed exactly once (validator) |
| Resources | Plain text | Plain text | Inert until resources exist |
| Company | Link | Link | Fine |
| CTA, search | "Talk to DECHY"; search dialog | Same | Search index is 31 KB for 85 pages (about 365 bytes per page) and grows linearly; fine to about 500 pages before it should be split or loaded lazily |
| Footer | Explore (9 items), legal (4) | Same | Industries, Resources and Locations are inert text |

Checks: important hubs reachable (yes); no published page is orphaned (validator); menus expose only published pages (validator and the `nav.yaml` rule); menus remain maintainable as the site grows (categories and groups are data, with a cap and a directory); navigation is not overloaded (7 primary items, menus cap at 8); search is a scalable escape hatch (static index, native dialog, no external service). Discoverability of Work Areas, technologies and the Solutions hub is adequate today. Solutions will need a menu or at least a link list when six pages exist.

Two of seven primary items and three of nine footer items are inert text by design (no placeholders). That is correct under the approved rule but is the visible cost of not yet having Industries and Resources; do not "fix" it with placeholder pages.

## 9. SEO / Search Architecture Audit

| Area | Finding | Evidence |
|---|---|---|
| Titles and descriptions | Unique (validator), length-bounded (title 10 to 70, description 70 to 165) | Measured |
| Canonical URLs | One per page, absolute, trailing slash, from `SITE_ORIGIN` | Measured |
| Sitemap | Generated from index-eligible page records only; absolute, slashed URLs; `lastmod` from `dateModified` | Measured |
| Robots | Disallow all until `SITE_INDEXING=true`; when enabled, allow all and exclude `/api/` | Measured |
| Indexing control | A page is indexable only if both its record and the environment allow it; all pages currently `noindex, nofollow` | Measured |
| Breadcrumbs | Rendered and in `BreadcrumbList` JSON-LD on every non-home page | Measured |
| Structured data | One `@graph` per page: `Organization`, `WebSite`, `WebPage` (or `CollectionPage`, `AboutPage`, `ContactPage`), `BreadcrumbList`, plus `Service` on services and `FAQPage` where an FAQ exists. No `LocalBusiness`, address or geo, as required | Measured |
| Open Graph, Twitter | Present on every page; one shared OG image; locale `en_US` is constant | Measured |
| Hierarchy and URLs | Consistent with the plan; no dates or IDs | Measured |
| Duplicate intent, thin pages | Validators for duplicate title, description and intent, similarity per kind, and a 900-word floor for technology pages. Work Areas have no word floor (minimum 620 words) | Measured |
| Internal links | Orphan validator; 39 percent of related references are inert text (section 3) | Measured |
| Entity clarity | Stable `@id`s; descriptor paired with the name on Home and Company; **no `sameAs`** because no external profiles are confirmed, so disambiguation from "Dechy" (a French commune) rests on the descriptor only | Measured, Documented |
| AEO structure | Answer-first definition block on all 32 technology pages, 25 Work Areas and 10 of 15 services; FAQ on 15 of 15 services, 32 of 32 technologies, 8 of 25 Work Areas | Measured |
| GEO and AI-search signals | `inLanguage`, clear entity relationships in JSON-LD, plain-language definitions. `llms.txt` is not a dependency and is not present, as instructed | Measured |
| International | English only; `hreflang` not emitted and not needed yet; locale is a constant | Measured |
| Future country pages | Architecture defined (doc 05); the OG locale and `inLanguage` constants must become per-page values only when a localized document exists | Documented |
| Future articles | Brief data exists; no article page kind, no `Article` schema, no author data | Measured |

Genuine blockers to **indexing launch** (not to Phase 4): final domain and `SITE_ORIGIN` (DEC-02), Netlify authorization (DEC-26), and confirmed external profiles for `sameAs` if the owner has them. Nothing in the SEO architecture blocks Phase 4 work. The search architecture supports traditional search (canonical, sitemap, metadata, internal links), answer engines (definition-first pages, FAQ, structured data) and entity understanding (stable graph, `@id`s, breadcrumbs), subject to the `sameAs` gap above. Observations, none a blocker: `FAQPage` markup is on about every page (its rich-result eligibility is limited, so treat it as machine-readable Q and A, not as a ranking tactic); technology and Work Area pages carry no `about` property naming the technology or system; 17 of 25 Work Areas have no FAQ.

## 10. Content Architecture Audit

| Area | Finding |
|---|---|
| Phase 1 and 2 voice | The owner's direction of 6 October asked for an experienced company explaining a solution, not a textbook. Phase 2 pages are untouched and still follow the earlier pattern: all 25 Work Areas open with a "what is" definition block and carry a labeled scenario callout (53 hypothetical or example phrasings across the 25), and the Work Areas are much shorter than the service pages (median 729 words against 1,520; the validator sets a word floor for services, home, contact and technology pages, but none for Work Areas or hubs) |
| Phase 3 voice | Technology pages follow the newer voice and the 900-word floor (median 983) |
| Page differentiation | Every service, Work Area and technology page has a distinct block sequence (15 of 15, 25 of 25, 32 of 32 distinct) and passes the similarity validators |
| Definitions and technical explanations | Present, with glossary and readability validators enforcing first-use glosses |
| Generalized examples | Labeled and natural-sounding on technology pages; on Work Areas still partly a "scenario" callout pattern |
| CTAs | One CTA block per page, unique CTA heading per technology page (tested) |
| Internal linking | Strong on published axes; see section 3 for the inert-reference load |
| Article briefs | 53 briefs with canonical home and a primary question; entity references are free text |

**Is the content voice a blocker to Phase 4?** No. Phase 4 adds new pages that follow the current rules; it does not edit Phase 2. **Is it important?** Yes: the Solutions hub and pages will link into 25 Work Areas whose voice differs from the new pages. The recommended handling is a separate **content refinement pass (R1)** on the Phase 1 and 2 pages and on diagram positioning, scheduled by the owner before launch, not inside Phase 4.

**Content rules that govern Phase 4 pages** (all already approved; restated so the build has one list):

1. Problem first, then understanding, options, solution, next step (ADR 0004). A Solution page begins with the business problem (AGENTS 71).
2. Experienced-company voice: what it means, why it matters, where it fits, options, what DECHY can do, technical depth where useful. A definition only where it aids understanding.
3. Generalized examples use natural wording and are never presented as client work; no repeated disclaimer boxes.
4. No client, project, metric, award, certification or technology-experience claim without a supplied fact. No named BI tool, framework or other unconfirmed product in copy.
5. Never a thin page or a renamed copy: a floor not below the technology floor (900 words), a distinct brief, and the similarity validators.
6. Each Solution page must not restate its closest Work Area: it describes the project or function (the transformation, the migration, the integration, the reporting need, the support function), and links to the Work Area for the system.
7. Unbuilt references render as plain text. No dashes, no emojis.

The current content strategy is sufficient; no new strategy is needed.

## 11. Visual / UX Audit

| Area | State | Evidence |
|---|---|---|
| Typography | Body 17 px confirmed on a rendered page; tokens documented; tests enforce sizes and touch targets | Measured |
| Responsive | 12 widths (320 to 2560) on all 85 pages (1,020 tests) and an alignment suite (1,109 tests) | Measured |
| Accessibility | axe (WCAG 2.2 AA) on all 85 pages at 390 and 1440 px, plus open menus and form error states | Measured |
| Motion | Reduced-motion behavior tested (motion-photos suite) | Measured |
| Diagrams | Grid-based HTML with real type; a text-overlap sweep at 320, 768 and 1440 px found no overlap or clipping on 85 pages (doc 12) | Documented |
| Images | 7 image assets, 3 MB in `public` | Measured |
| Performance | Python page: 27 KB compressed HTML, 147 KB JavaScript, 12 requests, 856 ms load locally, layout shift 0. Largest contentful paint **not captured** (the browser pane did not report it); no Lighthouse run or performance budget exists in CI | Measured, Not measured |

Known issues and their classification (the audit did not reproduce the owner's visual observations, because automated alignment and overlap checks pass; the owner's eye is the evidence and it has not been repeated since the last review):

| Issue | Classification | Reason |
|---|---|---|
| Diagram positioning and alignment | **Important, non-blocking** | Automated checks pass; owner reported earlier cases; recheck at the Solutions hub build and in R1 |
| Occasional diagram text overlap | **Important, non-blocking** | The overlap sweep found none at three widths; confirm at 2560 and with the new diagrams |
| Pages feeling repetitive (hero, definition, callout, related, CTA rhythm) | **Later refinement (R1)** | Block sequences differ; the repetition is visual rhythm and voice |
| Content feeling instructional | **Later refinement (R1)** | See section 10 |
| Pages needing richer visual treatment | **Later refinement** | Imagery is a quality pass, not a release gate |
| Performance budget missing | **Important before launch** | Add a Lighthouse or equivalent check once the Netlify preview exists |

No known visual issue is a release blocker for Phase 4. Two items need an owner look when the first Solution page and hub exist.

## 12. Performance / Accessibility / Testing Audit

| Gate | Result |
|---|---|
| Typecheck, lint, format check | Pass |
| Content and entity validation | Pass: 85 pages, 804 entities, 901 relations, 0 errors, 0 warnings |
| Unit tests | 150 pass |
| Production build | Pass |
| Dependency audit | 0 vulnerabilities in production dependencies; patch and minor updates available (Next 16.4.0, React 19.3.0), TypeScript 7 and ESLint 10 are majors; Dependabot is configured |
| Browser tests | 2,461 in 8 files. Responsive 1,020 and layout alignment 1,109 are 86.5 percent of the total. They grow by about 25 tests per new page |
| Accessibility | axe on all pages at two widths; open menus; form errors |
| CI | One job, 90 minute limit, 2 workers. Completed runs took 25.1 minutes (`0957aac`) and 33.5 minutes (`66972b0`); the earlier Phase 3 run was cancelled at the old 30 minute limit; local runs take about 55 minutes with 4 workers (owner figure; not re-measured) |
| CI reliability | `cancel-in-progress` applies to `main`, so a second push cancels the first run. `357dadf` and `ff20a47` on `main` have no completed run |
| Lighthouse and performance | Not run; no budget |

**Assessment of the test duration.** The 25 to 55 minute range is acceptable temporarily and is technical debt, not a blocker. Ten more pages add about 250 tests (about 10 percent). The risk is not the number but that the whole suite is one serial CI job and that `main` runs get cancelled.

**Proposed test architecture** (no coverage is reduced; every test still runs at every width):

| Tier | Contents | When | Expected wall time |
|---|---|---|---|
| 0 Static | typecheck, lint, format, unit (150), validate, build, audit | Every push | A few minutes |
| 1 Smoke | pages, navigation, contact, accessibility and security, the phase specs, motion (about 330 tests) | Every push | Under 10 minutes |
| 2 Matrix | responsive (1,020) and layout alignment (1,109), run as four parallel shards (`--shard=i/4`) | Every push to a branch and every merge to `main`; never cancelled on `main` | About 8 to 12 minutes per shard |
| Local | `e2e:smoke` for the work loop; the matrix runs in CI | Developer choice | Minutes |

Also change the CI concurrency so a run on `main` is never cancelled by the next push. These changes belong at the start of Phase 4 preparation (B8).

## 13. International / Industry / Location Audit

| Area | State | Ready for later? |
|---|---|---|
| 15 country targets | Fifteen `country` entities in three waves (5, 6, 4), `presence: none` enforced by the schema | Entities yes. DEC-35 (approve or reorder the pool and waves) is still open |
| Global positioning, no fake offices | Company statement and facts enforce it; no address, geo or `LocalBusiness` anywhere | Yes |
| Country page architecture | Blueprint, URLs `/locations/{slug}/`, schema (`WebPage` + `Service` with `areaServed`), similarity risk and mitigations in doc 05 | The design is ready; the page kind, content and market research are not. DEC-38 (who verifies regulatory statements) is open |
| Country x service, service x industry | Defined as CREATE LATER intersections with distinct-substance requirements | Not started; correctly deferred |
| International SEO and `hreflang` | Locale-ready architecture (single locale, no `hreflang` emitted); English country pages are not duplicates of one another | Ready to extend; OG locale and `inLanguage` must become per-document when a localized page exists |
| Industry architecture | 37 entities, 8 candidate first-wave industries (an ASSUMPTION in plan section 8), pages need industry-specific substance and regulatory accuracy | **Not ready**: Industries have no relations to Work Areas or Solutions, no approved Solution to Industry mapping, no reviewer for regulatory statements (DEC-38), and no Work Entries |
| Canonical handling | One canonical per page from `SITE_ORIGIN` | Ready |

Finding: Industries and Country Wave 1 are **not ready to be built** and should each go through a qualification gate of the same kind as the technology and Solutions gates, before any page is written. That gate for industries should be sequenced after the Solutions pages exist, because Solution to Industry relationships are the evidence it needs.

## 14. 53-Article Architecture Audit

| Check | Finding |
|---|---|
| Coverage by service | Software 8, Web 2, Mobile 1, AI 9, Automation 8, API 4, Cloud 3, Cybersecurity 3, Data 1, Ecommerce 2, UI/UX 2, Branding 1, SEO 5, Digital Marketing 1, Consulting 3. All 15 services covered; Data and Analytics, Mobile, Branding and Digital Marketing have one article each |
| Relationship to the six Solutions | Each has a matching brief: Business Process Automation (#20, #21), Legacy Modernization (#3), Cloud Migration (#32), CRM Integration (#30), Business Dashboards (#37), AI Customer Support (#15). The architecture and the article plan agree |
| Relationship to Work Areas and deferred Solutions | #9 internal software, #27 spreadsheets, #10 agents, #25 and #26 workflows, #28 integration, #50 transformation map to represented concepts; #31 payments, #4 SaaS, #11 and #45 knowledge map to deferred ones |
| Technologies | #12 (OpenAI, Claude, Gemini or open models) supports the open-model candidate; #22, #23, #33, #38 support existing pages |
| Industries | Only three industry-oriented briefs (#48, #49, #53) |
| Search intent | Types D, G, C, X, I give informational versus decision intent; commercial intent is carried by the canonical home link, not recorded per brief |
| Duplication risk | Pairs to watch: #20 and #21 (differentiated explicitly), #1 and #2 and #52, #43 and #44 and #45, #12 and #18, #15 and #10. Differentiated by type and question; keep as is |
| Data quality | `relatedEntities` is free text, so a brief cannot yet be validated against the graph; batches 1 to 6 are 9, 9, 9, 9, 9, 8 |
| Phasing | **Contradictory**: the master plan puts Batch 1 in Phase 3 and Batches 2 and 3 in Phase 4; the owner moved articles and resources to a later phase on 6 October; Phase 3 has ended without Batch 1 |
| Prerequisites | Named authors and reviewers (DEC-22) not supplied; no article page kind; no `Article` schema |

The plan is sound and should not be reduced. It is **ready for later implementation after one short planning pass** (not a rewrite): convert `relatedEntities` into entity IDs, add a per-brief intent label, resolve the phasing statement, and settle authors. Articles are not part of Phase 4.

## 15. Security / Technical Governance Audit

| Area | Finding |
|---|---|
| Environment and secrets | One origin variable, an indexing switch, and contact delivery settings. `.env.example` has no values; nothing secret is in the repository (Documented, spot-checked) |
| API surface | One route, `/api/contact` (POST only; other methods return 405) |
| Form handling | JSON content type required, same-origin check, body size cap, honeypot, minimum fill time, server-side validation, no-store responses, per-client rate limit |
| Rate limit | In-memory, per instance. On a serverless host each instance has its own memory, so it only slows naive abuse. A platform-level limit is needed at launch |
| Delivery | `none`, `log`, `webhook` or `resend`; no inbox invented; destination (DEC-18) not configured |
| Headers and CSP | Full header set on every page. CSP keeps `'unsafe-inline'` for scripts and styles because static Next.js pages need it; everything else is locked down (documented trade-off) |
| Dependencies | 0 production vulnerabilities; Dependabot weekly; patch and minor updates pending |
| External services | None at runtime (no analytics, fonts and images are local) |
| Static and dynamic boundaries | All pages are static; the only dynamic routes are the contact API and generated metadata files |
| Deployment configuration | `netlify.toml` and `scripts/netlify-build.mjs` set the build; `SITE_ORIGIN` falls back to the Netlify deploy URL; indexing off unless set |
| Git governance | Private repository, remote verified, identity verified, no force pushes. Branch protection is not available on the plan, so `main` is protected only by practice. CLAUDE.md says "CI green, then merge to `main`"; the last two documentation merges landed before CI completed (see B1) |
| Production indexing controls | Verified: robots disallow all and every page `noindex` unless `SITE_INDEXING=true` |

No security blocker for Phase 4. Launch dependencies (not Phase 4): Netlify authorization, domain, contact destination, a platform rate limit, analytics and consent decision (DEC-17), crawler policy (DEC-19).

## 16. Completeness and Deferred Work

Page count is not the measure. Items are classified once.

| Class | Item | State |
|---|---|---|
| **A. Missing page** | Six Solution pages; Node.js, .NET, Power Automate and WooCommerce pages; MEDIUM technology pages | Pending implementation (Phase 4) or deferred (MEDIUM) |
| A. Missing page | Industries hub and pages; Locations hub and country pages; Resources hub and 53 articles | Intentionally deferred behind gates |
| **B. Missing entity** | The open-model group; any new Solution | Pending owner decision. No new Solution is proposed |
| B. Missing entity | None other found | |
| **C. Missing relationship** | Page to Solution relation vocabulary; next-wave candidates to Work Areas; API Integrations Work Area to its published integration pages; industries to services, Work Areas and Solutions; 8 Solutions without a problem edge (documented as gaps, not to be filled by invention) | Pending (first three), deferred (industry), recorded gap (the 8) |
| **D. Missing content** | Phase 1 and 2 voice refinement; FAQ on 17 Work Areas; article text; Work Entries (no real project facts supplied) | Refinement pass R1; articles later; Work Entries wait for facts |
| **E. Missing navigation** | A Solutions menu; Industries and Resources links | Solutions menu in Phase 4; the rest follow their pages |
| **F. Missing technical capability** | `solution` page kind and validators; `industry`, `location` and `article` page kinds; CI sharding; performance budget; `Article` and `Person` schema; analytics (DEC-17) | Solution kind in Phase 4; sharding in Phase 4 preparation; the rest later |
| **G. Intentionally deferred** | The five deferred Solutions; Customer Experience Systems; Solution to Industry mapping; open-model group; nine confirmation-required technologies; 21 later technologies; country waves; Phase 6 localization; `llms.txt` (not a dependency) | By decision |
| Pending factual confirmation | The nine technologies; frameworks named inside language pages; hosting options for open models; industry lists per Solution; DEC-22 authors; DEC-38 reviewer; DEC-35 country pool | Owner |
| Unnecessary | No page or entity is unnecessary. 16 Solutions will not receive pages by decision | |

## 17. Phase 4 Readiness Decision

**Formal status: B. READY WITH PRECONDITIONS**, for the narrowed Phase 4 defined in section 18.

| Scope | Status | Why |
|---|---|---|
| Solutions layer (six pages, hub correction, rails, navigation) | **READY WITH PRECONDITIONS** | Entity graph, problem edges, article support and technology dependencies exist; the page kind, rule amendments and reference handling must be added |
| Companion technology batch (four HIGH pages) | **READY** after data work | Approved candidates, qualified; relations still to be added as part of each build |
| Industries | **NOT READY** | No approved industry relationships, no regulatory reviewer, no Work Entries; needs a qualification gate |
| Country Wave 1 | **NOT READY** | DEC-35 and DEC-38 open; no market research; no page kind |
| Article Batches 2 and 3 (and Batch 1) | **NOT READY** | Authors, entity-linked briefs, page kind and phasing unresolved |
| Work Entries | **NOT READY** | No project facts supplied |

The master plan's Phase 4 row ("Industries; solutions; qualified intersections; country Wave 1; article Batches 2 to 3; Work Entries") should therefore be re-scoped by the owner. Each excluded item gets its own gate rather than being carried inside an oversized phase.

## 18. Proposed Phase 4 Scope

**Objective.** Make the Solutions axis real: publish the six approved Solution pages and a corrected hub, connected to the Services, Work Areas and Technologies that already exist, so that a visitor can start from a business problem and reach the right system, service and technology, without changing the 85 existing pages' content.

**Structure.**

| Stage | Contents | Output |
|---|---|---|
| 4.0 Preparation (no public change) | Fix CI on `main` and shard the matrix suites (B1, B8); amend the link-slot rule (B3); decide the reference rule for non-page Solutions (B4); settle the page-to-Solution relation (B6); apply the 15 pending Solution policies (doc 14 section 10.2); add the missing relations in section 7; add the `solution` page kind, schema, structured data and validators (similarity, required blocks, floor, slot rules) (B5) | Documentation, data, validators, tests; no new route |
| 4A Companion technology batch (optional, owner decides) | Node.js, .NET, Power Automate, WooCommerce at `/software-development/nodejs/`, `/software-development/dotnet/`, `/automation/microsoft-power-automate/`, `/ecommerce/woocommerce/` | 4 pages (85 to 89); menu placement in Languages and Backend, Automation and Business Platforms, and Commerce and Payments |
| 4B Solutions | Six Solution pages at `/solutions/{slug}/`; the corrected `/solutions/` hub; a Solutions menu if approved; rails and search index updates | 6 pages (89 to 95), one hub revised |

**Exact page candidates.**

| Page | Canonical slug | Closest Work Area | Technologies it links |
|---|---|---|---|
| Business Process Automation | `/solutions/business-process-automation/` | Workflow Automation, Automation Systems | Zapier, Make, n8n, Airtable, Power Automate (4A), Python |
| Legacy System Modernization | `/solutions/legacy-system-modernization/` | Custom Software Systems | Java, PHP, Python, .NET (4A), Docker, AWS |
| Cloud Migration | `/solutions/cloud-migration/` | Cloud Platforms | AWS, Azure, Google Cloud, Docker, Kubernetes, Terraform |
| CRM Integration | `/solutions/crm-integration/` | Integration Platforms | HubSpot, Salesforce, Zapier, Make, Stripe |
| Business Dashboards | `/solutions/business-dashboards/` | Data and Analytics Systems | PostgreSQL, Python, React; no named BI product until confirmed |
| AI Customer Support | `/solutions/ai-customer-support/` | AI Solutions | OpenAI, Claude, Gemini, LangChain |

**Dependencies.** Preparation before either stage. Solution pages link to existing technology pages; links to the 4A pages become live when those exist and are plain text before then. The hub is built last in 4B.

**Required data.** The 15 pending Solution policies; the `solves` edges already recorded (14 Solutions connected); a precise page-to-Solution relation; service, Work Area and technology edges for each of the six (present: 1 to 3 Work Areas and 1 to 3 services each, and 1 to 7 technologies; AI Customer Support has 1, CRM Integration 2 and Business Dashboards 2, so technology relations must be added where they are real, never padded); for 4A, each page's service, Work Area, solution and industry relations; no Solution to Industry edges.

**Required content rules.** Section 10, items 1 to 7.

**Required visual patterns.** Existing hero, definition, columns, table, chooser, process, diagram, FAQ, related and CTA blocks; one self-explanatory diagram per page (ADR 0004); the hub reuses the pathfinder and rail patterns. No new component family is needed beyond what a `solution` kind requires.

**Required SEO and schema work.** `WebPage` + `Service` where the page describes a service (plan), `BreadcrumbList` (Home, Solutions, the page), `FAQPage` where an FAQ exists, unique title, description and primary intent per page, canonical, sitemap and search-index entries (automatic from the page record), internal links from the hub, the closest Work Area, the services and the technologies.

**Validation requirements.** Typecheck, lint, format, content validation, unit tests, production build, the full browser suite in CI (sharded), axe on the new pages at two widths, the twelve-width responsive checks and alignment checks on every new page and the hub, a text-overlap check on every new diagram, and a manual look at the hub and one Solution page at phone, tablet and desktop widths.

**Acceptance criteria.**

1. The six Solution pages are published, each problem-first, at or above the floor, passing the similarity and clarity validators, and each connected to at least one service, one Work Area and the technologies that are real for it (a target of three, never padded).
2. `/solutions/` matches section 5: it presents the six, routes the represented needs to Work Areas, and names no deferred, merged or graph-only Solution.
3. No published page links to, or names as a destination, a Solution that has no page, other than through the rule decided in B4.
4. Validation shows 0 errors and 0 warnings; no orphan; no duplicate intent; the technology page count is 32 or 36 as decided, and all tests reflect it.
5. Main CI is green on the final commit with no cancelled run.
6. No client, project, metric or capability claim beyond approved facts; no named unconfirmed product.
7. The owner reviews the hub and one Solution page at three widths and approves before the remaining pages ship.

**Explicit exclusions.** Industries pages and hub; Locations hub and country pages; Resources hub and any article; Work Entries; the seven MEDIUM technology pages; the open-model group and entity; the five deferred Solutions and Customer Experience Systems; any new Solution; Solution to Industry edges; the nine confirmation-required technologies; any change to the 25 Work Areas, the services or Phase 1 and 2 copy; the content refinement pass R1; analytics; localization.

## 19. Preconditions / Acceptance Criteria

| ID | Issue | Why it matters | Exact action | Before Phase 4? | During Phase 4? | Later? |
|---|---|---|---|---|---|---|
| B1 | `main` has two commits (`357dadf`, `ff20a47`) with no completed CI run; the current head `66972b0` is green (33.5 minutes) but CI cancels earlier runs on `main` when a newer push arrives | A pushed state has not been validated by the full gate, against CLAUDE.md's "CI green" rule | Set `cancel-in-progress` to false for `main` and confirm the next head is green (the current head is already green) | **Yes** | | |
| B2 | The master plan's Phase 4 row is larger than the readiness supports | Building Industries, countries and articles without gates would repeat the entity-to-page error the owner has been preventing | Owner approves the scope in section 18 and records the re-scope of the plan's Phase 4 row (an amendment note, as for AMD-19) | **Yes** | | |
| B3 | The plan says each service links 3 to 6 Solutions and each Work Area 2; 6 services and 7 Work Areas have none; the validator does not enforce it | The rule contradicts the architecture and would force invented links | Amend the rule to "a Solution or the Work Area or service that answers the need", and decide whether to enforce it | **Yes** (document change) | | |
| B4 | 87 of 130 Solution references on published pages point at 16 Solutions that will never be pages | They would stay inert text permanently | Decide one rule: represented concepts link to their Work Area; deferred and graph-only ones are removed from rails or stay as plain text; record it in the entity data, not in page copy | No, but before the first Solution page publishes | **Yes** | |
| B5 | No `solution` page kind, schema, validators or structured-data case | Pages cannot be built or validated | Add the kind, required blocks, floor, similarity configuration, `Service` schema case and tests | | **Yes** (first task of 4B) | |
| B6 | `offersSolution` is used from technologies and Work Areas (105 of 133 edges) | Conflates axes; will confuse Solution page rails | Add a precise relation or document `offersSolution` as undirected "page lists Solution"; migrate by regenerating derived relations | Preferable | **Yes** (4.0) | |
| B7 | Next-wave technologies lack Work Area edges; .NET and Supabase lack any | The technology page tests require them | Add relations as part of each page build | | **Yes** (4A) | |
| B8 | Browser suite is one serial job, 25 to 55 minutes, growing about 10 percent in Phase 4 | Slows every change; one cancelled run hides failures | Adopt the tiered, sharded architecture in section 12 without removing tests | Preferable | **Yes** (4.0) | |
| B9 | 15 Solution `pagePolicy` changes are pending | Data would still say CREATE LATER for concepts that will not be pages | Apply doc 14 section 10.2 once the owner authorizes | | **Yes** (4.0) | |
| B10 | Nine technologies await factual confirmation | Naming them would be a capability claim | None for Phase 4; do not name them. Owner confirms when ready | | | **Later** |
| B11 | Industries, Country Wave 1 and articles lack gates | Not ready (section 17) | Run a qualification gate for each before scheduling | | | **Later** (separate gates) |
| B12 | Phase 1 and 2 voice and diagram refinement | Visible inconsistency with newer pages | Owner schedules R1 | | | **Later**, before launch |
| B13 | Launch dependencies: domain, Netlify, contact destination, platform rate limit, `sameAs` profiles, performance budget | Needed to index and operate the site | Owner decisions DEC-02, DEC-26, DEC-18 and the others | | | **Later**, before launch |
| B14 | Article phasing is contradictory across documents | Plans disagree | Settle during the article planning pass | | | **Later** |

**Blockers versus preconditions.** B1, B2 and B3 must be done before Phase 4 starts; they are small (a workflow setting, an approval, an amendment note). B4 to B9 are part of Phase 4 itself. B10 to B14 are not Phase 4 work.

## 20. Open Decisions

| # | Decision | Recommendation |
|---|---|---|
| D1 | Approve the narrowed Phase 4 in section 18, and whether 4A (four HIGH technology pages) is included | Approve. Include 4A before 4B; WooCommerce may move to a later wave without affecting 4B, since the six Solutions do not depend on it |
| D2 | Solutions navigation: keep a plain link, or add a link plus chevron menu listing the six | Add the menu in 4B, data-driven like the others, so the six are visible from every page |
| D3 | The rule for the 16 Solutions without pages (B4) | Represented concepts link to their Work Area; the rest are not shown on rails until a page exists |
| D4 | The page-to-Solution relation (B6) | Add a precise relation and migrate; keep `offersSolution` for service to Solution only |
| D5 | Amend the link-slot rule (B3) | Yes, as stated in B3 |
| D6 | Is C# `partOf` .NET, or only related to it? | Related, not `partOf` (a language is not a part of a runtime); group it in copy and keep it as an entity |
| D7 | The open-model group | Decide when the MEDIUM wave is scheduled |
| D8 | Confirm the nine technologies | When the owner is ready; not needed for Phase 4 |
| D9 | Article phasing, authors (DEC-22), and the entity-linking pass | After Phase 4; one short planning pass |
| D10 | Start the industry qualification gate | After the Solutions pages exist; it needs Solution to Industry evidence and a reviewer (DEC-38) |
| D11 | Country pool and waves (DEC-35) and the regulatory reviewer (DEC-38) | Needed before a country gate |
| D12 | Schedule the content refinement pass R1 | After Phase 4B, before launch |
| D13 | Launch dependencies (domain, Netlify, contact destination, analytics, crawler policy, `sameAs`) | Needed before indexing; independent of Phase 4 |
