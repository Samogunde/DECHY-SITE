# DECHY Country Architecture

Status: APPROVED PHASE 0 ARCHITECTURE (governs its topic under the approved plan; precedence in CLAUDE.md and ADR 0002). Country pages are a planned part of the platform.
Labels: CONFIRMED, RECOMMENDED, ASSUMPTION, VERIFY AT WRITING (legal or market facts that must be re-checked against current sources when each page is written; I list topics, not final claims).

## 1. Principles

CONFIRMED by your instruction:
- Country level only. No city pages, no street addresses, no offices, no branches, no local teams, no Google Business Profiles, no local phone numbers.
- Pages represent DECHY's ability to serve clients in that market, truthful to global positioning ("DECHY works with clients in X"; never "our X office").
- 10 to 15 strategically selected countries.
- No template-with-country-name pages. Each page needs market-specific substance.
- Pages connect to services, technologies, industries, solutions, business types, and content.
- **Global scope (Phase 0 approval):** the country set is for international search and content expansion. It does not mean DECHY only targets these countries, and no page may call them DECHY's only or priority markets unless separately approved. Copy says DECHY serves organizations and clients in these markets as part of a global practice.

## 2. Country set

Candidate pool of 15 (your examples): United States, United Kingdom, Germany, France, Spain, Italy, Netherlands, Ireland, Switzerland, Sweden, Canada, Australia, United Arab Emirates, Belgium, Austria.

RECOMMENDED publication in waves so quality stays high (each wave reviewed before the next):

| Wave | Countries | Why this grouping |
|---|---|---|
| 1 | United States, United Kingdom, Canada, Australia, Ireland | English-language buyer markets; the page can be written natively with strong market specifics |
| 2 | Germany, France, Netherlands, Switzerland, Belgium, Austria | EU/EEA and DACH/Benelux markets with strong regulatory and language specifics; pair with localized-language versions later |
| 3 | Spain, Italy, Sweden, United Arab Emirates | Distinct regulatory and language contexts |

ASSUMPTION: wave order is mine; you may reprioritize by where you want business (DEC-32).

## 3. Country page blueprint

Required content, each section written for that country (not swapped):

1. Hero: what DECHY does for organizations operating in the country, remote-first delivery stated plainly.
2. Business landscape: what technology buyers there typically need (high level, factual).
3. Services most relevant in this market, with reasons.
4. Regulatory and compliance considerations that affect software, data, AI, and automation (VERIFY AT WRITING).
5. Market-specific integrations: payment methods, e-invoicing, identity, accounting, commerce platforms (VERIFY AT WRITING).
6. Industries prominent in the market and relevant solutions.
7. Business types served (startups, SMEs, enterprises, public sector, etc.) as relevant.
8. Technology capabilities relevant to the market.
9. Working across time zones and languages: how engagements run.
10. Country FAQs (real questions).
11. Related Work Areas and entries, resources, services, technologies.
12. CTA.

A page is publishable only if at least sections 4, 5, and 6 contain substance specific to that country and the page passes the duplicate-content validator against every other country page (similarity threshold set at build).

## 4. Country-specific considerations (research topics, not final claims; VERIFY AT WRITING)

| Country | Topics to research and cover |
|---|---|
| United States | State privacy laws (for example California), HIPAA for health data, SOC 2 expectations, ACH/card payments, sector regulation (finance, health), accessibility litigation context |
| United Kingdom | UK GDPR and Data Protection Act, Open Banking, FCA context for fintech, public-sector procurement frameworks, Faster Payments/BACS |
| Canada | PIPEDA and provincial rules, Quebec language and privacy requirements, bilingual interfaces, Interac |
| Australia | Privacy Act, Consumer Data Right, data residency preferences, PayID/BPAY |
| Ireland | EU GDPR with Irish regulator context, technology-sector concentration, EU single-market issues |
| Germany | GDPR and strict data protection culture, Impressum and site-identification expectations, e-invoicing rollout, Mittelstand manufacturing systems, German-language expectations, SEPA |
| France | GDPR/CNIL, e-invoicing rollout, French-language expectations, public-sector requirements |
| Netherlands | iDEAL, logistics and trade sector systems, strong English use in business |
| Switzerland | Federal data protection act, multilingual (DE/FR/IT) needs, finance and pharma sectors, Twint |
| Belgium | Multilingual (NL/FR/DE), Bancontact, e-invoicing mandate, EU institutions context |
| Austria | DACH conventions, GDPR, German-language expectations, industrial sector |
| Spain | GDPR/AEPD, regional languages, public-sector digitalization, tourism and retail |
| Italy | GDPR/Garante, e-invoicing (SDI) context, SME-dominated economy, manufacturing |
| Sweden | Klarna/BankID/Swish ecosystem, Nordic digital maturity, sustainability reporting |
| United Arab Emirates | PDPL and free-zone data regimes, data residency, Arabic/English bilingual interfaces (RTL), government digital initiatives, payment and VAT context |

Cross-cutting EU topics for the EU pages (VERIFY AT WRITING): GDPR, NIS2, DORA for financial entities, the EU AI Act as it phases in, and accessibility requirements.

## 5. Data model

```yaml
# data/countries/<slug>.yaml
id: loc.germany
type: country
name: Germany
iso: DE
region: europe
wave: 2
presence: none                 # fixed: DECHY has no office; serves clients remotely
languagesOfBusiness: [de, en]
regulatoryTopics: [...]        # structured, each with source URL and last verified date
localIntegrations: [...]       # e.g. SEPA, e-invoicing
primaryIndustries: [ind.manufacturing, ind.logistics]
relatedServices: [...]
relatedTechnologies: [...]
relatedSolutions: [...]
businessTypes: [...]
faqs: [...]
status: CREATE LATER | CREATE / INDEX
```

Edges: Country → Service, Technology, Industry, Solution, Business type, Resource, Work (markets where entries were delivered, only if supplied and permitted).

Validator rules: `presence` must equal `none` unless an approved fact says otherwise; forbidden strings (office, branch, headquarters, address, "our team in") fail the build on country pages; every regulatory claim needs a source and `lastVerified` date; unique-content similarity check.

## 6. URLs, hreflang, schema

- Hub `/locations/` and pages `/locations/{country-slug}/` (for example `/locations/germany/`).
- Qualified country x service intersections `/{service}/{country-slug}/` are CREATE LATER and need distinct, evidenced substance beyond the country page (for example `/software-development/germany/`). Not part of Wave 1 to 3.
- English country pages are not locale variants of one another; they are different documents. Do not create `en-US`/`en-GB` duplicates of identical text. A German-language version of the Germany page is a separate locale document (`/de/locations/germany/`) linked with hreflang once genuinely localized.
- Schema: `WebPage` + `Service` with `areaServed` set to the `Country`; `BreadcrumbList`. No `LocalBusiness`, no address, no geo coordinates.

## 7. Risks and mitigations

- Doorway/scaled-content perception if pages look alike. Mitigation: unique sections 4 to 6, similarity validator, human review, waves.
- Stale legal statements. Mitigation: sources, last verified dates, quarterly review task.
- Legal advice implication. Mitigation: "considerations", not legal advice; wording reviewed.
- Pages for markets where inquiries cannot be served well (language, time zone). Mitigation: state engagement language and time-zone handling truthfully (needs your facts: DEC-05).

## 8. Decisions

DEC-09 (revised): approve country architecture, waves, and the no-city rule. DEC-35: confirm the 15-country pool and wave order.
