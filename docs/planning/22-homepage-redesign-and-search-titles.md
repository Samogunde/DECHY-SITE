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
