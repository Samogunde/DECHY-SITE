# Motion system

Status: implemented in the Phase 1 refinement pass and extended in the site-wide refinement (7 October 2026). Source of truth for tokens: `src/app/globals.css` (`:root` and the "motion" section). Figure and card motion: `src/styles/motion.css`. Driver: `src/components/primitives/MotionProvider.tsx`. Every reveal plays once: content that has appeared stays visible when the visitor scrolls back up.

## Principles

Purposeful, subtle, fast, consistent, accessible, performance-conscious. Motion communicates feedback, state, hierarchy, continuity or explanation. The page keeps a rhythm of still sections, interaction, and occasional reveals; most of it does not move.

## Tokens

| Token | Value | Used for |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.22, 0.61, 0.36, 1)` | Everything that arrives or responds |
| `--ease-in-out` | `cubic-bezier(0.45, 0, 0.25, 1)` | Looping diagram motion |
| `--dur-fast` | 140 ms | Hover, press, color and underline changes |
| `--dur-base` | 220 ms | Panels, disclosure, field states, arrow nudge |
| `--dur-slow` | 520 ms | Entrance reveals |
| `--rise` | 14 px | The only entrance travel distance |
| `--stagger` | 70 ms | Delay between siblings in a group (capped at six) |

## What moves, and why

| Element | Behavior | Purpose |
|---|---|---|
| Buttons | Color and shadow change; 1 px lift on hover (hover-capable devices only); pressed state; arrow nudges 3 px; spinner while sending | Feedback |
| Links and rows | Underline thickness and color ease; service rows tint the title and nudge the arrow | Feedback |
| Desktop navigation | Underline grows from the left; current page keeps it | State |
| Services panel and mobile menu | Fade and rise 6 px; close the same way; mobile sub-list expands with a height transition | State and continuity |
| Header | Soft shadow once the page has scrolled | Orientation |
| Section headers | Fade and rise; the blue eyebrow bar draws in | Hierarchy |
| Groups (lists, columns, steps, tech groups) | Children arrive in sequence | Hierarchy |
| Photographs | Frame fades in while the image settles from a 5 percent zoom; 2.5 percent zoom on hover | Continuity |
| FAQ | Height and opacity ease on open and close (where the browser supports `::details-content`); plus icon rotates | State |
| Form fields | Border and focus ring ease; label color changes on focus; errors fade in | Feedback |
| Hero diagram | Layers settle in once on load; a small packet travels the integration bus | Explanation |
| Connected-flow diagram | Steps appear in order when the figure scrolls in; step numbers take turns glowing | Explanation |
| Engineering and modernization diagrams | Steps appear in the order the process runs | Explanation |

| Interface mockups (site-wide refinement, 7 October 2026) | Once, as the figure scrolls in: chart bars grow from the baseline in order, progress meters fill, cards and rows arrive in a short sequence, a phone settles in front of its desktop window, and a booking arrives in the staff view. Pointing at a row or card inside a mockup lights it | Explanation, and the feeling of a real product without pretending to be one |
| Hub diagram | Parts arrive in order and their connectors draw out to the core; pointing at a part highlights it and dims the rest | Explanation |
| Delivery steps | Cards arrive in sequence and the path between the numbers draws in after them; pointing at a step lights its number | Explanation |
| Technical detail tabs | The new panel fades and rises 4 px when a topic is chosen | State |
| At a glance and choosers | The answer panel fades in; options lift on hover; a progress bar and "next" link show where you are | State and orientation |
| Destination, pathfinder, and chip links | Lift with a shadow, and the arrow circle fills and nudges; a pressed state on click | Feedback; only things that are links move. Information cards acknowledge the pointer with an outline only |
| Home hero bus packet and connected-flow halo | Small loops, kept on the owner's instruction; they pause off screen and are hidden under reduced motion | Explanation |

Still by design: the hero text, the company statement, FAQ text, tables, footer, legal pages. There is no custom cursor; feedback comes from hover, focus, and pressed states.

## Rules

1. Only CSS transitions and keyframes, plus a 2 KB observer. No animation library. Only `opacity` and `transform` animate for reveals, so nothing causes layout shift. SVG steps animate opacity only (their `transform` attributes position them).
2. The hero's text never animates, so first paint and largest content are untouched.
3. Content already on the first screen is never hidden. Below-the-fold content is hidden only after JavaScript has run, and never when reduced motion is requested, so the page is complete without JavaScript.
4. Looping diagram motion pauses when its figure is off screen.
5. Hover movement is gated by `@media (hover: hover)` so touch devices never see a stuck hover state; pressed feedback applies everywhere.
6. Hover is never the only way to understand or operate something; every hover effect has a focus equivalent.
7. Keyboard focus rings are never removed or hidden by transitions.

## Reduced motion

Under `prefers-reduced-motion: reduce`: all animations and transitions are off; reveals do not run and nothing is hidden; hover movement and image zoom are off; looping diagram elements are hidden. State changes (menus, disclosure, validation) still work, instantly. If the preference changes while a page is open, anything still hidden is revealed.

## Tested

`tests/e2e/motion-photos.spec.ts` covers: reveals complete and nothing stays hidden; the first screen is never hidden; button hover and arrow movement; menu transition and focus return; diagram sequencing; field focus state; FAQ operation; reduced motion (no animation, no hidden content, no hover movement, menus and FAQ still work); layout shift under 0.02 on pages with photographs. `tests/unit/refinement.test.ts` guards the tokens, the reduced-motion block, hover gating, and the absence of animation libraries.
