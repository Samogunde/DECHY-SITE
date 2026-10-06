# ADR 0004: Clarity, comprehension and solution-guidance standard

Date: 2026-10-05. Status: accepted by the owner (instruction accompanying the Phase 1 acceptance).

## Context

Phase 1 is accepted. Before Phase 2, the owner set a permanent requirement: the site must be easy for an ordinary visitor to understand, must guide visitors from problem to next step, and must use diagrams that teach. Technical accuracy and search value remain required.

## Decisions

1. The visitor's questions, the problem-to-next-step spine, plain language, progressive depth (four levels), scannability, self-explanatory diagrams (purpose, takeaway, caption, labels in plain words), interaction that helps understanding (never hover-only), the solution-system principle with obvious pathways, and the five-question page test are permanent standards for all pages. Full text: `docs/design/clarity-and-comprehension-standard.md`.
2. Neither SEO nor technical accuracy is traded for clarity. Simplification must preserve meaning.
3. The standard is enforced in the content model (a `comprehension` block, diagram `purpose` and `takeaway`, glossary terms with plain definitions), in validators (glossary and readability lint, required summary and next step), and in browser tests (no hover-only information).
4. Pages already built in Phase 1 (Home, Software Development, Contact) are brought up to this standard as the first step of Phase 2, because some of their labels and diagram terms assume specialist knowledge.

## Consequences

- Adds components (At a glance, Term, Deeper details, Chooser, comparison matrix, generic teaching diagrams) and fields to the content schema; see `docs/planning/10-phase-2-plan.md`.
- Page review gains a recorded comprehension check; a page is not complete without it.
- Does not reduce any approved capability, technology, platform, language, integration or industry.
