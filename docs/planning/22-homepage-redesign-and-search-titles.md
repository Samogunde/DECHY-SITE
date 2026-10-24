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

## Twelfth pass (21 October 2026): partnerships, compliance, menu, layout fixes

- **Partnerships and compliance.** The owner confirmed in chat that DECHY is enrolled in four partner programs and works in compliance with four standards.
  - Partner programs: AWS Partner Network, Microsoft AI Cloud Partner Program, Google Cloud Partner, and Salesforce Partner.
  - Standards: ISO, CMMI, GDPR, and HIPAA.
  - These are recorded in `data/partners/partnerships.yaml` and as `confirmed_by_owner_2026-10-21` in `data/partners/programs.json`. Wix, Shopify, Webflow, HubSpot, and Stripe stay unconfirmed.
  - A `partnerships` block shows partner tiles beside compliance tiles. It is live on the home page, replacing the draft "platforms" section, and on the Certifications page, which is now titled "Certifications, Partners and Compliance".
  - Official partner and ISO or CMMI marks replace the text tiles once the owner supplies them.
- **Menu.** About us is now a dropdown: About DECHY, How we work, Who we work with, Certifications and partners, Our impact, and Testimonials (review builds). A link to a home section appears only when that section exists.
- **Overlaps fixed.**
  - In the menu and drawer, the clients figure takes its own full row.
  - The hero proof items are centered on one line.
  - The home clients figure steps down in size beside the faces.
- **"Who we are" layout.** The heading and answer sit across the top, then a wide photograph beside a card holding the paragraphs. The same layout applies to every definition section with a photograph.

## Thirteenth pass (21 October 2026): offers, proof, estimator, cost content, calls to action

Owner direction, 21 October 2026: "put in all the numbers, figures, costs", with real copy and no templated text.

- **Hero.**
  - Seven slides: custom software, websites and web apps, mobile apps, AI, automation, ecommerce, and integration.
  - Each slide has its own headline, supporting line, offer, button, and link to its service page.
  - The slides share one grid cell, so the hero never shifts as they change. Only slide one's photo loads eagerly, and slides change every 6.5 seconds.
- **Proof strip.**
  - Counters under the hero on the home page, About us, and every service page, with the same wording everywhere (`data/proof/counters.yaml`).
  - Live counters: happy clients (1,500+), engineers and designers (100+, an owner fact recorded as `company.team`), and certifications (22, counted from the data). Each counter links to its page.
  - Projects delivered and countries served stay hidden until the owner supplies figures, since both are "not provided" in the approved facts.
  - One sentence explains the squad that works on each project.
- **Cost estimator** (`/tools/cost-estimator/`).
  - Four steps lead to a price range, a timeline range, and a breakdown. The result shows first; name and email are asked only afterwards, and leads go to the contact inbox.
  - Base ranges come from `data/pricing/services.yaml`, and the choices in `data/pricing/estimator.yaml` add to them, so the estimator and the guides agree.
  - The page also covers what the estimate is based on, what changes the price, what it excludes, and six questions.
  - It is linked from the Resources menu, the footer, every cost guide, every service page, and every case study.
- **Cost hub** (`/cost/`): the estimator and every cost guide, grouped into what it costs to build, how pricing works, and cost by industry.
- **Cost guides.**
  - Thirteen new guides: web app development, MVP, ecommerce store, AI integration, API and systems integration, pricing models, hourly rates and dedicated teams, maintenance, and five industries (healthcare, fintech, real estate, logistics, and retail).
  - The three existing build guides gain sections on what is included and the timeline. The mobile guide adds iOS, Android, and cross-platform side by side.
  - Duplicate "development cost" guides were not created, because they would compete with the existing ones in search.
  - Retail replaces ecommerce among the industries, because ecommerce has its own guide.
- **New prices.** Hourly rates, dedicated teams, care plans, and MVP prices live in `data/pricing/models.yaml`. They are proposed and await the owner's sign-off. The industry ranges in the industry guides are proposed in the same way.
- **Calls to action** (`src/lib/content/ctas.ts`).
  - Primary bands (a quote or a call) end sections; soft bands (the cost, the estimator, similar work) sit mid-page.
  - Each band is written from the page's own service, price range, and projects.
  - Targets: home and service pages 6, industry pages 4, and cost guides 4 (in the article view). Case studies reach 3 through their own view.
  - The header button reads "Get a quote" and stays visible on scroll.
