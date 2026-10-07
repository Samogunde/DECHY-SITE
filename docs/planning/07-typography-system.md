# DECHY Responsive Typography System

Status: APPROVED DESIGN SPECIFICATION (kept by the owner, ADR 0001). Part of the Phase 0 design system. No production site exists.
Source files: `docs/design/typography-tokens.css` (the tokens) and `docs/design/typography-specimen.html` (a review page that uses the tokens). Both are design artifacts, not site code.
Fonts (CONFIRMED): Manrope for headings and UI, Source Sans 3 for body and long-form, monospace only where technically appropriate.
Verification: every number below was computed from the tokens, and the specimen was rendered in a real browser at 390, 820, 1280, 1440, and 1920 px wide with the actual web fonts, reading back computed sizes and characters per line.

## 1. The problem being solved

The earlier build used about 14px body text and read like documentation. Replacing it with one bigger fixed number would fix desktop and break mobile, or the reverse. The system below does not use one number. It uses a small set of roles, lets each role scale according to how much it needs to, and controls the reading width separately, because size alone does not make text comfortable.

## 2. Findings from measuring the actual fonts (VERIFIED)

| Measure | Result | Consequence |
|---|---|---|
| x-height of Source Sans 3 | 0.49 em | Slightly smaller than the system UI font (0.50). A 17px Source Sans 3 reads like about 16.6px system text. This is why 14px felt tiny and why 16px would still feel small. |
| x-height of Manrope | 0.54 em | Manrope is taller and wide, so its headings look larger than the same pixel size in other fonts. Headings can be set a little smaller and need tighter letter spacing at large sizes. |
| `ch` unit vs real text | 66ch gave about 73 real characters per line | `ch` measures the digit "0", which is wider than average letters. Reading measures are set at 62ch and 64ch to land at 66 to 72 real characters per line. |
| Average line length after tuning | 69 to 71 characters from 820px to 1920px wide | Measure stays stable as text grows, which is the point. |

## 3. Design principles

1. **Roles, not sizes.** Every piece of text has a role (display, heading level, lead, body large, body, body small, caption, label, UI). Components use roles, never raw pixel values.
2. **Contrast scaling.** The bigger a role is, the more it changes between phone and desktop. Body changes about 9 to 14 percent between phone and desktop; H1 about 63 percent; Display about 89 percent. Proportional scaling of everything would make phone body text too big or desktop body text too small. This is how both complaints are avoided.
3. **Fluid where it is smooth, stepped where ergonomics matter.** Reading and heading roles are fluid with `clamp()`. Controls and navigation are fixed sizes that change only at breakpoints.
4. **Size and width are designed together.** Each reading role has its own measure in `ch`.
5. **rem everywhere.** Respects the browser font-size preference and zoom.
6. **A floor.** Nothing readable is below 14px. Body copy is never below 17px. AMENDED by the owner on 7 October 2026: normal body is 16 to 17px, reading text 17 to 18px, lead 18 to 20px, and statements 19 to 22px (`--fs-statement`); body is never below 16px. The tokens in `src/styles/typography-tokens.css` and the browser and unit tests carry the new floors.

## 4. The scale

Fluid range is 360px to 1440px viewport, then a scale step above that. Values at selected viewports (px, computed):

| Level | 360 | 390 | 768 | 1024 | 1280 | 1440 | 1920 (x1.06) | 2560 (x1.12) |
|---|---|---|---|---|---|---|---|---|
| Display | 36.0 | 36.9 | 48.1 | 55.7 | 63.3 | 68.0 | 72.1 | 76.2 |
| H1 | 32.0 | 32.6 | 39.6 | 44.3 | 49.0 | 52.0 | 55.1 | 58.2 |
| H2 | 26.0 | 26.3 | 30.5 | 33.4 | 36.2 | 38.0 | 40.3 | 42.6 |
| H3 | 21.0 | 21.2 | 23.6 | 25.3 | 27.0 | 28.0 | 29.7 | 31.4 |
| H4 | 18.5 | 18.6 | 19.8 | 20.7 | 21.5 | 22.0 | 23.3 | 24.6 |
| Lead | 19.5 | 19.6 | 21.2 | 22.3 | 23.3 | 24.0 | 25.4 | 26.9 |
| Body large | 17.5 | 17.6 | 18.4 | 19.0 | 19.6 | 20.0 | 21.2 | 22.4 |
| Body | 17.0 | 17.0 | 17.6 | 17.9 | 18.3 | 18.5 | 19.6 | 20.7 |
| Body small | 15.0 | 15.0 | 15.4 | 15.6 | 15.9 | 16.0 | 17.0 | 17.9 |

Fixed (never fluid, never scaled): caption 14, label 14, eyebrow 13 (uppercase, 2 to 4 words only), navigation 15 (16 from 1280px), mobile menu items 18, buttons 16, form inputs 16 (so iOS does not zoom on focus), help and error text 14, code 0.9em of surrounding text and never below 14.

## 5. Roles, fonts, weights, line heights, tracking

