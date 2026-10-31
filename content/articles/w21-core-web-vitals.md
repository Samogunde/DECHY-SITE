---
slug: core-web-vitals
type: guides
category: guide
service: web-development
title: "Core Web Vitals Explained, and How to Fix Them | DECHY Tech"
description: "A plain guide to Core Web Vitals for business websites: LCP, INP and CLS, the targets to hit, how to test your site and the fixes that matter most."
h1: "Core Web Vitals for Business Sites: What Matters and How to Fix It"
summary: "A plain guide to Core Web Vitals for business websites: LCP, INP and CLS, the targets to hit, how to test your site and the fixes that matter most."
answer: "Core Web Vitals are three measurements Google uses to judge how fast and stable a page feels: Largest Contentful Paint (LCP), Interaction to Next Paint (INP) and Cumulative Layout Shift (CLS). To pass, aim for LCP under 2.5 seconds, INP under 200 milliseconds and CLS under 0.1. They are one of many ranking signals, but they directly affect whether visitors stay or leave, which is why they matter for business results too."
intent: Core Web Vitals
date: 2026-10-24
author: DECHY Team
---

Here is what each one means, how to check yours and the fixes that usually deliver the biggest gains.

## The three metrics in plain words

### LCP: how fast the main content appears
Largest Contentful Paint measures how long it takes for the biggest visible element, usually a hero image, banner or headline block, to show up.

**Target:** 2.5 seconds or less.
**What hurts it:** large images, slow servers, render-blocking scripts and heavy fonts.

### INP: how quickly the page responds
Interaction to Next Paint measures how long the page takes to respond when someone taps, clicks or types. It replaced an older metric called First Input Delay.

**Target:** 200 milliseconds or less.
**What hurts it:** heavy JavaScript, too many third-party scripts and long tasks that block the browser.

### CLS: how stable the layout is
Cumulative Layout Shift measures how much the page jumps around while loading. You have felt this when you go to tap a button and an ad pushes it down.

**Target:** 0.1 or less.
**What hurts it:** images without set dimensions, late-loading banners, embeds and fonts that swap and shift text.

## Why they matter for business

- **Visitors leave slow sites.** Even a one-second delay can reduce conversions on some sites.
- **Google uses page experience as a signal.** It is not the biggest factor, since relevant, helpful content matters more, but when two pages are similar in quality, experience can tip the balance.
- **Mobile users are less patient.** Most are on phones with variable connections.
- **Fast sites cost less to run and convert better.** Lighter pages use less bandwidth and keep people engaged.

## How to test your site

Use these free tools:

- **PageSpeed Insights** gives scores for mobile and desktop, plus a list of fixes. Look at the real-user data ("field data") if it is available, not just the lab test.
- **Google Search Console** has a Core Web Vitals report that groups your pages into good, needs improvement and poor, using real visitor data.
- **Lighthouse** in Chrome's developer tools lets you test pages privately.
- **WebPageTest** gives detailed breakdowns of how a page loads.

Test your most important pages: the homepage, key service pages, the contact page and a typical article. Test on mobile first.

## Fixes that deliver the biggest gains

### Fix LCP

1. **Optimize images.** Use modern formats such as WebP or AVIF, compress them and size them for the screen. Oversized images are the most common cause of slow LCP.
2. **Prioritize the hero image.** Load it first, don't lazy-load it and give the browser a hint to fetch it early.
3. **Use a fast host and a CDN.** A content delivery network serves your pages from locations near the visitor.
4. **Reduce render-blocking resources.** Defer non-essential scripts and inline critical styles.
5. **Trim fonts.** Use fewer font files and weights, and load them efficiently.
6. **Cache pages.** Serving a ready-made page is faster than building it on every visit.

### Fix INP

1. **Cut unnecessary JavaScript.** Remove unused plugins, widgets and libraries. Each one adds work for the browser.
2. **Delay third-party scripts.** Chat widgets, trackers and ad scripts should load after the main content, or on interaction.
3. **Break up long tasks.** Developers can split heavy work into smaller chunks so the page stays responsive.
4. **Keep the page simple.** Fewer elements and a lighter structure respond faster.
5. **Test on mid-range phones.** A site that feels fine on a new laptop can lag on a typical phone.

### Fix CLS

1. **Set width and height on images and videos**, so the browser reserves space before they load.
2. **Reserve space for ads, banners and embeds.**
3. **Avoid inserting content above what the visitor is already reading.** Cookie banners should overlay or use reserved space.
4. **Load fonts carefully.** Use font-display settings and similar fallback fonts to prevent text jumping.
5. **Animate with transforms**, not by changing layout properties.

## Platform tips

**WordPress:** use a lightweight theme, limit plugins, add caching and image optimization, and choose quality hosting. Heavy page builders and many plugins are common culprits.

**Next.js and modern frameworks:** use the built-in image and font optimization, prefer static generation where possible and watch the size of client-side JavaScript.

**Website builders:** you have limited control. Compress images, remove unused apps and widgets and keep pages simple.

## A practical order of work

1. Test your top five pages on mobile
2. Fix image sizes and formats first, as it is usually the easiest win
3. Remove or delay scripts you don't need
4. Add caching and a CDN
5. Fix layout shifts with dimensions and reserved space
6. Re-test, and check Search Console in four weeks, since field data updates slowly

## What not to obsess over

- **A perfect 100 score.** A page that passes the Core Web Vitals thresholds is in good shape. Chasing the last few points rarely pays.
- **Lab scores alone.** Real-user data tells you how actual visitors experience the site.
- **Speed at the expense of content.** Helpful, relevant pages rank because of what they say. Speed supports that. It doesn't replace it.

## How we fix Core Web Vitals at DECHY

We start with measurement, not guesswork. We look at field data from real visitors and lab tests for the pages that matter most, such as your home page, service pages and checkout. Then we list the problems in order of impact.

Most fixes fall into a few groups. Images get resized, compressed and served in modern formats. Fonts and scripts load in a better order. Layout shifts are removed by reserving space for images, banners and embeds. Third-party tags are reviewed, and the ones you do not need are removed.

For many business sites, a focused speed and technical audit with fixes costs {{fact:price.seo-aeo-geo-technical-audit-and-fixes}}. When the problems come from an old theme or platform, a rebuild can be the cheaper path. A business website with us costs {{fact:price.web-development-business-website}}, built to pass Core Web Vitals from launch.

Use the [cost estimator](/tools/cost-estimator/) for a range, or [send us your site](/contact/). We will tell you what is slowing it down and what it would take to fix it.

## Frequently asked questions

### What are good Core Web Vitals scores?
LCP of 2.5 seconds or less, INP of 200 milliseconds or less and CLS of 0.1 or less, measured for at least 75 percent of visits.

### Do Core Web Vitals affect Google rankings?
Yes, as part of page experience signals, though content relevance and quality matter more. They also affect conversions directly.

### How long until improvements show in Search Console?
Field data is gathered over about 28 days, so expect changes to appear within four to six weeks.

### Why is my mobile score worse than desktop?
Phones have slower processors and connections, and tests simulate that. Mobile is the score to prioritize.

### Can I fix Core Web Vitals without a developer?
Some fixes, like compressing images and removing unused plugins, are easy. Deeper issues with scripts and code need a developer.

### What is the quickest win?
Optimizing and properly sizing your largest images. It often improves LCP the most with the least effort.

## Next step

Want a clear picture of how your site performs and what to fix first? Send us your URL. We'll review it and give you a prioritized list. [Talk to DECHY](/contact/).
