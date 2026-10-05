# ADR 0001: Phase 0 approvals and standing decisions

Status: Accepted by the owner (first Phase 0 approval and second decision approval, 2026-10-04).
Authority: owner's explicit instructions in chat.

## Approved direction

- Fresh DECHY project; GitHub repository `Samogunde/DECHY-SITE`; local working directory `C:\DECHY-SITE`; GitHub is the permanent source of truth; no connection to the old Codex repository.
- Workflow: local development, test, commit, push, then Netlify deployment.
- Full DECHY capability architecture retained; classification organizes and never reduces public positioning; no public "no proof" disclaimers.
- Approved PNG logo used as supplied; no redesign, regeneration, or vector gate. Vector master and brand-asset system are later recommendations.
- Work architecture retained (Work Areas and Work Entries); Work Areas must be substantive, not thin SEO pages. No fabricated client names, testimonials, results, statistics, awards, dates, or confidential information.
- Country-level architecture retained for international search and content expansion; it does not mean DECHY only targets those countries; no implied offices or branches; no city pages.
- 53 launch articles retained, six-batch structure approved. Articles are to be written in the content implementation phase, not during the planning gate.
- Stack direction: Next.js, React, TypeScript, App Router, Tailwind CSS; typed content architecture; entity architecture; SEO, AEO, GEO architecture.
- Phase 1 begins with Homepage and Software Development, after the Phase 0 package is reviewed and Phase 1 is explicitly authorized.
- Larger, more readable body typography approved in direction; the full responsive typography system is specified in `docs/planning/07-typography-system.md`.
- Derived accessible color variants approved where required for contrast; the approved brand tokens (#111827, #2F6FED, #F7F6F2, #E5E7EB, #6B7280) are unchanged.
- CLAUDE.md established with a precedence model; it must not contradict AGENTS.md, DECHY_CONTENT_MASTER.md, or DECHY_CLAUDE_MASTER_HANDOFF.md.
- Domain: deferred. Candidates include dechy.com (currently registered and parked for sale), dechytech.com, dechydev.com. The architecture is domain-independent. No brand change.

## Authority model

The owner is the final product owner. Claude Code is responsible for research, analysis, architecture, recommendations, implementation, testing, debugging, Git, deployment, and technical quality, and should challenge weak decisions. Major changes to brand, positioning, core service architecture, domain strategy, major information architecture, major technical architecture, public factual claims, or scope are presented for approval and never changed silently.

## Amendments to source documents proposed by the Phase 0 package (not yet applied to those documents)

These are recorded here so the replaced text is explicit. They take effect for implementation decisions once the owner approves the Phase 0 package; the amendment ledger and in-place supersession markers are in ADR 0002, which the owner authorized.

| Proposed amendment | Replaces |
|---|---|
| App at repository root instead of a `website/` subfolder | AGENTS 78 layout |
| Claude Code is the primary engineering agent; Codex references retired | AGENTS 79 item 10, AGENTS 81 |
| Canonical-home URLs for technologies; flat hubs for industries, solutions, work, locations, resources | Clarifies AGENTS 29 examples; `/automation/airtable-automation/` merged into `/automation/airtable/` |
| Problem entities open Solution pages; no separate problem page family | Clarifies AGENTS 22, 23, 71 |
| Country pages (10 to 15) with waves; no city pages | Clarifies AGENTS 24, 47 |
| The 53-article architecture in `docs/planning/06-article-plan-53.md` | Fills the missing list referenced by Content Master 9 |
| Derived accessible color tokens and the typography system | Adds to AGENTS 1A.5 to 1A.8; brand values unchanged |

## Second approval (decision register review)

- Repository `Samogunde/DECHY-SITE` is private. No other repository created; name unchanged. The three existing commits stay as they are (no rewrite, no force-push).
- Future commits use `102127730+Samogunde@users.noreply.github.com`.
- Approved: DEC-07 (four entity/page principles), DEC-08 (URL rules, `/ai/` and `/cloud/` kept, Airtable merged), DEC-10 (navigation and five families), DEC-11 (root application layout with enforced conceptual separation), DEC-23 (working positioning copy, refined in Phase 1), DEC-24 (structure not ranking), DEC-31 (Phase 1 scope), DEC-32 (global positioning; countries not exclusive).
- Phase 1 handling: unbuilt pages are plain text, never dead links, fake routes, "Coming Soon", or placeholder pages; the contact form is built with a securely configurable destination and no fake inbox; imagery is not restricted to diagrams but is purposeful, properly licensed, provenance-tracked, never fabricated evidence.
- Responsive design: mobile, tablet, laptop, desktop, and large desktop are all first-class and validated in a browser.
- The measured typography system (`docs/planning/07-typography-system.md`, `docs/design/typography-tokens.css`) is kept.
- FAQs are kept despite the retirement of FAQ rich results. `llms.txt` is optional, never a core dependency.
- External research continues but is kept separate from company facts and never weakens or invents capability claims.
- Precedence model: owner instruction; AGENTS.md; DECHY_CONTENT_MASTER.md; DECHY_CLAUDE_MASTER_HANDOFF.md; approved Phase 0 plan; decision records; implementation details.

## Status of the proposed amendments (table above)

Approved by the owner: root layout instead of `website/`; canonical-home URLs and flat hubs; merging the Airtable pair; problems opening Solution pages; country pages (10 to 15, waves) without cities; the 53-article architecture; derived accessible colors and the typography system. Claude Code as primary engineering agent is established by `CLAUDE.md`. Editing the text of AGENTS.md, the Content Master, or the Handoff (for example retiring the Codex references) was authorized by the owner in the reconciliation instruction; the files are annotated in place with original wording preserved (see ADR 0002).
