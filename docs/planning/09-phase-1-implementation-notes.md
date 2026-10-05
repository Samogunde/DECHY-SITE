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
| Imagery | No stock photography in Phase 1 | Candidates found were generic (glowing code, sticky-note whiteboards) and below the authenticity bar. The registry, validator, and image pipeline are ready for real photography when supplied |
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
