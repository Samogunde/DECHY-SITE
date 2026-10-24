---
slug: app-store-launch-checklist
type: guides
category: guide
service: mobile-app-development
title: "App Store Launch Checklist for iOS and Android | DECHY"
description: "A practical checklist for launching your app on the Apple App Store and Google Play: accounts, listing, privacy, testing, review tips, and post-launch steps."
h1: "App Store Launch Checklist: Apple and Google Play"
summary: "A practical checklist for launching your app on the Apple App Store and Google Play: accounts, listing, privacy, testing, review tips, and post-launch steps."
answer: To launch an app, you need developer accounts, a finished and tested build, a complete store listing with screenshots and a privacy policy, accurate privacy declarations and a plan for reviews and updates. Apple's review can take a day or more and often rejects first submissions for avoidable reasons. Start the account and listing work weeks before your build is ready.
intent: app store launch checklist
date: 2026-10-24
author: DECHY Team
---

Rules and fees change, so check Apple's and Google's current requirements before you submit. This checklist covers what founders most often miss.

## 1. Accounts and ownership

- [ ] Create the **Apple Developer Program** account in your company's name. Apple charges an annual fee.
- [ ] Create the **Google Play Console** account in your company's name. Google charges a one-time fee.
- [ ] Use an organization account where possible, which may require a business registration number and a D-U-N-S number for Apple.
- [ ] Keep the accounts under **your** control. Give your development partner access as a team member, never ownership.
- [ ] Use a shared company email address for the accounts, with two-factor authentication on.
- [ ] Allow time for verification. Organization checks can take days or weeks.

Do this first. It is the most common reason launches slip.

## 2. App readiness

- [ ] The app does what the listing says, with no sample text, dead buttons or test data
- [ ] Core flows work from first open to the main goal
- [ ] A **demo account** is ready for reviewers if login is required, with sample data
- [ ] The app handles no connection, slow connection and errors gracefully
- [ ] Crash reporting and analytics are set up
- [ ] The version number and build number are set correctly
- [ ] The app is tested on real devices, including older models and small screens
- [ ] Permissions are requested only when needed, with a clear reason shown to the user
- [ ] Account deletion is available inside the app if users can create accounts
- [ ] Payments and subscriptions work in the store's sandbox

## 3. Testing before submission

- [ ] Internal testing by your team
- [ ] **TestFlight** beta for iOS with real users
- [ ] **Closed or open testing track** on Google Play. New personal developer accounts may need a minimum testing period and tester count, so check the current requirement.
- [ ] A bug list triaged, with no known crashes or blockers
- [ ] Accessibility checked: text size, contrast and screen reader basics
- [ ] Performance checked: launch time, battery use and memory

## 4. Store listing content

Prepare this in advance. It takes longer than people expect.

- [ ] **App name.** Short, clear and available. Check trademark conflicts.
- [ ] **Subtitle or short description** with your main keyword, written for people first
- [ ] **Full description** explaining what the app does and who it is for
- [ ] **Keywords** (Apple has a keyword field; Google reads the description)
- [ ] **Icon** at the required sizes, simple and recognisable
- [ ] **Screenshots** for each required device size, showing real features with short captions
- [ ] **Preview video** (optional but useful)
- [ ] **Category** chosen carefully
- [ ] **Support URL** and a working support email
- [ ] **Marketing URL** (optional)
- [ ] **Age rating** questionnaire answered honestly
- [ ] **Localized listings** if you serve several languages

Do not use another company's name, logo or misleading claims. Apple and Google reject these.

## 5. Privacy and legal

This is where many submissions fail.

- [ ] A **privacy policy** published on a public URL and linked in the listing and in the app
- [ ] **Apple privacy "nutrition labels"** filled in accurately, matching what the app and any third-party tools collect
- [ ] **Google Play Data safety** form completed accurately
- [ ] Every analytics, advertising or crash tool you use is accounted for in these declarations
- [ ] **Terms of service** available
- [ ] Consent flows where laws require them, for example for tracking or marketing
- [ ] **App Tracking Transparency** prompt if you track users across other companies' apps and sites
- [ ] Compliance with rules for children's data if the app targets kids
- [ ] Regulated industries such as health or finance checked for extra requirements

