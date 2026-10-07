# Phase 5B: premium visual, diagram, content, and interaction refinement (implementation notes)

Status: IMPLEMENTED. Authorized by the owner on 7 October 2026 as a production refinement of the existing 127 pages. No pages were added. This file records what changed and why. It adds no company facts.

## 1. Owner instruction that supersedes earlier text

Visible explanatory captions under diagrams ("This diagram shows ...") are removed. This supersedes the visible-caption part of ADR 0004 section on self-explanatory diagrams and of `docs/design/layout-and-visual-quality-rules.md`. The caption, purpose, and takeaway stay in the content record and in the page markup for assistive technology and search (the caption is rendered visually hidden). Alignment, naming, and takeaway validation are unchanged. Recorded in `docs/decisions/0007-diagram-captions-and-premium-refinement.md`.

## 2. Shared components

- **Buttons** (`src/app/globals.css`): a label never breaks across lines where it fits; the arrow keeps its own flex slot; below 30rem a long label wraps centred and balanced with tighter padding. Minimum height 48px.
- **CTA labels**: 226 "Talk to us/DECHY about X" labels became short, specific "Discuss ..." labels (for example "Discuss your software project"). No label changes meaning.
- **Diagram system** (`src/styles/diagrams.css`): compact tokens (box padding, gaps, title and text sizes, 14px minimum kept); visible captions removed; the layers diagram rebuilt so connectors are drawn from the grid (stage reaches the row centre line, each supporting box has a stub on that line, equal-height supporting boxes carry the bracket) instead of guessed offsets; the hub, before-after, decision, and flow diagrams tightened; before-after sits side by side from 28rem; the decision diagram joins each situation to its answer with a short line and drops the arrow row on narrow widths.
- **Diagram interaction and motion**: hovering a part lifts it and its connected parts and quietens the rest (layers, hub, flow, funnel, before-after, decision), with `:has()` only, hover-capable devices only, nothing essential hover-only. Connector lines draw in when a figure scrolls into view; reduced motion removes it.
- **At a glance** (`GuidanceBlocks.tsx`, `GlanceTabs.tsx`, `guidance.css`): three forms of the same five answers. Tabs with a dark action panel (services, hubs, company); a numbered stepped flow ending in an action bar (solutions, work areas, industries); an editorial layout with one large statement, a ruled list, and an action row (technologies, countries, other pages). The tabs follow the standard keyboard pattern and every panel stays in the markup.
- **Pathfinder** ("I need ...") is now a set of tiles with an arrow at the edge and a lift on hover.
- **Index lists** with six or more two-column items render as tiles.
- Photograph and mockup widths: the portal wireframe is capped so it no longer fills the page.

## 3. Hero composition and variety

The software anatomy hero was redesigned (short titles, one short phrase per node, a compact stack). Seven service heroes now show a conceptual interface instead of a teaching diagram: Web Development (site editor), Mobile App Development (phone app), AI (assistant), Automation (workflow board), Ecommerce (store and engine), Data and Analytics (report), UI/UX (dashboard). The teaching diagram each replaced moved into its own section lower on the page with its own heading. Other services keep a compact diagram of a different kind (layers, hub, funnel, decision, flow).

## 4. Content and voice

- 67 hero lines that began "This page covers/explains ..." were removed; 17 "This sketch shows ..." sentences were removed from section introductions.
- 84 technical-section introductions that began "Most visitors can skip this section" now state the subject directly. The repeated heading "For technical readers" became "How we build with X" on technology pages and "Under the hood" elsewhere.
- Nine of the longest diagram phrases were shortened.
- A few pages that fell under their word floors after shortening received useful additions (technical items and one sentence each), not filler.

## 5. Verification

Typecheck, lint, format check, content validation (127 pages, 0 errors), unit tests, production build, and the full browser suite (responsive 320 to 2560, alignment, accessibility, navigation, metadata, structured data, sitemap, robots, links). The browser tour covered the home page, services hub, several services, solutions, a technology page, hubs, an industry, and mobile at 320 and 390.

## 6. Not done

- Individually hand-drawn image assets for each page were not produced; the visuals remain HTML, CSS, and SVG for performance and sharpness.
- Content depth work on every Phase 1 to 4 page (full rewrite for voice) remains for a later pass; this phase fixed the shared patterns and the most repeated phrases.
