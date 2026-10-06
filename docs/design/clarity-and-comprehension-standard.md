# Clarity, comprehension and solution-guidance standard

Status: permanent standard for every DECHY page, set by the owner on 2026-10-05 and applying to Phase 2 and every later phase. It sits beside `layout-and-visual-quality-rules.md` (how things are laid out) and `motion-system.md` (how things move). This document governs whether a visitor can understand and act.

The principle in one line: **DECHY should look technically capable while remaining easy for people to understand.** Technical accuracy and clarity are both required. A technically correct page that an ordinary business visitor cannot follow has failed.

## 1. The visitor's questions

Every major page lets a normal visitor answer these quickly, in roughly this order (an example sequence, not a mandatory template; pick the order that fits the visitor's intent):

1. What is this?
2. Why does it matter to me, and what problem does it solve?
3. Who is it for?
4. What does DECHY actually do?
5. How does it work, at a high level?
6. What options exist, and how do I choose?
7. What does the process look like?
8. What should I do next?

Each content file records its answers in a `comprehension` block (what, problem, audience, choose, next). That block feeds the page's "At a glance" summary and is the review record for the quality test in section 9.

## 2. Problem to next step

Pages move the visitor along: problem, understanding, options, solution, next step. Where it applies, say the problem, why it happens, what options exist, what DECHY can do, how the approach works, what to consider, and what to do next. Do not simply list services or technologies. Make the technical idea concrete in practical business terms. Example of the standard:

- Weak: "API integration connects different systems."
- Right: "If your CRM, website, payment system and internal tools do not share information automatically, your team may be entering the same data more than once. API integration connects those systems so information moves between them on its own."

## 3. Plain language

- Plain, direct sentences. Average sentence length about 20 words; no sentence over about 35 words without a reason.
- No unexplained jargon, acronyms or abstraction. When a technical term is needed, explain it the first time it appears on the page, in the same sentence or the next ("an API, which is a way for two programs to share information"). The `Term` component and the glossary (`data/taxonomy/concepts.yaml`, `plain` field) carry the explanation; the page still reads correctly without any hover.
- Prefer the visitor's words (the problem as they would say it) in headings; use the technical term in the body and explain it.
- Technical depth is progressive (section 4), never front-loaded.

## 4. Progressive depth

Explain in layers, so non-technical decision makers and technical evaluators both find what they need:

| Level | Content | Where it lives |
|---|---|---|
| 1 | What it means in plain language | The page's lead and "At a glance" |
| 2 | Why it matters and what problem it solves | Main body |
| 3 | How DECHY approaches it | Main body (process, decisions, options) |
| 4 | Technical detail: technologies, architecture, implementation considerations | "Technical detail" sections and expandable panels (`DeeperDetails`). The content is in the page for crawlers and assistive technology; it is not hidden behind hover. |

## 5. Scannability

A visitor should understand the page without reading every word: clear headings, short paragraphs, meaningful subheadings and lists, a visual hierarchy, tables only where comparison is the point, diagrams where they teach, clear calls to action. No walls of text. Do not cut substance just to look short: easy to scan, easy to understand, and substantive enough to be useful.

## 6. Diagrams teach, they do not decorate

Before drawing, answer: **what does the visitor need to understand?** Then pick the purpose and design for it.

Each diagram brief states (and the content file records) `purpose` (process, system, relationship, workflow, comparison, sequence, architecture, decision, transformation, before and after), `takeaway` (one sentence a visitor should leave with), and the audience. Then:

- A plain-language title that says what it shows; labels in everyday words, each with a short descriptor where the label is a technical term ("Background jobs: tasks that run on their own, such as sending reminders").
- Obvious relationships and direction: arrows only where flow is meant; numbered steps where order matters; visual emphasis on the one thing to notice.
- No unexplained boxes, arrows or acronyms. A non-technical visitor can read the diagram at a glance; the surrounding text adds depth.
- Enough spacing and readable text (the type floors apply). Simple and clear beats complicated and impressive. If it cannot communicate its purpose, redesign it.
- Heading, intro, diagram and caption say the same thing. The caption starts with what the diagram shows and how to read it. Scan order: heading, short explanation, visual, practical meaning, next action.
- Layout rules: `layout-and-visual-quality-rules.md`.

## 7. Interaction that helps understanding

Use hover explanations, expandable detail, comparison interactions, accordions, tabs, progressive disclosure, interactive diagrams, contextual links and next-step calls to action only where they help the visitor understand or choose. Rules: never make important information available only on hover (touch and keyboard users must reach it); everything works without JavaScript or reveals all content; focus states and reduced-motion behavior are unaffected. Do not turn everything into an interaction.

## 8. The site is a solution system

The visitor arrives with a business or technology problem and the site helps them understand what they need and what DECHY can do. This shapes information architecture, page structure, copy, diagrams, internal links and calls to action. Pathways must be obvious without being simplistic. A visitor can recognize themselves in statements such as:

- I need custom software.
- I need a mobile app.
- I need to automate this workflow.
- I need AI in our business.
- I need our systems to share information.
- I need to move to the cloud, or modernize.
- I need better security.
- I need an online store.
- I need to be found in search, including AI answers.
- I need help deciding what technology approach to take.

The "find your path" chooser, the Services hub, the Solutions hub and the "At a glance" block exist to make these pathways obvious.

## 9. Search, accuracy and the page test

- **Do not sacrifice SEO for clarity, or clarity for SEO.** Keep search language, entities and intent; write for people first. SEO, AEO and GEO strengthen readable content; they never make it harder to read.
- **Do not sacrifice accuracy for simplicity.** Simplify without changing the meaning: no misleading analogies, state necessary qualifications, and keep simple explanations separate from implementation detail.
- **Quality test for every page.** Before a page is complete, answer from the page alone: What does DECHY do here? What problem does this page solve? Who is it for? What would you choose if you had this problem? What should you do next? If any answer is not reasonably obvious, improve the page. No outside reader is needed for every page; this is the review standard, and the answers are recorded in the `comprehension` block.

## 10. Enforcement

- Content validator: required `comprehension` block; a visible "At a glance" summary on commercial and Work pages; every diagram has `purpose`, `takeaway` and a caption that states what it shows; jargon and acronym glossary check (first use explained); readability lint (sentence length, paragraph length); progressive-depth structure; next-step call to action present.
- Tests: no information reachable only by hover; keyboard and touch operation of every interactive explainer; expandable detail present in the DOM.
- Review: the quality test above, recorded per page, before any page is called complete.
