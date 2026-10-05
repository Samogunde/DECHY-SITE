# DECHY Work Architecture

Status: APPROVED PHASE 0 ARCHITECTURE (governs its topic under the approved plan; precedence in CLAUDE.md and ADR 0002). Work is a primary section of the site.
Labels: CONFIRMED, RECOMMENDED, ASSUMPTION, DECISION REQUIRED (see `03-decisions-register.md`).

## 1. Purpose and positioning

CONFIRMED: DECHY has completed substantial work across the capabilities in the master architecture. Work is the public portfolio architecture of a **technology company**, not a freelancer gallery. It communicates breadth, technical depth, and the connected-systems approach.

Two terms, kept distinct internally (never as a public disclaimer):

- **Work** = the broad portfolio and project-capability architecture.
- **Case study** = a Work entry that carries enough verified detail to tell a full evidence-based story.

Rule: nothing is invented. Capability statements are approved. Specific client names, dates, metrics, testimonials, awards, and results appear only when you supply them.

## 2. Two layers

### Layer 1: Work Areas (can be written now, no project facts required)

A Work Area describes the kind of system DECHY builds, in system terms: what it is made of, how it is architected, what it integrates with, what decisions it involves, and what a delivered system typically looks like. Each has original architecture and data-flow diagrams made for DECHY. Any scenario is labeled "illustrative scenario" (AGENTS 46), never presented as a named client project.

This layer fully populates Work today without fabricating anything, and it is distinct from service pages: service pages speak to the buyer's decision ("should we, how do we engage"); Work Areas show the built system ("what it looks like and how it works").

Proposed Work Areas (RECOMMENDED; maps to all 15 pillars; ASSUMPTION about final names):

| Discipline | Work Areas |
|---|---|
| Software | Custom business applications; SaaS platforms; Customer and employee portals; Marketplaces; Booking and scheduling systems; Membership and subscription platforms; CRM and ERP systems; Inventory and management systems |
| Web | Corporate and content websites; Web applications; Headless and CMS builds; Progressive web apps |
| Mobile | iOS and Android apps; Cross-platform apps |
| AI | AI assistants and copilots; RAG knowledge systems; AI agents; Document intelligence; Computer vision and speech systems; Recommendation and predictive systems |
| Automation | Business process automation; CRM and sales automation; Airtable business systems; Customer support automation; Finance and HR automation |
| Cloud and security | Cloud migrations and architectures; CI/CD and DevOps platforms; Security assessments and secure builds |
| Data and integration | Analytics and BI dashboards; Data pipelines and warehouses; API and systems integration; Payment integration |
| Ecommerce | Shopify and WooCommerce stores; Custom and subscription commerce; Ecommerce integrations |
| Design and brand | Product and UI/UX design; Design systems; Brand identity systems |
| Growth | SEO, AEO and GEO programs; Marketing automation and lead generation |
| Transformation | Technology audits; Digital transformation roadmaps |

Roughly 45 Work Areas exist in this list. Not all become separate pages: the qualification engine applies. RECOMMENDED: roughly 20 to 25 stand-alone Work Area pages, the rest as sections within them.

### Layer 2: Work Entries (project-level, filled from information you supply)

A Work Entry is a specific project, named or anonymized. It exists only from facts you provide through the intake form (`docs/templates/work-intake.md`). The entry model supports any depth.

Entry states (internal field `verification`; the public page just shows what exists):

| State | Meaning | Public rendering |
|---|---|---|
| `summary` | Project type, services, technologies, problem, what was built; client anonymized or named with permission | Compact entry |
| `detailed` | Adds architecture, implementation, integrations, challenges, visuals | Full Work page |
| `case-study` | Adds verified outcomes, client approval, quotes or metrics where supplied | Case study layout, `Article` schema |

No metric, quote, or client identity is ever generated. Missing optional blocks simply do not render.

## 3. Data model (extends the content model)

```yaml
# data/work/entries/<slug>.yaml  (Layer 2)
id: work.<slug>
type: work-entry
verification: summary | detailed | case-study
title: ...                      # descriptive; client name only if permitted
client:
  display: named | anonymized   # e.g. "a regional logistics operator" only if true
  name: ...                     # optional, permitted only
  sector: ind.logistics
projectType: workarea.customer-portal
year: ...                       # optional
services: [svc.software-development, svc.api-integration]
technologies: [tech.python, tech.postgresql]
platforms: []
integrations: []
industries: [ind.logistics]
problems: [prob.disconnected-systems]
solutions: [sol.customer-portal-development]
summary: ...
implementation: ...
technicalSummary: ...
outcomes: []                    # only supplied, verified facts
media: [asset ids]              # real screenshots or DECHY-made diagrams
relatedArticles: []
permissions: { publishName: bool, publishScreenshots: bool, source: ... }
```

```yaml
# data/work/areas/<slug>.yaml  (Layer 1)
id: workarea.<slug>
type: work-area
discipline: ...
services: [...]
technologies: [...]
architecture: diagram ids
typicalComponents: [...]
decisions: [...]
illustrativeScenarios: [...]    # always labeled illustrative
entries: [work ids]             # populated as Layer 2 grows
```

Edges connect Work to Service, Technology, Platform, Integration, Industry, Problem, Solution, Article, Country (served markets), and other Work.

## 4. URLs and navigation

- `/work/` hub: filterable by discipline, service, technology, industry; text-forward index with diagram thumbnails (not a card wall).
- `/work/areas/{slug}/` for Work Area pages.
- `/work/{slug}/` for Work Entries and case studies.
- Filter states are `noindex, follow`; clean hub and entry URLs are indexable.
- Primary navigation item "Work" is present. Footer lists Work Areas.
- Service pages show a "Related work" rail pulling from edges; Technology and Industry pages likewise.

## 5. Page blueprints

Work Area page: definition lead; what DECHY builds in this area; reference architecture diagram; typical components; integrations; technology options; decisions and trade-offs; security and quality considerations; illustrative scenario; related services, technologies, industries, articles; entries (when present); CTA.

Work Entry page: context; problem; approach; architecture (diagram); implementation summary; technologies and integrations; challenges and decisions; outcome (only supplied); media; related items; CTA. Each page varies emphasis; no repeated template feel.

## 6. Schema

Work Area: `WebPage` + `Service` where it describes a service; `BreadcrumbList`. Work Entry `summary` and `detailed`: `WebPage` or `CreativeWork`; `case-study`: `Article`. Use `SoftwareApplication` only for real, public products. No `Review`, `Rating`, or `Organization` client markup without permission.

## 7. Governance

- A Work Entry cannot publish without its `permissions` block filled and a reviewer.
- Names, logos, screenshots of clients only with recorded permission.
- Validator blocks: metrics without a source field, quotes without a permission record, the words "case study" on non-verified entries, client logos without permission.
- Anonymization is allowed only if the description remains true (do not describe a sector or size that is false).

## 8. What I need from you (does not block planning)

1. Approve the two-layer model (DEC-34).
2. Fill the intake form for any projects you can describe, in any order. Even 5 to 10 `summary` entries transform the section. Anonymized is fine.
3. Tell me which Work Areas are strongest so the hub leads with them.