- **Case studies.** A client quote block between the results and the related projects, shown when a project has a supplied `quote`. None has been supplied yet.
- **Contact.** `PUBLIC_BOOKING_URL`, `PUBLIC_CONTACT_EMAIL`, and `PUBLIC_CONTACT_PHONE` show a booking button, email, and phone when set. "Book a call" buttons use the booking link and fall back to the contact form.

## Fourteenth pass (21 October 2026): owner figures and a 20% price cut

- **New facts from the owner.** Projects delivered 1,500+ (`company.projects`) and countries served 20+ (`company.countries`). The proof strip now shows all five counters.
- **20% price cut.** Every DECHY price was cut by 20% (script: rounded figures within 8% of an exact cut). The cut covers:
  - the eleven services whose ranges the owner did not set
  - their FAQ answers
  - all 30 industry pages
  - the new cost guides
  - the care plans and MVP prices
  - the estimator's feature and integration add-ons; the rush premium drops from 25% to 20%
- **Not cut.**
  - The owner's fixed ranges: custom software, website, web app, and mobile app.
  - Dedicated team prices, at the owner's instruction.
  - Third-party fees.
- **Hourly rates** are now three simple rates, not a per-role card: design and development $35 to $55, specialist work $45 to $80, and testing $25 to $35. Most work stays fixed price.

## Fifteenth pass (21 October 2026): thirty client testimonials and a new Testimonials page

Owner direction, 21 October 2026. The owner chose the mediusware testimonial page as the reference layout.

- **The testimonials.** The owner supplied 30 testimonials, two for each of the fifteen services. They replace the content pack's 300 example quotes, which are deleted (`data/samples/testimonials.json`) and no longer imported.
  - They live in `data/testimonials/testimonials.yaml`. Each one lists the service it is about and the client's industry.
  - The wording is as supplied, except for one spelling change to US English ("enquiries" became "inquiries").
  - They are live content, not drafts, so the validator no longer blocks the word "testimonials".
- **Where they appear.**
  - **Home:** six testimonials marked `home`.
  - **Service pages:** the two testimonials for that service.
  - **Industry pages:** that industry's own testimonials first (up to six), filled to three with testimonials for the services the page links to.
  - **The full set:** the Testimonials page.
- **One card everywhere.** The card shows:
  - a quote mark and the service as a link at the top
  - the quote in the heading font
  - initials, name, role, company, and the industry as a link
  Real clients are never shown with stock faces.
- **The Testimonials page** (`/testimonials/`, indexed). Its sections, in order:
  - the hero and the proof strip
  - a featured spotlight (one large quote, chosen from six people)
  - every testimonial, with service buttons, an industry menu, and nine at a time with "Show more"
  - the four themes clients mention most
  - the client journey (six steps beside a photograph)
  - testimonials by service (fifteen cards)
  - certifications, partnerships and compliance, questions, and a call to action
  - No counts are shown, per the eleventh pass.
- **Similarity.** Testimonials are the clients' own words and repeat across pages by design, so the copy-overlap check skips them.
- **"Trusted by" strip** (review builds only): now eight companies from the testimonials.
- **For the owner.** Four testimonials name DECHY people (Luis, Amara, Daniel, Maya). None of them is on the team section.

## Sixteenth pass (21 and 22 October 2026): the reference testimonial page, black, calm blue, readable text

Owner direction, 21 and 22 October 2026.

- **Testimonials page, rebuilt after the reference page.** Fifteen sections in the reference order, layout, and motion, with DECHY's own testimonials and wording:
  - hero with the proof figures
  - companies behind the testimonials
  - client stories slider
  - client journey (sticky photograph, steps that light up on scroll)
  - outcomes row (every testimonial)
  - featured voices (hover a person to read their testimonial)
  - case studies in depth
  - "your technology partner" list that opens on hover
  - testimonials by service
  - the measured figures
  - why clients stay
  - quality, partnerships, and compliance
  - certifications
  - questions
  - a closing call
  Nothing is invented: ratings show only when a client gives one, and the figures are the approved proof figures. The reference's videos, NPS, CSAT, retention, and referral figures have no DECHY equivalent and are not shown.
