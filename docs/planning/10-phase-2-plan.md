# Phase 2 execution plan

Status: APPROVED AND IMPLEMENTED by owner authorization on 5 October 2026 (see 11-phase-2-implementation-notes.md for what was built and any deviations from this plan).

Sources: the approved master plan (sections 4 to 9, 13, 14, 20, 21, 27, 33, 36 and Appendices C to E), the decisions register, ADR 0001 to 0004, the Work, country and article architectures, `AGENTS.md`, the Content Master, and everything built and verified in Phase 1. Where this plan departs from the approved phase table, it says so and asks (section 16).

## 1. Phase 2 objective

Turn the accepted Phase 1 foundation into the full core of the DECHY website, so that a visitor with any of DECHY's fifteen kinds of problem can find their way to a clear, honest explanation and a next step, and so that the site is a production launch candidate.

Approved canonical scope (master plan section 36): the remaining 14 service pillars, Company, the Work hub with Work Areas (about 20 to 25), the full legal set, and a production launch candidate. This plan adds, for owner decision, three guided hubs that the approved URL rules already define as real pages (`/services/`, `/solutions/`, `/technologies/`), and a first step that brings the three Phase 1 pages up to the new clarity standard (ADR 0004).

Success means: every page passes the visitor test in `docs/design/clarity-and-comprehension-standard.md`, the layout and image rules in `docs/design/layout-and-visual-quality-rules.md`, and every automated gate; every approved capability remains in the entity graph and is reachable from at least one page; no page exists only to raise the URL count.

## 2. Scope control: nothing approved is reduced

- All 760 entities stay in the graph (15 services, 15 countries, 316 capabilities, 286 technologies, 37 industries, 30 problems, 22 solutions, 24 concepts, 15 business types). Deferring a page is not removing a capability: an entity becomes a page only when it has its own search intent and unique content (master plan section 15).
- Every approved technology, platform, language and integration is named on at least one Phase 2 page (inside its canonical service pillar, a Work Area, or the Technologies directory). A new validator rule fails the build if an approved technology is unreachable. Names without a page render as plain text (Phase 1 rule), and become links automatically when their page ships.
- No mass generation. Each page has a declared visitor purpose, a content brief, unique content, a specific visual treatment, typed relationships, and a recorded comprehension check.

## 3. Page groups and exact routes

New indexable pages: 48. With the five existing pages the sitemap holds 53.

### Group A. Phase 1 pages brought to the new standard (existing routes, no new URLs)

`/`, `/software-development/`, `/contact/`. Also `/privacy/` and `/cookies/` receive the plain-language pass only.

### Group B. The 14 remaining service pillars

| Route | Service | Primary visitor intent (plain words) |
|---|---|---|
| `/ai/` | AI & Machine Learning | Use AI in my business without hype |
| `/automation/` | Automation, Workflows & AI Solutions | Stop doing repetitive work by hand |
| `/api-integration/` | API & Systems Integration | Make my systems share information |
| `/data-analytics/` | Data & Analytics | Trust and use my data |
| `/cloud/` | Cloud & DevOps | Move to or run in the cloud reliably |
| `/cybersecurity/` | Cybersecurity | Protect my systems and data |
| `/web-development/` | Web Development | Build or rebuild a website or web app |
| `/mobile-app-development/` | Mobile App Development | Build a mobile app |
| `/ecommerce/` | Ecommerce Solutions | Sell online |
| `/ui-ux/` | UI/UX & Product Design | Make my product easy to use |
| `/branding/` | Branding & Creative | Build or refresh my brand |
| `/seo-aeo-geo/` | SEO, AEO & GEO | Be found, including in AI answers |
| `/digital-marketing/` | Digital Marketing | Turn attention into customers |
| `/consulting/` | Consulting & Digital Transformation | Decide what technology approach to take |

### Group C. Guided hubs (owner decision D1; recommended)

