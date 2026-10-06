# Phase 1 Implementation Notes

Status: Phase 1 built, verified locally and green in GitHub Actions on Linux (final commit `3951d34`), merged to `main`. Netlify authorization is the only external dependency still open. Sources of truth for scope: plan section 36 ("Phase 1 canonical scope") and Appendix D.

## What was built

Application foundation (Next.js 16.3.8, React 19.2.8, TypeScript strict, App Router, Tailwind 4.3, Node 22) at the repository root; approved design tokens and the measured responsive typography; a typed content system (Zod-validated YAML) with a 760-entity graph seeded one-for-one from the approved capability lists; validators enforcing the architecture on every build; tests and CI; SEO plumbing (metadata, canonicals, sitemap, robots, JSON-LD, breadcrumbs, Open Graph); header, footer, 404, Home, Software Development, Contact, Privacy policy, Cookie policy; original diagrams and a conceptual interface visual with a provenance registry.

## Decisions taken during implementation (within the approved architecture)

| Topic | Decision | Why |
|---|---|---|
| Toolchain versions | TypeScript 6.0.x, ESLint 9, React 19.2.8 | typescript-eslint does not yet support TypeScript 7; React is past the patched 19.2.1 RSC release |
| Rendering | Every page prerendered; only `/api/contact` is dynamic | Smallest server surface after the 2025 RSC advisory; best performance |
| CSP | `script-src 'unsafe-inline'` with everything else locked down | Next.js static pages carry inline bootstrap scripts; nonces would force dynamic rendering. Revisit with hash/SRI CSP |
| Favicon | None. `<link rel="icon" href="data:,">` | A favicon is a brand asset that has not been supplied or approved; none was invented. A custom 204 route failed in production and was removed |
| Logo | Approved PNG used unmodified; framed by CSS only; `darken` blend so its near-white background vanishes on Warm Off White; delivered via `next/image` (resized derivatives), master and public copy byte-identical (hash-tested) | No redraw, crop of the file, or variant |
| Imagery | Five licensed photographs plus six original diagrams (see the refinement pass below) | Superseded the first-pass decision to use diagrams only. Photographs sit where a real context communicates more than a drawing; diagrams stay where architecture or method is the point |
| Contact | Destination from environment (`none`, `log`, `webhook`, `resend`); honest 503 when unconfigured; honeypot, minimum fill time, same-origin, JSON-only, size cap, in-memory rate limit | No invented inbox. Rate limit is per instance; back it with a platform limit in production |
| Analytics | None | DEC-17 is open; the cookie policy states there are no analytics |
| Fonts | Latin subset preloaded only | `latin-ext` preloads cost about 40KB for an English-only site; add with localized content |
| Navigation | Unbuilt hubs render as plain text; Services menu lists all 15 with only built pages linked | Approved handling rule |

## Findings fixed during verification

Missing paragraph spacing (utility override of component CSS); horizontal overflow on mobile from a wide table stretching an implicit grid column; process numerals using brand blue on Warm Off White (4.21:1) now use the derived link blue; 36px logo link below the touch-target size; focus-trap cycle order in the mobile menu plus `inert` on page content; production 500 from a 204 favicon route; contact-form layout shift (CLS 0.204) from a Suspense fallback; honeypot rejection leaked the field name; Next.js 16.3 `next dev` appended an "agent rules" block to AGENTS.md (disabled with `agentRules: false`, block removed, regression-tested); wrong `images.qualities` for the logo; dev-mode registry re-parsed on every call (minutes per page) now cached by modification time; Prettier reformatted the approved typography tokens (now exempt and drift-tested).

## Verified results (local production build)

Unit tests: 82. Browser tests: 99 (12 widths x 5 pages with overflow, type floors, touch targets, reading measure; routes and metadata; navigation by mouse, keyboard, and touch; contact flows; axe WCAG 2.2 AA on every page at 390 and 1440 plus open-menu and error states; security headers; sitemap and robots). Lighthouse: accessibility 100 and best practices 100 everywhere; desktop performance 100; mobile performance 92 to 95 (simulated slow 4G, 4x CPU); SEO 100 with indexing enabled (69 only because pages are intentionally `noindex` before the domain is approved). `npm audit --omit=dev`: 0 vulnerabilities. Five dev-only advisories remain in the lint toolchain (`eslint-config-next` to `fast-glob` to `braces`, denial of service on crafted glob patterns); the suggested fix is a downgrade to Next 14, so it is not applied.

## Open items

- Netlify: creating or linking the site and the first deploy preview need the owner's authorization.
- Contact destination (DEC-18): choose a provider and set the environment variables in Netlify.
- Privacy and cookie policies are accurate to what the site does today but need review by a qualified person before launch; the legal entity and contact details are not yet in the facts register (DEC-05).
- Favicon, vector logo, and the brand-asset set remain later recommendations (DEC-03).
- Taxonomy gap: AGENTS.md lists no Node.js, Express, Django, Laravel, Spring, or .NET (server frameworks); the Software Development page therefore names only listed technologies. Add them to `data/taxonomy` if they are part of DECHY's capability.
- Branch protection on a private GitHub repository may require a paid plan; CI runs regardless.

## Refinement pass (imagery, voice, presentation, motion)

