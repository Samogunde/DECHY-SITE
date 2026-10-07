# ADR 0006: Technology and Solutions architecture reconciliation

Date: 2026-10-06. Status: accepted by the owner (instructions following the qualification gate and the decision-resolution pass). Nothing in this record builds a page; it removes contradictions from the planning system and fixes one current answer for each question below.

## Context

The qualification gate (`docs/planning/14-technology-and-solutions-qualification.md`) reviewed all 329 technology-like entities and all 22 Solutions against the 25 Work Areas. It showed that the master plan's first-wave Solution list (twelve) would put several pages beside Work Areas that already answer the same question, and that the entity schema had no way to say that one technology belongs to another. The owner approved the qualification in principle and asked for one final reconciliation so that every planning document gives the same answer.

## Decisions

1. **The canonical first-wave Solution architecture is six standalone Solution pages:** Business Process Automation, Legacy System Modernization, Cloud Migration, CRM Integration, Business Dashboards, AI Customer Support. The earlier first wave of twelve (plan section 9, Phase 2 plan) is **SUPERSEDED** by this decision (AMD-19). It is kept in place, marked, as the historical record.
2. **Classification of the 22 Solutions (approved working architecture).**
   - Standalone first-wave: the six above.
   - Represented through existing Work Areas, with no duplicate Solution page: AI Agents, API Integration, Customer Portal Development, Data Systems, Digital Transformation, Ecommerce Systems, Internal Business Software, Subscription Platforms, Workflow Automation.
   - Merged: AI Automation into Business Process Automation.
   - Deferred: AI Knowledge Systems, Booking Platforms, Marketplace Platforms, Payment Integration, SaaS Platforms.
   - Graph-only: Customer Experience Systems.
   - All 22 stay in the entity graph with their relations. No `pagePolicy` change is applied by this record; the pending values are listed in doc 14, section 10.2.
3. **The four axes stay distinct.** Services are what DECHY does. Work Areas are the kinds of system DECHY builds. Solutions are the business problem, need, or outcome. Technologies are what a system can be built with. A Solution earns its own page only when it satisfies a meaningfully different user intent from the Work Area closest to it. Problems open Solutions or Work Areas; there is no problem page family (AMD-05).
4. **`/solutions/` stays a real canonical hub on the Solutions axis.** Its approved information architecture is documented in doc 14, section 11.2. It is documented only; the hub is not redesigned or rebuilt by this record.
5. **Grouped technologies use a formal `partOf` relation (AMD-20).** The existing vocabulary had no grouping relation, so `partOf` (child to parent) was added, with `hasPart` as its derived inverse. It is semantic only: no page, URL, menu entry, link or public capability claim follows from it, and the "Where this connects" rails ignore it. The eight accepted groupings use it: Express and NestJS to Node.js; Django, FastAPI and Flask to Python; Spring Boot to Java; Laravel to PHP; Elasticsearch to the ELK stack.
6. **Solution to Industry mapping is DEFERRED / REQUIRES FUTURE QUALIFICATION.** No Solution-level industry mapping is approved. Existing service-level industry relationships are kept. No Solution to industry edge is created without evidence.
7. **The open-model AI group is a pending architecture decision.** "Open-source and open-weight AI models" (possible members Meta Llama, Mistral, Hugging Face; possible hosting relationships Together AI and Groq) is a candidate only. No entity, page, route or navigation entry exists.
8. **The nine confirmation-required technologies stay in REVIEW / CONFIRMATION REQUIRED:** Ruby on Rails, Power BI, Tableau, Looker, Kafka, RabbitMQ, OpenSearch, Datadog, Sentry. "Not named in planning" is not evidence that DECHY does not support a product, and the capability category being approved is not evidence that it does (AMD-21). They are neither removed nor promoted, and have no page.
9. **Node.js and .NET are next-wave public-page candidates (HIGH); MySQL is a MEDIUM candidate** whose qualification is conditional on content that is genuinely different from the PostgreSQL page. None is built.
10. **One current source of truth.** Where an older decision is superseded it is annotated in place with the amendment number and a pointer to the current decision; older text is not deleted. The current answers live in doc 14 (Technology and Solutions qualification, with its Decision Resolution and Architecture reconciliation sections) and in this ADR.

## Rationale for the change from twelve to six

The twelve were a first-pass list, marked RECOMMENDED and "to be finalized", built from the 22 candidates in AGENTS section 23 before the Work Area layer existed. Of the twelve, six are kept, one (AI Knowledge Systems) is deferred, and five (Workflow Automation, API Integration, Customer Portal Development, Internal Business Software, AI Agents) describe the same buyer intent and the same system as a Work Area that is already published (for example Customer Portal Development and Customer Portals). Four more of the 22 (Data Systems, Digital Transformation, Ecommerce Systems, Subscription Platforms) were never in the twelve and are likewise represented by Work Areas. A second page for each of those would split one intent across two URLs and break the rule that every concept has one canonical home. The six that remain describe projects or business functions (a modernization, a migration, a CRM integration, a reporting need, a support function, an automation programme) that no Work Area describes.

## Consequences

- The Solutions section of Phase 4 is six pages, not twelve, and is blocked on the owner's authorization as before.
- The schema and validator gain `partOf` and `hasPart`; the validator rejects a `partOf` between non-technology entities, a cycle, or a stored `hasPart`.
- No public page, route, navigation entry, Work Area or copy changes.
- Phase 4 prerequisites are listed in doc 14, section 11.7.
