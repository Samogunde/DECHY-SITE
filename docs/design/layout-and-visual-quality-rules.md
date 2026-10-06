# Layout and visual-quality rules

Status: permanent standard for every DECHY page, from the quality pass of 2026-10-05. Origin: owner direction after reviewing the first two diagrams (caption drifting left of its diagram; supporting boxes not aligned to the stages they support). These rules turn those two screenshots into a system. Enforced by `tests/e2e/layout-alignment.spec.ts`, the content validator, and the checklist at the end.

## 1. The container hierarchy

```
PAGE CONTAINER      .container-site       one max width, one gutter, one left edge
  SECTION           <Section>              vertical rhythm, tone, one heading
    CONTENT GRID    .editorial / grids     rail (label, heading) + content, or a stated column grid
      VISUAL FRAME  .figure / .photo       owns the width of the visual and its caption
        DIAGRAM or IMAGE
        CAPTION     inside the same figure
```

A visual and everything that explains it (caption, labels, legend, annotations) belong to the same frame. The frame decides the width; children fill it. Nothing inside positions itself against the viewport.

- A caption starts on the left edge of its diagram or image, and never extends past its right edge.
- Do not cap a diagram's width on the diagram and leave the caption on the column. Cap the figure (`--fig-max` on `.figure`); the diagram and caption then share the capped width. Capped figures align to the grid line (start), not centered.
- Left edges inside one section land on a small set of grid lines. A block that starts 1 to 12 px from another block's edge reads as a mistake, so it fails the test.

## 2. Diagrams

1. **Real text in a grid, not scaled vector text.** SVG text shrinks with the diagram (the first version rendered at 9 to 10 px on phones and tablets). HTML diagrams use the type system's sizes at every width (nothing under 14 px; 13 px only for uppercase eyebrow labels). SVG is for shapes, schematics and UI depictions (the portal wireframe), never for labels that must be read as copy.
2. **Layout follows the diagram's own width.** Use container queries on `.figure-frame` (`@container dgm (min-width: ...)`), not viewport media queries, so the diagram behaves the same in a narrow column and in a narrow window.
3. **Related items share a row.** When one column supports another, each supporting item sits in the same grid row as the item it supports (top and bottom edges aligned) and connectors are drawn from that row. A row with two supporting items divides its height between them. Never position a supporting item by pixel offset.
4. **One set of tokens**: `--dgm-gap`, `--dgm-pad-*`, `--dgm-line`, the box styles, the fill, border, muted and accent colors. Dark surfaces change tokens only (`.tone-ink .dgm`).
5. **Narrow layouts are designed, not shrunk**: columns become a single flow; supporting items attach beneath what they support (as a tray), so arrows still run from unit to unit.
6. **Accessible**: each diagram has a name and description (`DiagramRoot`), real list semantics, decorative parts `aria-hidden`.
7. **Motion explains**: staggered steps (`.fx-step`), halo on the active step, bus packet; paused off screen; removed under reduced motion (see motion-system.md).

Components: `src/components/figures/` (`DiagramRoot`, `SystemMap`, `SoftwareAnatomy`, `ConnectedFlow`, `QualityLayers`, `ModernizationPath`), styles in `src/styles/diagrams.css`, container in `Figure.tsx`. New diagrams are added there and registered in the `FIGURES` map with their maximum width.

## 3. Photography

Selection:
- Choose on relevance to the section, professional quality, authenticity, composition, lighting, visual consistency with the page (cool, clean, natural light, restrained grading), and absence of stock clichés. Never choose or compose people by demographic. Do not build a representation checklist.
- Reject: soft or noisy files, heavy filters, over-warm or over-contrasted grading, obviously staged poses, "person staring at a laptop", glowing code, server rooms, holograms, AI-looking imagery, visible third-party brands or personal data (legible product names, IMEI numbers), interiors that imply DECHY offices, and anything that implies the people shown are DECHY staff or clients.
- Prefer images that show real devices, real interfaces and real working environments over generic office scenes.

Quality gate, before an image is accepted:
1. The source is at least 2400 px wide (the validator enforces this); originals of 6000 px are preferred and are stored at 2880 px.
2. Inspect it at 100 percent for sharpness and noise, and at the rendered size on phone, tablet, laptop, desktop and large desktop, including the crop at each breakpoint (`PhotoRef.position`, ratios in `Photo.tsx`).
3. The `sizes` attribute must describe the real rendered width so the browser requests enough pixels (the test compares served width to needed width at 1x and 2x).
4. Serve through `next/image` (AVIF or WebP); the stored JPEG is only the master for the optimizer.

Licensing and credits:
- Use only images whose license allows commercial website use without visible attribution. If a license requires visible credit, do not use the asset.
- **No source or creator credit appears anywhere on the site**: not under, over or beside images, not in captions, not in overlays. Provenance lives in `data/assets/images.yaml` and `data/assets/licenses/`. The validator rejects credit wording in page copy and captions, and a browser test checks the rendered text.
- A caption, when used, describes the image and nothing else.
- Every photograph needs: source URL, creator, license URL, license evidence file, SHA-256, dimensions, alt text, and usage.

## 4. Text and component alignment

- Heading, supporting text, list, table and buttons in a block start on the same grid line unless there is a stated design reason (for example a numbered list's numerals).
- Cards, labels and icons use the shared padding and gap tokens; no one-off offsets.
- Buttons in a group share height and baseline; icons align to the text's center line.
- Check wrapping: no orphaned single words in headings (balanced), no label that wraps differently from its siblings without reason.

## 5. Responsive proof

A layout is not finished until it holds at 320, 360, 375, 390, 430, 768, 820, 1024, 1280, 1440, 1920 and 2560 px. The automated suite proves caption and diagram edges, row alignment, text floors, overflow and photo sharpness at all of these; the author still looks at the result in a browser at least at phone, tablet and desktop widths, and at the widths where a container query switches layout.

## 6. Checklist before any page is called done

- [ ] Every figure: diagram and caption share one frame; no drift at any width.
- [ ] Every diagram: real text at or above the floors; related items share rows; narrow layout designed.
- [ ] Every photograph: sharp at 100 percent and at rendered size on 1x and 2x; crops checked per breakpoint; premium and consistent; no clichés; no visible brand or personal data; no credit visible.
- [ ] Provenance recorded (registry, license evidence, hash, alt text).
- [ ] Headings, copy, lists, tables, buttons and CTAs on the page grid; no near-miss offsets.
- [ ] Motion is consistent, restrained, keyboard and reduced-motion safe, with no layout shift.
- [ ] Visual rhythm: nothing looks accidentally positioned or artificially filled.
