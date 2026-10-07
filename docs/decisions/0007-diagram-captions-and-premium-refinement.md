# ADR 0007: Diagram captions are not shown; premium refinement rules

Date: 7 October 2026. Status: accepted by the owner (chat instruction, Phase 5B).

## Decision

1. Diagrams no longer show an explanatory caption ("This diagram shows ..."). The caption, purpose, and takeaway remain in the content record, are validated as before, and are rendered visually hidden inside the figure for assistive technology and search.
2. Diagram nodes carry a short title and at most one short phrase. Detail belongs in the surrounding copy.
3. Connectors are drawn from the layout grid so they touch the boxes they join at every width. No offset guesses.
4. "At a glance" has three forms (tabs with an action panel, stepped flow with an action bar, editorial) assigned by page kind. The same five answers, never one repeated five-column block.
5. Hero visuals vary by service: a conceptual interface where one communicates the capability, otherwise a compact diagram of a different kind.
6. Buttons never wrap where the label fits. Labels are short and specific.

## Supersedes

The visible-caption requirement in ADR 0004 (self-explanatory diagrams) and in `docs/design/layout-and-visual-quality-rules.md`. The rest of ADR 0004 (purpose, takeaway, plain labels, agreement with heading and copy) stands.

## Consequences

Validators still require a caption verb and a takeaway, because those fields now serve accessibility and search. Alignment tests treat the hidden caption as part of the figure.
