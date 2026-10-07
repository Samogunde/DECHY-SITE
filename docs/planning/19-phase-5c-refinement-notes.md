# Phase 5C: complete visual, interaction, content, and design-system refinement (notes)

Status: IMPLEMENTED. Authorized by the owner on 7 October 2026 with twenty reference screenshots. No pages were added. This file records what changed. It adds no company facts.

## 1. One interaction for "choose and see"

`src/components/sections/SelectPanel.tsx` is a single, accessible pattern used in three places:

- **At a glance** on every guided page (services, hubs, solutions, work areas, industries, technologies, countries, company, resources). The three earlier forms (tabs, flow, editorial) are retired, so every page now behaves the same way. A visible prompt says the questions can be chosen; the selected option is filled dark; the answer panel names the question it answers; a "Next" control steps through the answers; the next step is a separate action panel.
- **Route choosers** ("Which route fits you?"), replacing the radio-input version.
- **Option comparisons**: tables whose first column lists options to choose between (Option, Route, Approach, Way to connect, Tool, Platform, Model, Situation, Language, Channel; two to six rows) become a choice with an answer panel. Build, buy, or connect is one of them.

Behaviour: each option is a real button. Wide screens show a rail of options beside one panel, with hover preview on devices that hover; narrow screens show an accordion. Click, tap, Enter, Space, and the arrow keys all work. Every panel is in the markup, so content stays readable to search engines and assistive technology.

## 2. Other shared components

- **Tables** that remain tables have a lighter header, more spacing, a row highlight, and become one card per row on narrow screens (no sideways scrolling).
- **Quality figure**: the pyramid and checklist became one composition. Stacked test layers on the left; a release pipeline on the right whose stages can be selected (click, tap, keyboard) to open their detail, with passed stages marked. The stray centring that pushed titles right is gone.
- **Decision diagram**: one question, column labels shown once, then rows of situation and recommendation; no repeated "IF / CHOOSE" boxes. Narrow screens join each situation to its recommendation with an accent rule.
- **Connectors**: arrowheads between stacked layers are solid and stop a fixed clearance short of the next box. The software diagram's base became a Build, Test, Release, Maintain pipeline.
- **Bullets**: ordinary list markers are neutral (ink dot or slate dash); blue is kept for links, selection, and emphasis.
- **Entity chips** ("Where it is applied", "Kinds of organization"): items with a page are link chips with an arrow and hover state; business types link to Who we work with, the ecommerce sector links to the Ecommerce service (`representedPath` in `src/lib/content/urls.ts`); items with no canonical page are dashed tags that do not look clickable. No page was created and no dead link added.

## 3. Hero variety

Cybersecurity's hero now shows its layered protection diagram; the prioritization funnel moved to its own section ("From every possible threat to a short list"). Together with the Phase 5B changes, services use architecture (software), product interfaces (web, mobile, AI, automation, ecommerce, data, UI/UX), connected systems (integration), infrastructure and security layers (cloud, cybersecurity, SEO, branding), funnels (digital marketing), and a decision layout (consulting).

## 4. Voice

The opening section of ten service pages and all 25 Work Areas no longer reads as a dictionary entry ("Custom software is ..."). Each now opens with what DECHY does ("We build software for one organization's own processes ..."), keeping a short definition only where it helps and glossing terms on first use. Those sections are labelled "Our approach" (services) and "In practice" (Work Areas) instead of repeating "What it is", which At a glance already answers.

## 5. Verification

Typecheck, lint, format, content validation (127 pages, 0 errors), unit tests, production build, targeted browser runs, and the full browser suite in CI before merge. Browser inspection at 1280 and 390 covered the Software Development hero and sections, At a glance, choosers, option comparisons, the quality figure, entity chips, the decision diagram, Cybersecurity, and Automation.
