# Phase 3: technology pages (plan, qualification, and implementation notes)

Status: IMPLEMENTED. Authorized by the owner on 6 October 2026 as one continuous build. This file records the scope taken from the approved documents, the qualification outcome, and what was built. It adds no company facts. The qualification of the remaining technologies and of the Solutions axis, and the ranked next technology wave, are in `14-technology-and-solutions-qualification.md`.

## 1. Scope source

Master plan section 36 (Phase 3: "Technology, platform, AI, automation, and integration pages by search intent") and section 7 (strategic technologies; initial candidate list of 34, marked ASSUMPTION about demand). URL rule (section 20, AMD-10): a technology page lives at its canonical-home service URL, for example `/software-development/python/`. AGENTS 69 sets the content a technology page must carry. AGENTS 76 requires a data-flow diagram on every integration page.

Owner instructions on 6 October 2026 refine this: definitions only where they aid understanding; practical, non-teacherly voice; no repeated "made-up example" warning boxes; no thin or renamed-copy pages; no technology-coverage validator; no llms.txt; articles and resources stay in a later phase.

## 2. Qualification table

The 34 candidates were checked against the entity graph and the approved capability lists.

| Candidate | Outcome | Reason |
|---|---|---|
| Next.js, React, TypeScript, PHP, WordPress, Webflow | Built | Strategic entities, `CREATE LATER` in the taxonomy; real search intent |
| Python, Java | Built | Same |
| LangChain, OpenAI, Claude, Gemini | Built | AI providers and framework, feature prominence |
| Stripe | Built | The one feature-level integration entity |
| Airtable, HubSpot, Salesforce, Zapier, Make, n8n | Built | Automation and business platforms, feature prominence |
| AWS, Azure, Google Cloud | Built | Cloud platforms, feature prominence |
| Docker, Kubernetes, Terraform | Built | In the plan's candidate list; seeded as `reference`/`REVIEW`, promoted to `feature`/`CREATE / INDEX` because each has distinct buyer intent (containerization, "do we need Kubernetes", infrastructure as code) |
| Flutter, React Native, Swift, Kotlin | Built | Mobile technologies, feature prominence |
| PostgreSQL, MongoDB | Built | Databases, feature prominence |
| Shopify | Built | Ecommerce platform, feature prominence |
| Node.js | Not built | Not an entity in the approved capability architecture (AGENTS lists). Adding it is an entity decision for the owner |
| .NET | Not built | Same. Only ".NET MAUI" exists, as a `reference` entity |

32 pages. The 32 entities now carry `pagePolicy: CREATE / INDEX`. All other technology entities keep their policy and stay in the graph without pages.

## 3. What was built

- A `technology` page kind, with rules in the validator: the entity must be technology-like; the URL must be its canonical home; the page's parent must be its service; it must link to that service; it needs a diagram (a flow diagram for integrations); no disclaimer boxes; at least 900 words and seven distinct block types; comprehension record and next step.
- Similarity control for technology pages (`TECH_SIMILARITY`): identical block sequences, copied text, shared headings (beyond the standing "technical readers" heading), repeated diagrams, takeaways, or choosers are rejected. The sequence threshold is deliberately loose (0.95) because technology pages share a family of sections by design.
- Page shape, following the owner's order: what it means, where it fits (a chooser, comparison, or diagram), options and alternatives, what DECHY can do, technical depth in expandable panels, questions, related entities, next step. The "options" element varies by technology, and so do the hero diagram, the supporting blocks, and the order.
- Internal linking: service to technology (each service page links its technologies), technology to service, to related technologies and alternatives, to solutions and Work Areas, and to industries. Solutions and industries have no pages yet, so they render as plain text and become links in Phase 4 with no content edit. `scripts/derive-relations.ts` now also derives technology-side edges (`usesTechnology`, `integratesWith`, `alternativeTo`) and writes `data/relations/derived.yaml` (renamed from `phase-2.yaml`).
- The `/technologies/` hub gained a "Read about a technology in detail" block, grouped by service.

## 4. Not in Phase 3

Solution pages, industry pages, country and resource pages, the 53 articles (the plan puts Batch 1 in Phase 3; the owner's 6 October message places resources and articles in a later phase, and the owner's latest instruction governs), service-by-industry pages, people and city pages, and any client, project, metric, award, partnership, or certification claim. Technology entities without a page remain in the entity graph.

## 5. Systemic issues recorded for the later refinement pass

- Diagram components: two small reusable fixes were made in this phase (the hub connector now sits clear of the rounded corner of its frame; the At a glance action now sits on its own line at every width). A broader review of diagram positioning and spacing is deferred to the refinement pass the owner described. A text-overlap sweep at 320, 768, and 1440 px found no overlapping or clipped diagram text on any of the 85 pages.
- Content tone: Phase 2 pages still contain teaching-style definitions and labeled hypothetical scenarios on Work Areas. Phase 3 pages follow the new voice. The Phase 2 wording is untouched, as instructed.
- Comparison tables name competing technologies as examples of alternatives. They state no market share, ranking, or price, and should be reviewed for currency in the refinement pass.
