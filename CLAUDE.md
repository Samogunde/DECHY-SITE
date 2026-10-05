# CLAUDE.md: DECHY project governance for Claude Code

This file tells every Claude Code session how to work on DECHY. It adds no new company facts and does not override the DECHY specifications. Where it summarizes them, the source documents win.

## 1. Current state (update at every gate)

- Phase 0 (planning and architecture): **complete and approved.**
- Phase 1 (production implementation): **not started; requires the owner's explicit authorization in chat.** Approved Phase 1 scope is in `docs/planning/02-master-implementation-plan.md` (Appendix D and section 36).
- Working copy: `C:\DECHY-SITE`. Remote: `https://github.com/Samogunde/DECHY-SITE.git` (GitHub is the permanent source of truth). The repository is private. Never use or reference the abandoned Codex repository or its code.

## 2. Precedence model (which document governs what)

When documents disagree, resolve in this order. A higher item wins over a lower one for the type of decision it governs.

| Rank | Source | Governs |
|---|---|---|
| 1 | The owner's latest explicit instruction in chat | Everything. The owner is the final product owner. |
| 2 | `AGENTS.md` | Brand, positioning facts, descriptor, services, entity and SEO/AEO/GEO rules, URL and content-model principles, engineering quality gates (section 80A), prohibited behavior |
| 3 | `DECHY_CONTENT_MASTER.md` | Content depth, page composition, homepage and service blueprints, visual content standard, content QA and definition of done |
| 4 | `DECHY_CLAUDE_MASTER_HANDOFF.md` | Claude's role, audit and approval gates, phase order, working principles |
| 5 | `docs/planning/*` (approved Phase 0 plan) | Concrete architecture, designs, and decisions the owner approved, including amendments to rows 2 to 4 |
| 6 | `docs/decisions/` (decision records) | Why an approved amendment was made and which text it supersedes |
| 7 | Implementation details (code conventions, this file's process notes) | How things are built within everything above |

Rules for conflicts:
1. An approved planning decision or ADR that explicitly amends AGENTS.md, the Content Master, or the Handoff governs that specific point, and the ADR names the replaced text. Until an amendment is approved, the source document governs.
2. If a conflict is not covered by an approved amendment, do not guess: state the conflict, recommend a resolution, and ask.
3. Never silently change anything in the "approval required" list (section 4).
4. The owner's instruction to "use the PNG logo", "preserve the full capability architecture", and "no public proof disclaimers" are standing decisions recorded in `docs/decisions/0001-phase-0-approvals.md`.

Where to look first: for facts and brand read `AGENTS.md` sections 1 and 1A; for services and entity lists sections 2 to 23; for URLs, SEO, schema sections 24 to 64; for engineering and quality section 80A; for content depth read `DECHY_CONTENT_MASTER.md`; for process and gates read the Handoff sections 5 to 24. The approved plan is `docs/planning/02-master-implementation-plan.md`. `AGENTS.md` is large (about 27k tokens), so it is intentionally not auto-imported here; read the relevant sections on demand.

## 3. Non-negotiable rules (summaries; sources prevail)

- Official descriptor, exact: **Technology, Software, AI & Digital Solutions**. Never shorten or replace it. Rejected tagline: "Technology. People. Progress." Never use it.
- Company statement (approved, do not alter the figures): "Since 2010, DECHY has helped over 1,500 organizations, companies, firms, brands, businesses, individuals, professionals, teams, and other clients across a wide range of industries and business types."
- DECHY is global and has no physical offices, addresses, branches, local teams, or Google Business Profiles. Country pages mean "serves clients in"; never imply presence. No city pages.
- The full capability architecture in AGENTS.md is approved. Never remove a capability, technology, language, platform, framework, integration, industry, or service. Internal classification organizes the system; it never appears publicly as a disclaimer and never reduces positioning.
- Never invent specific facts: client names, project details, metrics, results, testimonials, awards, certifications, partnerships, dates, confidential information, staff. Illustrative examples are labeled illustrative. Work Entries and case studies come only from facts the owner supplies.
- AI, Automation, Web, or SEO must not become the whole identity or outrank other services.
- Style: no em dashes, no en dashes, no emojis in DECHY content or docs. Use "to" for ranges.
- Brand tokens are fixed: #111827, #2F6FED, #F7F6F2, #E5E7EB, #6B7280, Manrope (headings), Source Sans 3 (body). Derived accessible variants are allowed for contrast and must be documented; they never replace the brand tokens. Use the supplied PNG logo as is; do not redraw, recolor, stretch, or regenerate it.
- Imagery: purposeful original and properly licensed visuals, provenance tracked in the asset registry, nothing fabricated as evidence; confirm each download batch (source, filename, size, license) with the owner before downloading.
- Unbuilt pages render as plain text, never as dead links, fake routes, "Coming Soon", or placeholder pages.
- Typography follows `docs/planning/07-typography-system.md` and `docs/design/typography-tokens.css`.
- Company facts live only in the Approved Facts Register (to be created in Phase 1 under `data/facts/`). External technical research is kept separate (see `docs/planning/08-external-research-log.md`) and never becomes a company fact.

## 4. Approval required before action (present, do not decide silently)

Major changes to: brand; business positioning; core service architecture; domain strategy; major information architecture or URL rules; major technical architecture or stack; public factual claims; scope; and any edit to AGENTS.md, the Content Master, or the Handoff. Also required: Netlify account actions, DNS or domain changes, image downloads (list source, filename, size, license), and anything that publishes or sends content outside the repository other than a normal Git push.

Claude should still challenge weak decisions, recommend improvements, and report risks. Challenge is expected; silent change is not.

## 5. Working method

Plan, implement, test, inspect (in a real browser for UI), diagnose and fix, re-verify, then commit and push. Follow AGENTS.md section 80A: do not present knowingly broken work; report honestly what was and was not verified. Do not ask the owner to do work Claude can do.

## 6. Git and GitHub

- Verify `git remote -v` shows `Samogunde/DECHY-SITE` before any push.
- Planning and documentation: commit and push after verification.
- Production code (once authorized): short-lived branches, CI green, then merge to `main`; conventional commit messages (`feat:`, `fix:`, `content:`, `docs:`, `chore:`); never push knowingly broken work; never commit secrets; keep binary masters out of Git unless explicitly approved.
- Commit identity for this repository: `Samogunde <102127730+Samogunde@users.noreply.github.com>` (set in the local repo config; verify with `git config user.email` before committing). Existing commits are not rewritten.
- Commit messages end with the co-author line required by the session attribution instructions.
- Work only in `C:\DECHY-SITE` (outside OneDrive).

## 7. Commands

None yet. The application is not scaffolded. Add install, dev, test, lint, typecheck, and build commands here when Phase 1 is authorized and the scaffold exists.

## 8. Research policy

Use current external research when it materially improves technology, SEO/AEO/GEO, accessibility, security, search-engine, platform, or deployment decisions. Log findings with source and date in `docs/planning/08-external-research-log.md`. Re-verify versions and security advisories at scaffold time.