| Role | Font and weight | Line height (phone / tablet / laptop+) | Tracking | Used for |
|---|---|---|---|---|
| Display | Manrope 700 | 1.06 | -0.025em | Homepage hero statement only |
| H1 | Manrope 700 | 1.12 / 1.12 / 1.08 | -0.02em | One per page |
| H2 | Manrope 700 | 1.20 / 1.20 / 1.16 | -0.015em | Section headings |
| H3 | Manrope 600 | 1.30 / 1.30 / 1.26 | -0.01em | Subsections, card titles on feature cards |
| H4 | Manrope 600 | 1.40 | 0 | FAQ questions, small headings |
| H5, H6 | Manrope 700, 16 and 14, H6 as label | 1.35 | 0 | Rare |
| Section heading kicker (eyebrow) | Manrope 700, 13, uppercase | 1.3 | +0.08em | Above H1/H2, 2 to 4 words |
| Lead | Source Sans 3 400 | 1.5 | 0 | Intro under H1 |
| Body large | Source Sans 3 400 | 1.65 / 1.65 / 1.70 | 0 | Articles, guides, service narrative |
| Body | Source Sans 3 400 | 1.60 / 1.65 / 1.65 | 0 | Cards, FAQ answers, general UI copy |
| Body small | Source Sans 3 400 | 1.5 | 0 | Table cells, secondary notes, footer text |
| Caption and metadata | Source Sans 3 400, 14 | 1.45 | 0 | Figure captions, author and date lines, breadcrumbs |
| Label | Manrope 600, 14 | 1.35 | 0 | Form labels, tags, badges |
| Navigation | Manrope 600 | 1.35 | 0 | Menus |
| Button | Manrope 600, 16 | 1.2 | 0 | All buttons; 44px minimum height |
| Technical text | system monospace stack, 0.9em | 1.6 | 0 | Code and identifiers only |

Weights are limited to what is loaded: Manrope 500, 600, 700, 800 (800 reserved), Source Sans 3 400, 600, 700, and 400 italic. Bold in body is 600, not 700, for a calmer page. Numerals in statistics use tabular figures if the font provides them (to be confirmed at build).

Headings use `text-wrap: balance` and body paragraphs `text-wrap: pretty` as progressive enhancements (browsers without support simply wrap normally).

## 6. Reading widths

| Context | Measure | Real characters per line (measured) | Notes |
|---|---|---|---|
| Articles and guides | 62ch | 69 | Body large; sticky table of contents in a side column on desktop |
| Service, solution, Work Area, country narrative | 64ch | 71 | Body large; wider figures and tables break out to the full content frame |
| Lead paragraph | 54ch | about 60 | Keeps the intro short and punchy |
| H1 and hero statements | 22ch with balance | n/a | Prevents orphan words and very long headlines |
| FAQ answers, card text | up to 64ch, usually narrower by the grid | 45 to 70 | Cards are not stretched to fill wide columns |
| Technical content | Prose stays at 62 to 64ch; tables, diagrams, and code blocks use the full content frame and scroll horizontally if needed | n/a | Never squeeze a table to the prose measure |
| Content frame | 1200px at 1024, 1280px from 1280px, 1440px from 1920px, 1600px from 2560px | n/a | Frame grows with type; prose measure does not |

Rule: prose never runs wider than its measure regardless of screen size. Large screens gain whitespace and larger figures, not longer lines.

## 7. Where fluid sizing is used, and where breakpoints are used

**Fluid (`clamp()` between 360px and 1440px):** Display, H1, H2, H3, H4, Lead, Body large, Body, Body small. Each is `clamp(min, intercept + slope * vw, max)` with a rem intercept, so the preferred value always contains a rem part.

**Breakpoint steps (not fluid):**

| Breakpoint | Changes |
|---|---|
| 768px (tablet) | Body line height 1.60 to 1.65; page gutter 20 to 32px; two-column layouts begin |
| 1024px (laptop) | Heading line heights tighten (H1 1.12 to 1.08, H2 1.20 to 1.16, H3 1.30 to 1.26); body large line height 1.65 to 1.70; gutter 40px; desktop navigation appears at 15px |
| 1280px (desktop) | Navigation 15 to 16px; content frame 1280px; gutter 48px |
| 1920px (large desktop) | Scale multiplier 1.06 on fluid roles; content frame 1440px |
| 2560px (very large desktop) | Scale multiplier 1.12; content frame 1600px |

Tablet is deliberately not "stretched phone": it gets its own line heights, gutters, and layout columns, and its type sits mid-range (body large 18.4, H1 39.6).

## 8. How the system prevents the two failure modes

**Desktop text too small**
- Body large reaches 19.6px at 1280 and 20px at 1440; body 18.3 to 18.5. At 1920 and above the multiplier raises them to 21.2 and 19.6, so a large monitor does not look like a phone layout with margins.
- Card and FAQ text (Body role) is only about 8 percent smaller than article text and is never under 17px; 14px text exists only for captions and labels.
- Small text (15 to 16px, rising with the multiplier) is limited to secondary information.

