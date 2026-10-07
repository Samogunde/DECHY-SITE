# Site-wide refinement: design-system changes and the two sample pages

Status: SAMPLES BUILT, awaiting the owner's approval before the rollout to every remaining page. Owner direction of 7 October 2026 ("complete site-wide refinement, sample-first"). This file records what changed. It adds no company facts.

## 1. Shared design system (applies to every page now)

- **Typography (owner amendment):** normal body 16 to 17px, reading text 17 to 18px, lead 18 to 20px, a new statement size of 19 to 22px, and a slightly smaller H2 (24 to 34px). The lead and statement styles that felt oversized on Business Web Platforms now use the lead size. Tests and the typography document carry the new floors.
- **Vertical rhythm:** section padding reduced from 56 to 112px to 48 to 88px.
- **At a glance:** the first question fits the page (What we do; What we build on Work Areas; What it is on technology pages); "Who it helps" replaces "Who it is for". The selected option has a blue edge, options lift on hover, and each answer ends with a progress bar ("1 of 4") and the next question, so it is obvious the questions can be chosen.
- **Answer split:** opening sections set the heading and the direct answer together in the left column and the supporting paragraphs beside them, so the left column is never an empty rail.
- **Tile lists:** long lists run full width under their heading, three across, with a quiet accent that lengthens on hover.
- **Split visual sections:** a diagram or interface sits beside its heading and points; four or more points run in a row underneath so the text never outgrows the visual.
- **Compare tables:** two options side by side, the recommended one raised as a card running down the table.
- **Callouts:** one composed card (label and title left, story right); the limits callout is a dark card for a deliberate change of pace. No dashed boxes.
- **Process steps:** four steps sit in one row of four, not three and one.
- **Where this connects:** compact cards of link chips under a full-width heading instead of four long ruled columns.
- **Diagrams:** quieter one-pixel outlines with slight depth; workflow steps light up in order as a flow scrolls into view (once, never looping, off for reduced motion).
- **Interface mockups:** soft frames with depth instead of heavy outlines; image areas drawn as artwork instead of hatched placeholders; generic but realistic content (consultations, online booking, client area; named products with stock states).

## 2. New product interfaces

- `platform-ui` (Business Web Platforms hero): a booking page where a visitor picks a day and time, with the staff view receiving the booking, the documents, and the payment, and a note that it is saved to the business's records. Laid out on a grid so the staff card never covers the booking controls.
- The customer portal (`portal-wireframe` id kept) is now an HTML product interface: a desktop portal with menu, search, summary cards, and orders with statuses, and a phone in front of it. The old SVG wireframe with scaled text was removed.

## 3. Software Development

At a glance rewritten in DECHY's voice; "Our approach" in the answer split; build, buy, or connect as the selectable comparison; the ten system types as full-width tiles; the interfaces section rebuilt around the new portal interface; the quality figure as before; callouts as cards; connections as chip cards.

## 4. Business Web Platforms

New hero copy ("We build websites that do the work ...") and the booking platform interface; "In practice" now sets the six-part platform diagram beside two points; "Brochure site or platform?" is a side-by-side comparison; the separate "What we build" lists merged into the site-editor section as four points; four delivery steps in one row; the example as a card. The page is about 6,500px at 1440px wide, from about 7,400px.

## 5. Next

After approval, the same standard is applied page by page to every remaining page family, with each page's opening, At a glance answers, and section intros rewritten in DECHY's voice, followed by a full-site QA pass.
