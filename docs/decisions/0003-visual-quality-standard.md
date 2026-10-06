# ADR 0003: Visual quality standard

Date: 2026-10-05. Status: accepted by the owner (instruction of 2026-10-05).

## Context

After reviewing the imagery, voice and motion refinement, the owner found three recurring problems: captions drifting away from their diagrams, supporting items in a diagram not aligned to the items they support, and photography that was not at the quality of the typography and diagrams. The owner also set rules on image selection and credits.

## Decisions

1. **Container model.** Every visual is a frame that owns its width; the diagram or image and its caption live inside it. Layout rules are reusable and tested rather than corrected per screenshot. See `docs/design/layout-and-visual-quality-rules.md`.
2. **Diagrams are grid-based HTML with real type.** Scaled SVG text produced sizes as small as 9 px; diagrams now use the type system at every width and respond to their own container width. SVG remains for shapes and UI depictions.
3. **Photography quality gate.** Sharp, high-resolution, well lit, composed, consistent with the page; no clichés, no staged-stock look, no AI-looking imagery; inspected at rendered size and at 2x before acceptance. Minimum source width 2400 px, enforced by the validator.
4. **Selection is by relevance and quality, never demographic.** No representation checklist.
5. **No visible source credits, anywhere.** Only licenses that permit commercial web use without visible attribution may be used; where attribution would be required the asset is not used. Provenance is recorded internally (registry and license evidence). Enforced by the validator and a browser test.
6. **Standing rule for all future pages.** Alignment, spacing, grid, component relationships, image quality, caption placement, responsive behavior, wrapping and visual balance are inspected before a page is called complete, without waiting for the owner to find the same mistake again.

## Consequences

- Supersedes the earlier practice of showing a small creator credit under photographs (added in the first refinement pass) and the five photographs chosen then. Their replacements and the reasons are in the Phase 1 implementation notes.
- New diagrams must be built on the diagram system; new images must pass the gate and be recorded.
- The first-pass SVG diagrams (system map, software anatomy, connected flow, quality layers, modernization path) were rebuilt on the new system with the same content and visual language. The portal wireframe stays SVG as a UI depiction and is exempt from the text floor.
