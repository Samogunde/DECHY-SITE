# Site-wide refinement: design system, page families, and the two sample pages

Status: IN PROGRESS. Owner direction of 7 October 2026 ("complete site-wide refinement, sample-first"), followed by the owner's review of the samples with screenshots: visual defects, every page family sharing one format, runs of text-only sections, and stacked accordions that look alike. This file records what changed. It adds no company facts.

## 1. Shared design system

- **Typography (owner amendment):** normal body 16 to 17px, reading text 17 to 18px, lead 18 to 20px, a statement size of 19 to 22px, and a slightly smaller H2 (24 to 34px). Tests and the typography document carry the new floors.
- **Vertical rhythm:** section padding 48 to 88px (was 56 to 112px).
- **At a glance:** the first question fits the page (What we do; What we build on Work Areas; What it is on technology pages); "Who it helps"; a blue edge on the selected option, lift on hover, a progress bar ("1 of 4") and the next question.
- **Answer split:** opening sections set the heading and the direct answer together on the left and the supporting paragraphs beside them. Prose sections now use the same pattern (first paragraph as the answer), so no prose section arrives as one undivided column.
- **Opening beside a visual:** on technology and industry pages, the teaching diagram that used to sit in the hero is set beside the opening text.
- **Compact diagrams beside their heading:** hub, layers, funnel, and decision diagrams sit beside their heading and points instead of under them, so a section never leaves half its width empty. Flows and before-and-after stay full width.
- **Hub diagram rebuilt (32 pages):** the core sits in the middle with its parts on both sides, joined by straight connectors that end in a port on the core; both sides share grid rows so facing parts line up. Narrow containers draw a tree: the core on top and the parts hanging from one line, each part drawing its own segment so the line starts at the core and ends at the last part. Replaces the dark box with one small arrow into a dashed box.
- **Compare tables:** the header cells now line up with their columns (a visually hidden header cell had dropped out of the grid and shifted every header one column left).
- **Option cards:** on a page that already has a chooser, an option comparison is shown as cards (with "This page" on the current technology) instead of a second identical select panel.
- **Technical detail:** a dark section with topic tabs (ARIA tabs, arrow keys) and a two-column panel, so it no longer looks like the questions that follow it.
- **Common questions:** numbered question cards that open in place, with a "Have a different question?" card beside them on wide screens and after them on phones.
- **Grouped lists (about 100 pages):** cards with a number, a title, and checked items instead of ruled bullet columns.
- **Delivery steps (60 pages):** connected step cards; numbers joined by one line across the row (wide) or down the page (narrow); what each step produces shown as tags.
- **Destination cards:** a short list where every entry is a page is shown as link cards with an arrow.
- **Callouts:** one composed card; the limits card is dark, and turns light when the dark technical section follows it, so two dark bands never meet.
- **Where this connects:** compact cards of link chips; five groups now share one row.
- **Interface mockups:** tiles reflow instead of squeezing, so a word is never split across lines ("Consultations"); placeholder text ("Company name", "Customer name") replaced with generic, realistic content (kinds of deals and jobs, never client names).

## 2. Page families now open differently

- **Services:** interface or diagram hero (unchanged pattern).
- **Technology pages (52):** a profile card beside the headline: a neutral category icon (never a logo), the service it belongs to, what it works with, alternatives, and the systems we build with it, all from the entity graph.
- **Solution pages (6):** the answer drawn as a blueprint on a dark panel, with the systems and technologies it is usually built with.
- **Industry pages (8):** a sector card: systems we build, solutions, services, and the technologies often used.
- **Work Areas (25):** the system drawn inside a product window ("System map"), with what it is often built with underneath.

## 3. Voice

Every Work Area opening, the five country openings, and the hub and company openings were rewritten in DECHY's voice ("We build customer portals: ...") and the meta copy ("This page explains ...") removed. No new factual claims.

## 4. The two samples

- **Software Development:** At a glance in DECHY's voice; "Our approach" in the answer split; build, buy, or connect as the selectable comparison; the ten system types as full-width tiles; the interfaces section around the customer portal interface; callouts as cards; connections as chip cards.
- **Business Web Platforms:** new hero copy and the booking platform interface; "In practice" with the platform hub beside two points; "Brochure site or platform?" as a side-by-side comparison; one site-editor section with four points; four delivery steps in one row; the example as a card.

## 5. Next

Continue page by page across every family (content voice inside sections, section order variety within families, photography where it helps), then a full-site QA pass at every required width.