An inaccurate privacy declaration can lead to rejection or removal later.

## 6. Payments and subscriptions

- [ ] In-app purchases and subscriptions set up in each store's console
- [ ] Digital goods sold through the store's billing system where required by the store rules
- [ ] Clear pricing, trial terms and renewal information shown before purchase
- [ ] A way to restore purchases
- [ ] A way to manage or cancel subscriptions
- [ ] Tax and bank details completed so you can be paid

Rules on payments differ between stores and regions and change over time. Read the current guidelines before you design your billing.

## 7. Submission

**Apple:**
- [ ] Upload the build through Xcode or your CI tool
- [ ] Complete App Store Connect metadata
- [ ] Add review notes, demo login and any special instructions
- [ ] Choose manual or automatic release after approval
- [ ] Submit for review

**Google:**
- [ ] Upload the app bundle to Play Console
- [ ] Complete the store listing, content rating, Data safety and target audience sections
- [ ] Roll out to production, with a staged percentage if you want a cautious release
- [ ] Submit for review

## 8. Common reasons for rejection

- Crashes or bugs during review
- Missing or inaccurate privacy information
- No demo account, so reviewers can't test
- Broken links or no real support contact
- Unfinished sample content or incomplete features
- Requesting permissions without a clear reason
- A "web wrapper" with little app value
- Misleading descriptions or screenshots
- Payments that bypass store rules
- Missing account deletion option

If you're rejected, read the message, fix the specific issue, reply clearly and resubmit. Rejection is common and fixable.

## 9. Launch week

- [ ] Prepare a launch announcement for email, social channels and your website
- [ ] Add store badges and links to your site
- [ ] Brief your support team
- [ ] Monitor crash reports and reviews daily
- [ ] Respond to early reviews, especially negative ones
- [ ] Ask happy users for a rating at a sensible moment, such as after a successful task
- [ ] Track installs, activation and retention
- [ ] Have a hotfix process ready

## 10. After launch

- [ ] Plan updates every few weeks at first
- [ ] Fix top issues from reviews and analytics
- [ ] Test on new operating system versions when they release
- [ ] Review store listing performance and test new screenshots or descriptions
- [ ] Keep privacy declarations up to date when you add tools
- [ ] Budget for yearly maintenance. See [app maintenance cost](/resources/cost-guides/app-and-software-maintenance-cost/).

## Timeline to plan for

A rough guide for a first release:

- **4 to 6 weeks before:** create accounts, begin verification, draft listing and policies
- **2 to 3 weeks before:** beta testing, screenshots and privacy forms
- **1 week before:** final build, submit for review
- **Review time:** often one to a few days, longer if rejected
- **After approval:** release and monitor

Leave a buffer for rejections. Do not announce a hard launch date until the build is approved.

## Frequently asked questions

### How long does App Store review take?
Often a day or two, but it varies. Plan for several days, and longer if you are rejected and need to resubmit.

### How much does it cost to publish an app?
Apple charges an annual developer fee and Google a one-time fee. Check current prices on their sites, and add any costs for design, testing and legal documents.

### Do I need a privacy policy?
Yes, for almost every app. Both stores require one, and it must match what your app actually collects.

### Why was my app rejected?
Common causes are crashes, missing demo login, inaccurate privacy information, unfinished sample content and unclear permission requests. The rejection message lists the specific reason.

### Can my developer publish under their own account?
It is better not to. If the developer owns the listing, you can lose control of your app. Publish under your own accounts.

### Should I launch on iOS and Android at the same time?
Not necessarily. Many teams launch on one platform first to learn faster. See [building a mobile app MVP (minimum viable product, a first version with only the essentials)](/resources/guides/build-a-mobile-app-mvp/).

## Next step

Getting ready to launch? We can run a pre-submission check on your build, listing and privacy declarations before you send it to review. [Talk to DECHY](/contact/).