| Route | What it is |
|---|---|
| `/services/` | "Find your service": a guided chooser from the visitor's goal to the right pillar, plus all 15 in the five families |
| `/solutions/` | "Start from your problem": the first-wave situations (12) each pointing to the best service and Work Area now; links to individual solution pages in Phase 4 |
| `/technologies/` | "What we work with, in plain English": the full approved technology architecture grouped by purpose, each group explained, every name present |

### Group D. Work

| Route | Page |
|---|---|
| `/work/` | Work hub (filter by discipline, service, technology; filtered views are noindex) |
| `/work/areas/{slug}/` | 25 Work Areas (list below) |

Work Areas (default list, owner may reprioritize: DEC-39). Each is a page about a kind of system DECHY builds, in system terms; the roughly 20 other areas in the Work architecture become sections inside these.

| Discipline | Slug | Absorbs these Work Architecture areas |
|---|---|---|
| Software | `custom-business-applications` | CRM, ERP, inventory and management systems; booking and scheduling; membership and subscription platforms |
| Software | `saas-platforms` | |
| Software | `customer-and-employee-portals` | |
| Software | `marketplaces` | |
| Web | `websites-and-cms-builds` | Corporate and content websites; headless and CMS builds |
| Web | `web-applications` | Progressive web apps |
| Mobile | `mobile-apps` | iOS and Android; cross-platform |
| AI | `ai-assistants-and-copilots` | |
| AI | `knowledge-and-document-systems` | RAG knowledge systems; document intelligence |
| AI | `ai-agents` | |
| AI | `vision-speech-and-predictive-ai` | Computer vision and speech; recommendation and predictive systems |
| Automation | `business-process-automation` | CRM and sales, customer support, finance and HR automation |
| Automation | `airtable-business-systems` | |
| Cloud | `cloud-migrations-and-architectures` | |
| Cloud | `devops-and-delivery-platforms` | CI/CD |
| Security | `security-assessments-and-secure-builds` | |
| Data | `analytics-and-dashboards` | BI dashboards |
| Data | `data-pipelines-and-warehouses` | |
| Integration | `api-and-systems-integration` | Payment integration |
| Ecommerce | `ecommerce-stores-and-platforms` | Shopify and WooCommerce; custom and subscription commerce; ecommerce integrations |
| Design | `product-ux-and-design-systems` | Design systems |
| Brand | `brand-identity-systems` | |
| Growth | `seo-aeo-geo-programs` | |
| Growth | `marketing-automation-and-lead-generation` | |
| Transformation | `technology-audits-and-roadmaps` | Digital transformation roadmaps |

Work Areas describe what DECHY builds and how such a system is put together. Any scenario is labeled "illustrative scenario". No client, metric, testimonial or project is invented; Work Entries (`/work/{slug}/`) wait for facts the owner supplies.

### Group E. Company

| Route | Page |
|---|---|
| `/company/` | About DECHY: what it is, how its work fits together, how it serves clients worldwide (approved facts only) |
| `/company/how-we-work/` | The working process, communication, remote delivery, what a client can expect |
| `/company/who-we-work-with/` | The 15 business types, what each typically needs, where to start |

People pages (`/company/team/{slug}/`) need real, consented profiles (DEC-22) and are not built.

### Group F. Legal ("full legal set", interpreted)

`/privacy/` and `/cookies/` exist. New: `/terms/` (website terms of use) and `/accessibility/` (accessibility statement, including how to report a barrier). A responsible-disclosure page waits for a real security contact (DEC-05). All legal text needs review by a qualified person before launch.

## 4. Recommended build order, with review gates

Each step ends with automated gates and an owner review before the next family starts. The order puts the pages that most distinguish DECHY first and proves the clarity standard on one pilot before scaling.

