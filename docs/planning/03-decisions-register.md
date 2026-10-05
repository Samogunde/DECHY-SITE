# DECHY Decisions Register

Status: DRAFT FOR REVIEW. Each decision shows my recommendation. "Blocks" says which phase cannot proceed without it. Reply with the decision numbers you approve (for example "approve all recommendations except DEC-09 and DEC-20"), or change any.

Priority: **P0** blocks Phase 1. **P1** blocks Phase 2 release. **P2** later.

## A. Environment and operations

| ID | Pri | Decision | Options | Recommendation |
|---|---|---|---|---|
| DEC-01 | P0 | Where does the working copy live? It is currently inside OneDrive (sync conflicts with `node_modules`, `.next`, `.git`; path contains a space). | (a) Keep in OneDrive; (b) move to a non-synced folder such as `C:\Dev\dechy-site`; (c) keep in OneDrive but pause sync for the folder | **(b).** GitHub is the backup. I will move the folder, re-verify Git, and keep your original source files recoverable. |
| DEC-02 | P0 | dechy.com: it is already registered (created 2009-03-04, **expires 2027-03-04**, registrar-locked, nameservers NS1/NS2.NAMEFIND.COM) and currently responds with HTTP 200. Who controls the registrar and DNS, what does the live site contain, is email (MX) in use, and will you renew now? | Provide registrar/DNS access method and inventory | Confirm ownership and enable auto-renew for multiple years immediately. Give me the current site's purpose and any inbound URLs. I can inventory DNS records read-only. No DNS change happens without your explicit go-ahead. |
| DEC-26 | P1 | Netlify: who authorizes the account, which plan, and who owns it? | I cannot log in for you | You create or authorize the Netlify account and connect the GitHub repo; I configure everything else. Choose a plan after seeing build and bandwidth needs. |
| DEC-27 | P0 | Git commit identity. Global config is `Samogunde` / `ssmmyjoy5@gmail.com`; this session's account email is `ssmmyjoy10@gmail.com`. | Use configured identity; use the session email; use a GitHub noreply address | Confirm which email is attached to the Samogunde GitHub account so commits are attributed correctly. Default: keep the configured identity. |
| DEC-28 | P0 | Push the planning set and the four source files to GitHub now? The repository is empty; I could not determine whether it is public. Pushing publishes your internal strategy and the logo file. | (a) Commit locally only; (b) push to `main`; (c) push to a `planning` branch | **(a) now**, then (b) once you confirm the repo is **private** (or accept it being public). I will not push before you answer. |
| DEC-25 | P1 | Git/CI workflow: protected `main`, short-lived branches, GitHub Actions CI, Dependabot, optional `gh` CLI install. | Accept / modify | Accept as in plan section 34. `gh` is optional; installing it is a download I would ask about. |
| DEC-30 | P0 | Update governance files: add `CLAUDE.md` importing `AGENTS.md`; replace Codex references in AGENTS.md (sections 79, 81); create `docs/decisions/` ADR log. | Accept / modify | Accept. AGENTS.md changes are listed in an ADR for your approval before editing. |
| DEC-33 | P0 | Who is the final approver and is there a separate "master planner" reviewer (Content Master 2, 14)? | Name roles | Name the approver(s). I assume you are final approver. |

## B. Facts, claims, proof, people

| ID | Pri | Decision | Recommendation |
|---|---|---|---|
| DEC-05 | P0/P1 | Provide inputs for the **Approved Facts Register**: legal entity name and jurisdiction; confirm "since 2010" as founding or operating start; basis for "over 1,500" (internal record); contact email/phone/scheduling link; engagement models and pricing posture; markets served; languages spoken; confirmed external profiles (LinkedIn, GitHub, Upwork, Contra, Clutch, GoodFirms, others); any permitted client names, quotes, logos, certifications, partnerships. | Provide what exists; everything else stays out of the site. I will create the register file and leave unknowns marked unknown. |
| DEC-06 | P0 | **Capability tiers** for technologies and services (`core`, `working`, `familiar`, `unverified`). The spec lists several hundred technologies; none is evidenced. | I will pre-fill a proposed tier list from the shortlist in plan section 7 for you to correct. Only core/working may appear in capability language. |
| DEC-21 | P1 | Approve the **Proof Pipeline**: DECHY builds and publishes 3 to 5 clearly labeled reference implementations. Who builds them and which first? | Approve; start with lead-qualification workflow, document Q&A with evaluation, resilient API integration. I can build them. |
| DEC-22 | P1 | Named real people: authors/reviewers/leads, bios, and real photographs (with consent). | Provide at least one named technical lead/author. Without real people, "human" and E-E-A-T signals stay weak; I will not invent or generate staff. |
| DEC-29 | P1 | Trademark clearance for DECHY (note: "Dechy" is also a French commune with about 5,300 inhabitants; no matching tech company found in my web search). | Commission a clearance search in key markets before heavy investment. Outside engineering scope. |
| DEC-32 | P0 | Goals and markets: target customers and geographies, top service lines by revenue, definition of a qualified lead, measurable targets. | Provide; used to set homepage emphasis (DEC-24) and measurement. |

## C. Brand and design