Owner direction after reviewing the first Phase 1 build: keep the visual direction; add purposeful photography; speak as DECHY; make the Home page feel less like a catalog; add a restrained motion system. No architecture changed.

**Photography.** Five photographs from Unsplash (Unsplash License: commercial use, no attribution required), each recorded in `data/assets/images.yaml` with source page, creator, SHA-256, dimensions, alt text and a license evidence file in `data/assets/licenses/`. Placement: Home "Who we help" (rail), "Problems we solve" (wide band), "What we build" (split with heading); Software Development "Interfaces" (beside the existing wireframe, which stays); Contact (beside the form). (Superseded by the quality pass below: these first five were replaced.) Stored at 1800 px maximum as progressive JPEG (130 to 255 KB) and served resized (AVIF or WebP) by `next/image`. Candidates rejected: a tablet photograph showing a third-party product name and device IMEI numbers; vendor photographs with visible brand marks; portrait-format images that cropped badly. The validator enforces registry entries, evidence files and a four-photograph page limit. People shown are not DECHY staff or clients, and the site never says so; a small creator credit accompanied each photograph (removed in the quality pass: no credit is shown on the site).

**Voice.** Home, Software Development and Contact now speak in the first person plural ("At DECHY, we build...", "we recommend...", "our approach"). Third person is kept for the approved company statement, page titles and meta descriptions, structured data (the `company.breadth` fact stays third person because it feeds the Organization description), definitional answers such as "What custom software development is", FAQ questions, and table cells. First-person copy makes no claims about team size, locations, clients or results.

**Presentation.** Home gains three layouts for lists (rail photo, band photo with two columns, split heading and photo with two columns); the technology section changes from eight stacked lists to a two-column grid of grouped names; the eyebrow gets a small blue bar. Nothing was removed: all services, technologies, industries and capabilities remain.

**Motion.** See `docs/design/motion-system.md`. CSS-first, one 2 KB client driver, no libraries.

**Verified.** Unit tests 95, browser tests 114 (12 widths x 5 pages, navigation, contact, accessibility, security, photography, motion, reduced motion). Lighthouse (production build, localhost): accessibility 100 and best practices 100 on Home, Software Development and Contact; desktop performance 100; mobile performance 98 (Home), 96 (Software Development), 87 to 91 (Contact, simulated 4x CPU throttling, high variance on total blocking time); layout shift 0.

**Known limits.** FAQ height animation uses `::details-content`, which needs a current Chromium or Safari; other browsers open and close instantly. The Unsplash License provides no model releases for the people pictured; images are used only in neutral illustrative contexts and should be replaced if any depicted person objects, or when DECHY has its own photography.

## Quality pass (alignment, diagram system, photography standard)

Owner direction of 2026-10-05 after reviewing two diagrams: captions drifted left of their diagrams, and the supporting boxes in the anatomy diagram did not line up with the layers they support. Treated as a system fault, not two bugs. Decision record: `docs/decisions/0003-visual-quality-standard.md`; rules: `docs/design/layout-and-visual-quality-rules.md`.

**Root causes found.** (1) The diagram capped its own width and centered, while the caption spanned the column: 112 px of drift at 768 px and 22 px at 1920 px. (2) Supporting boxes were placed on an independent 80 px pitch while the layers used 102 px. (3) A measurement of rendered text inside the SVG diagrams showed 8.8 px at 320 px and about 10 px at tablet widths, because vector text scales with the drawing; this violated the 14 px floor and no test covered it.

**Fixes.** One frame (`.figure > .figure-frame > diagram`, caption inside); five diagrams rebuilt as grid-based HTML with real type (system map, software anatomy, connected flow, quality layers, modernization path) using container queries; supporting systems share rows with their layer (equal top and bottom edges) or attach as a tray when narrow; the portal wireframe stays SVG as a UI depiction and is left-aligned in its frame. Same content, colors and visual language.

**Photography replaced.** Measured the first five at source resolution: all were 6000 px originals, but the stored copies were only 1800 px (soft on 2x and large screens); the contact image was soft and over-processed, and several used heavy warm grading that did not match the page. Reviewed about 70 candidates and chose five on quality, consistency and relevance (never demographics): port operations with a tablet (Home, who we help), a warehouse aisle with a clipboard (Home, problems), a phone app dashboard with design tools behind it (Home, what we build), a wireframe desk (Software Development, interfaces, kept and re-exported at full resolution), a notebook-and-laptop desk (Contact). Stored at 2880 px; the optimizer serves up to 2880. Rejected on inspection: a laptop dashboard whose screen showed unfinished profane placeholder text, an out-of-focus tablet shot, a tablet showing a vendor name and device numbers, images with visible brand lettering on clothing, and images that read as AI-generated. Known caveats recorded in the license evidence: the phone image depicts a third-party application design; the port image has container-line lettering as ambient background.

**Credits.** Removed everywhere on the page. All five are Unsplash License (no attribution required); source, creator, license evidence, hash, size and alt text are recorded internally. The validator rejects credit wording in copy and captions, and a browser test checks the rendered text.

**Guardrails added.** `tests/e2e/layout-alignment.spec.ts` (69 cases): caption and diagram edges, row alignment of supporting systems, bus junction alignment, diagram text floors, near-miss left edges per section, no visible credits, and served photo width against needed width at 1x and 2x, at all 12 widths on all pages. The validator now requires photographs to be at least 2400 px wide.