| Step | Work | Gate |
|---|---|---|
| 0 | Foundations: new content fields and validators, glossary with plain definitions, new components (section 12), generic teaching diagrams; retrofit Home, Software Development and Contact to the clarity standard | Owner reviews the retrofitted Software Development page |
| 1 | Pilot: `/ai/` | Owner review of the pilot before any scaling |
| 2 | Intelligence and automation: `/automation/`, `/api-integration/`, `/data-analytics/`; then `/services/` hub | Family review |
| 3 | Infrastructure and security: `/cloud/`, `/cybersecurity/` | Family review |
| 4 | Build: `/web-development/`, `/mobile-app-development/`, `/ecommerce/` | Family review |
| 5 | Design, growth, advisory: `/ui-ux/`, `/branding/`, `/seo-aeo-geo/`, `/digital-marketing/`, `/consulting/` | Family review |
| 6 | `/solutions/` finder and `/technologies/` directory | Review |
| 7 | `/work/` hub and Work Areas in three batches (software, web, mobile: 7; AI, automation, integration, data: 9; cloud, security, ecommerce, design, brand, growth, consulting: 9), each batch after its pillars exist | Batch review each |
| 8 | Company (3 pages), `/terms/`, `/accessibility/`, Home pathway section | Review |
| 9 | Launch candidate: Netlify preview (needs authorization), full-site accessibility, performance, security and link sweep, indexing flags still off until the domain is decided | Owner go-ahead |

## 5. How the 14 service pages stay different from each other

The risk is fourteen copies of Software Development with the nouns changed. Controls:

1. **A content brief per page**, stored as data, declares: the visitor's real decision, the page's own spine (ordered blocks), its distinctive blocks and diagram, and its comprehension answers (what, problem, audience, choose, next). Source: the "emphasis and distinctive blocks" table in master plan section 6.
2. **Each page answers a different decision**, so the spine follows the visitor's question, not a template:

| Page | The decision it helps with | Distinctive teaching visual | Distinctive block |
|---|---|---|---|
| AI & ML | Which kind of AI help do I actually need, and is it safe to use? | "What kind of AI?" map in plain words; how an AI assistant answers from your own documents, step by step | Governance and evaluation; "when AI is the wrong tool" |
| Automation | What should I automate, and with which tool? | Anatomy of one automated workflow, before and after | Tool chooser (Zapier, Make, n8n, Power Automate, Airtable); "not every automation needs AI" |
| API & Integration | How do I stop re-typing the same data in several systems? | Before and after: copy and paste versus connected | Integration patterns explained with one picture each; error handling |
| Data & Analytics | How do I get numbers I can trust? | From scattered data to a trusted dashboard | Data quality ladder; spreadsheet versus warehouse |
| Cloud & DevOps | Should I move, modernize or rebuild, and how safely? | Three paths to the cloud; from change to release | Cost and reliability considerations |
| Cybersecurity | What am I protecting, from whom, and what first? | Layers of protection around what matters | Assessment deliverables; secure development |
| Web Development | Custom, CMS or headless? | Platform chooser | Performance and accessibility standards in plain numbers |
| Mobile App | Native or cross-platform? | Idea to app store to updates | Native versus cross-platform chooser |
| Ecommerce | Which platform fits my business? | How a store connects to payments, stock, shipping, accounting | Platform fit by business type; migration |
| UI/UX | How do I make it easy to use? | Research to design to hand-off | What you receive (deliverables) |
| Branding | How do I build a brand that works everywhere? | Strategy to identity to system | Deliverables set |
| SEO, AEO, GEO | How do people and AI assistants find and understand me? | Three layers: be found, be answered, be understood | Measurement; honest limits (no guaranteed citations) |
| Digital Marketing | How does attention become customers, measurably? | A visitor's path to becoming a customer | Channel map tied to measurement |
| Consulting | What technology approach should I take? | Engagement ladder: assess, plan, deliver | "Which kind of help do you need" chooser |

3. **Validators that fail the build**: ordered block sequences must differ (the distance between any two service pages must exceed a set threshold); text similarity between any two pages stays under a set threshold; each page must carry at least one diagram and one distinctive block that no other page uses; each page's diagram `takeaway` must be unique.
4. **A pilot first**: `/ai/` is built and reviewed before the other 13, so the owner judges non-template quality on a real page before it is repeated.

