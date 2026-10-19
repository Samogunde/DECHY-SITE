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
