# 22. Homepage redesign, search titles, and draft content (19 October 2026)

Owner decisions in chat, 19 October 2026 (rank 1 in the precedence model). They amend the earlier rules named below.

## Decisions

1. **Lead with software, web, and mobile.** The homepage leads with three services: Custom Software, Websites and Web Apps, and Mobile Apps. AI, automation, integration, and cloud are presented as built in. The other eight services appear in a compact "Also from DECHY" row. All 15 services keep their pages, menus, and URLs. This amends the rule that no service is emphasized on the homepage.
2. **Headline.** "Websites, web apps, mobile apps, and custom software, built to work as one system." The approved positioning line stays in the facts register unchanged. The descriptor is unchanged and remains the hero eyebrow.
3. **Page titles.** Every title says what the page is first and ends with " | DECHY". DECHY appears nowhere else in the title. Titles are at most 60 characters, and descriptions run from 70 to 160 characters. The validator enforces all three rules (`title-format`, `title-length`, `desc-length`). The home title is "Custom Software, Web & Mobile App Development | DECHY".
4. **Price ranges** are shown, with what moves the price. The owner confirms the figures before they go live.
5. **Second accent color.** Amber (`--color-amber` #f5a524, with `--color-amber-text` #a8590a for text on light surfaces) is approved as a trial. It is used for kickers, highlights, and figures only.
6. **Dark hero, depth, and varied section layouts.** This covers three shadow levels, a blue glow, a grid texture, card hover lift, and an icon set (lucide-react, pinned).
7. **Proof sections.** "Trusted by" logos, selected work (case studies), and testimonials. The owner will supply real logos, projects, quotes, and team photos.
8. **US English** across the site (inquiry, labeled, fulfillment, center, catalog, license).

## Draft content

Sections that need owner facts carry `draft: true`: pricing, case studies, testimonials, and the logo strip. The logos are invented sample names, never real brands, so no endorsement is implied.

- The registry drops draft sections when it loads, unless `DECHY_SHOW_DRAFTS=true`. Production therefore never contains them, and neither do search, structured data, the sitemap text, or the assistant.
- A review build (`DECHY_SHOW_DRAFTS=true npm run build`) shows them inside a dashed amber frame labeled "Draft for review".
- To publish a section, replace the placeholders with the supplied facts and remove `draft: true`. The validator then applies every claim rule to it.

## Homepage order

Production, without drafts:

1. Hero (dark, with proof figures from the facts register)
2. Three lead services
3. Built in (AI, automation, integration, cloud)
4. Also from DECHY
5. Problems we solve
6. Our promise ("We will tell you what not to build.")
7. How a project runs
8. Technology
9. Industries (the 8 built pages, each linked)
10. Buyer questions
11. Final call to action

The review build adds the logos after the hero, and pricing, selected work, and testimonials after the promise.

## Launch checklist (domain day)

These need the real domain:

- Set `SITE_ORIGIN` to the domain and `SITE_INDEXING=true`.
- Verify the domain in Google Search Console and Bing Webmaster Tools, then submit `/sitemap.xml`.
- Request indexing for the home and service pages.

GA4 and conversion events can be wired before the domain exists and switched on by setting the measurement ID. They need a consent banner first, because the cookie policy currently promises necessary storage only.

## Second pass (19 October 2026): dark, layered homepage

The owner's feedback on the first sample was that it still read as flat, the hero was crowded, and the icons looked generic. The direction now follows the interaction patterns the owner liked on mediusware.com, built from scratch; no assets were copied.

- **Hero.** "We build" stays fixed while the offer changes in place: custom software, websites, web apps, mobile apps. Each has its own line, its own interface screen, and floating labels.
  - Buttons let visitors choose a service, and each shows a progress bar.
  - It pauses on hover or focus and never moves under reduced motion.
  - The heading carries the full list of services for search and screen readers.
- **Motion and depth.**
  - Number counters that count up from 1. The server renders the real figure, so it never depends on JavaScript.
  - A statement that lights up word by word as you scroll.
  - Drifting light beams, glass panels, and a glow that follows the pointer.
  - Outline buttons that fill with a sweep on hover; primary buttons get a shine.
  - A scroll progress bar.
  - Logo and icon tiles on staggered rows that lift on hover.
  - A project process whose photograph stays in place while the phases scroll past.
- **Icons.** Phosphor line icons (light and thin weights) replace the earlier set. Technology tiles use the official marks from Simple Icons (CC0). AWS, Azure, Java, OpenAI, and Salesforce are not in that set, because their owners withdrew them, so those tiles show the name as a wordmark.
- **Photographs.** Twelve Unsplash photographs from the free library (Unsplash License: commercial use, no attribution). Each is stored as a 2600 px JPEG at quality 90 with 4:4:4 chroma and registered with license evidence. Browsers receive WebP sized to the painted width. The home page may carry up to 14 photographs; other pages keep the limit of 4. The validator now finds photographs inside items (phases, cards), not only on blocks.
- **Draft sections** (logos, selected work, testimonials, pricing) now render without a draft label in review builds, as the owner asked. They are still removed from production builds until real details replace the samples. The sample company names, quotes, and figures are invented for layout only.

## Third pass (19 October 2026): photographs instead of illustrations, all services visible

- The hero rotates every 3.4 seconds instead of 5.2.
- The hero and the three service rows show photographs instead of interface illustrations. The owner's direction is real images on the site; stock is used until project photography is supplied.
- A "Fifteen services, one team" explorer replaces the compact list. Five family tabs each show a photograph and every service in the family, with icons, short descriptions, and links. The home page now shows the full range, not only the three lead services.
- The technology section now has seven groups and about 60 marks, with room between tiles so a lifted tile never touches its neighbors.
- Pricing cards are shorter (name, typical range, one line, timeline), and whichever card is hovered or focused lights up. What moves the price is shown as chips.
- Testimonials show circular portraits. The validator rejects a stock portrait on any published (non-draft) testimonial, so a sample face can never reach the live site.
- The questions section uses the dark home design.
- Fifteen more Unsplash photographs, registered with license evidence. The home page may carry up to 32 photographs.

## Fourth pass (20 October 2026): premium menus, quieter text, tighter inner pages

Owner direction (20 October 2026) and the consultant brief of the same date.

- **Menus.**
  - The top navigation uses pill hovers.
  - Each mega menu is a floating card. On the left it describes what the menu covers and shows two approved facts (clients helped, operating since). On the right are rows with an icon tile, a name, and one short line.
  - The menu drawer shows link cards with icons (Partnership included), a "Popular services" row, a solid blue call-to-action card, and a proof strip.
- **Text.**
  - Headings stay white. Body text is gray (#AEB6C3) and leads are a lighter gray, so plain white is no longer used for body copy.
  - Secondary text is 14 to 15px: cards, steps, lists, menus, and small print. Main reading text stays 16px.
  - Inner-page section headings drop from about 50px to 40px.
  - This amends the 7 October typography rule for secondary text only.
- **Inner pages.**
  - Section padding is cut by about a third. The cause was a homepage rule that also matched inner pages.
  - Three clearly different surfaces alternate, the third with a faint grid and a blue glow.
  - The inner hero has a larger headline and a proof strip.
  - A mid-page call-to-action band sits after the first third of the page.
  - The closing call to action is a solid blue card.
  - "Related services, technologies and industries" sits in one row.
  - The Software page dropped from 14,118px to about 11,600px at 1440px wide.
- **Brief items done.**
  - Instruction text is removed ("Choose a question to see the answer", "1 of 4", "Next: ...").
  - The At a glance tabs are renamed (What we build, Problems we solve, Who we serve, How to choose).
  - The Software page H1, H2, and H3 wording changed as the brief directs. The hedging hero lines on Software, AI, and Automation are removed.
  - The Work page is retitled "Our work", and the sections that talked about the site itself are removed.
  - In the home hero, the old line now leaves before the new one arrives, with no blur. The pause on hover stays off, as the owner asked earlier.
  - The first hero photograph loads at once.
- **Partners.**
  - A "Partners and platforms we build on" section on the home page shows seven platform marks and a "Partner with us" card.
  - It is a draft (review builds only), because a partnership is a factual claim that needs the owner's confirmation.
- **Work page samples.** In review builds, the Work page opens with sample case studies and quotes from the three lead services. Real case studies replace them when the owner supplies project facts.

## Fifth pass (20 October 2026): pricing, case studies, team, thirty industries, agency voice

Owner direction, 20 October 2026.

- **Pricing.**
  - Every service page has a "Pricing and timelines" section with 3 to 5 tiers, built from `data/pricing/services.yaml`.
  - The top tier of every service ends with "+", and timelines are short.
  - Home pricing uses the owner's ranges and is live:
    - website $2,000 to $10,000+
    - web app $5,000 to $50,000+
    - mobile app $10,000 to $60,000+
    - custom software $15,000 to $100,000+
  - Cost and timeline answers on the service pages now give real ranges.
  - The validator no longer treats "$1,500" as the client count.
- **Case studies.**
  - Thirty sample case study pages at `/work/case-studies/<slug>/`, built from `data/samples/case-studies.yaml` and proof.yaml.
  - The Work page has a grid of case cards that filters by service. Each service page's case cards link to their case study.
  - These appear in review builds only. They are noindex and are left out of validation; real case studies replace them.
- **Team.** A ten-person team section on the Company page (review builds only), with bios that open on hover or tap. Portraits match the name: women and men are kept in separate portrait pools.
- **DECHY facts.** A live block on the Company page built from the approved facts.
- **Thirty industries.**
  - 22 new industry pages, generated by `scripts/build-industry-pages.mjs` from `data/industries/*.yaml`.
  - Every page has its own copy. Section order differs per page, and each has a "projects, costs, and timelines" table.
  - The Industries menu shows all 30 in three columns with icons. The hub lists them in the brief's seven groups.
- **Photos.** 171 Pexels photographs (Pexels License: free for commercial use, no attribution required), for the industries and the portraits. Sources now include Pexels as well as Unsplash.
- **Agency voice.** All 15 service pages were updated by `scripts/voice-pass.mjs`:
  - a promise in each H1
  - "we" to "you" leads
  - hedging support lines removed
  - "you may not need us" callouts turned into "How we pick the right approach"
  - buyer headings in place of "Under the hood"
- **Menus.** A menu closes as soon as the pointer leaves the menu card. A pointer check covers missed leave events.

## Sixth pass (20 October 2026): brand files, office photos, menu, testimonials

Owner direction, 20 October 2026.

- **Brand.**
  - The owner supplied SVG masters: a white logo for dark backgrounds, a white monogram, and a monogram on black.
  - `scripts/brand-v2.ts` renders the header and footer logo, the favicon, and the app and assistant icons. The light plate behind the logo is gone.
  - The older navy logo stays as the structured-data logo.
- **Office photos.**
  - Six owner-supplied photographs of the DECHY workspace (reception, engineering floor, boardroom, meeting rooms, team meetings). They are stored byte for byte with SEO file names and descriptive alt text.
  - They appear on About us (hero and an "Inside DECHY" gallery), in the home numbers section, and on How we work.
  - The supplied files are 1536 px wide, so they are placed where they render sharp at 2x.
  - About us may carry 6 photographs. No address or city is stated.
- **Menu.** The order is now Services, Industries, Our Work, Solutions, Technologies, Insights, About us. The URLs are unchanged. The Our Work menu links to case studies and testimonials when they exist.
- **Testimonials.**
  - A Testimonials page (review builds only until real testimonials exist).
  - The layout has a featured quote, a sticky filter rail by service and by industry with counts, and a masonry wall of quote cards with portraits, tags, and case study links. On phones the filters become two select menus.
  - Industry pages show quotes from that industry first, then from related services.
  - Each person always shows the same portrait everywhere on the site.

## Seventh pass (21 October 2026): real portfolio, About us, testimonials, buttons

Owner direction, 21 October 2026.

- **Portfolio.**
  - The owner supplied 47 screens of real client work. With duplicates removed there are 37 unique screens, covering 31 projects, in `data/portfolio/projects.yaml`.
  - Each project is a live case study at `/work/case-studies/<slug>/`. The page shows the hero with the main screen, the results, the story (what the client wanted, the challenge, what we built), what was delivered, the stack, any further screens, related projects, and a call to action.
  - Screens are stored as JPEG quality 92 with 4:4:4 chroma, are shown whole (never cropped), and have no click to zoom.
  - Our Work shows every project with service chips and an industry filter.
  - Every service page and every industry page shows its projects.
  - The home "What we build" rows show ClaimBridge, Alder & Stone, and CarePath.
- **Results.** The results were drafted from the screens at the owner's direction. They show in review builds. On the live site a project's results appear once the owner sets `resultsConfirmed: true` after confirming or correcting the figures.
- **Validator.** With real projects supplied, "case study" wording is no longer blocked. Portfolio screens do not count toward the per-page photograph limit. Shared sections (pricing, selected work, client quotes) are left out of page-similarity checks.
- **About us.**
  - The page reads as a story: who we are, the facts, the company statement, Inside DECHY, how we think, the team, and questions.
  - The "Who we are" photo moves under the opening, which removes an overlap.
  - The office wording is updated, with no address stated.
  - The gallery captions are removed.
  - The team is 12 people, four to a row, with circular portraits and short bios that are always visible.
- **At a glance.** It now shows only on service, industry, solution, technology, work area, and country pages.
- **Testimonials.** The page has a summary strip and a grid of aligned cards with equal heights and the same structure throughout (person, quote, tags), replacing the masonry wall.
- **Buttons.** Outline and secondary buttons fill white with dark text on hover everywhere on the dark theme. This fixes text that was white on white.

## Eighth pass (21 October 2026): content pack v2

The owner supplied `DECHY_Content_Data_Pack_v2.zip` with implementation instructions. `scripts/import-content-pack.mjs` imports it into `data/`. US English is applied to the pack text, and names, roles, companies, and meaning are kept as supplied.

- **Facts.** The pack matches `data/facts/company.yaml`. Nothing was changed and no statistics were added.
- **Testimonials (300).** `data/samples/testimonials.json` now holds the pack's testimonials.
  - They replace the earlier sample quotes. `data/samples/proof.yaml` and `data/samples/case-studies.yaml` are removed.
  - Every service page and every industry page shows six. No quote appears on two pages.
  - Industry pages choose first, from the matching pack industries (`PACK_INDUSTRIES` in `src/lib/content/samples.ts`). Service pages then take quotes for their own service.
  - The Testimonials page shows all 300, filtered by 15 services and the pack's 30 industries.
  - Of the quotes no page uses, three appear on the home page and six on Our Work.
  - The testimonials show initials rather than portraits. The pack has no portraits, and the stock set has 113 faces, so a face would otherwise appear under two names.
  - The pack calls these illustrative examples, not verified endorsements, so they stay in review builds only.
- **Team (12).** About us lists the pack's twelve profiles (review builds only).
- **Selected work.** Service and industry pages show three projects. The full portfolio is on Our Work (`/work/`). The portfolio projects, their names, screens, and copy are unchanged.
- **Technology ecosystem (52).** The Technologies hub has a "Tools and platforms" section in twelve categories.
  - The 30 tools already in the graph were reused, and 22 missing ones were added in `data/taxonomy/technologies-ecosystem.yaml`.
  - Sixteen gained a logo.
  - No entry implies a partnership.
- **Glossary (30).** The Resources page has a glossary with a letter index. The terms come from `data/glossary/terms.json`, and the clarity check reads each entry as "Term: definition".
- **Client Identity Register.** The 300 testimonial companies in the register are the companies on the quotes. The home "Trusted by" strip now uses eight of them. The 75 concept brands are not used, because the concept case studies were not imported.
- **Partner and certification reference.** It is stored as reference only in `data/partners/programs.json`. No program is confirmed for DECHY and nothing is published from it. The home section now reads "The platforms we build on".
- **Not imported.** The editorial authors and the concept case studies were not imported, at the owner's direction.

## Ninth pass (21 October 2026): owner review fixes, Resources, templates

Owner review, 21 October 2026.

- **Testimonial text.** The pack's 300 quotes are built from templates: 904 sentences, only 294 of them distinct, and each closing line used 20 times. The pack itself labels them `fictional_testimonial_example`. No original wording was supplied to compare against, so no quote was rewritten.
  - The home page now shows three software, web, and mobile quotes, replacing the Digital Marketing quote.
  - The real client wording is needed before any quote can go live.
- **Testimonial layout.**
  - Service, industry, and home pages show a slider: two equal cards at a time (one on phones), with arrows, a counter, and a progress bar.
  - Each card shows the person first, then the quote.
  - The Testimonials page has a filter bar (service tabs and an industry menu) above an even three-column grid, twelve stories at a time with "Show more".
- **Case studies.**
  - Technologies without a logo show a monogram, so names such as "Azure" no longer appear twice.
  - The number counter shows the real value until it starts, always ends on the exact value, and never counts durations or decimals, so "1 weeks" can no longer appear.
- **Mobile page.**
  - "The life of an app" diagram is merged into the process, now called "From first idea to the app stores and beyond", which gains a sixth step: Keep improving.
  - The thin "See the mobile systems we build" links were a duplicate of the Related section and are removed.
  - The "App updates and support after launch" text moves into "Keeping an app healthy".
  - Service pages no longer show the "On this page" strip or the mid-page call to action. At a glance and the pricing section carry the call to action.
- **Menu.** "Insights" is renamed "Resources", with a dropdown: Guides and articles, Cost guides, Comparisons, and Glossary. Cost guides and Comparisons appear only once a page of that kind is published. The footer adds Glossary.
- **Resources page.**
  - The page shows the title, one line, filter tabs (All, Guides, Comparisons, Cost guides, and Glossary as a link), the featured article, the latest articles, a cost guides row and a comparisons row (each once one exists), a Glossary card, one call to action, and the promise line.
  - The pathfinder, the "Five kinds of resource" columns, the standards callout, and the FAQ are removed.
- **Glossary.** The glossary has its own page at `/resources/glossary/`, A to Z, with DefinedTermSet structured data. It is in the sitemap, the menu, and the footer.
- **Article template.**
  - Front matter can now set `author`, `reviewed`, `answer` (the short answer box), `related`, `compare` (side-by-side table, when to choose each, our recommendation), and `pricing` (a cost guide's price table from `data/pricing/services.yaml`).
  - New type `cost-guides` and category `cost`. URLs are `/resources/<type>/<slug>/`.
  - A service's pricing section links to its cost guide once one is published.

## Tenth pass (21 October 2026): cost guides and comparisons published

At the owner's direction, eight resource pages are written and published as live content.

- **Cost guides** (`/resources/cost-guides/`):
  - How much custom software, a website, and a mobile app cost.
  - How we price, with a table of every service's smaller and larger typical projects, read from `data/pricing/services.yaml`.
- **Comparisons** (`/resources/comparisons/`):
  - Native vs cross-platform apps (brief 8).
  - WordPress vs a custom website (brief 7).
  - Custom software vs off-the-shelf, which links to the build, buy, or integrate guide.
  - In-house team vs agency.
- **Content rules.**
  - Prices and timelines come only from the owner's pricing data.
  - The pages use no statistics, client claims, or named authors.
  - The process statements are ones the site already makes: a written plan with a fixed quote and timeline after a short call, staged delivery, and client ownership of code and data.
- **Validator.** The short answer and the comparison table now count as page text for the length check, and pass the same style checks as other copy.
- **Tests.** Cost guides and the two unplanned comparisons are allowed outside the 53-article plan. The search test checks the eight results the search box shows.

## Eleventh pass (21 October 2026): certifications, client faces, testimonial counts

Owner direction, 21 October 2026, with mediusware's recognition section as the reference.

- **Certifications.**
  - The owner supplied 23 badge files covering 22 certifications. One was a duplicate.
  - `scripts/prepare-certification-badges.mjs` removes plain backgrounds by filling inward from the edges, so the artwork is never touched. It also trims the margins and writes descriptive names to `public/certifications/`.
  - The data is in `data/certifications/certifications.yaml`, in six areas: cloud, AI, platforms, security, delivery, and growth.
  - The page `/company/certifications/` has a hero, figures (badges, issuers, areas, and the platforms the team is certified on), a sticky area bar, rows of badge, issuer, name, and what each one proves, why it matters, questions, and a call to action.
  - The home page and About us show eight badges in a strip, with a link to the page. Links also go in the footer and the drawer.
  - Copy says the team holds the certifications, never that DECHY is a partner of the issuer.
- **Client faces.**
  - Three licensed library portraits are cropped, and their studio background is replaced with the brand blue (`scripts/prepare-client-avatars.mjs`).
  - They appear beside every "clients helped" figure: the page heroes, the home and About figures, the menus, and the drawer.
  - The portraits were chosen for plain backgrounds and framing.
- **Testimonials.** Every count is removed: the summary strip, the number in the heading, the industry menu counts, the result count, "Show more" totals, and the slider counter.
- **Pending the owner.**
  - Partnerships, which need confirmed partner program membership.
  - Compliance badges such as ISO and CMMI, which need the certificates.
  - Awards, which the owner will supply.
  - Real client testimonial wording.