## 6. Solutions, Technologies, Industries, Work, Resources, Company, Locations, and individual pages

| Question | Phase 2 answer | Where the rest goes |
|---|---|---|
| Solutions pages | None. `/solutions/` is a guided finder (D1). The 22 solutions stay entities | Phase 4: individual `/solutions/{slug}/` pages, first wave of 12 |
| Technologies pages | `/technologies/` directory only (D1). Technologies are explained inside their pillar and Work Areas | Phase 3: dedicated technology and platform pages by search intent (the candidate list of 34 in master plan section 7) |
| Industries pages | None. Industries appear as plain text and as "where this applies" content on service pages | Phase 4: first wave of 8 industry pages; the 37 industry entities stay |
| Work | `/work/` and 25 Work Areas | Work Entries when the owner supplies project facts |
| Resources | None. `/resources/` stays plain text in navigation until articles exist | See section 7 |
| Company | 3 pages (Group E) | People pages when real profiles exist |
| Country and location pages | None | Phase 4 Wave 1 (US, UK, Canada, Australia, Ireland); Phase 5 Waves 2 and 3; hub `/locations/` ships with Wave 1. No cities, addresses or offices ever |
| Individual technology, sub-service, integration pages | None as pages. Included as named, explained content inside pillars, Work Areas and the directory | Phase 3 (technology, platform, AI, automation and integration pages by intent); service by industry and service by country intersections later still |

Navigation after Phase 2: Services, Solutions, Technologies, Work, Company are all live links; Industries and Resources stay plain text until their pages exist (Phase 4 and Phase 3). This follows the approved handling rule: no placeholder pages.

## 7. The 53 articles