| ID | Pri | Decision | Recommendation |
|---|---|---|---|
| DEC-03 | P0 | **Logo path.** Only one opaque 1536x676 PNG exists (background #FDFEFC; ink about #0A1B30; blue bar about #1B6BEE; descriptor baked in). Missing: vector master, transparent, reverse for dark, wordmark-only, monogram, favicon, app icon, mono versions. You said do not recreate; AGENTS 1A.3 says a vector master must eventually exist. | Options: (a) you supply/commission vector files; (b) you authorize a **faithful vector tracing** of the approved logo (same letterforms, spacing, colors) with side-by-side overlay proof, to be approved by you before use; (c) use the raster as is. **Recommend (b) or (a).** Until decided, Phase 1 can use the PNG on light backgrounds only, and dark sections and favicon wait. Also decide whether logo colors or tokens are the master (they differ slightly). |
| DEC-12 | P0 | **Derived accessible tokens** (link blue #2A62D8, on-dark blue #7AA5F8, slate text #5B6472, darker functional text colors; all computed). The CONFIRMED palette fails WCAG for several necessary pairs. | Approve derivation. Brand values remain unchanged. |
| DEC-13 | P0 | Type sizing: body 18px desktop (17 min mobile), line-height 1.65, fluid headings. | Approve. Prevents the "tiny body text" failure. |
| DEC-20 | P1 | Image sourcing policy: purpose-built diagrams first; licensed photography (Unsplash, Pexels or similar) sparingly; AI imagery only conceptual; per-batch download approval by you; masters outside Git. | Approve. I will present each batch (source, filename, size, license) for approval before downloading. |
| DEC-23 | P0 | Positioning statement. Candidates in plan section 2. | Choose one or supply your own. My lean: option 1. |
| DEC-24 | P0 | Homepage emphasis. Equal 15 pillars risk "does everything." Does revenue concentration justify stronger emphasis on some services (without ranking AI/Automation above the others)? | Tell me the real mix; I will structure emphasis within the five-family model. |

## D. Architecture and information design

| ID | Pri | Decision | Recommendation |
|---|---|---|---|
| DEC-04 | P0 | **Launch article list.** The Content Master says 53 are defined in AGENTS.md; they are not. | Supply the list, or approve me deriving a proposed slate (tied to services, real questions, and links) for approval; publish in batches of 8 to 10. |
| DEC-07 | P0 | Principles: (1) entity does not equal page; (2) one canonical home per concept; (3) service x technology page is canonical when "X development" intent dominates; (4) technology pages only for core/working capability. | Approve. |
| DEC-08 | P0 | URL rules: canonical-home URLs (`/software-development/python/`), flat hubs for industries/solutions/resources/work, `trailingSlash: true`, merge `/automation/airtable-automation/` into `/automation/airtable/`; keep short slugs `/ai/` and `/cloud/` (or rename to `/ai-machine-learning/` and `/cloud-devops/`). | Approve rules; keep the short slugs. |
| DEC-09 | P1 | Locations: no city pages; country pages only by evidence gate; no LocalBusiness schema. | Approve. |
| DEC-10 | P0 | Navigation: five capability families; Work hidden until evidence exists; business types as a section, not pages. | Approve. |
| DEC-11 | P0 | Repository layout: Next.js app at repo root; `data/`, `content/`, `docs/` as in plan section 26 (deviates from AGENTS 78 `website/` subfolder). | Approve. |
| DEC-14 | P0 | Content store: typed YAML/MDX in Git with Zod validation and a custom loader; no CMS at launch; masters outside Git. | Approve. |
| DEC-15 | P0 | Stack: Next.js (latest stable, patched), React, TypeScript strict, Tailwind, npm, Node 22, static-first on Netlify. | Approve; versions verified at scaffold, security advisories checked. |
| DEC-16 | P1 | Internationalization: locale-ready architecture, default locale unprefixed, English-only publishing, no language added before genuine localization. | Approve. |

## E. Operations of the site

| ID | Pri | Decision | Recommendation |
|---|---|---|---|
| DEC-17 | P1 | Analytics and consent: Search Console + Bing + a cookieless privacy-first analytics tool; GA4 only later and consent-gated. | Approve; choose the tool at implementation (Plausible, Umami, or Netlify). |
| DEC-18 | P1 | Contact/lead handling: form endpoint, bot protection, email delivery provider, where inquiries are stored (email only vs Airtable/CRM), response owner and time. Do not claim an integration until live. | Start with email delivery plus an Airtable record if you want to dogfood; tell me who answers. |
| DEC-19 | P1 | AI crawler policy: allow search/retrieval agents; training agents allow or block? | Allow retrieval agents; training is your business call (my lean: allow, since discoverability is a stated goal). |
| DEC-31 | P0 | Phase 1 scope: Home + Software Development + working Contact page + header/footer + 404 + minimum legal pages (privacy, cookies) so CTAs and forms are not dead ends. Legal text reviewed by a qualified person before launch. | Approve; legal drafts flagged "pending legal review" internally, never published as final without your sign-off. |

## F. Defaults I will apply unless you object

- No em dashes, en dashes, emojis, or the rejected tagline anywhere; enforced by lint.
- No third-party technology logos on the site.
- Pages with missing proof simply omit proof sections.
- Preview deployments are `noindex`.
- I will not push to GitHub or change DNS without explicit confirmation.
