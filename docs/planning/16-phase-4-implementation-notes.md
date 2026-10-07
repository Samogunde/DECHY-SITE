# Phase 4: implementation notes

Status: IMPLEMENTED. Authorized by the owner on 6 October 2026 as one continuous development phase, after the qualification, reconciliation, and readiness documents (`14` and `15`). This file records what was built, the small implementation decisions made without stopping, and what was verified. It adds no company facts.

## 1. What Phase 4 built

| Area | Built | Pages |
|---|---|---|
| Solutions | Six standalone Solution pages and a corrected `/solutions/` hub | 6, hub revised |
| Technologies | The four HIGH pages (Node.js, .NET, Power Automate, WooCommerce) and the seven MEDIUM pages (BigQuery, MySQL, Vue, Angular, Firebase, Supabase, Snowflake) | 11 |
| Industries | An Industries hub and the eight first-wave industry pages | 9 |
| Locations | A Locations hub and the five first-wave country pages | 6 |
| Resources | A Resources hub, the article page type, the articles block, and Article structured data. No article is published | 1 |

The site grew from 85 to 118 pages. The count was never a target: each page is an approved candidate with its own intent and content.

Not built, by instruction: the open-model group, Ruby on Rails, Power BI, Tableau, Looker, Kafka, RabbitMQ, OpenSearch, Datadog, Sentry, the five deferred Solutions, Work Entries, country Waves 2 and 3, and any of the 53 articles.

## 2. Page kinds, schema, and validators

- New page kinds: `solution`, `industry`, `location`, and `article`. Hubs for Industries, Locations, and Resources use the existing `hub` kind.
- New block: `articles`, a list of published articles grouped by kind, which renders nothing (and drops out of the section navigation) until an article exists.
- New page field: `article` (kind and summary). The author of every article is the DECHY organization; no person is invented.
- Validator rules by kind: solution pages need a service, a Work Area, and two technologies, a hero diagram, and no disclaimer box; industry and location pages must sit under their hubs; location pages must belong to a country entity; articles need their record, the `/resources/` parent, and the Article schema type.
- Word floors: solution 1,100, industry 1,000, location 900, article 1,400, in addition to the existing floors.
- Similarity: separate configurations for solution, industry, and location pages. Country pages may share structure but not copy; their shingle limit is 12 percent (the other kinds are 5 percent) because every country page legitimately repeats short statements such as "DECHY works remotely".
- Two global guards: no page may name a product whose capability the owner has not confirmed (Power BI, Tableau, Looker, Kafka, RabbitMQ, OpenSearch, Datadog, Sentry, Ruby on Rails), and location, industry, solution, and article pages may not imply an office, branch, local team, or address.

## 3. Entity graph

- `scripts/derive-relations.ts` now derives Solution and industry relations from the pages: a Solution page that lists a service, a Work Area, or a technology creates the edge to that party; an industry page creates `appliesToIndustry` edges from the services, Work Areas, and technologies it lists. Industry pages do not relate to Solutions, and Solution pages never relate to industries, so Solution to Industry mapping stays deferred (ADR 0006).
- Policies applied: the six Solutions are `CREATE / INDEX`; the nine represented Solutions and AI Automation are `MERGE / CONSOLIDATE`; the four deferred are `CREATE LATER`; Customer Experience Systems is `DO NOT CREATE`. The eight industries and five countries are `CREATE / INDEX`. The eleven technologies are `CREATE / INDEX`.
- The "Where this connects" rails no longer list a Solution that has no page. Those names were permanent plain text; the Systems we build rail already points to the Work Area that answers them.
- `partOf` edges are unchanged and still never render.

## 4. Navigation

- Solutions and Industries are menus (link plus chevron), data-driven from `data/navigation/nav.yaml`, each item led by a one-line summary. Only published pages appear. The same disclosure pattern, keyboard behavior, and mobile drill-down as the other menus.
- Resources is a link to the hub; Company is unchanged. Industries and Resources are no longer plain text, and the footer's Industries, Resources, and Locations links are live.
- The Technologies menu gained the eleven pages in the Web, Languages and Backend, Automation, Cloud, Data, and Commerce categories. Firebase and Supabase sit in Cloud and DevOps, matching their parent service.
- A validator requires every Solution and industry page to be placed in its menu.

## 5. Content decisions (made without stopping)

- Solution pages are problem-first, not definition-first, and each has a different block order and a different hero diagram kind, so the six do not read as one template.
- Business Dashboards names no business-intelligence product; it describes "a reporting tool" generically, because those products await confirmation.
- Industry pages describe typical systems and what to take care over. They claim no client, result, statistic, or certification, and they say that rules vary by country and that the reader's own adviser should confirm requirements.
- Country pages cover the market, rules, payment and accounting systems, industries, and working across time zones. They say DECHY works remotely and has no office there. The legal and market considerations were written from established public knowledge and are listed in the research log (R7) to be re-checked against current sources before launch; they are presented as considerations, not legal advice.
- The Resources hub is useful without articles: it points to the decisions that existing service, solution, and technology pages already answer, explains the five kinds of resource, and states how resources will be written.
- The technology and Solution pages that mention a name in a list (for example Zapier) link only to pages that exist; unbuilt names would be plain text.
- Service pages gained links to the new technology pages in their related groups, so every technology page is reachable from its service (a Phase 3 rule).

## 6. CI

- `cancel-in-progress` no longer applies to `main`, so every commit on `main` completes its own run.
- The workflow is split into a static job (type check, lint, format, unit tests, validation, audit, build) and a browser job run as four parallel shards of the full suite. No test was removed or reduced.

## 7. Verification

See the final report of the phase. Throwaway measurement scripts were not committed.

## 8. Known and deferred

- Phase 1 and 2 voice and diagram refinement (the general correction pass).
- Industries beyond the first eight; country Waves 2 and 3; the 53 articles (briefs remain data); Work Entries.
- Solution to Industry mapping; the open-model group; the nine confirmation-required technologies.
- Launch dependencies: domain, Netlify authorization, contact destination, a platform rate limit, external profiles for `sameAs`, and a performance budget.