- **Motion.** The outcomes and by-service rows loop without end: after the last card the first follows straight on. Rows and stories move on by themselves and pause while the pointer is over them; the dashes change the slide on hover.
- **Questions.** Every FAQ on the site opens one question at a time, with none open at first. The Testimonials page uses the standard FAQ with every question shown.
- **Black, not bluish.** Dark surfaces, cards, borders, and gray text are neutral blacks, charcoals, and grays. The header, mega menus, drawer, and footer are pure black. Background glows keep a trace of blue at well under half their former strength.
- **Calm blue, one accent.** The amber second accent is retired. The brand blue #2F6FED stays on the calls to action: buttons, the CTA band, and the drawer and partner invitations. Decorative uses (lines, icons, small fills, accent words, links) use the same hue with less saturation: #466CB9 for lines and fills, #7290CA for text (5:1 or more on every dark surface).
- **Readable text.** Nothing on the site is under 14px. Labels, tags, counts, and eyebrows are 14px; text people read is at least 15px. The eyebrow token is 14px in both the site and the approved specification (`docs/design/typography-tokens.css`). Interface mockups, diagram nodes, and the private admin keep their own sizes.
- **Clients 1,200+.** The owner set the clients figure to 1,200+ everywhere, including the approved statement ("over 1,200"). Projects delivered stay 1,500+.
- **Partner logos.** AWS, Microsoft, Google Cloud, and Salesforce show their official logos wherever the partnerships appear (`public/partners/`, provenance in `data/assets/licenses/partner-logos.md`). The compliance check marks are blue.
- **Icons.** Professional duotone icons are used where they help scanning: the partner list, the reasons clients stay, and the measured figures. They are not added everywhere.
- **Section rhythm** (owner, 22 October 2026: "sections are not well divided"). Every section after the opening takes the next of three backgrounds in turn: black, charcoal (#18181B), and the faded blue (navy with a soft blue glow from the top), with a hairline at its top. The opening, the call-to-action bands, and the closing call keep their own designs.
- **Certifications hero photo and nine more partners** (owner, 22 October 2026). Three library photographs taken in another company's office (its logo on the glass, its stickers on the laptops; Cherrydeck, `lib-company-02`, `07`, `09`) are removed from the site and the library. The Certifications hero now shows the DECHY engineers' workspace. Partnerships grow from four to thirteen, adding Shopify, Adobe, Oracle, Cisco, Meta, Wix, Squarespace, WordPress, and Figma, each with its logo (`data/assets/licenses/partner-logos.md`). WordPress and Figma read "Agency partner" until the owner names the program. Partners take the full width, four across, with compliance as its own row.

## Seventeenth pass (22 October 2026): the owner's pricing review

Owner direction, 22 October 2026. Every figure is an agreed target that the owner confirms before launch. Timelines are unchanged; only their wording changed.

- **One price file.** `data/pricing/prices.yaml` holds every price: service tiers, hourly rates, teams, care plans, headline summaries, MVP packages, and the estimator. It replaces `services.yaml`, `models.yaml`, and `estimator.yaml`. Each price is also a fact (`price.<service>-<plan>`, `price.care-<plan>`, `price.summary-<kind>`, with `-from`, `-to`, and for care plans `-year` variants), so pages, guides, the cost hub, FAQ answers and their schema, titles, and meta descriptions use `{{fact:price....}}` and change with the file. Descriptions are checked for length (70 to 165 characters) after the figures are filled in.
- **Estimator calculation.** The low end is the base low plus every add-on low (after the 10 percent template discount). The high end is the low plus 60 percent of the spread between the summed highs and lows. Figures round to the nearest $500 under $20,000 and the nearest $1,000 above. Under $25,000 the high is at most twice the low. Two native mobile apps keep the 60 percent rule. Each integration is the single-integration range, $1,500 to $4,000.
- **Tier rules.** A landing page allows content editing, copywriting, booking, languages, and search setup, at most four at once. Accounts and payments are disabled there and offer the web app estimate (from $5,000) with a switch button; the same check runs on every tier. No tier shows a total above the top of the next tier's base range; when choices reach that point, the result offers the bigger tier's estimate.
- **No rush or flexible pricing.** Step 4 asks "When do you want to start?" (as soon as possible, within a month, just researching). It never changes the price and is sent with the lead.
- **Answers reset properly.** Changing the service or tier clears features, design, and integrations. "Change my answers" clears only the steps after the one the visitor goes back to. The result adds "Most projects like this land near the middle of the range."
- **Add-on prices.** Web add-ons follow the owner's table. In every other flow an add-on's top is at most 1.6 times its bottom. Unit tests cover the owner's test cases (`tests/unit/estimate.test.ts`).
- **Price ranges everywhere.** The owner's listed changes are applied. Every other range is held to at most 2.5 times its bottom (third-party fees and hourly rates excepted).
- **Care plans.** Essential $100 to $300 a month (up to 2 hours), Growth $350 to $900, Product $1,200 to $3,000. The maintenance rule of thumb is 15 to 25 percent of the build a year.
- **Headlines and timelines.** Price headlines read "Most projects cost X to Y, a first version from Z" for the eight product types. Timeline columns read "Typical timeline from approved scope", with the line "The timeline starts once the scope is approved and we have what we need from you."
- **Text that runs together.** Prices, labels, and timelines in cards and tables now have real spaces between them, so readers that take the raw text (search, AI answers, copy and paste) no longer see "$24,5003 to 5 weeks".
- **Design.** The home price cards are redesigned: the price stays on one line, and there is no accent bar on hover. The home testimonials show one large quote beside the list of clients; it moves on by itself every 7 seconds, pauses on hover, and hovering a client shows their quote. The Testimonials page stories move every 4.5 seconds and pause on hover. Some headings carry a calm blue accent on a few words (`[[words]]` in content, rendered by `AccentText`).

## Eighteenth pass (24 October 2026): the owner's 41 articles

Owner direction, 24 October 2026. The owner supplied 50 articles. Nine cover topics already on the site and were skipped (numbers 01 to 05, 13, 25, 32, and 49); the other 41 are published under Resources as `content/articles/w06-*.md` to `w50-*.md`. Their links to the nine skipped topics point at the existing pages.

- **Our prices, not market prices.** Every project figure is a DECHY price fact (`{{fact:price....}}`), so the articles change with `data/pricing/prices.yaml`. Industry articles (healthcare, logistics, fintech, real estate) use the figures of the matching industry cost guides. Third-party fees (subscriptions, hosting, app store fees, AI usage), salaries, regional market rates, and illustrative return examples stay as written, because they are not our prices.
- **Questions.** Each article's "Common questions" become its FAQ block, with FAQPage structured data.
- **US spelling, site rules.** Spelling is US English. Titles are at most 60 characters with " | DECHY", descriptions 70 to 160. Jargon is explained in plain words at first use. Wording the validator rejects was reworded: "placeholder", "local teams", and numbered customer counts.
- **Length.** Twenty-six articles were under the 1,400-word article minimum by 1 to 186 words. Each gained one section, written for its topic, on how we handle that work and what it costs with us. It sits before the questions.
- **Markdown.** The article parser now reads tables, numbered lists, checklists, "###" subheadings (shown as bold lead-ins), and a line of text followed by a list (kept in place as an inline list).

## Nineteenth pass (24 October 2026): team of eight, alignment, site search, type floor, assistant

Owner direction, 24 October 2026.

- **Team.**
  - Eight people: the Managing Director and two directors first, in larger cards, then five in a compact grid. The five include Samuel Abims and the four people named in testimonials.
  - Each card shows the name, the role, one line on the outcome the person owns, and three skill tags. There are no experience lines and no LinkedIn links.
  - The section is published; it was a draft before, which is why it was missing on Netlify. Team portraits do not count toward a page's photo limit.
- **"Who we are."** The heading row and the photo row share one grid. The answer spans exactly the card's width, and its first line sits on the heading's baseline. It stacks below 1024px.
- **Site search.**
  - One index covers every page, each page's questions, and the team. It opens from the header button, `/`, or Ctrl/Cmd+K.
  - It searches as you type and matches partial words, typos, and plurals (`src/lib/search-engine.ts`, no dependency). Results show a highlighted snippet and the page type.
  - Full matches come first, then pages that match some of the words, with "Show more". `/search/` is the full results page; it is noindex and not in the sitemap.
- **Resources search.** A search over the full text of every article (`/articles-index.json`), with category filters (Guides, Decision guides, Comparisons, Cost guides, Industry notes, Explainers) and a result count.
- **Type floor (`src/styles/type-floor.css`).**
  - Article reading text is 17px. Answers and statements are 16px.
  - All other text is at least 15px, except short uppercase labels and number badges (14px).
  - Header links are 15px at 1280 to 1439px. The selected count badge has white text.
  - The assistant uses 16px throughout.
- **Assistant.** An "Ask DECHY" pill launcher that steps aside on phones for the cookie banner, the footer, and form buttons. The panel is dark, with "Talk to a person" always in view. Live chat runs through Telegram (doc 23, section 7).
