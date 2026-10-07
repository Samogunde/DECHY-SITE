# Phase 5: visual expansion, platform coverage, content refinement, and UX (implementation notes)

Status: IMPLEMENTED. Authorized by the owner on 6 October 2026 as a pure implementation phase. This file records what was decided and built. It adds no company facts.

## 1. Result

- Pages: 118 to 127. Static routes: 123 to 132 (the nine added pages plus nothing else; sitemap lists 127 URLs).
- Technology pages: 43 to 52.
- No article, Work Entry, person, city, or fake-proof page was added.

## 2. Platform coverage

Qualification used the existing framework (`14-technology-and-solutions-qualification.md`): real search intent, a distinct buyer decision, a canonical home service, and enough honest substance to avoid a thin or renamed-copy page.

| Candidate | Outcome | Canonical URL | Reason |
|---|---|---|---|
| Wix | Built | `/web-development/wix/` | Large buyer base, clear "build, extend, or outgrow" decision |
| Wix Studio | Built | `/web-development/wix-studio/` | A distinct product for agencies and larger sites; separate decision from Wix |
| Squarespace | Built | `/web-development/squarespace/` | Design-led sites; distinct fit and limits |
| Drupal | Built | `/web-development/drupal/` | Structured content and governance; distinct from WordPress |
| BigCommerce | Built | `/ecommerce/bigcommerce/` | Open, B2B-capable store platform, alongside Shopify and WooCommerce |
| PayPal | Built | `/api-integration/paypal/` | Payment integration with its own flow and risks; sits beside Stripe |
| Go | Built | `/software-development/go/` | Services and tooling language with distinct intent |
| Microsoft 365 | Built | `/automation/microsoft-365/` | Where many businesses already work; integration and automation target |
| Cloudflare | Built | `/cloud/cloudflare/` | Edge delivery and security; distinct from the major clouds |

Shopify and WooCommerce were already represented. Candidates not listed stay in the graph under their existing policy (doc 14); none was added to inflate the count.

Each page follows the Phase 3 contract: comprehension record, an honest "when it fits and when it does not" section, a block sequence unique among technology pages, a hero diagram (a conceptual interface or a flow), options and alternatives, technical depth in panels, FAQ, related links to its service, alternatives, Solutions, Work Areas, and industries, and a unique closing call to action. Relationships were added only where the existing graph supports them.

## 3. Visual system

- **Conceptual interface mockups** (`src/components/figures/Mockups.tsx`, `src/styles/mockups.css`): eight original screens (site builder, store, dashboard, phone app, CRM record, analytics report, support assistant, workflow) plus a combined set for the home page. They are HTML and CSS with real text in grids, sized by their container, with no numbers, client names, or logos, and captions that say they are conceptual. Each is registered as an original `interface-visual` asset.
- **Placement**: about 35 pages gained a "What it looks like" diagram block that matches their subject (services, Work Areas, Solutions, industries, and technologies). On pages where a mockup is the hero or diagram, it sits beside the text rather than below it.
- **Home**: a dark "What people see" section shows a dashboard, a phone screen, and an assistant together, with the idea that the screens sit on top of connected systems.
- **Photography**: one new photograph (automated production line) on the Manufacturing industry page, registered with license evidence. The existing phone-app and port-operations photographs are unchanged. Other candidates were rejected: a hospital corridor (readable names and signage), and robot-arm and appliance-line images that were strongly orange or showed distracting text. Photographs stay selective: the visual load is carried by mockups and diagrams.
- Visual intensity follows the page type: high on Home and Work, medium-high on Services, Solutions, and Industries, medium on Technologies and Company, low on Resources and legal pages.

## 4. Content and voice

- The 25 Work Area scenario callouts were rewritten: unique titles, "A typical case is ..." wording, and the repeated disclaimer paragraph and hero support sentence removed. The eyebrow now reads "A typical example" and the "made-up example" caption is gone.
- Service pages touched by mockups gained a distinct, subject-specific diagram so the pages no longer share one shape.

## 5. Navigation and UX

- Technologies menu limit raised to 10 items per category; the nine new pages are placed in the existing eight categories.
- Service pages always list their own canonical technology pages in "Where this connects", even beyond the usual rail cap. Pageless Solutions are hidden from rails.
- The desktop header switches from the compact layout at 80rem (was 74rem) so the longer labels never crowd at 1280 px.

## 6. Verification

Typecheck, lint, format check, content validation (127 pages, 0 errors), unit tests, production build, and the full browser suite (responsive 320 to 2560, alignment, accessibility with axe, navigation, metadata, structured data, sitemap, robots, links). Visual inspection covered Home, Services hub, a service page, a Solution, a technology page (desktop, tablet, phone), a Work Area, an industry, a country page, the Technologies and Work menus, and mobile navigation.

## 7. Not done and open

- Country-page legal statements still need re-verification before launch (unchanged from Phase 4).
- Netlify authorization and the contact-form destination remain launch dependencies.
- The 53 articles remain a later phase.