**Mobile text too big**
- Body is 17 to 17.5px, in line with platform text sizes; it does not rise on small screens to "make it readable".
- Display is 36px (not 48 or 56); H1 is 32px; H2 26px. The homepage statement wraps to five lines at 390px, which was judged calm in the rendered specimen.
- Fixed UI roles stay at 14 to 18px, so buttons and labels do not inflate.
- Heading to body ratio on phones is about 1.5 for H2 (26 / 17), against about 2.1 on desktop (38 / 18), so phones stay calm.

## 9. Accessibility (WCAG 2.2 AA unless stated)

- **1.4.4 Resize text (200%)**: all sizes in rem with a rem component in every `clamp()`; the maximum is below 2.5 times the minimum for every role (largest ratio is Display at 1.89). Browser zoom and text-only zoom both enlarge the text; layout reflows.
- **1.4.10 Reflow**: no horizontal scrolling at 320 CSS px for prose; wide tables and code scroll in their own container with keyboard access (`tabindex="0"`).
- **1.4.12 Text spacing**: no fixed heights on text containers; line height is at least 1.5 for paragraph text, so user stylesheets that raise spacing do not clip content.
- **1.4.3 Contrast**: body text uses Deep Charcoal on Warm Off White (16.4:1). Secondary text uses the derived slate text color and link text uses the derived link blue (see the design system) because the brand slate and blue fail in small-text use on Warm Off White.
- **1.4.8 (AAA guidance adopted)**: line length is at most about 72 characters, paragraphs are left aligned (never justified), and spacing between paragraphs is at least 1em.
- **2.5.8 Target size**: controls are at least 44px tall, above the 24px AA minimum.
- Language: `lang` is set on `html`; non-Latin locales add specific fallbacks before launch (Arabic and CJK need locale font stacks and often a larger line height).
- Uppercase is limited to short eyebrows; no all-caps paragraphs; no text in images for essential content.
- Reduced motion has no effect on type, but any text animation is disabled for it.

## 10. Why this scale

- **Body range of 17 to 20px.** Source Sans 3 has a small x-height, so its pixel size must be higher than a typical system font for the same visual size. Calibration: 17px has an x-height of 8.3px, matching 16.6px system text on phones; 19.6px at 1280 has 9.6px, matching 19px system text, which is where premium reading sites sit.
- **Two body tiers on purpose.** Long-form reading (service narrative and articles) gets the larger tier and longer line height; cards and FAQs get the second tier so layouts can stay dense without small type.
- **Heading ratio about 1.25 to 1.4 between levels on desktop and 1.2 on phone**, which gives clear hierarchy without exaggerated headline sizes (the spec warns against oversize startup headlines).
- **Manrope tracking tightens with size** because Manrope is wide; this keeps long headings from sprawling.
- **A display tier used once per site** (homepage hero) so ordinary pages never look like landing-page templates.

## 11. Component notes

- **Navigation**: 15px on laptop, 16px from 1280; mobile menu items 18px with 56px rows; current item shown by weight and an underline, not by color alone.
- **Buttons**: 16px Manrope 600, no uppercase, 44px minimum height, 6px radius.
- **Forms**: 16px inputs and 14px labels and help text; error text 14px with an icon and not by color alone.
- **Breadcrumbs**: 14px, the current page at weight 600.
- **Metadata** (author, reviewer, date, read time): 14px caption role.
- **FAQs**: question H4 role (Manrope 600, 18.5 to 22px), answer Body role.
- **Cards**: title Manrope 600 at 18 to 21px (fluid within its own small range), description Body role. Cards are limited to genuinely parallel short items.
- **Tables**: Body small for cells (15 to 16px), headers Label role; rows have at least 12px vertical padding.
- **Code**: inline `code` in the monospace stack at 0.9em with a light background; blocks at no less than 14px, line height 1.6, horizontal scroll, no wrapping of code, no ligatures.
- **Statistics and large numbers** (only when supplied facts exist): Manrope 700 with tabular numerals at H2 to H1 size.

## 12. Font loading

Self-hosted through `next/font` with the variable versions of Manrope and Source Sans 3, Latin and Latin Extended subsets, `display: swap`, automatic size-adjusted fallbacks to avoid layout shift, roman files preloaded and the italic loaded only on pages that use it. The specimen uses Google Fonts only because it is a review page; the site will not call a font CDN at runtime.

## 13. Test plan for implementation

1. Playwright captures at 320, 360, 375, 390, 430, 768, 820, 1024, 1280, 1440, 1920, and 2560 px wide.
2. A unit test reads computed font sizes and asserts the floors (body at least 17px, nothing readable under 14px).
3. A test measures characters per line on prose elements (accept 60 to 75).
4. axe checks for contrast on every template.
5. Manual: 200 percent zoom, text-only zoom, and a mobile screen reader pass on the two representative pages.
6. Human review of the two representative pages on a phone, a tablet, a laptop, and a large monitor before the scale is applied site-wide.

## 14. Decision

DEC-13 (approved in principle; this measured system is kept). Tuning after the first browser review of Home and Software Development is expected and allowed through a change to the tokens only, never page by page.
