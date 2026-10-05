# DECHY 53 Launch Article Plan

Status: FINAL PHASE 0 PACKAGE, awaiting owner review. The 53-article requirement is retained in full.
Documentation gap: the Content Master says the list is defined in AGENTS.md, but AGENTS.md does not contain it. This document is the proposed complete 53-article architecture. If an earlier original list exists anywhere (the abandoned build, notes), send it and I will reconcile it against this set with a mapping table; nothing here blocks that.

## 1. Selection logic

Each article was chosen to do all of these:
1. Answer a real question a buyer or technical evaluator asks (clear primary intent).
2. Support one canonical-home service and at least two other entities (technology, solution, industry, problem, integration).
3. Link up to a commercial page and across to related articles (hub and spoke).
4. Add original value: decision frameworks, architecture diagrams, trade-off tables, checklists, failure modes. Not summaries of other pages.
5. Together, cover all 15 pillars, the major platforms and providers, industries, and problems.

Coverage by cluster: Software and Web 9, AI 10, Automation and Workflows 8, Integration, Data, Cloud, Security 10, Ecommerce, Design, Brand 5, SEO, AEO and GEO 5, Industries and Compliance 3 (#48, #49, #53), Consulting, Marketing Systems and Transformation 3 (#50, #51, #52). Total 53.

## 2. The 53 articles

Type codes: D definition and explainer, G guide or how-to, C comparison, X decision framework, I industry. Canonical home is the service URL the article reports to. "Pillar" marks articles that should be the deepest in their cluster (3,000+ words, original diagrams).

| # | Working title | Type | Canonical home | Primary question answered | Key entities and links | Batch |
|---|---|---|---|---|---|---|
| 1 | What Is Custom Software Development and When Does a Business Need It | D, Pillar | software-development | What is custom software and is it right for us | Software Dev, SaaS, internal tools, build vs buy (#2) | 1 |
| 2 | Build, Buy or Integrate: How to Choose Business Software | X | software-development | Should we build, buy off the shelf, or connect existing tools | Software Dev, API integration, Airtable, CRM | 1 |
| 3 | How to Modernize Legacy Software Without Stopping the Business | G | software-development | How do we replace old systems safely | Legacy modernization, cloud migration (#32), integration | 2 |
| 4 | SaaS Product Development: From MVP to Scalable Platform | G | software-development | How is a SaaS product planned and built | SaaS, MVP, multi-tenancy, cloud, startups | 3 |
| 5 | Monolith or Microservices: Choosing a Software Architecture | C | software-development | Which architecture fits our stage | Architecture, microservices, serverless, DevOps | 2 |
| 6 | Headless CMS or Traditional CMS: Which Fits Your Website | C | web-development | Which CMS model should we use | WordPress, Contentful, Sanity, Strapi, Next.js | 3 |
| 7 | WordPress or a Custom Web Application: How to Decide | X | web-development | When is WordPress enough | WordPress, Next.js, React, performance | 3 |
| 8 | Native or Cross-Platform Mobile Apps: Swift, Kotlin, Flutter and React Native Compared | C | mobile-app-development | Which approach for our app | Flutter, React Native, Swift, Kotlin | 3 |
| 9 | How to Plan Internal Business Software People Will Actually Use | G | software-development | How do we scope internal tools | Internal tools, portals, UX, adoption | 5 |
| 10 | What Are AI Agents and How Do They Differ from Chatbots and Automation | D, Pillar | ai | What is an AI agent | AI agents, LLMs, workflows, tools | 1 |
| 11 | Retrieval-Augmented Generation (RAG) Explained for Business Teams | D | ai | What is RAG and when is it useful | RAG, vector databases, embeddings, knowledge systems | 2 |
| 12 | OpenAI, Claude, Gemini or Open Models: How to Choose an AI Model Provider | C | ai | Which model provider fits our use case | OpenAI, Anthropic Claude, Gemini, Llama, Mistral, Bedrock | 2 |
| 13 | AI Readiness Assessment: Questions to Answer Before You Start | X | consulting | Are we ready for AI | AI strategy, data, governance, consulting | 3 |
| 14 | How to Add AI to an Existing Business Application | G | ai | How do we integrate AI into what we have | LLM integration, APIs, security, evaluation | 3 |
| 15 | AI Customer Support: What to Automate and What to Keep Human | G | ai | What can AI handle in support | AI support, chatbots, voice agents, CRM | 3 |
| 16 | How to Evaluate and Test an LLM Application | G | ai | How do we know the AI works | Evaluation, hallucination, guardrails | 4 |
| 17 | AI Security and Governance for Business Applications | G | ai | What are the risks and controls | Prompt injection, data privacy, access, EU AI Act | 4 |
| 18 | Fine-Tuning, RAG or Prompting: Which Approach to Use | C | ai | Which technique should we use | Fine-tuning, RAG, prompt design | 4 |
| 19 | Document Intelligence: Automating Invoices, Contracts and Forms with OCR and AI | G | ai | How do we automate document work | OCR, NLP, workflows, finance automation | 4 |
| 20 | Business Process Automation: What It Is and Where to Start | G, Pillar | automation | Where should automation begin | BPA, workflow, CRM, Airtable | 1 |
| 21 | Workflow Automation, Business Process Automation and AI Automation: The Differences | D | automation | How do these terms differ | Workflow, BPA, AI automation | 1 |
| 22 | Zapier, Make or n8n: How to Choose an Automation Platform | C | automation | Which platform fits | Zapier, Make, n8n, Power Automate | 2 |
| 23 | Airtable as a Business Operating System: What It Can and Cannot Do | G | automation | Can Airtable run our operations | Airtable, CRM, interfaces, automation, integrations | 2 |
| 24 | Automating Lead Management: From Web Form to CRM to Follow-Up | G | automation | How do we automate lead handling | CRM, HubSpot, Salesforce, Airtable, AI qualification | 2 |
| 25 | How to Map a Workflow Before You Automate It | G | automation | How do we prepare a process for automation | Workflow design, approvals, data | 4 |
| 26 | Error Handling, Monitoring and Maintenance for Automated Workflows | G | automation | How do we keep automations reliable | Monitoring, retries, webhooks, logging | 4 |
| 27 | Too Many Spreadsheets: Replacing Spreadsheet Processes with a Real System | G | automation | How do we move off spreadsheets | Airtable, custom software, data migration | 4 |
| 28 | What Is API Integration and How Do Systems Actually Connect | D, Pillar | api-integration | How do systems exchange data | REST, GraphQL, webhooks, OAuth | 1 |
| 29 | REST, GraphQL, Webhooks and Events: Choosing an Integration Pattern | C | api-integration | Which pattern fits | REST, GraphQL, webhooks, event-driven | 3 |
| 30 | CRM Integration: Connecting Salesforce or HubSpot to the Rest of Your Business | G | api-integration | How do we integrate our CRM | Salesforce API, HubSpot API, ERP, automation | 3 |
| 31 | Payment Integration: Stripe, PayPal, Adyen, Paystack and Flutterwave Compared | C | api-integration | Which payment provider fits our markets | Stripe, PayPal, Adyen, Paystack, Flutterwave, ecommerce | 4 |
| 32 | Cloud Migration: Planning, Risks and Sequence | G | cloud | How do we move to the cloud | AWS, Azure, Google Cloud, DevOps, security | 1 |
| 33 | AWS, Azure or Google Cloud: A Practical Comparison for Business Applications | C | cloud | Which cloud should we use | AWS, Azure, GCP, cost, services | 2 |
| 34 | CI/CD and DevOps Basics for Business Software Teams | G | cloud | What is a good delivery pipeline | GitHub Actions, Docker, Kubernetes, Terraform | 4 |
| 35 | Application Security Basics: The OWASP Top 10 for Business Owners | G | cybersecurity | What are the main app risks | OWASP, secure coding, testing | 5 |
| 36 | Zero Trust, MFA and Identity: A Practical Starting Guide | G | cybersecurity | How do we improve access security | Zero Trust, MFA, IAM, OAuth, Entra ID | 5 |
| 37 | Data Analytics and BI: How to Build Dashboards People Trust | G | data-analytics | How do we get reliable reporting | BI, warehouses, BigQuery, Snowflake, data quality | 5 |
| 38 | Shopify, WooCommerce, Magento or BigCommerce: How to Choose | C | ecommerce | Which commerce platform fits | Shopify, WooCommerce, Adobe Commerce, BigCommerce | 5 |
| 39 | Website and Ecommerce Platform Migration Without Losing SEO or Sales | G | ecommerce | How do we migrate safely | Migration, redirects, indexation, SEO | 5 |
| 40 | What Is a Design System and Why Product Teams Need One | D | ui-ux | What is a design system | Figma, components, tokens, handoff | 5 |
| 41 | UX Research and Usability Testing: Methods and When to Use Each | G | ui-ux | Which research method to use | UX research, prototyping, testing | 5 |
| 42 | Brand Strategy and Brand Identity: What a Business Needs First | D | branding | What comes first in branding | Brand strategy, identity, guidelines | 5 |
| 43 | SEO, AEO and GEO: What Each One Means and How They Work Together | D, Pillar | seo-aeo-geo | What is the difference | SEO, AEO, GEO, entities, structured data | 1 |
| 44 | How AI Search Engines Find, Summarize and Cite Sources | D | seo-aeo-geo | How does AI search pick sources | Google AI Overviews, ChatGPT, Perplexity, Gemini | 6 |
| 45 | Entity SEO and Structured Data: A Practical Guide | G | seo-aeo-geo | How do we use entities and schema | Schema.org, Knowledge Graph, internal linking | 6 |
| 46 | Technical SEO Checklist for Modern JavaScript Websites | G | seo-aeo-geo | How do we make JS sites crawlable | Next.js, React, rendering, Core Web Vitals | 6 |
| 47 | International SEO: hreflang, URL Structure and Localization | G | seo-aeo-geo | How do we run SEO across countries | hreflang, subdirectories, localization | 6 |
| 48 | Logistics and Operations Software: Where Integration and Automation Pay Off | I | software-development | What software helps logistics operations | Logistics, tracking, APIs, automation, analytics | 6 |
| 49 | Software for Healthcare Organizations: Interoperability, Privacy and Where AI Fits | I | software-development | What matters in health software | Healthcare, HIPAA, FHIR, security, AI | 6 |
| 50 | Digital Transformation: A Practical Roadmap That Is Not a Buzzword | G, Pillar | consulting | How do we run a transformation | Consulting, audits, architecture, automation | 1 |
| 51 | CRM and Marketing Automation: Aligning Sales and Marketing Systems | G | digital-marketing | How do sales and marketing share data | HubSpot, Salesforce, email, lead nurturing | 6 |
| 52 | How to Choose a Software Development Partner: Questions to Ask | X | consulting | How do we evaluate a technology partner | Discovery, contracts, delivery models | 2 |
| 53 | Compliance-Aware Software: GDPR, HIPAA and SOC 2 Basics for Product Teams | G | cybersecurity | How does compliance shape software | GDPR, HIPAA, SOC 2, audits, cloud | 6 |

Batch counts: 1 = 9, 2 = 9, 3 = 9, 4 = 9, 5 = 9, 6 = 8. Total 53 (all numbers 1 to 53 appear once).

## 3. Recommendations on the set (explained, none removes an article)

1. **Overlap control (rename and differentiate).** #20 is the "where to start" how-to; #21 is the definitions article. Keep their intents strictly separate in briefs, or they cannibalize.
2. **#44 renamed** from any "how AI engines choose sources" framing to "find, summarize and cite", and written without guarantees (AGENTS 15, 35).
3. **#39 widened** to website and ecommerce migration (covers the AGENTS migration content) and **#46 excludes migration** to avoid overlap.
4. **#31 expanded** with regional payment context (Paystack and Flutterwave are in the DECHY integration list and are a differentiator for Africa-facing projects, ASSUMPTION about relevance to your market).
5. **Pillars (#1, #10, #20, #28, #43, #50)** are the deepest assets; publish first in Batch 1 so later articles have strong parents.
6. **Industry coverage** is intentionally light in the 53 (#48, #49, #53); deeper industry content belongs on industry pages and in the post-launch expansion list.
7. **Post-launch candidates (beyond the 53)** to add once Search Console shows demand: ecommerce automation, Shopify integration, Python vs Node.js for backends, PostgreSQL vs MongoDB, serverless vs containers, API security, AI voice agents, no-code vs low-code vs custom, product discovery, mobile app security, data migration, headless commerce, programmatic SEO risks, schema for services.
8. All titles are working titles; final titles are chosen for intent after a SERP check at brief time.

## 4. Article standard (applies to every one)

Each article must contain: answer-first opening (1 to 2 sentence direct answer), definitions of terms, practical explanation, at least one original figure or table (decision matrix, architecture or data-flow diagram, checklist), trade-offs and common mistakes, implementation considerations, when not to do it, a short set of real FAQs, related DECHY services and Work Areas, links to 3 to 6 related entities and articles, external references to authoritative standards or documentation where useful (OWASP, W3C, schema.org, vendor docs), named author and reviewer, `datePublished`, `dateModified`.

Depth: as long as the topic needs; typical 1,800 to 3,500 words; pillars 3,000 to 5,000 with several figures. Length is never padded.

Voice: no em or en dashes, no emojis, no hype, no guarantees. Capability language about DECHY is allowed (approved). Specific project claims only from supplied facts; examples are labeled "illustrative".

Per-article brief (stored as data before writing): slug, canonical home, primary intent, secondary intents, SERP notes, outline, required figures, entities and edges, internal link slots, FAQ list, schema type, author, reviewer, batch.

Publication: batches of 8 or 9. Each batch passes content QA, technical QA, and your review before the next begins. Articles live at `/resources/{type}/{slug}/` (types: guides, comparisons, definitions, articles).

## 5. Dependencies

Phase 2 service pages should exist or be in progress before Batch 1 publishes, so every article has a parent. Authors and reviewers named (DEC-22) before publication.