Not published in Phase 2. The approved sequence puts Batch 1 (9 articles, including all six of the deepest "pillar" articles: #1, #10, #20, #28, #43, #50) in Phase 3, Batches 2 and 3 in Phase 4, Batches 4 to 6 in Phase 5. The 53 are distributed across later phases by design: each batch needs its parent pages to exist, its authors and reviewers named (DEC-22), and a quality review before the next. The approved text also allows Batch 1 to begin once its pillars exist; this plan keeps it in Phase 3 to protect the quality of Phase 2, and offers it as optional decision D4.

What Phase 2 does for the articles: store all 53 briefs as data (slug, canonical home, intent, outline, required figures, entities, link slots), and reserve their link slots on the pillar pages as plain text, so nothing needs rewriting later.

## 8. Entity graph and internal-linking expansion

- Relation types gain `hasWorkArea` and `explainedBy` (glossary). Pages declare edges; rendered link rails come from edges, never hand-placed links.
- Link slots per page kind, enforced by the validator (master plan section 21): service pillar: 2 to 4 related services, 3 to 6 technologies, 3 to 6 solutions, 2 or more Work Areas, 2 or more industries (plain text until Phase 4), resources (plain text until Phase 3); Work Area: its service, 3 to 6 technologies, 2 related Work Areas, 2 solutions; hubs: every child.
- Targets by end of Phase 2: relations grow from 88 to roughly 450 (about 12 per pillar, 8 per Work Area, plus hubs); every new page has at least 2 inbound links; zero orphans; zero broken links.
- Canonical homes are unchanged. Breadcrumbs follow them. A technology named on several pages always links to its single canonical home.
- Plain-text references convert to links automatically when the target page is published, with no content edit.
- New coverage rule: every approved technology must appear on at least one published page.

## 9. SEO, AEO and GEO on the new pages

- **SEO.** One primary intent per page, recorded in the brief, with the plain-language intent first and the search terms woven in naturally; unique title and description; descriptive headings; canonical URLs; sitemap from indexable pages; filtered Work hub views `noindex, follow`.
- **AEO.** An answer-first plain-English definition at the top (the "At a glance" block); real FAQs (3 to 6) written as plain answers, never padded; comparison tables and choosers where the visitor is choosing; step lists for processes.
- **GEO.** Explicit, consistent relationships: DECHY, service, technology, solution, problem, industry, business type, integration, use case. Original diagrams with text equivalents. Honest limits stated. No claim that any AI system will cite or recommend DECHY.
- **Structured data.** `Service` with provider and a worldwide area served, `FAQPage` only for visible FAQs, `BreadcrumbList`, `ItemList` on hubs, `WebPage` or `AboutPage`. No `LocalBusiness`, address, ratings, reviews or `sameAs` without supplied facts. `HowTo` is not used.
- **Clarity and SEO together.** Clarity never removes search language; it adds explanation next to it (ADR 0004).
- **Launch candidate.** Indexing stays off until the domain is decided (`SITE_INDEXING`); sitemap and robots are already conditional. `llms.txt` is optional (D6).

## 10. Content requirements

- Service pillars: about 2,200 to 3,200 words, Work Areas about 1,200 to 1,800, hubs about 1,200 to 2,000, Company about 900 to 1,500. Length is whatever the visitor needs; nothing padded, nothing cut for looks.
- Every commercial and Work page: an "At a glance" summary (what it is, who it is for, the problem it solves, what you get, next step) generated from the page's `comprehension` block; an answer-first lead; the problem before the solution; options with how to choose; how DECHY approaches it; the process; honest "when this is not the right answer"; real FAQs; related items; a clear next step.
- Voice: "we" as established, third person only where Phase 1 set it (statement, metadata, structured data).
- No fabricated clients, metrics, testimonials, awards, people, offices or projects. Illustrative examples are labeled.

## 11. Clarity and comprehension requirements (permanent, ADR 0004)

Applied to every page (full text in `docs/design/clarity-and-comprehension-standard.md`):

- The page answers what, why, who, what DECHY does, how it works, the options, the process, and the next step.
- Plain language; technical terms explained on first use; four levels of depth, with level 4 in expandable "Technical detail" panels that remain in the page for crawlers and assistive technology.
- A problem to understanding to options to solution to next step spine; a visitor can recognize their own situation in the ten pathways (custom software, mobile app, automate a workflow, AI in the business, connect systems, cloud or modernization, security, online store, search and AI visibility, help deciding).
- Enforcement: `comprehension` block, glossary and readability lint, required next step, and the five-question page test recorded per page.
- **Retrofit (Step 0).** The Phase 1 pages are not exempt. Several labels and terms assume specialist knowledge: for example "Integration" bus, "Background jobs", "Identity and access", "Shared APIs, data, and authentication", "strangler pattern", and unexplained CRM, ERP, SaaS, "data model" and OWASP. Each gets a plain explanation, and each Phase 1 diagram gets a stated purpose, takeaway and a plainer caption.

## 12. Reusable components

Reused from Phase 1 without change: `Section` and `SectionHeader`, `Hero` (service variant), the block renderer and block types (definition, prose, index, service index, entities, process, table, diagram, columns, FAQ, related, CTA, legal, contact form), `Figure` and the diagram system (`DiagramRoot`, container queries, tokens), `Photo`, `Arrow`, `LinkButton`, header and footer, breadcrumbs, `MotionProvider` and the motion tokens, the JSON-LD graph builder, the validator, and the entire test suite.

New in Phase 2:

| Component | Purpose |
|---|---|
| `AtAGlance` | The five-line summary at the top of commercial and Work pages |
| `Term` | Plain-language explanation of a term, available on tap, focus and hover, with the explanation also readable in context |
| `DeeperDetails` | Expandable technical detail (level 4), content always in the DOM |
| `Chooser` | A guided decision (tabs or segmented choices): which approach fits me; all options visible without JavaScript |
| `ComparisonMatrix` | Responsive comparison table that becomes stacked cards on narrow screens |
| `PathFinder` | "I need..." pathways to services; used on Home, `/services/` and `/solutions/` |
| Generic teaching diagrams | `FlowDiagram` (ordered steps), `LayerStack`, `BeforeAfter`, `HubAndSpoke`, `Funnel`, `DecisionDiagram`; each built on the container system with purpose, takeaway and caption props |
| `SectionNav` | In-page "On this page" contents for long pages |
| `Callout` | "When this is not the right answer" and "Honest limits" notes |
| `TechnologyDirectory` | Grouped, expandable, complete list of the technology architecture |
| `WorkAreaPage` blocks | Architecture figure, typical components, decisions, illustrative scenario |
| `RelatedRail` (edge-driven) | Typed relationships rendered as links or plain text |

## 13. Data and entity requirements

- `Page` schema: `kind` gains `hub`, `company`, `work-area`, `work-hub`; new `comprehension` block (what, problem, audience, choose, next); `visitorIntent`; `distinctive` block list; `reviewedAgainstTest` record.
- Diagram block: `purpose`, `takeaway`, `audience`.
- New block types for the components above.
- `data/taxonomy/concepts.yaml` gains a `plain` definition and a "level" for each glossary term; the glossary grows from 24 concepts to the terms the pages need.
- `data/work/areas/*.yaml` (25 files): discipline, services, technologies, typical components, decisions, illustrative scenarios, diagram ids, `entries` (empty until Work Entries exist).
- `data/briefs/services/*.yaml` (14) and `data/briefs/articles/*.yaml` (53, stored only).
- `data/relations/`: edges for every new page; new relation types noted in section 8.
- Facts register: unchanged unless the owner supplies facts (DEC-05).
- Asset registry: new photographs and diagrams recorded under the ADR 0003 gate.

## 14. Visual strategy for the new pages

- **Diagrams carry the explanation.** Every pillar and Work Area has at least one original diagram that teaches one thing (section 11 of the clarity standard). Roughly 14 pillar diagrams plus 25 Work Area diagrams plus the hub visuals, built from the generic components, not drawn one by one.
- **Photography is selective.** Zero to two per page where a real working context or device helps; none on pages where a diagram or typography does the job. Same gate as ADR 0003 (at least 2400 px, inspected at 100 percent and at rendered size on 1x and 2x, no credits visible, no demographic selection, no clichés). Company pages use no staff photography because none exists; they use typography and process diagrams.
- **Interface visuals.** Authentic interface imagery where it teaches: real devices and real interfaces in photographs, original labeled wireframes, and, if the owner approves DEC-21, DECHY-built reference implementations whose screenshots are genuinely DECHY's.
- **Technical illustrations** are original and labeled conceptual or illustrative.
- **Motion** reuses the established system: reveal, hover and focus feedback, diagram step sequencing, disclosure transitions; chooser and disclosure components follow the same tokens. Nothing new moves without a reason; reduced motion removes it.
- **Hover and touch.** Hover adds nothing that touch and keyboard users cannot reach.
- **Responsive.** Container-based diagrams and the 12-width test matrix apply to every new figure automatically.

## 15. Testing and quality gates for each page

A page is complete only when all pass:

1. Typecheck, lint, format, unit tests, content validation (build fails on errors).
2. New validators: `comprehension` block present and the five answers recorded; glossary and acronym check; readability lint (sentence and paragraph length); next step present; diagram `purpose`, `takeaway` and a caption that states what it shows; block-sequence distance and text similarity between pillar pages; unique distinctive block and diagram; link slots; no orphans; no broken links; every approved technology reachable; photograph gate and no visible credits.
3. Browser tests at 12 widths: overflow, type floors, touch targets, reading width, caption and diagram alignment, row alignment, served image sharpness; axe at 390 and 1440 including open interactive components; keyboard and touch operation of every chooser, term and disclosure; no information reachable only by hover; reduced motion; no layout shift; console clean.
4. Lighthouse on the production build: accessibility and best practices 100, mobile performance 90 or above for each page template.
5. Structured data validity and sitemap and robots checks.
6. A human-style review: the five-question page test, the visual-quality checklist, and a look in a real browser at phone, tablet and desktop widths, recorded in the page's review note.
7. CI green on GitHub (Linux) before merge to `main`.

## 16. Decisions and dependencies

**Decisions for the owner (defaults shown; Phase 2 can start on the defaults):**

| # | Decision | Recommendation |
|---|---|---|
| D1 | Build the three guided hubs (`/services/`, `/solutions/`, `/technologies/`) in Phase 2, ahead of the Phase 3 and 4 detail pages they lead to. The approved URL rules define them as real pages, but the approved phase table does not place them | Yes. They deliver the "find your solution" pathways and show the complete technology breadth without thin pages |
| D2 | The Work Area list in section 3 (25 pages) and which lead the hub (DEC-39) | Approve as the default; tell me the areas that are strongest |
| D3 | Pilot-first: build `/ai/` and review it before the other 13 | Yes |
| D4 | Publish article Batch 1 at the end of Phase 2 instead of Phase 3 | No (keep Phase 3); store all 53 briefs now |
| D5 | Retrofit Home, Software Development and Contact to the clarity standard as Step 0 | Yes |
| D6 | Generate an optional `llms.txt` and decide the AI-crawler policy (DEC-19) | Add `llms.txt`; allow retrieval agents; training agents your call |
| D7 | Approve DEC-21: DECHY-built reference implementations as a source of authentic interface visuals and Work material | Yes, optional accelerator |
| D8 | Legal set: Terms of use and Accessibility statement drafted by me; name a qualified reviewer (DEC-38) | Yes |

**Information I need from you.** Nothing is a hard blocker for starting Step 0. Needed later, with defaults:

- DEC-05 facts for the Company pages (legal entity and jurisdiction, contact channels, engagement models, time zones, languages of delivery, real external profiles). Without them the Company pages use only approved facts and stay general.
- Contact destination (DEC-18) for the form to deliver.
- Netlify authorization for the preview (launch candidate, Step 9).
- A legal reviewer for Privacy, Cookies, Terms and Accessibility.
- The domain stays deferred (DEC-02); the launch candidate runs on a Netlify address with indexing off.

## 17. Explicitly deferred (not in Phase 2)

- All individual technology, platform, language, AI-provider, automation-tool and integration pages (Phase 3, by search intent).
- Industries hub and the 8 first-wave industry pages (Phase 4); the remaining 29 industry entities stay in the graph.
- Individual solution pages (Phase 4, first wave of 12).
- Country and location pages and the `/locations/` hub (Phase 4 Wave 1; Phase 5 Waves 2 and 3).
- All 53 articles and the `/resources/` hub (Batch 1 in Phase 3; the rest in Phases 4 and 5).
- Work Entries and case studies (when facts are supplied); people pages (when real profiles exist).
- Service by industry and service by country intersections; sub-service pages not already covered by a Work Area (qualification engine, Phase 3 onward).
- Language localization (Phase 6); logged-in applications and portals; analytics tooling (DEC-17); the favicon and wider brand set (DEC-03); domain selection (DEC-02); trademark clearance (DEC-29).
- Any change to the approved phone-app and port photographs: left exactly as they are until the visual asset library is revisited after the broader site exists.

## 18. Index of the owner's 38 points

| Points | Where answered |
|---|---|
| 1 to 3 | Sections 3 and 4 |
| 4 | Section 5 |
| 5 to 12 | Section 6 (and Sections 3 and 17) |
| 13 | Section 7 |
| 14 | Section 8 |
| 15 | Section 9 |
| 16 | Section 14 |
| 17 and 18 | Section 12 |
| 19 | Section 13 |
| 20 | Section 15 |
| 21 | Section 16 |
| 22 | Section 17 |
| 23 to 37 | Section 11 and `docs/design/clarity-and-comprehension-standard.md`; ADR 0004; added to `CLAUDE.md` |
| 38 | Section 2 |
