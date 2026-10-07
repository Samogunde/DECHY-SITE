# Technology and Solutions qualification

Status: REVIEW AND RECOMMENDATION, with owner decisions recorded in section 10. Nothing here is implemented as a page. It is the planning gate between the navigation pass and Phase 4. Written 6 October 2026. Sections 1 to 9 are the qualification as submitted, updated only where an owner decision changed a disposition (the nine entities now read CONFIRMATION REQUIRED, and MySQL is requalified). Section 10, Decision Resolution, is the current record of what is approved, what awaits factual confirmation, what is deferred, and what still needs architectural review.

Evidence labels used throughout:

- **Approved** means it is stated in an approved planning or governance document (`AGENTS.md`, the master plan, the Content Master, the decision records, or Samuel's own instructions).
- **Recommended** means it is my recommendation, built on approved evidence, and needs Samuel's approval before it is acted on.
- **Inferred** means it follows from the current architecture but is not written down anywhere.
- **Needs Samuel** means the evidence does not settle it.

## 1. Executive summary

**What was reviewed.** All 329 technology-like entities in the graph (the 310 seeded from `AGENTS.md`, plus the 19 added in ADR 0005), the 32 published technology pages, the 22 Solution entities, the 25 Work Areas, the 30 problem entities, the 15 services, and the navigation data.

**Technology inventory.** Of 329 entities: 32 already have pages and stay; 11 more qualify for a page in a next wave; 21 are legitimate later candidates; 103 are better represented inside another page or group; 153 stay in the graph without a page; 9 are CONFIRMATION REQUIRED (no planning evidence for the named product, so no page and no promotion until the capability is confirmed). Nothing is removed and no approved entity is recommended for removal.

**The 19 added entities.** Two are verified and kept (Node.js and .NET are named in the approved master plan). Eight are grouped under an approved parent (the Node.js, Python, Java and PHP frameworks, and Elasticsearch under the approved ELK entity). Nine have no planning evidence for the named product and are held as CONFIRMATION REQUIRED, neither promoted nor removed: Ruby on Rails, Power BI, Tableau, Looker, Kafka, RabbitMQ, OpenSearch, Datadog and Sentry. I added all 19 in the previous pass on my own reading of capability categories. For the 17 without named evidence the category is approved but the named product is not, and the review treats that as an open fact to confirm, not as a finding that DECHY does not support them.

**Next technology wave.** Eleven pages, ranked: four HIGH (Node.js, WooCommerce, .NET, Power Automate) and seven MEDIUM (BigQuery, MySQL, Vue, Angular, Firebase, Supabase, Snowflake), plus one grouped open-models page that needs a new group entity (MEDIUM, Samuel to decide). MySQL was first placed in LATER only because the PostgreSQL page exists; on requalification (section 4.3) it passes the standalone-page criteria and is MEDIUM.

**Solutions versus Work Areas.** Of the 22 planned Solutions, 6 satisfy an intent that is meaningfully different from every Work Area and should become pages; 5 are plausible but should wait; 9 are the same intent as a Work Area and should be represented by it; 1 merges into another Solution; 1 stays graph-only. Nothing is removed. This is smaller than the first-wave 12 in the master plan, and deliberately so: nine of the twelve planned first-wave Solutions would otherwise be a second page for something a Work Area already explains.

**What this changes in the data.** The eight grouped entities carry `MERGE / CONSOLIDATE`; the nine confirmation-required entities keep `REVIEW` with a CONFIRMATION REQUIRED marker (section 3). Nineteen Problem to Solution edges were added to the graph (section 10.5). No Solution `pagePolicy` is changed and no page, route or copy changes.

## 2. Current technology inventory disposition

### 2.1 The standard applied

A technology receives a public page only if it passes all of these, together:

1. **Intent.** People search for it as a service or decision, not only as a word.
2. **Relevance.** It is commercially important to DECHY's buyers.
3. **Unique content.** DECHY can say something a reader cannot get from a vendor's own site, such as when it fits, what the alternatives cost, and how it connects to the systems we build.
4. **Support.** An approved planning document names it as a DECHY capability (class A or B below), not merely a technology that belongs to an approved service.
5. **Distinctness.** It does not repeat another page.

Evidence classes: **A** the approved lists in `AGENTS.md`; **B** another approved planning document (the master plan, the Content Master, or the handoff); **C** only the capability category is approved; **D** nothing. Classes C and D are never enough for an entity to be kept as an approved capability on their own.

### 2.2 Summary

| Disposition | Count | Meaning here |
|---|---|---|
| APPROVED PUBLIC PAGE | 43 | 32 published, plus 11 qualified for the next wave and not yet built |
| LATER | 21 | Legitimate future candidates; no commitment |
| MERGE / GROUP | 103 | Named inside another page or a group page; no page of their own |
| GRAPH-ONLY ENTITY | 153 | Stay in the graph; includes 28 concepts that suit articles in Phase 5 |
| CONFIRMATION REQUIRED | 9 | Kept as entities, no page, not promoted; the owner confirms the factual capability before a final disposition |
| **Total** | **329** | |

The 28 concepts (OAuth, Zero Trust, microservices, serverless and similar) are counted under GRAPH-ONLY. They are article candidates, not technology pages.

### 2.3 The full table, by service

Every one of the 329 entities is below, grouped by its canonical service. "Intent" is the search or buyer intent for the technology as a page of its own. "Relevance" is the entity's approved `prominence` (feature, standard, reference). "Capability support" names where the entity is approved.

Counts (329 technology-like entities): GRAPH-ONLY ENTITY 153; APPROVED PUBLIC PAGE 43; MERGE / GROUP 103; CONFIRMATION REQUIRED 9; LATER 21.

Method: dispositions come from the first-pass rules in `13-phase-3-review-technology-inventory.md`, re-run under the five-way standard and corrected where this review disagreed (MySQL, the open-models group, and the 19 added entities). Intent is the search or buyer intent for the technology as a standalone page; relevance is the entity's `prominence` in the approved taxonomy; support names the document that approves the entity.


#### AI & Machine Learning (30)

| Name | Type | Current status | Disposition | Service | Intent | Relevance | Unique page content | Capability support | Recommended action | Reason |
|---|---|---|---|---|---|---|---|---|---|---|
| Anthropic Claude | provider | Published `/ai/anthropic-claude/` | APPROVED PUBLIC PAGE | AI & Machine Learning | High | High | Yes | AGENTS s6 | Keep (published) | Built in Phase 3 |
| Google Gemini | provider | Published `/ai/google-gemini/` | APPROVED PUBLIC PAGE | AI & Machine Learning | High | High | Yes | AGENTS s6 | Keep (published) | Built in Phase 3 |
| LangChain | framework | Published `/ai/langchain/` | APPROVED PUBLIC PAGE | AI & Machine Learning | High | High | Yes | AGENTS s6 | Keep (published) | Built in Phase 3 |
| OpenAI | provider | Published `/ai/openai/` | APPROVED PUBLIC PAGE | AI & Machine Learning | High | High | Yes | AGENTS s6 | Keep (published) | Built in Phase 3 |
| PyTorch | framework | REVIEW | LATER | AI & Machine Learning | Medium | Low | Probably | AGENTS s6 | Revisit when demand or evidence exists | Candidate for one combined machine-learning frameworks page with TensorFlow and scikit-learn |
| Vector Databases | technology | REVIEW | LATER | AI & Machine Learning | Medium | Low | Probably | AGENTS s6 | Revisit when demand or evidence exists | Concept-led intent; best as one vector databases page or a resource |
| Amazon Bedrock | provider | REVIEW | MERGE / GROUP | AI & Machine Learning | Low alone | Low | Only inside the target | AGENTS s6 | No own page; named inside the target above | Represented inside the AWS page and the AI service |
| Hugging Face | provider | REVIEW | MERGE / GROUP | AI & Machine Learning | Low alone | Low | Only inside the target | AGENTS s6 | No own page; named inside the target above | Represented inside the open-models group (page pending a group-entity decision, section 4) |
| LlamaIndex | framework | REVIEW | MERGE / GROUP | AI & Machine Learning | Low alone | Low | Only inside the target | AGENTS s6 | No own page; named inside the target above | Represented inside the LangChain page (shown as an alternative) |
| Meta Llama | provider | REVIEW | MERGE / GROUP | AI & Machine Learning | Low alone | Low | Only inside the target | AGENTS s6 | No own page; named inside the target above | Represented inside the open-models group (page pending a group-entity decision, section 4) |
| Microsoft Azure AI | provider | REVIEW | MERGE / GROUP | AI & Machine Learning | Low alone | Low | Only inside the target | AGENTS s6 | No own page; named inside the target above | Represented inside the Azure page and the AI service |
| Mistral | provider | REVIEW | MERGE / GROUP | AI & Machine Learning | Low alone | Low | Only inside the target | AGENTS s6 | No own page; named inside the target above | Represented inside the open-models group (page pending a group-entity decision, section 4) |
| Pinecone | technology | REVIEW | MERGE / GROUP | AI & Machine Learning | Low alone | Low | Only inside the target | AGENTS s6 | No own page; named inside the target above | Represented inside a vector databases page, if built |
| scikit-learn | framework | REVIEW | MERGE / GROUP | AI & Machine Learning | Low alone | Low | Only inside the target | AGENTS s6 | No own page; named inside the target above | Represented inside a combined machine-learning frameworks page (later) |
| Semantic Kernel | framework | REVIEW | MERGE / GROUP | AI & Machine Learning | Low alone | Low | Only inside the target | AGENTS s6 | No own page; named inside the target above | Represented inside the LangChain page (shown as an alternative) |
| TensorFlow | framework | REVIEW | MERGE / GROUP | AI & Machine Learning | Low alone | Low | Only inside the target | AGENTS s6 | No own page; named inside the target above | Represented inside a combined machine-learning frameworks page (later) |
| AI Gateways | technology | REVIEW | GRAPH-ONLY ENTITY | AI & Machine Learning | Low | Low | No | AGENTS s6 | Keep in the graph | Narrow intent; covered by AI service content |
| Chroma | technology | REVIEW | GRAPH-ONLY ENTITY | AI & Machine Learning | Low | Low | No | AGENTS s6 | Keep in the graph | Narrow intent; covered by AI service content |
| Cohere | provider | REVIEW | GRAPH-ONLY ENTITY | AI & Machine Learning | Low | Low | No | AGENTS s6 | Keep in the graph | Narrow intent; covered by the model-provider pages |
| FAISS | technology | REVIEW | GRAPH-ONLY ENTITY | AI & Machine Learning | Low | Low | No | AGENTS s6 | Keep in the graph | Narrow intent; covered by AI service content |
| Groq | provider | REVIEW | GRAPH-ONLY ENTITY | AI & Machine Learning | Low | Low | No | AGENTS s6 | Keep in the graph | Narrow intent; covered by the model-provider pages |
| Haystack | framework | REVIEW | GRAPH-ONLY ENTITY | AI & Machine Learning | Low | Low | No | AGENTS s6 | Keep in the graph | Narrow intent; covered by AI service content |
| Keras | framework | REVIEW | GRAPH-ONLY ENTITY | AI & Machine Learning | Low | Low | No | AGENTS s6 | Keep in the graph | Narrow intent; covered by the machine-learning frameworks page if built |
| Milvus | technology | REVIEW | GRAPH-ONLY ENTITY | AI & Machine Learning | Low | Low | No | AGENTS s6 | Keep in the graph | Narrow intent; covered by AI service content |
| Model APIs | technology | REVIEW | GRAPH-ONLY ENTITY | AI & Machine Learning | Low | Low | No | AGENTS s6 | Keep in the graph | Narrow intent; covered by AI service content |
| Model Orchestration | technology | REVIEW | GRAPH-ONLY ENTITY | AI & Machine Learning | Low | Low | No | AGENTS s6 | Keep in the graph | Narrow intent; covered by AI service content |
| Qdrant | technology | REVIEW | GRAPH-ONLY ENTITY | AI & Machine Learning | Low | Low | No | AGENTS s6 | Keep in the graph | Narrow intent; covered by AI service content |
| RAG Infrastructure | technology | REVIEW | GRAPH-ONLY ENTITY | AI & Machine Learning | Low | Low | No | AGENTS s6 | Keep in the graph | Narrow intent; covered by AI service content |
| Together AI | provider | REVIEW | GRAPH-ONLY ENTITY | AI & Machine Learning | Low | Low | No | AGENTS s6 | Keep in the graph | Narrow intent; covered by the model-provider pages |
| Weaviate | technology | REVIEW | GRAPH-ONLY ENTITY | AI & Machine Learning | Low | Low | No | AGENTS s6 | Keep in the graph | Narrow intent; covered by AI service content |

#### API & Systems Integration (27)

| Name | Type | Current status | Disposition | Service | Intent | Relevance | Unique page content | Capability support | Recommended action | Reason |
|---|---|---|---|---|---|---|---|---|---|---|
| Stripe | integration | Published `/api-integration/stripe/` | APPROVED PUBLIC PAGE | API & Systems Integration | High | High | Yes | AGENTS s11 | Keep (published) | Built in Phase 3 |
| Flutterwave | integration | REVIEW | LATER | API & Systems Integration | Medium | Low | Probably | AGENTS s11 | Revisit when demand or evidence exists | Regional payment provider; build with the Africa market wave |
| Google APIs | integration | REVIEW | LATER | API & Systems Integration | Medium | Low | Probably | AGENTS s11 | Revisit when demand or evidence exists | Moderate intent; one page on Google integrations |
| Microsoft Graph | integration | REVIEW | LATER | API & Systems Integration | Medium | Low | Probably | AGENTS s11 | Revisit when demand or evidence exists | Moderate intent; pair with Microsoft 365 |
| PayPal | integration | REVIEW | LATER | API & Systems Integration | Medium | Low | Probably | AGENTS s11 | Revisit when demand or evidence exists | Payment provider; shown as an alternative on the Stripe page |
| Paystack | integration | REVIEW | LATER | API & Systems Integration | Medium | Low | Probably | AGENTS s11 | Revisit when demand or evidence exists | Regional payment provider; build with the Africa market wave |
| Adyen | integration | REVIEW | MERGE / GROUP | API & Systems Integration | Low alone | Low | Only inside the target | AGENTS s11 | No own page; named inside the target above | Represented inside the Stripe page (alternative); one 'payment providers' comparison is a resource candidate |
| Braintree | integration | REVIEW | MERGE / GROUP | API & Systems Integration | Low alone | Low | Only inside the target | AGENTS s11 | No own page; named inside the target above | Represented inside the Stripe page (alternative) |
| HubSpot API | integration | REVIEW | MERGE / GROUP | API & Systems Integration | Low alone | Low | Only inside the target | AGENTS s11 | No own page; named inside the target above | Represented inside the HubSpot page |
| Salesforce API | integration | REVIEW | MERGE / GROUP | API & Systems Integration | Low alone | Low | Only inside the target | AGENTS s11 | No own page; named inside the target above | Represented inside the Salesforce page |
| Shopify API | integration | REVIEW | MERGE / GROUP | API & Systems Integration | Low alone | Low | Only inside the target | AGENTS s11 | No own page; named inside the target above | Represented inside the Shopify page |
| Square | integration | REVIEW | MERGE / GROUP | API & Systems Integration | Low alone | Low | Only inside the target | AGENTS s11 | No own page; named inside the target above | Represented inside the Stripe page (alternative) |
| WooCommerce API | integration | REVIEW | MERGE / GROUP | API & Systems Integration | Low alone | Low | Only inside the target | AGENTS s11 | No own page; named inside the target above | Represented inside the WooCommerce page, if built |
| WordPress REST API | integration | REVIEW | MERGE / GROUP | API & Systems Integration | Low alone | Low | Only inside the target | AGENTS s11 | No own page; named inside the target above | Represented inside the WordPress page |
| API Gateway | technology | REVIEW | GRAPH-ONLY ENTITY | API & Systems Integration | Low | Low | No | AGENTS s8 | Keep in the graph | Covered by service content |
| Event-Driven Architecture | technology | REVIEW | GRAPH-ONLY ENTITY | API & Systems Integration | Low | Low | No | AGENTS s11 | Keep in the graph | Covered by service content |
| GraphQL | technology | REVIEW | GRAPH-ONLY ENTITY | API & Systems Integration | Low | Low | No | AGENTS s7 | Keep in the graph | Covered by service content |
| gRPC | technology | REVIEW | GRAPH-ONLY ENTITY | API & Systems Integration | Low | Low | No | AGENTS s11 | Keep in the graph | Covered by service content |
| Microservices | technology | REVIEW | GRAPH-ONLY ENTITY | API & Systems Integration | Low | Low | No | AGENTS s11 | Keep in the graph | Covered by service content |
| OpenID Connect | technology | REVIEW | GRAPH-ONLY ENTITY | API & Systems Integration | Low | Low | No | AGENTS s11 | Keep in the graph | Covered by service content |
| REST | technology | REVIEW | GRAPH-ONLY ENTITY | API & Systems Integration | Low | Low | No | AGENTS s11 | Keep in the graph | Covered by service content |
| SOAP | technology | REVIEW | GRAPH-ONLY ENTITY | API & Systems Integration | Low | Low | No | AGENTS s11 | Keep in the graph | Covered by service content |
| Webhooks | technology | REVIEW | GRAPH-ONLY ENTITY | API & Systems Integration | Low | Low | No | AGENTS s7 | Keep in the graph | Covered by service content |
| WebSockets | technology | REVIEW | GRAPH-ONLY ENTITY | API & Systems Integration | Low | Low | No | AGENTS s11 | Keep in the graph | Covered by service content |
| Wix APIs | integration | REVIEW | GRAPH-ONLY ENTITY | API & Systems Integration | Low | Low | No | AGENTS s11 | Keep in the graph | Narrow intent |
| Apache Kafka | technology | DO NOT CREATE | CONFIRMATION REQUIRED | API & Systems Integration | Low | Medium | Not assessed until confirmed | Category only (inferred) | Keep as entity; no page; Samuel confirms the capability before a final disposition | Event-driven architecture is approved as a concept; Kafka is in no planning document |
| RabbitMQ | technology | DO NOT CREATE | CONFIRMATION REQUIRED | API & Systems Integration | Low | Low | Not assessed until confirmed | Category only (inferred) | Keep as entity; no page; Samuel confirms the capability before a final disposition | Event-driven architecture is approved as a concept; RabbitMQ is in no planning document |

#### Automation, Workflows & AI Solutions (21)

| Name | Type | Current status | Disposition | Service | Intent | Relevance | Unique page content | Capability support | Recommended action | Reason |
|---|---|---|---|---|---|---|---|---|---|---|
| Airtable | platform | Published `/automation/airtable/` | APPROVED PUBLIC PAGE | Automation, Workflows & AI Solutions | High | High | Yes | AGENTS s7 | Keep (published) | Built in Phase 3 |
| HubSpot | platform | Published `/automation/hubspot/` | APPROVED PUBLIC PAGE | Automation, Workflows & AI Solutions | High | High | Yes | AGENTS s7 | Keep (published) | Built in Phase 3 |
| Make | technology | Published `/automation/make/` | APPROVED PUBLIC PAGE | Automation, Workflows & AI Solutions | High | High | Yes | AGENTS s7 | Keep (published) | Built in Phase 3 |
| Microsoft Power Automate | technology | REVIEW | APPROVED PUBLIC PAGE | Automation, Workflows & AI Solutions | High | Low | Yes | AGENTS s7 | Next wave, rank 4 (HIGH); not built | Major automation platform; named as an alternative on three Phase 3 pages |
| n8n | technology | Published `/automation/n8n/` | APPROVED PUBLIC PAGE | Automation, Workflows & AI Solutions | High | High | Yes | AGENTS s7 | Keep (published) | Built in Phase 3 |
| Salesforce | platform | Published `/automation/salesforce/` | APPROVED PUBLIC PAGE | Automation, Workflows & AI Solutions | High | High | Yes | AGENTS s7 | Keep (published) | Built in Phase 3 |
| Zapier | technology | Published `/automation/zapier/` | APPROVED PUBLIC PAGE | Automation, Workflows & AI Solutions | High | High | Yes | AGENTS s7 | Keep (published) | Built in Phase 3 |
| Google Workspace | platform | REVIEW | LATER | Automation, Workflows & AI Solutions | Medium | Low | Probably | AGENTS s7 | Revisit when demand or evidence exists | Business platform; pair with Gemini content |
| Microsoft 365 | platform | REVIEW | LATER | Automation, Workflows & AI Solutions | Medium | Low | Probably | AGENTS s7 | Revisit when demand or evidence exists | Business platform; pair with Power Automate if built |
| Notion | platform | REVIEW | LATER | Automation, Workflows & AI Solutions | Medium | Low | Probably | AGENTS s7 | Revisit when demand or evidence exists | Business platform; moderate intent |
| Zoho | platform | REVIEW | LATER | Automation, Workflows & AI Solutions | Medium | Low | Probably | AGENTS s7 | Revisit when demand or evidence exists | CRM and business suite; moderate intent |
| Asana | platform | REVIEW | MERGE / GROUP | Automation, Workflows & AI Solutions | Low alone | Low | Only inside the target | AGENTS s7 | No own page; named inside the target above | Represented inside a combined project-management platforms page (later) |
| ClickUp | platform | REVIEW | MERGE / GROUP | Automation, Workflows & AI Solutions | Low alone | Low | Only inside the target | AGENTS s7 | No own page; named inside the target above | Represented inside a combined project-management platforms page (later) |
| Cross-Platform Automation | technology | REVIEW | MERGE / GROUP | Automation, Workflows & AI Solutions | Low alone | Low | Only inside the target | AGENTS s7 | No own page; named inside the target above | Represented inside the Automation service |
| Low-Code Automation | technology | REVIEW | MERGE / GROUP | Automation, Workflows & AI Solutions | Low alone | Low | Only inside the target | AGENTS s7 | No own page; named inside the target above | Represented inside the Automation service and the Zapier, Make and n8n pages |
| Monday.com | platform | REVIEW | MERGE / GROUP | Automation, Workflows & AI Solutions | Low alone | Low | Only inside the target | AGENTS s7 | No own page; named inside the target above | Represented inside a combined project-management platforms page (later) |
| No-Code Automation | technology | REVIEW | MERGE / GROUP | Automation, Workflows & AI Solutions | Low alone | Low | Only inside the target | AGENTS s7 | No own page; named inside the target above | Represented inside the Automation service and the Zapier, Make and n8n pages |
| RPA | technology | REVIEW | MERGE / GROUP | Automation, Workflows & AI Solutions | Low alone | Low | Only inside the target | AGENTS s7 | No own page; named inside the target above | Represented inside the Automation service and Automation Systems Work Area |
| SaaS Integrations | technology | REVIEW | MERGE / GROUP | Automation, Workflows & AI Solutions | Low alone | Low | Only inside the target | AGENTS s7 | No own page; named inside the target above | Represented inside the API and Systems Integration service |
| APIs | technology | REVIEW | GRAPH-ONLY ENTITY | Automation, Workflows & AI Solutions | Low | Low | As an article | AGENTS s7 | Keep; article candidate (Phase 5) | A concept; suits resources |
| REST APIs | technology | REVIEW | GRAPH-ONLY ENTITY | Automation, Workflows & AI Solutions | Low | Low | As an article | AGENTS s7 | Keep; article candidate (Phase 5) | A concept; suits resources |

#### Cloud & DevOps (81)

| Name | Type | Current status | Disposition | Service | Intent | Relevance | Unique page content | Capability support | Recommended action | Reason |
|---|---|---|---|---|---|---|---|---|---|---|
| AWS | platform | Published `/cloud/aws/` | APPROVED PUBLIC PAGE | Cloud & DevOps | High | High | Yes | AGENTS s8 | Keep (published) | Built in Phase 3 |
| Azure | platform | Published `/cloud/azure/` | APPROVED PUBLIC PAGE | Cloud & DevOps | High | High | Yes | AGENTS s8 | Keep (published) | Built in Phase 3 |
| Docker | tool | Published `/cloud/docker/` | APPROVED PUBLIC PAGE | Cloud & DevOps | High | High | Yes | AGENTS s8 | Keep (published) | Built in Phase 3 |
| Firebase | platform | REVIEW | APPROVED PUBLIC PAGE | Cloud & DevOps | Medium | Low | Yes | AGENTS s8 | Next wave, rank 9 (MEDIUM); not built | Popular back-end platform for mobile and web; distinct intent |
| Google Cloud | platform | Published `/cloud/google-cloud/` | APPROVED PUBLIC PAGE | Cloud & DevOps | High | High | Yes | AGENTS s8 | Keep (published) | Built in Phase 3 |
| Kubernetes | tool | Published `/cloud/kubernetes/` | APPROVED PUBLIC PAGE | Cloud & DevOps | High | High | Yes | AGENTS s8 | Keep (published) | Built in Phase 3 |
| Supabase | platform | REVIEW | APPROVED PUBLIC PAGE | Cloud & DevOps | Medium | Low | Yes | AGENTS s8 | Next wave, rank 10 (MEDIUM); not built | Popular back-end platform; distinct intent from AWS or Firebase |
| Terraform | tool | Published `/cloud/terraform/` | APPROVED PUBLIC PAGE | Cloud & DevOps | High | High | Yes | AGENTS s8 | Keep (published) | Built in Phase 3 |
| Cloudflare | platform | REVIEW | LATER | Cloud & DevOps | Medium | Low | Probably | AGENTS s8 | Revisit when demand or evidence exists | Network and edge platform; moderate intent |
| AKS | technology | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the Azure page (a named service of that cloud) |
| Amplify | technology | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the AWS page (a named service of that cloud) |
| Ansible | tool | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the Terraform page (alternative) |
| API Management | technology | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the Azure page (a named service of that cloud) |
| App Service | technology | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the Azure page (a named service of that cloud) |
| Aurora | technology | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the AWS page (a named service of that cloud) |
| Azure DevOps | technology | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the Azure page (a named service of that cloud) |
| Azure Functions | technology | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the Azure page (a named service of that cloud) |
| Azure SQL | technology | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the Azure page (a named service of that cloud) |
| Azure Storage | technology | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the Azure page (a named service of that cloud) |
| Blob Storage | technology | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the Azure page (a named service of that cloud) |
| CDK | technology | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the AWS page (a named service of that cloud) |
| CDN | technology | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the Azure page (a named service of that cloud) |
| Cloud Build | technology | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the Google Cloud page (a named service of that cloud) |
| Cloud Functions | technology | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the Google Cloud page (a named service of that cloud) |
| Cloud Run | technology | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the Google Cloud page (a named service of that cloud) |
| Cloud SQL | technology | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the Google Cloud page (a named service of that cloud) |
| Cloud Storage | technology | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the Google Cloud page (a named service of that cloud) |
| CloudFormation | technology | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the AWS page (a named service of that cloud) |
| CloudFront | technology | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the AWS page (a named service of that cloud) |
| CloudWatch | technology | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the AWS page (a named service of that cloud) |
| Cognito | technology | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the AWS page (a named service of that cloud) |
| Compute Engine | technology | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the Google Cloud page (a named service of that cloud) |
| Container Apps | technology | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the Azure page (a named service of that cloud) |
| Cosmos DB | technology | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the Azure page (a named service of that cloud) |
| EC2 | technology | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the AWS page (a named service of that cloud) |
| ECS | technology | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the AWS page (a named service of that cloud) |
| EKS | technology | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the AWS page (a named service of that cloud) |
| Elastic Beanstalk | technology | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the AWS page (a named service of that cloud) |
| Elastic Load Balancing | technology | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the AWS page (a named service of that cloud) |
| Entra ID | technology | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the Azure page (a named service of that cloud) |
| EventBridge | technology | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the AWS page (a named service of that cloud) |
| GitHub Actions | tool | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the DevOps and Infrastructure Work Area and the Terraform and Docker pages |
| GKE | technology | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the Google Cloud page (a named service of that cloud) |
| Grafana | tool | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside an observability section of DevOps content |
| Key Vault | technology | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the Azure page (a named service of that cloud) |
| Lambda | technology | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the AWS page (a named service of that cloud) |
| Load Balancing | technology | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the Google Cloud page (a named service of that cloud) |
| Monitor | technology | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the Azure page (a named service of that cloud) |
| Netlify | platform | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the Next.js and Webflow pages (hosting) |
| Prometheus | tool | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside an observability section of DevOps content |
| Pub/Sub | technology | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the Google Cloud page (a named service of that cloud) |
| Pulumi | tool | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the Terraform page (alternative) |
| RDS | technology | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the AWS page (a named service of that cloud) |
| S3 | technology | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the AWS page (a named service of that cloud) |
| Secrets Manager | technology | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the AWS page (a named service of that cloud) |
| SNS | technology | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the AWS page (a named service of that cloud) |
| SQS | technology | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the AWS page (a named service of that cloud) |
| Step Functions | technology | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the AWS page (a named service of that cloud) |
| Vercel | platform | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the Next.js page (hosting) |
| Vertex AI | technology | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the Google Cloud page (a named service of that cloud) |
| WAF | technology | REVIEW | MERGE / GROUP | Cloud & DevOps | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the AWS page (a named service of that cloud) |
| Apache | tool | REVIEW | GRAPH-ONLY ENTITY | Cloud & DevOps | Low | Low | No | AGENTS s8 | Keep in the graph | Infrastructure tool or operating system; covered by DevOps content |
| Argo CD | tool | REVIEW | GRAPH-ONLY ENTITY | Cloud & DevOps | Low | Low | No | AGENTS s8 | Keep in the graph | Infrastructure tool or operating system; covered by DevOps content |
| CircleCI | tool | REVIEW | GRAPH-ONLY ENTITY | Cloud & DevOps | Low | Low | No | AGENTS s8 | Keep in the graph | Infrastructure tool or operating system; covered by DevOps content |
| Debian | tool | REVIEW | GRAPH-ONLY ENTITY | Cloud & DevOps | Low | Low | No | AGENTS s8 | Keep in the graph | Infrastructure tool or operating system; covered by DevOps content |
| DigitalOcean | platform | REVIEW | GRAPH-ONLY ENTITY | Cloud & DevOps | Low | Low | No | AGENTS s8 | Keep in the graph | Alternative host; shown on the AWS page |
| ELK | tool | REVIEW | GRAPH-ONLY ENTITY | Cloud & DevOps | Low | Low | No | AGENTS s8 | Keep in the graph | Infrastructure tool or operating system; covered by DevOps content |
| GitLab CI/CD | tool | REVIEW | GRAPH-ONLY ENTITY | Cloud & DevOps | Low | Low | No | AGENTS s8 | Keep in the graph | CI tool; covered by DevOps content |
| HAProxy | tool | REVIEW | GRAPH-ONLY ENTITY | Cloud & DevOps | Low | Low | No | AGENTS s8 | Keep in the graph | Infrastructure tool or operating system; covered by DevOps content |
| Helm | tool | REVIEW | GRAPH-ONLY ENTITY | Cloud & DevOps | Low | Low | No | AGENTS s8 | Keep in the graph | Infrastructure tool or operating system; covered by DevOps content |
| Jenkins | tool | REVIEW | GRAPH-ONLY ENTITY | Cloud & DevOps | Low | Low | No | AGENTS s8 | Keep in the graph | CI tool; covered by DevOps content |
| Linux | tool | REVIEW | GRAPH-ONLY ENTITY | Cloud & DevOps | Low | Low | No | AGENTS s8 | Keep in the graph | Infrastructure tool or operating system; covered by DevOps content |
| Nginx | tool | REVIEW | GRAPH-ONLY ENTITY | Cloud & DevOps | Low | Low | No | AGENTS s8 | Keep in the graph | Infrastructure tool or operating system; covered by DevOps content |
| OpenTelemetry | tool | REVIEW | GRAPH-ONLY ENTITY | Cloud & DevOps | Low | Low | No | AGENTS s8 | Keep in the graph | Infrastructure tool or operating system; covered by DevOps content |
| Railway | platform | REVIEW | GRAPH-ONLY ENTITY | Cloud & DevOps | Low | Low | No | AGENTS s8 | Keep in the graph | Developer hosting; narrow intent |
| Render | platform | REVIEW | GRAPH-ONLY ENTITY | Cloud & DevOps | Low | Low | No | AGENTS s8 | Keep in the graph | Developer hosting; narrow intent |
| Rocky Linux | tool | REVIEW | GRAPH-ONLY ENTITY | Cloud & DevOps | Low | Low | No | AGENTS s8 | Keep in the graph | Infrastructure tool or operating system; covered by DevOps content |
| Travis CI | tool | REVIEW | GRAPH-ONLY ENTITY | Cloud & DevOps | Low | Low | No | AGENTS s8 | Keep in the graph | Infrastructure tool or operating system; covered by DevOps content |
| Ubuntu | tool | REVIEW | GRAPH-ONLY ENTITY | Cloud & DevOps | Low | Low | No | AGENTS s8 | Keep in the graph | Infrastructure tool or operating system; covered by DevOps content |
| Datadog | platform | DO NOT CREATE | CONFIRMATION REQUIRED | Cloud & DevOps | Low | Medium | Not assessed until confirmed | Category only (inferred) | Keep as entity; no page; Samuel confirms the capability before a final disposition | Observability is approved through Prometheus, Grafana, OpenTelemetry and ELK; Datadog is in no planning document |
| Sentry | platform | DO NOT CREATE | CONFIRMATION REQUIRED | Cloud & DevOps | Low | Medium | Not assessed until confirmed | Category only (inferred) | Keep as entity; no page; Samuel confirms the capability before a final disposition | Observability is approved through Prometheus, Grafana, OpenTelemetry and ELK; Sentry is in no planning document |

#### Cybersecurity (11)

| Name | Type | Current status | Disposition | Service | Intent | Relevance | Unique page content | Capability support | Recommended action | Reason |
|---|---|---|---|---|---|---|---|---|---|---|
| Encryption | concept | REVIEW | GRAPH-ONLY ENTITY | Cybersecurity | Concept | Low | As an article | AGENTS s9 | Keep; article candidate (Phase 5) | Concept: explained in resources and in service pages, not as a technology page |
| IAM | technology | REVIEW | GRAPH-ONLY ENTITY | Cybersecurity | Low | Low | As an article | AGENTS s8 | Keep; article candidate (Phase 5) | A concept; suits resources and the Cybersecurity service |
| JWT | concept | REVIEW | GRAPH-ONLY ENTITY | Cybersecurity | Concept | Low | As an article | AGENTS s9 | Keep; article candidate (Phase 5) | Concept: explained in resources and in service pages, not as a technology page |
| MFA | concept | REVIEW | GRAPH-ONLY ENTITY | Cybersecurity | Concept | Low | As an article | AGENTS s9 | Keep; article candidate (Phase 5) | Concept: explained in resources and in service pages, not as a technology page |
| OAuth | concept | REVIEW | GRAPH-ONLY ENTITY | Cybersecurity | Concept | Low | As an article | AGENTS s9 | Keep; article candidate (Phase 5) | Concept: explained in resources and in service pages, not as a technology page |
| OAuth2 | concept | REVIEW | GRAPH-ONLY ENTITY | Cybersecurity | Concept | Low | As an article | AGENTS s9 | Keep; article candidate (Phase 5) | Concept: explained in resources and in service pages, not as a technology page |
| OWASP | concept | REVIEW | GRAPH-ONLY ENTITY | Cybersecurity | Concept | Low | As an article | AGENTS s9 | Keep; article candidate (Phase 5) | Concept: explained in resources and in service pages, not as a technology page |
| Secrets Management | concept | REVIEW | GRAPH-ONLY ENTITY | Cybersecurity | Concept | Low | As an article | AGENTS s9 | Keep; article candidate (Phase 5) | Concept: explained in resources and in service pages, not as a technology page |
| Secure Coding | concept | REVIEW | GRAPH-ONLY ENTITY | Cybersecurity | Concept | Low | As an article | AGENTS s9 | Keep; article candidate (Phase 5) | Concept: explained in resources and in service pages, not as a technology page |
| TLS/SSL | concept | REVIEW | GRAPH-ONLY ENTITY | Cybersecurity | Concept | Low | As an article | AGENTS s9 | Keep; article candidate (Phase 5) | Concept: explained in resources and in service pages, not as a technology page |
| Zero Trust | concept | REVIEW | GRAPH-ONLY ENTITY | Cybersecurity | Concept | Low | As an article | AGENTS s9 | Keep; article candidate (Phase 5) | Concept: explained in resources and in service pages, not as a technology page |

#### Data & Analytics (27)

| Name | Type | Current status | Disposition | Service | Intent | Relevance | Unique page content | Capability support | Recommended action | Reason |
|---|---|---|---|---|---|---|---|---|---|---|
| BigQuery | technology | REVIEW | APPROVED PUBLIC PAGE | Data & Analytics | Medium | Low | Yes | AGENTS s8 | Next wave, rank 5 (MEDIUM); not built | Data warehouse; strong data and AI intent |
| MongoDB | technology | Published `/data-analytics/mongodb/` | APPROVED PUBLIC PAGE | Data & Analytics | High | High | Yes | AGENTS s10 | Keep (published) | Built in Phase 3 |
| MySQL | technology | REVIEW | APPROVED PUBLIC PAGE | Data & Analytics | Medium | Low | Yes | AGENTS s10 | Next wave, rank 6 (MEDIUM); not built | Requalified: distinct database ecosystem (WordPress, WooCommerce, PHP, migration); medium priority |
| PostgreSQL | technology | Published `/data-analytics/postgresql/` | APPROVED PUBLIC PAGE | Data & Analytics | High | High | Yes | AGENTS s10 | Keep (published) | Built in Phase 3 |
| Snowflake | platform | REVIEW | APPROVED PUBLIC PAGE | Data & Analytics | Medium | Low | Yes | AGENTS s10 | Next wave, rank 11 (MEDIUM); not built | Data warehouse; strong enterprise intent |
| Databricks | platform | REVIEW | LATER | Data & Analytics | Medium | Low | Probably | AGENTS s10 | Revisit when demand or evidence exists | Specialist data platform; build when data work is evidenced |
| Redis | technology | REVIEW | LATER | Data & Analytics | Medium | Low | Probably | AGENTS s10 | Revisit when demand or evidence exists | Caching and data store; moderate intent |
| DynamoDB | technology | REVIEW | MERGE / GROUP | Data & Analytics | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the AWS page |
| Elasticsearch | technology | MERGE / CONSOLIDATE | MERGE / GROUP | Data & Analytics | Low alone | Medium | Only inside the target | Category only (inferred) | No own page; named inside the target above | Represented inside the approved ELK entity (Elasticsearch is the E in ELK) |
| Firestore | technology | REVIEW | MERGE / GROUP | Data & Analytics | Low alone | Low | Only inside the target | AGENTS s8 | No own page; named inside the target above | Represented inside the Firebase page |
| Appwrite | platform | REVIEW | GRAPH-ONLY ENTITY | Data & Analytics | Low | Low | No | AGENTS s10 | Keep in the graph | Narrow intent |
| Cassandra | technology | REVIEW | GRAPH-ONLY ENTITY | Data & Analytics | Low | Low | No | AGENTS s10 | Keep in the graph | Covered by the database and data-platform pages |
| ClickHouse | platform | REVIEW | GRAPH-ONLY ENTITY | Data & Analytics | Low | Low | No | AGENTS s10 | Keep in the graph | Covered by the database and data-platform pages |
| CockroachDB | technology | REVIEW | GRAPH-ONLY ENTITY | Data & Analytics | Low | Low | No | AGENTS s10 | Keep in the graph | Covered by the database and data-platform pages |
| Couchbase | technology | REVIEW | GRAPH-ONLY ENTITY | Data & Analytics | Low | Low | No | AGENTS s10 | Keep in the graph | Covered by the database and data-platform pages |
| MariaDB | technology | REVIEW | GRAPH-ONLY ENTITY | Data & Analytics | Low | Low | No | AGENTS s10 | Keep in the graph | Covered by the database and data-platform pages |
| Neo4j | technology | REVIEW | GRAPH-ONLY ENTITY | Data & Analytics | Low | Low | No | AGENTS s10 | Keep in the graph | Covered by the database and data-platform pages |
| Oracle | technology | REVIEW | GRAPH-ONLY ENTITY | Data & Analytics | Low | Low | No | AGENTS s10 | Keep in the graph | Covered by the database and data-platform pages |
| PocketBase | platform | REVIEW | GRAPH-ONLY ENTITY | Data & Analytics | Low | Low | No | AGENTS s10 | Keep in the graph | Narrow intent |
| Redshift | platform | REVIEW | GRAPH-ONLY ENTITY | Data & Analytics | Low | Low | No | AGENTS s10 | Keep in the graph | Covered by the database and data-platform pages |
| SQL Server | technology | REVIEW | GRAPH-ONLY ENTITY | Data & Analytics | Low | Low | No | AGENTS s10 | Keep in the graph | Covered by the database and data-platform pages |
| SQLite | technology | REVIEW | GRAPH-ONLY ENTITY | Data & Analytics | Low | Low | No | AGENTS s10 | Keep in the graph | Covered by the database and data-platform pages |
| Xano | platform | REVIEW | GRAPH-ONLY ENTITY | Data & Analytics | Low | Low | No | AGENTS s10 | Keep in the graph | Narrow intent |
| Looker | platform | DO NOT CREATE | CONFIRMATION REQUIRED | Data & Analytics | Low | Low | Not assessed until confirmed | Category only (inferred) | Keep as entity; no page; Samuel confirms the capability before a final disposition | The BI capability is approved but this named tool is in no planning document |
| OpenSearch | technology | DO NOT CREATE | CONFIRMATION REQUIRED | Data & Analytics | Low | Low | Not assessed until confirmed | Category only (inferred) | Keep as entity; no page; Samuel confirms the capability before a final disposition | No planning evidence; Elasticsearch is grouped under ELK |
| Power BI | platform | DO NOT CREATE | CONFIRMATION REQUIRED | Data & Analytics | Low | Medium | Not assessed until confirmed | Category only (inferred) | Keep as entity; no page; Samuel confirms the capability before a final disposition | The BI capability is approved but this named tool is in no planning document |
| Tableau | platform | DO NOT CREATE | CONFIRMATION REQUIRED | Data & Analytics | Low | Medium | Not assessed until confirmed | Category only (inferred) | Keep as entity; no page; Samuel confirms the capability before a final disposition | The BI capability is approved but this named tool is in no planning document |

#### Ecommerce Solutions (10)

| Name | Type | Current status | Disposition | Service | Intent | Relevance | Unique page content | Capability support | Recommended action | Reason |
|---|---|---|---|---|---|---|---|---|---|---|
| Shopify | platform | Published `/ecommerce/shopify/` | APPROVED PUBLIC PAGE | Ecommerce Solutions | High | High | Yes | AGENTS s4 | Keep (published) | Built in Phase 3 |
| WooCommerce | platform | REVIEW | APPROVED PUBLIC PAGE | Ecommerce Solutions | High | Low | Yes | AGENTS s4 | Next wave, rank 2 (HIGH); not built | High-intent ecommerce platform; omitted from the plan's list although the entity exists |
| BigCommerce | platform | REVIEW | LATER | Ecommerce Solutions | Medium | Low | Probably | AGENTS s12 | Revisit when demand or evidence exists | Ecommerce platform; build when demand is shown |
| Magento / Adobe Commerce | platform | REVIEW | LATER | Ecommerce Solutions | Medium | Low | Probably | AGENTS s12 | Revisit when demand or evidence exists | Ecommerce platform with migration intent |
| Shopify Plus | platform | REVIEW | MERGE / GROUP | Ecommerce Solutions | Low alone | Low | Only inside the target | AGENTS s12 | No own page; named inside the target above | Represented inside the Shopify page |
| Webflow Ecommerce | platform | REVIEW | MERGE / GROUP | Ecommerce Solutions | Low alone | Low | Only inside the target | AGENTS s12 | No own page; named inside the target above | Represented inside the Webflow and Shopify pages |
| OpenCart | platform | REVIEW | GRAPH-ONLY ENTITY | Ecommerce Solutions | Low | Low | No | AGENTS s12 | Keep in the graph | Platform with limited standalone intent |
| PrestaShop | platform | REVIEW | GRAPH-ONLY ENTITY | Ecommerce Solutions | Low | Low | No | AGENTS s12 | Keep in the graph | Platform with limited standalone intent |
| Squarespace Commerce | platform | REVIEW | GRAPH-ONLY ENTITY | Ecommerce Solutions | Low | Low | No | AGENTS s12 | Keep in the graph | Low-complexity builder |
| Wix Ecommerce | platform | REVIEW | GRAPH-ONLY ENTITY | Ecommerce Solutions | Low | Low | No | AGENTS s12 | Keep in the graph | Low-complexity builder; covered by Wix if built |

#### Mobile App Development (14)

| Name | Type | Current status | Disposition | Service | Intent | Relevance | Unique page content | Capability support | Recommended action | Reason |
|---|---|---|---|---|---|---|---|---|---|---|
| Flutter | technology | Published `/mobile-app-development/flutter/` | APPROVED PUBLIC PAGE | Mobile App Development | High | High | Yes | AGENTS s5 | Keep (published) | Built in Phase 3 |
| Kotlin | technology | Published `/mobile-app-development/kotlin/` | APPROVED PUBLIC PAGE | Mobile App Development | High | High | Yes | AGENTS s5 | Keep (published) | Built in Phase 3 |
| React Native | technology | Published `/mobile-app-development/react-native/` | APPROVED PUBLIC PAGE | Mobile App Development | High | High | Yes | AGENTS s5 | Keep (published) | Built in Phase 3 |
| Swift | technology | Published `/mobile-app-development/swift/` | APPROVED PUBLIC PAGE | Mobile App Development | High | High | Yes | AGENTS s5 | Keep (published) | Built in Phase 3 |
| Android SDK | technology | REVIEW | MERGE / GROUP | Mobile App Development | Low alone | Low | Only inside the target | AGENTS s5 | No own page; named inside the target above | Represented inside the Kotlin page |
| Dart | language | REVIEW | MERGE / GROUP | Mobile App Development | Low alone | Low | Only inside the target | AGENTS s18 | No own page; named inside the target above | Represented inside the Flutter page |
| FlutterFlow | technology | REVIEW | MERGE / GROUP | Mobile App Development | Low alone | Low | Only inside the target | AGENTS s5 | No own page; named inside the target above | Represented inside the Flutter page |
| iOS SDK | technology | REVIEW | MERGE / GROUP | Mobile App Development | Low alone | Low | Only inside the target | AGENTS s5 | No own page; named inside the target above | Represented inside the Swift page |
| Jetpack Compose | technology | REVIEW | MERGE / GROUP | Mobile App Development | Low alone | Low | Only inside the target | AGENTS s5 | No own page; named inside the target above | Represented inside the Kotlin page |
| Kotlin Multiplatform | technology | REVIEW | MERGE / GROUP | Mobile App Development | Low alone | Low | Only inside the target | AGENTS s5 | No own page; named inside the target above | Represented inside the Kotlin page |
| SwiftUI | technology | REVIEW | MERGE / GROUP | Mobile App Development | Low alone | Low | Only inside the target | AGENTS s5 | No own page; named inside the target above | Represented inside the Swift page |
| .NET MAUI | technology | REVIEW | GRAPH-ONLY ENTITY | Mobile App Development | Low | Low | No | AGENTS s5 | Keep in the graph | Narrow intent; covered by a .NET page if built |
| Ionic | technology | REVIEW | GRAPH-ONLY ENTITY | Mobile App Development | Low | Low | No | AGENTS s5 | Keep in the graph | Declining demand |
| Objective-C | language | REVIEW | GRAPH-ONLY ENTITY | Mobile App Development | Low | Low | No | AGENTS s18 | Keep in the graph | Legacy; covered by the Swift page where relevant |

#### SEO, AEO & GEO (11)

| Name | Type | Current status | Disposition | Service | Intent | Relevance | Unique page content | Capability support | Recommended action | Reason |
|---|---|---|---|---|---|---|---|---|---|---|
| Bing | ecosystem | REVIEW | GRAPH-ONLY ENTITY | SEO, AEO & GEO | Low | Low | No | AGENTS s15 | Keep in the graph | A search or AI ecosystem we optimize for (GEO), not a technology we build with |
| ChatGPT | ecosystem | REVIEW | GRAPH-ONLY ENTITY | SEO, AEO & GEO | Low | Low | No | AGENTS s15 | Keep in the graph | A search or AI ecosystem we optimize for (GEO), not a technology we build with |
| Claude | ecosystem | REVIEW | GRAPH-ONLY ENTITY | SEO, AEO & GEO | Low | Low | No | AGENTS s15 | Keep in the graph | A search or AI ecosystem we optimize for (GEO), not a technology we build with |
| Gemini | ecosystem | REVIEW | GRAPH-ONLY ENTITY | SEO, AEO & GEO | Low | Low | No | AGENTS s15 | Keep in the graph | A search or AI ecosystem we optimize for (GEO), not a technology we build with |
| Google AI Mode | ecosystem | REVIEW | GRAPH-ONLY ENTITY | SEO, AEO & GEO | Low | Low | No | AGENTS s15 | Keep in the graph | A search or AI ecosystem we optimize for (GEO), not a technology we build with |
| Google AI Overviews | ecosystem | REVIEW | GRAPH-ONLY ENTITY | SEO, AEO & GEO | Low | Low | No | AGENTS s15 | Keep in the graph | A search or AI ecosystem we optimize for (GEO), not a technology we build with |
| Google Search | ecosystem | REVIEW | GRAPH-ONLY ENTITY | SEO, AEO & GEO | Low | Low | No | AGENTS s15 | Keep in the graph | A search or AI ecosystem we optimize for (GEO), not a technology we build with |
| Grok | ecosystem | REVIEW | GRAPH-ONLY ENTITY | SEO, AEO & GEO | Low | Low | No | AGENTS s15 | Keep in the graph | A search or AI ecosystem we optimize for (GEO), not a technology we build with |
| Meta AI | ecosystem | REVIEW | GRAPH-ONLY ENTITY | SEO, AEO & GEO | Low | Low | No | AGENTS s15 | Keep in the graph | A search or AI ecosystem we optimize for (GEO), not a technology we build with |
| Microsoft Copilot | ecosystem | REVIEW | GRAPH-ONLY ENTITY | SEO, AEO & GEO | Low | Low | No | AGENTS s15 | Keep in the graph | A search or AI ecosystem we optimize for (GEO), not a technology we build with |
| Perplexity | ecosystem | REVIEW | GRAPH-ONLY ENTITY | SEO, AEO & GEO | Low | Low | No | AGENTS s15 | Keep in the graph | A search or AI ecosystem we optimize for (GEO), not a technology we build with |

#### Software Development (40)

| Name | Type | Current status | Disposition | Service | Intent | Relevance | Unique page content | Capability support | Recommended action | Reason |
|---|---|---|---|---|---|---|---|---|---|---|
| .NET | technology | CREATE LATER | APPROVED PUBLIC PAGE | Software Development | High | High | Yes | Master plan s7 | Next wave, rank 3 (HIGH); not built | Named in master plan section 7; C# is grouped into it; verified against the approved plan |
| Java | language | Published `/software-development/java/` | APPROVED PUBLIC PAGE | Software Development | High | High | Yes | AGENTS s18 | Keep (published) | Built in Phase 3 |
| Node.js | technology | CREATE LATER | APPROVED PUBLIC PAGE | Software Development | High | High | Yes | Master plan s7 | Next wave, rank 1 (HIGH); not built | Named in master plan section 7 (strategic technologies); very high intent; verified against the approved plan |
| Python | language | Published `/software-development/python/` | APPROVED PUBLIC PAGE | Software Development | High | High | Yes | AGENTS s18 | Keep (published) | Built in Phase 3 |
| Go | language | REVIEW | LATER | Software Development | Medium | Low | Probably | AGENTS s18 | Revisit when demand or evidence exists | Moderate intent; build when back-end work is evidenced |
| C# | language | REVIEW | MERGE / GROUP | Software Development | Low alone | Low | Only inside the target | AGENTS s18 | No own page; named inside the target above | Represented inside the .NET page (Phase 4 candidate) |
| Django | framework | MERGE / CONSOLIDATE | MERGE / GROUP | Software Development | Low alone | Medium | Only inside the target | Category only (inferred) | No own page; named inside the target above | Represented inside the Python page, only after Samuel confirms Python frameworks as a capability |
| Express | framework | MERGE / CONSOLIDATE | MERGE / GROUP | Software Development | Low alone | Medium | Only inside the target | Category only (inferred) | No own page; named inside the target above | Represented inside the Node.js page, only after Samuel confirms Node.js frameworks as a capability |
| FastAPI | framework | MERGE / CONSOLIDATE | MERGE / GROUP | Software Development | Low alone | Medium | Only inside the target | Category only (inferred) | No own page; named inside the target above | Represented inside the Python page, only after Samuel confirms Python frameworks as a capability |
| Flask | framework | MERGE / CONSOLIDATE | MERGE / GROUP | Software Development | Low alone | Low | Only inside the target | Category only (inferred) | No own page; named inside the target above | Represented inside the Python page, only after Samuel confirms Python frameworks as a capability |
| NestJS | framework | MERGE / CONSOLIDATE | MERGE / GROUP | Software Development | Low alone | Medium | Only inside the target | Category only (inferred) | No own page; named inside the target above | Represented inside the Node.js page, only after Samuel confirms Node.js frameworks as a capability |
| Spring Boot | framework | MERGE / CONSOLIDATE | MERGE / GROUP | Software Development | Low alone | Medium | Only inside the target | Category only (inferred) | No own page; named inside the target above | Represented inside the Java page, only after Samuel confirms Java frameworks as a capability |
| API Architecture | concept | REVIEW | GRAPH-ONLY ENTITY | Software Development | Concept | Low | As an article | AGENTS s19 | Keep; article candidate (Phase 5) | Concept: explained in resources and in service pages, not as a technology page |
| Bash | language | REVIEW | GRAPH-ONLY ENTITY | Software Development | Low | Low | No | AGENTS s18 | Keep in the graph | Language with limited standalone service intent |
| C | language | REVIEW | GRAPH-ONLY ENTITY | Software Development | Low | Low | No | AGENTS s18 | Keep in the graph | Language with limited standalone service intent |
| C++ | language | REVIEW | GRAPH-ONLY ENTITY | Software Development | Low | Low | No | AGENTS s18 | Keep in the graph | Language with limited standalone service intent |
| Clean Architecture | concept | REVIEW | GRAPH-ONLY ENTITY | Software Development | Concept | Low | As an article | AGENTS s19 | Keep; article candidate (Phase 5) | Concept: explained in resources and in service pages, not as a technology page |
| Cloud Architecture | concept | REVIEW | GRAPH-ONLY ENTITY | Software Development | Concept | Low | As an article | AGENTS s19 | Keep; article candidate (Phase 5) | Concept: explained in resources and in service pages, not as a technology page |
| Database Architecture | concept | REVIEW | GRAPH-ONLY ENTITY | Software Development | Concept | Low | As an article | AGENTS s19 | Keep; article candidate (Phase 5) | Concept: explained in resources and in service pages, not as a technology page |
| Distributed Systems | concept | REVIEW | GRAPH-ONLY ENTITY | Software Development | Concept | Low | As an article | AGENTS s19 | Keep; article candidate (Phase 5) | Concept: explained in resources and in service pages, not as a technology page |
| Domain-Driven Design | concept | REVIEW | GRAPH-ONLY ENTITY | Software Development | Concept | Low | As an article | AGENTS s19 | Keep; article candidate (Phase 5) | Concept: explained in resources and in service pages, not as a technology page |
| Functional Programming | concept | REVIEW | GRAPH-ONLY ENTITY | Software Development | Concept | Low | As an article | AGENTS s19 | Keep; article candidate (Phase 5) | Concept: explained in resources and in service pages, not as a technology page |
| Headless Architecture | concept | REVIEW | GRAPH-ONLY ENTITY | Software Development | Concept | Low | As an article | AGENTS s19 | Keep; article candidate (Phase 5) | Concept: explained in resources and in service pages, not as a technology page |
| Lua | language | REVIEW | GRAPH-ONLY ENTITY | Software Development | Low | Low | No | AGENTS s18 | Keep in the graph | Language with limited standalone service intent |
| MATLAB | language | REVIEW | GRAPH-ONLY ENTITY | Software Development | Low | Low | No | AGENTS s18 | Keep in the graph | Language with limited standalone service intent |
| Monolithic Architecture | concept | REVIEW | GRAPH-ONLY ENTITY | Software Development | Concept | Low | As an article | AGENTS s19 | Keep; article candidate (Phase 5) | Concept: explained in resources and in service pages, not as a technology page |
| Multi-Tenant Systems | concept | REVIEW | GRAPH-ONLY ENTITY | Software Development | Concept | Low | As an article | AGENTS s19 | Keep; article candidate (Phase 5) | Concept: explained in resources and in service pages, not as a technology page |
| MVC | concept | REVIEW | GRAPH-ONLY ENTITY | Software Development | Concept | Low | As an article | AGENTS s19 | Keep; article candidate (Phase 5) | Concept: explained in resources and in service pages, not as a technology page |
| MVVM | concept | REVIEW | GRAPH-ONLY ENTITY | Software Development | Concept | Low | As an article | AGENTS s19 | Keep; article candidate (Phase 5) | Concept: explained in resources and in service pages, not as a technology page |
| OOP | concept | REVIEW | GRAPH-ONLY ENTITY | Software Development | Concept | Low | As an article | AGENTS s19 | Keep; article candidate (Phase 5) | Concept: explained in resources and in service pages, not as a technology page |
| Perl | language | REVIEW | GRAPH-ONLY ENTITY | Software Development | Low | Low | No | AGENTS s18 | Keep in the graph | Language with limited standalone service intent |
| PowerShell | language | REVIEW | GRAPH-ONLY ENTITY | Software Development | Low | Low | No | AGENTS s18 | Keep in the graph | Language with limited standalone service intent |
| R | language | REVIEW | GRAPH-ONLY ENTITY | Software Development | Low | Low | No | AGENTS s18 | Keep in the graph | Language with limited standalone service intent |
| Ruby | language | REVIEW | GRAPH-ONLY ENTITY | Software Development | Low | Low | No | AGENTS s18 | Keep in the graph | Low standalone intent; with Rails removed it stays entity-only |
| Rust | language | REVIEW | GRAPH-ONLY ENTITY | Software Development | Low | Low | No | AGENTS s18 | Keep in the graph | Narrow intent |
| Scala | language | REVIEW | GRAPH-ONLY ENTITY | Software Development | Low | Low | No | AGENTS s18 | Keep in the graph | Language with limited standalone service intent |
| Serverless | concept | REVIEW | GRAPH-ONLY ENTITY | Software Development | Concept | Low | As an article | AGENTS s19 | Keep; article candidate (Phase 5) | Concept: explained in resources and in service pages, not as a technology page |
| SQL | language | REVIEW | GRAPH-ONLY ENTITY | Software Development | Low | Low | As an article | AGENTS s18 | Keep; article candidate (Phase 5) | A skill and concept more than a service; suits resources |
| Visual Basic | language | REVIEW | GRAPH-ONLY ENTITY | Software Development | Low | Low | No | AGENTS s18 | Keep in the graph | Language with limited standalone service intent |
| Ruby on Rails | framework | DO NOT CREATE | CONFIRMATION REQUIRED | Software Development | Low | Low | Not assessed until confirmed | Category only (inferred) | Keep as entity; no page; Samuel confirms the capability before a final disposition | No planning evidence; its language (Ruby) is itself entity-only with no page, so a framework adds nothing |

#### UI/UX & Product Design (5)

| Name | Type | Current status | Disposition | Service | Intent | Relevance | Unique page content | Capability support | Recommended action | Reason |
|---|---|---|---|---|---|---|---|---|---|---|
| Figma | tool | REVIEW | LATER | UI/UX & Product Design | Medium | Low | Probably | AGENTS s13 | Revisit when demand or evidence exists | Design tool; low service intent but real tool intent |
| Adobe XD | tool | REVIEW | GRAPH-ONLY ENTITY | UI/UX & Product Design | Low | Low | No | AGENTS s13 | Keep in the graph | Design tool; covered by the UI/UX service |
| Canva | tool | REVIEW | GRAPH-ONLY ENTITY | UI/UX & Product Design | Low | Low | No | AGENTS s13 | Keep in the graph | Design tool; covered by the UI/UX service |
| Illustrator | tool | REVIEW | GRAPH-ONLY ENTITY | UI/UX & Product Design | Low | Low | No | AGENTS s13 | Keep in the graph | Design tool; covered by the UI/UX service |
| Photoshop | tool | REVIEW | GRAPH-ONLY ENTITY | UI/UX & Product Design | Low | Low | No | AGENTS s13 | Keep in the graph | Design tool; covered by the UI/UX service |

#### Web Development (52)

| Name | Type | Current status | Disposition | Service | Intent | Relevance | Unique page content | Capability support | Recommended action | Reason |
|---|---|---|---|---|---|---|---|---|---|---|
| Angular | framework | REVIEW | APPROVED PUBLIC PAGE | Web Development | Medium | Low | Yes | AGENTS s4 | Next wave, rank 8 (MEDIUM); not built | High-intent front-end framework; common in enterprise work |
| Next.js | framework | Published `/web-development/nextjs/` | APPROVED PUBLIC PAGE | Web Development | High | High | Yes | AGENTS s4 | Keep (published) | Built in Phase 3 |
| PHP | language | Published `/web-development/php/` | APPROVED PUBLIC PAGE | Web Development | High | High | Yes | AGENTS s18 | Keep (published) | Built in Phase 3 |
| React | framework | Published `/web-development/react/` | APPROVED PUBLIC PAGE | Web Development | High | High | Yes | AGENTS s4 | Keep (published) | Built in Phase 3 |
| TypeScript | language | Published `/web-development/typescript/` | APPROVED PUBLIC PAGE | Web Development | High | High | Yes | AGENTS s18 | Keep (published) | Built in Phase 3 |
| Vue | framework | REVIEW | APPROVED PUBLIC PAGE | Web Development | Medium | Low | Yes | AGENTS s4 | Next wave, rank 7 (MEDIUM); not built | High-intent front-end framework; entity exists; not in the plan's 34 |
| Webflow | platform | Published `/web-development/webflow/` | APPROVED PUBLIC PAGE | Web Development | High | High | Yes | AGENTS s4 | Keep (published) | Built in Phase 3 |
| WordPress | platform | Published `/web-development/wordpress/` | APPROVED PUBLIC PAGE | Web Development | High | High | Yes | AGENTS s4 | Keep (published) | Built in Phase 3 |
| Drupal | platform | REVIEW | LATER | Web Development | Medium | Low | Probably | AGENTS s4 | Revisit when demand or evidence exists | CMS with migration and enterprise intent |
| Squarespace | platform | REVIEW | LATER | Web Development | Medium | Low | Probably | AGENTS s4 | Revisit when demand or evidence exists | Builder platform; migration intent |
| Wix | platform | REVIEW | LATER | Web Development | Medium | Low | Probably | AGENTS s4 | Revisit when demand or evidence exists | Builder platform; migration intent |
| Contentful | platform | REVIEW | MERGE / GROUP | Web Development | Low alone | Low | Only inside the target | AGENTS s4 | No own page; named inside the target above | Represented inside one headless CMS page (a later group candidate) with Sanity and Strapi |
| HubSpot CMS | platform | REVIEW | MERGE / GROUP | Web Development | Low alone | Low | Only inside the target | AGENTS s4 | No own page; named inside the target above | Represented inside the HubSpot page |
| JavaScript | language | REVIEW | MERGE / GROUP | Web Development | Low alone | Low | Only inside the target | AGENTS s18 | No own page; named inside the target above | Represented inside the TypeScript and React pages |
| Laravel | framework | MERGE / CONSOLIDATE | MERGE / GROUP | Web Development | Low alone | Medium | Only inside the target | Category only (inferred) | No own page; named inside the target above | Represented inside the PHP page, only after Samuel confirms PHP frameworks as a capability |
| Sanity | platform | REVIEW | MERGE / GROUP | Web Development | Low alone | Low | Only inside the target | AGENTS s4 | No own page; named inside the target above | Represented inside one headless CMS page (a later group candidate) |
| Strapi | platform | REVIEW | MERGE / GROUP | Web Development | Low alone | Low | Only inside the target | AGENTS s4 | No own page; named inside the target above | Represented inside one headless CMS page (a later group candidate) |
| Alpine.js | framework | REVIEW | GRAPH-ONLY ENTITY | Web Development | Low | Low | No | AGENTS s4 | Keep in the graph | Alternative front-end framework; named on the Next.js and React pages |
| Ant Design | tool | REVIEW | GRAPH-ONLY ENTITY | Web Development | Low | Low | No | AGENTS s4 | Keep in the graph | Developer tooling; no buyer intent of its own |
| Astro | framework | REVIEW | GRAPH-ONLY ENTITY | Web Development | Low | Low | No | AGENTS s4 | Keep in the graph | Alternative front-end framework; named on the Next.js and React pages |
| Babel | tool | REVIEW | GRAPH-ONLY ENTITY | Web Development | Low | Low | No | AGENTS s4 | Keep in the graph | Developer tooling; no buyer intent of its own |
| Bootstrap | tool | REVIEW | GRAPH-ONLY ENTITY | Web Development | Low | Low | No | AGENTS s4 | Keep in the graph | Developer tooling; no buyer intent of its own |
| Bulma | tool | REVIEW | GRAPH-ONLY ENTITY | Web Development | Low | Low | No | AGENTS s4 | Keep in the graph | Developer tooling; no buyer intent of its own |
| Chakra UI | tool | REVIEW | GRAPH-ONLY ENTITY | Web Development | Low | Low | No | AGENTS s4 | Keep in the graph | Developer tooling; no buyer intent of its own |
| Directus | platform | REVIEW | GRAPH-ONLY ENTITY | Web Development | Low | Low | No | AGENTS s4 | Keep in the graph | Platform with limited standalone intent |
| Ember | framework | REVIEW | GRAPH-ONLY ENTITY | Web Development | Low | Low | No | AGENTS s4 | Keep in the graph | Alternative front-end framework; named on the Next.js and React pages |
| ESLint | tool | REVIEW | GRAPH-ONLY ENTITY | Web Development | Low | Low | No | AGENTS s4 | Keep in the graph | Developer tooling; no buyer intent of its own |
| Foundation | tool | REVIEW | GRAPH-ONLY ENTITY | Web Development | Low | Low | No | AGENTS s4 | Keep in the graph | Developer tooling; no buyer intent of its own |
| Gatsby | framework | REVIEW | GRAPH-ONLY ENTITY | Web Development | Low | Low | No | AGENTS s4 | Keep in the graph | Alternative front-end framework; named on the Next.js and React pages |
| Ghost | platform | REVIEW | GRAPH-ONLY ENTITY | Web Development | Low | Low | No | AGENTS s4 | Keep in the graph | Narrow intent |
| Joomla | platform | REVIEW | GRAPH-ONLY ENTITY | Web Development | Low | Low | No | AGENTS s4 | Keep in the graph | Declining demand; migration intent is covered by the WordPress and Drupal pages |
| Lit | framework | REVIEW | GRAPH-ONLY ENTITY | Web Development | Low | Low | No | AGENTS s4 | Keep in the graph | Alternative front-end framework; named on the Next.js and React pages |
| Material UI | tool | REVIEW | GRAPH-ONLY ENTITY | Web Development | Low | Low | No | AGENTS s4 | Keep in the graph | Developer tooling; no buyer intent of its own |
| npm | tool | REVIEW | GRAPH-ONLY ENTITY | Web Development | Low | Low | No | AGENTS s4 | Keep in the graph | Developer tooling; no buyer intent of its own |
| Nuxt | framework | REVIEW | GRAPH-ONLY ENTITY | Web Development | Low | Low | No | AGENTS s4 | Keep in the graph | Alternative front-end framework; named on the Next.js and React pages |
| Parcel | tool | REVIEW | GRAPH-ONLY ENTITY | Web Development | Low | Low | No | AGENTS s4 | Keep in the graph | Developer tooling; no buyer intent of its own |
| pnpm | tool | REVIEW | GRAPH-ONLY ENTITY | Web Development | Low | Low | No | AGENTS s4 | Keep in the graph | Developer tooling; no buyer intent of its own |
| Preact | framework | REVIEW | GRAPH-ONLY ENTITY | Web Development | Low | Low | No | AGENTS s4 | Keep in the graph | Alternative front-end framework; named on the Next.js and React pages |
| Prettier | tool | REVIEW | GRAPH-ONLY ENTITY | Web Development | Low | Low | No | AGENTS s4 | Keep in the graph | Developer tooling; no buyer intent of its own |
| Prismic | platform | REVIEW | GRAPH-ONLY ENTITY | Web Development | Low | Low | No | AGENTS s4 | Keep in the graph | Platform with limited standalone intent |
| Remix | framework | REVIEW | GRAPH-ONLY ENTITY | Web Development | Low | Low | No | AGENTS s4 | Keep in the graph | Alternative front-end framework; named on the Next.js and React pages |
| Rollup | tool | REVIEW | GRAPH-ONLY ENTITY | Web Development | Low | Low | No | AGENTS s4 | Keep in the graph | Developer tooling; no buyer intent of its own |
| SolidJS | framework | REVIEW | GRAPH-ONLY ENTITY | Web Development | Low | Low | No | AGENTS s4 | Keep in the graph | Alternative front-end framework; named on the Next.js and React pages |
| Storyblok | platform | REVIEW | GRAPH-ONLY ENTITY | Web Development | Low | Low | No | AGENTS s4 | Keep in the graph | Platform with limited standalone intent |
| Svelte | framework | REVIEW | GRAPH-ONLY ENTITY | Web Development | Low | Low | No | AGENTS s4 | Keep in the graph | Alternative front-end framework; named on the Next.js and React pages |
| SvelteKit | framework | REVIEW | GRAPH-ONLY ENTITY | Web Development | Low | Low | No | AGENTS s4 | Keep in the graph | Alternative front-end framework; named on the Next.js and React pages |
| Tailwind CSS | tool | REVIEW | GRAPH-ONLY ENTITY | Web Development | Low | Low | No | AGENTS s4 | Keep in the graph | Developer tooling; no buyer intent of its own |
| Vite | tool | REVIEW | GRAPH-ONLY ENTITY | Web Development | Low | Low | No | AGENTS s4 | Keep in the graph | Developer tooling; no buyer intent of its own |
| Webpack | tool | REVIEW | GRAPH-ONLY ENTITY | Web Development | Low | Low | No | AGENTS s4 | Keep in the graph | Developer tooling; no buyer intent of its own |
| Wix Studio | platform | REVIEW | GRAPH-ONLY ENTITY | Web Development | Low | Low | No | AGENTS s4 | Keep in the graph | Platform with limited standalone intent |
| Wix Velo | platform | REVIEW | GRAPH-ONLY ENTITY | Web Development | Low | Low | No | AGENTS s4 | Keep in the graph | Platform with limited standalone intent |
| Yarn | tool | REVIEW | GRAPH-ONLY ENTITY | Web Development | Low | Low | No | AGENTS s4 | Keep in the graph | Developer tooling; no buyer intent of its own |


## 3. The 19 entities added in ADR 0005

I added these in the previous pass. Samuel's instruction is not to approve them automatically. The standard in section 2.1 is applied to each, and the evidence searched was `AGENTS.md`, the master plan, the Content Master, the handoff, every decision record, and the capability and concept taxonomy.

What the evidence says overall:

- **Node.js and .NET** are named in the master plan, section 7 ("Initial candidate list for Phase 3"), which is approved. The Phase 1 implementation notes also recorded their absence from `AGENTS.md` as a gap to resolve "if they are part of DECHY's capability". The plan's own list is that evidence.
- **The other 17 are named nowhere.** The same Phase 1 note lists Express, Django, Laravel and Spring as frameworks that `AGENTS.md` does not list, and says to add them only if they are part of DECHY's capability. That condition has not been met. The approved capability layer supports the category (Backend Development, Business Intelligence, Business Intelligence Systems, Data Engineering, an event-driven architecture concept, and ELK, Prometheus, Grafana and OpenTelemetry for observability), but not these named products.

| Entity | Evidence found | Class | Final disposition | Reason | What would change it |
|---|---|---|---|---|---|
| Node.js | Master plan s7 (strategic candidates); article plan names "Python vs Node.js for backends" as a post-launch candidate | B | **APPROVED PUBLIC PAGE** (next wave, rank 1) | Approved, very high intent, a distinct runtime decision | Nothing; verified |
| .NET | Master plan s7; `AGENTS.md` lists C# and ".NET MAUI" | B | **APPROVED PUBLIC PAGE** (next wave, rank 3) | Approved, enterprise intent; C# is grouped into it | Nothing; verified |
| Express | None (parent runtime Node.js is approved) | D | **MERGE / GROUP** into Node.js | A framework of an approved runtime. A page would add little; the name appears in the Node.js page only if Samuel confirms Node.js frameworks as a capability | Samuel confirms Node.js frameworks |
| NestJS | None | D | **MERGE / GROUP** into Node.js | As above | As above |
| Django | None (parent language Python is approved) | D | **MERGE / GROUP** into Python | A framework of an approved language; name appears on the Python page only after confirmation | Samuel confirms Python frameworks |
| FastAPI | None | D | **MERGE / GROUP** into Python | As above | As above |
| Flask | None | D | **MERGE / GROUP** into Python | As above | As above |
| Spring Boot | None (parent language Java is approved) | D | **MERGE / GROUP** into Java | As above | Samuel confirms Java frameworks |
| Laravel | None (parent language PHP is approved) | D | **MERGE / GROUP** into PHP | As above | Samuel confirms PHP frameworks |
| Ruby on Rails | None; Ruby itself is entity-only with no page | D | **CONFIRMATION REQUIRED** | No evidence, and its language has no page for it to attach to | Samuel confirms Ruby work |
| Elasticsearch | `AGENTS.md` lists ELK (the "E" is Elasticsearch) | A, by ELK | **MERGE / GROUP** into the approved ELK entity | It is part of an approved entity already; a second entity is a duplicate | Nothing |
| OpenSearch | None | D | **CONFIRMATION REQUIRED** | A fork of Elasticsearch with no evidence of its own | Samuel confirms |
| Power BI | Category only (Business Intelligence capabilities are approved) | C | **CONFIRMATION REQUIRED** | The category is approved; this product is in no document | Samuel names the BI tools DECHY works with |
| Tableau | Category only | C | **CONFIRMATION REQUIRED** | As above | As above |
| Looker | Category only | C | **CONFIRMATION REQUIRED** | As above | As above |
| Apache Kafka | Category only (event-driven architecture is an approved concept) | C | **CONFIRMATION REQUIRED** | The concept is approved; this product is in no document | Samuel confirms |
| RabbitMQ | Category only | C | **CONFIRMATION REQUIRED** | As above | As above |
| Datadog | Category only (observability is approved through Prometheus, Grafana, OpenTelemetry and ELK) | C | **CONFIRMATION REQUIRED** | Not named in any document | Samuel confirms |
| Sentry | Category only | C | **CONFIRMATION REQUIRED** | As above | As above |

Result: 2 approved, 8 grouped, 9 CONFIRMATION REQUIRED. None of the 19 becomes a page in this document, and the 8 grouped entities are not promoted to pages either. "Not named in planning" is not evidence that DECHY lacks the capability; it is only the absence of evidence that it has it, so the nine are held, not removed.

**Data change made (minimum and reversible).** In `data/taxonomy/technologies-completion.yaml`, the 8 grouped entities carry `pagePolicy: MERGE / CONSOLIDATE`. The 9 confirmation-required entities keep their original `pagePolicy: REVIEW` and carry a `CONFIRMATION REQUIRED` marker in the file; an earlier version of this change set them to `DO NOT CREATE` and was corrected after the owner's review (section 10). Node.js and .NET keep `CREATE LATER`. No entity is deleted, and none has a page, a menu entry or copy.

## 4. Recommended next technology wave

Ranked, using the same standard for every candidate. Priority combines search and commercial intent, the distinct information DECHY can give, and how much the page helps pages that already exist. Nothing below is built.

### 4.1 Ranked list

| Rank | Technology | Proposed URL | Parent service | Why a standalone page | Search intent | Commercial intent | Unique information DECHY can provide | Relationship to existing technology pages | Relationship to Work Areas | Overlap with another proposed page | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Node.js | `/software-development/nodejs/` | Software Development | The only common back-end runtime with no page; the Python page names Node as an alternative | "Node.js development services", "Python vs Node.js" | High | When one language across the stack pays, when it does not (CPU-heavy work, data and AI), how services are structured and run | TypeScript, React, Next.js, Python (alternative), Java, PostgreSQL, MongoDB, Docker, AWS | Custom Software Systems, API Integrations, Customer Portals, Business Web Platforms, Integration Platforms | Partial with TypeScript (language versus runtime), separable | HIGH |
| 2 | WooCommerce | `/ecommerce/woocommerce/` | Ecommerce | The WordPress and Shopify pages each point to it; a distinct, widely searched platform decision | "WooCommerce development", "WooCommerce vs Shopify", store migration | High | Owning a store versus renting one, plugin discipline, performance and payments, moving to or from Shopify | WordPress, PHP, Shopify, Stripe | Ecommerce Platforms, Commerce Systems | Some overlap with the WordPress page's "can it run a shop" answer | HIGH |
| 3 | .NET | `/software-development/dotnet/` | Software Development | Enterprise runtime absent from the site; C# grouped into it; legacy .NET Framework modernization is a real buyer problem | ".NET development services", "ASP.NET Core", "migrate .NET Framework" | High | Modernizing old .NET systems, fit with Azure and Microsoft identity, comparison with Java | Java, Azure, Docker, TypeScript, Angular | Custom Software Systems, Operations Platforms, Integration Platforms | Partial with Java (comparison), separable | HIGH |
| 4 | Power Automate | `/automation/microsoft-power-automate/` | Automation | The default automation choice inside Microsoft 365; three Phase 3 pages already name it as an alternative | "Power Automate consultant", "Power Automate vs Zapier" | High | Licensing and connector limits, governance, desktop flows, when Make or n8n is the better tool | Zapier, Make, n8n, Airtable, Azure | Automation Systems, Workflow Automation, Internal Business Tools | Moderate with the other three automation pages; differs by Microsoft ecosystem | HIGH |
| 5 | BigQuery | `/data-analytics/bigquery/` | Data and Analytics | Google Cloud's warehouse; strong data and AI intent; the Google Cloud page covers it only in part | "BigQuery consulting", "BigQuery data warehouse" | Medium to high | Cost control by partitioning and query design, ingestion, BI on top, AI integration | Google Cloud, PostgreSQL, Google Gemini | Data and Analytics Systems, Integration Platforms | Overlaps Snowflake (compare) and the Google Cloud page | MEDIUM |
| 6 | MySQL (requalified, section 4.3) | `/data-analytics/mysql/` | Data and Analytics | A separate database ecosystem: the default back end of WordPress, WooCommerce and much PHP software, with its own migration and upgrade decisions | "MySQL development", "MySQL to PostgreSQL migration", "MySQL vs PostgreSQL" | Medium | When MySQL is the right choice (WordPress and PHP estates, existing systems) and when to move; upgrades, replication and managed options; the MariaDB question | PostgreSQL (alternative, already links it), PHP, WordPress, WooCommerce (next wave), AWS | Business Web Platforms, Custom Software Systems, Data and Analytics Systems, Commerce Systems | Real overlap with PostgreSQL on the comparison table; the unique content is the MySQL-specific decisions | MEDIUM |
| 7 | Vue | `/web-development/vue/` | Web Development | A distinct framework and talent pool; Nuxt for search-friendly sites | "Vue.js development" | Medium | Progressive adoption, Vue versus React and Angular, Nuxt | React, Next.js, TypeScript | Business Web Platforms, Customer Portals | Overlaps React's comparison table and Angular | MEDIUM |
| 8 | Angular | `/web-development/angular/` | Web Development | Enterprise front-end intent and AngularJS migrations | "Angular development company" | Medium | Opinionated structure, long-term support, forms-heavy business software | React, TypeScript, Java, .NET | Operations Platforms, Internal Business Tools, Customer Portals | Overlaps Vue and React | MEDIUM |
| 9 | Firebase | `/cloud/firebase/` | Cloud and DevOps (as seeded) | Back-end platform for mobile and web; distinct from AWS or Google Cloud pages | "Firebase developer", "Firebase vs Supabase" | Medium | When a ready-made back end beats a custom one, lock-in, security rules, cost surprises | Flutter, React Native, Kotlin, Swift, Google Cloud, MongoDB (alternative) | Mobile Apps, Digital Products | Overlaps Supabase (comparison) | MEDIUM |
| 10 | Supabase | `/cloud/supabase/` | Cloud and DevOps (as seeded) | PostgreSQL-based alternative to Firebase with its own intent | "Supabase development", "Firebase alternative" | Medium | Postgres foundation, row-level security, moving from Firebase | PostgreSQL, Next.js, React | Digital Products, Business Web Platforms | Overlaps Firebase | MEDIUM |
| 11 | Snowflake | `/data-analytics/snowflake/` | Data and Analytics | Enterprise warehouse with strong consulting intent | "Snowflake consulting" | Medium | Workload and cost model, data sharing, Snowflake versus BigQuery | BigQuery, AWS, Azure, PostgreSQL | Data and Analytics Systems | Overlaps BigQuery | MEDIUM |
| 12 | Open models (grouped: Llama, Mistral, Hugging Face) | `/ai/open-models/` (needs a new group entity) | AI and Machine Learning | A real buyer decision (self-hosting) that the three provider pages cannot answer | "open source LLM development", "self-hosted LLM" | Medium | When self-hosting is worth it (data rules, cost at volume), evaluation, hardware and operations | OpenAI, Anthropic Claude, Google Gemini, LangChain, Docker, Kubernetes, n8n | AI Solutions, AI Agents | Touches the alternatives lists on the three provider pages | MEDIUM, needs Samuel |

Notes:

- **Why eleven and not more.** Each of the eleven passes all five tests in section 2.1. The 21 LATER candidates fail on intent or distinctness today, not on legitimacy.
- **C# is not a separate page.** It is grouped into the .NET page.
- **Open models need a decision** (section 8): a page about three providers needs a group entity such as `tech.open-models` with the slug `open-models`. Without it, the page would sit at `/ai/meta-llama/`, which is the wrong name for what it says.
- **Firebase and Supabase** have the parent service Cloud and DevOps in the seeded data. The recommended menu category is also Cloud and DevOps (section 4.4); this reverses the first recommendation.
- **Power Automate's slug** is the seeded `microsoft-power-automate`. A shorter slug would need a data change.
- **Recommended order.** Node.js, .NET, Power Automate, WooCommerce first (HIGH; also the dependencies of the first Solutions, section 9). Then BigQuery, MySQL (after WooCommerce, which it supports), Firebase, Supabase, Vue, Angular, Snowflake.

### 4.2 Later candidates (not part of the next wave)

These are legitimate. Each needs evidence (search data, a client request, or a related Solution page that needs it) before a page is built. [Recommended]

| Group | Entities | Trigger to promote |
|---|---|---|
| Databases | Redis, Databricks | Data-platform demand |
| Ecommerce platforms | BigCommerce, Magento / Adobe Commerce | Migration demand after WooCommerce |
| Builders and CMS | Wix, Squarespace, Drupal | Migration intent; consider one "website platforms" comparison |
| Business platforms | Microsoft 365, Google Workspace, Notion, Zoho | Power Automate or Gemini pages performing; CRM demand |
| Payments | PayPal; Paystack and Flutterwave (with the Africa market wave) | The Payment Integration Solution; country Waves |
| Languages | Go | Back-end demand beyond Node.js and Python |
| AI and data | PyTorch (with TensorFlow and scikit-learn as one machine-learning frameworks page), vector databases | Custom machine-learning or retrieval projects |
| Platform APIs | Google APIs, Microsoft Graph | Microsoft 365 and Google Workspace pages |
| Edge | Cloudflare | Performance and security work |
| Design | Figma | A UI/UX technology page, if the service evidence grows |

Group candidates: headless CMS (Contentful, Sanity, Strapi), project-management platforms (Asana, ClickUp, Monday.com), machine-learning frameworks, and open models are better built as one page each than as many.

### 4.3 MySQL requalification

MySQL was first placed in LATER only because the PostgreSQL page already exists. That is not a standalone-page criterion, so it was requalified against the full set. Evidence: MySQL is on the approved relational-database list (`AGENTS.md` section 10); the PostgreSQL, PHP and WordPress pages already name it as an alternative or companion; the Data and Analytics, Web Development and Software Development service pages name it as a database DECHY uses. No search-volume data was available in this pass, so the intent findings are **Inferred** from how people phrase these decisions, not measured.

| Criterion | Finding | Status |
|---|---|---|
| Legitimate search intent | Real, narrower than PostgreSQL: "MySQL development", "MySQL to PostgreSQL migration", "MySQL vs PostgreSQL", upgrade and performance help. Many MySQL searches are tutorial or administrator queries, which are not a services intent | Inferred |
| Commercial relevance | Medium. Rarely bought on its own; usually part of a WordPress, WooCommerce, PHP or existing-system decision. Rises when WooCommerce is built | Inferred |
| Distinct technology or ecosystem | Yes: a separate engine with its own replication, managed offerings (cloud-hosted MySQL) and the MariaDB fork question | Approved list; distinction inferred |
| Meaningful unique content | Yes, if written around the MySQL-specific decisions (stay, upgrade, migrate), not as a restatement of the PostgreSQL page | Inferred |
| Legitimate DECHY capability | Approved: on the `AGENTS.md` relational-database list and named by existing service pages | Approved |
| Relationship to services | Data and Analytics (canonical home), Software Development, Web Development | Established |
| Relationship to Work Areas | Business Web Platforms, Custom Software Systems, Data and Analytics Systems, Commerce Systems | Inferred from the service pages |
| Artificial duplication | Overlap with the PostgreSQL comparison table is real but bounded; the distinct intents (WordPress and WooCommerce back end, migration to or from MySQL, version upgrades) are not answered by the PostgreSQL page | Inferred |

**Outcome: MEDIUM, rank 6** (`/data-analytics/mysql/`), sequenced after WooCommerce so that it supports a live page. It would drop to LATER if, at build time, the page cannot be written around those distinct decisions without repeating the PostgreSQL page. The build gate is the existing technology similarity validator. Not built.

### 4.4 Firebase and Supabase: parent service and navigation category

**Recommendation.** Parent service **Cloud and DevOps** for both, with URLs `/cloud/firebase/` and `/cloud/supabase/`, and the **Cloud and DevOps** category in the Technologies menu.

- Both are listed under Cloud platforms in the approved Cloud and DevOps section of `AGENTS.md` (section 8), and they are also listed under backend and database platforms in the data section. The seeded canonical home is Cloud and DevOps, and the Cloud service page already names both as "backend platforms".
- Putting the menu category in the same place as the parent service keeps the URL, the breadcrumb and the menu in agreement, so a visitor has one home to learn, not two.
- Visitors who think "mobile back end" or "database" still reach them through the "Where this connects" rails (the Mobile Apps service already links Firebase), the Mobile and Languages and Backend pages, and site search.
- **This reverses my first recommendation** (Languages and Backend category). I changed it because an editorial category that disagrees with the URL and breadcrumb costs more in clarity than the extra placement helps. Samuel can still choose otherwise at build time; the menu is data-driven and the change is one line in `data/navigation/nav.yaml`.

Status: **Recommended**, to be confirmed with the wave. No page, entity or menu change is made now.

### 4.5 Open-model group: proposed entity (not created)

| Field | Proposal |
|---|---|
| Entity name | Open-source and open-weight AI models (short name: Open Models) |
| Proposed id and slug | `tech.open-models`, `open-models`, type technology |
| Parent service and URL | AI and Machine Learning; `/ai/open-models/` |
| Included technologies (approved providers, `AGENTS.md` section 7) | Meta Llama, Mistral, Hugging Face |
| Candidate additions, need Samuel's confirmation | Together AI and Groq, which host and serve open models; both are on the approved provider list. They would be mentioned as hosting options, not as members of the group |
| Not included | OpenAI, Anthropic Claude, Google Gemini, Cohere, which are not open-weight |
| Why a group, not three pages | The buyer decision is "should we self-host an open model", which none of the three provider pages answers; Llama, Mistral and Hugging Face are options inside that decision |
| Name note | "Open-weight" is the accurate term for models such as Llama whose weights are available but whose licence is not an open-source licence; the page title should say so plainly |
| Relationships needed | Each member provider needs a link to the group. The relation types in the schema have no "part of" type, so this is an **architectural review** item: either add one relation type or use `alternativeTo` and `furtherReading` |
| Existing provider entities | Remain; their current MERGE disposition becomes "named inside the group page" |

Status: **Decision required.** The group entity is not created until Samuel approves it.

## 5. Solutions versus Work Areas: qualification

The critical test, applied to each: **does this Solution satisfy a meaningfully different user intent from the Work Area?** A Solution is the business problem, need, outcome or situation. A Work Area is the kind of system we build. Two pages are justified only if a reasonable person would search for them differently and expect different content.

### 5.1 Identity

| Solution | Proposed slug | Primary business problem | Intended search or user intent | Primary outcome |
|---|---|---|---|---|
| AI Agents | `ai-agents` | Routine multi-step work needs judgment and eats staff time | "AI agent development" | An agent handling routine tasks under human control |
| AI Automation | `ai-automation` | Process steps that need reading or judgment block full automation | "AI automation for business" | Fewer manual steps, with AI doing the reading and sorting |
| AI Customer Support | `ai-customer-support` | Support teams answer the same questions while customers wait | "AI customer support", "AI chatbot for customer service" | Faster first answers and fewer repeat tickets, with people for hard cases |
| AI Knowledge Systems | `ai-knowledge-systems` | Staff cannot find answers in scattered documents | "AI knowledge base", "chat with company documents" | Accurate, sourced answers from approved content |
| API Integration | `api-integration` | Systems do not share data and people re-key it | "API integration services" | Systems exchange data automatically and reliably |
| Booking Platforms | `booking-platforms` | Customers book by phone or email; double bookings and no-shows | "booking system development" | Customers book and pay online; staff see one schedule |
| Business Dashboards | `business-dashboards` | Leaders lack current numbers; reports are built by hand | "business dashboard development" | One trusted view of the numbers that updates itself |
| Business Process Automation | `business-process-automation` | Repeated manual work, slow processes, too many spreadsheets | "business process automation" | Hours saved, fewer errors, faster handling |
| Cloud Migration | `cloud-migration` | Servers are costly, fragile or near end of life | "cloud migration services" | Systems run reliably in the cloud at controlled cost |
| CRM Integration | `crm-integration` | CRM data is out of step with the website, billing and support | "CRM integration services" | One customer record shared across tools |
| Customer Experience Systems | `customer-experience-systems` | Customers struggle across several touchpoints | No clear query | Not stated |
| Customer Portal Development | `customer-portal-development` | Customers phone for status and documents | "customer portal development" | Customers help themselves; fewer status calls |
| Data Systems | `data-systems` | Data is scattered and not trusted | "data systems" (vague) | A reliable data foundation |
| Digital Transformation | `digital-transformation` | The organization is stuck in manual, fragmented ways of working | "digital transformation services" | A phased, measured modernization |
| Ecommerce Systems | `ecommerce-systems` | Online selling is manual, slow or limited | "ecommerce development" | A store that sells and runs without manual effort |
| Internal Business Software | `internal-business-software` | Teams run on spreadsheets and email | "internal business software", "replace spreadsheets" | One shared tool in place of spreadsheets |
| Legacy System Modernization | `legacy-system-modernization` | Old software blocks change and few people understand it | "legacy system modernization" | An updated, safer system without stopping the business |
| Marketplace Platforms | `marketplace-platforms` | A founder wants to connect buyers and sellers | "marketplace development" | A working marketplace with sellers, payments and trust |
| Payment Integration | `payment-integration` | Payments are taken badly and reconciled by hand | "payment gateway integration" | Payments connected to orders and accounting |
| SaaS Platforms | `saas-platforms` | A team wants to turn a process or expertise into subscription software | "SaaS development" | A launched, scalable SaaS product |
| Subscription Platforms | `subscription-platforms` | Recurring billing and memberships are handled by hand | "subscription platform development" | Recurring revenue handled automatically |
| Workflow Automation | `workflow-automation` | Requests stall in inboxes with no clear owner | "workflow automation" | Tracked, timed approvals |

### 5.2 Overlap and disposition

| Solution | Closest Work Area | Closest Service | Relevant technologies | Different intent from the Work Area? | Would a user expect a separate page? | Disposition | Reason |
|---|---|---|---|---|---|---|---|
| AI Agents | AI Agents | AI and Machine Learning | OpenAI, Claude, Gemini, LangChain, n8n, Python | No: same system, same buyer | No | **REPRESENT THROUGH EXISTING WORK AREA** | The Work Area page already answers it; the problems "need an AI agent" and "need an AI chatbot" link to it |
| AI Automation | Automation Systems, AI Solutions | Automation | n8n, Zapier, Make, OpenAI | Partly: automation with an AI step; no distinct buyer | No | **MERGE WITH ANOTHER SOLUTION** (Business Process Automation) | AI is a technology facet of automation; a third automation page would split one intent |
| AI Customer Support | AI Solutions (adjacent) | AI and Machine Learning | OpenAI, Claude, LangChain, HubSpot, Salesforce | Yes: a business function with its own buyer, risks (hand-off, accuracy) and tools; no Work Area targets support | Yes | **KEEP AS DISTINCT SOLUTION** | A buyer searches for the outcome, not the system type |
| AI Knowledge Systems | Knowledge and Content Systems | AI and Machine Learning | LangChain, OpenAI, Claude, PostgreSQL | Partly: the buyer is purchasing an AI capability; the Work Area is about organizing content, with AI as one section | Perhaps | **CREATE LATER** | Decide after the content refinement strengthens the Work Area's AI depth; build a page only if the intent proves different |
| API Integration | API Integrations, Integration Platforms | API and Systems Integration | Stripe, HubSpot, Salesforce, Zapier, Make | No: same name and buyer as the service and two Work Areas | No | **REPRESENT THROUGH EXISTING WORK AREA** | Three pages would answer one question. The problem phrasing ("our tools do not talk to each other") belongs in the service and Work Area copy and the Solutions finder |
| Booking Platforms | none; Business Web Platforms and Mobile Apps are adjacent | Software Development | Next.js, React, Stripe, PostgreSQL, Flutter | Yes: a named product type no Work Area covers | Yes, for service businesses | **CREATE LATER** | Real intent, but status is REVIEW and it needs a design of its own (availability, payments, reminders) and a demand check |
| Business Dashboards | Data and Analytics Systems | Data and Analytics | PostgreSQL, BigQuery, React, Python | Yes, moderately: dashboards are the purchase; the Work Area is the whole pipeline | Yes | **KEEP AS DISTINCT SOLUTION** | Must not repeat the Work Area: choosing measures, roles and adoption |
| Business Process Automation | Automation Systems, Workflow Automation | Automation | Zapier, Make, n8n, Power Automate, Airtable, Python | Partly: it is the problem-led door for non-technical buyers; the Work Areas describe system types | Yes | **KEEP AS DISTINCT SOLUTION** (absorbs AI Automation) | It is the entry for ten of the thirty problem entities; the Work Areas stay the system detail |
| Cloud Migration | Cloud Platforms | Cloud and DevOps | AWS, Azure, Google Cloud, Docker, Terraform, Kubernetes | Yes: a project with phases, risks and rollback (`AGENTS.md` 75) rather than a kind of system | Yes | **KEEP AS DISTINCT SOLUTION** | Migration intent is separate from platform intent |
| CRM Integration | Integration Platforms, API Integrations | API and Systems Integration | HubSpot, Salesforce, Zapier, Make, Stripe | Yes: one specific integration with its own data decisions; the vendor pages cover single platforms | Yes | **KEEP AS DISTINCT SOLUTION** | Generic CRM integration is different from "HubSpot" or "Salesforce" as a platform |
| Customer Experience Systems | Customer Portals (adjacent) | UI/UX and Product Design | Figma (entity-only), Next.js | No clear query | No | **GRAPH-ONLY / NO PUBLIC PAGE** | No buyer phrasing. The problem "poor customer experience" maps to Customer Portals, UI/UX and AI Customer Support |
| Customer Portal Development | Customer Portals | Software Development | Next.js, React, TypeScript, PostgreSQL | No: identical | No | **REPRESENT THROUGH EXISTING WORK AREA** | The Work Area is the page |
| Data Systems | Data and Analytics Systems | Data and Analytics | PostgreSQL, MongoDB, BigQuery, Python | No | No | **REPRESENT THROUGH EXISTING WORK AREA** | Vague as a query; covered by the Work Area, with the reporting angle in Business Dashboards |
| Digital Transformation | Digital Transformation | Consulting | none | No: same name as the Work Area and the service | No | **REPRESENT THROUGH EXISTING WORK AREA** | Three pages for one phrase |
| Ecommerce Systems | Ecommerce Platforms, Commerce Systems | Ecommerce | Shopify, WooCommerce (next wave), Stripe | No | No | **REPRESENT THROUGH EXISTING WORK AREA** | Covered by two Work Areas and the service |
| Internal Business Software | Internal Business Tools, Operations Platforms | Software Development | Airtable, React, Python | No: the Work Area already speaks to spreadsheet replacement | No | **REPRESENT THROUGH EXISTING WORK AREA** | Same buyer and same system type |
| Legacy System Modernization | none; Custom Software Systems is adjacent | Software Development | Java, PHP, .NET, Python, Docker, AWS | Yes: a transformation project with risk and staging, not a kind of system | Yes | **KEEP AS DISTINCT SOLUTION** | The problem ("old software") is one of the strongest buyer situations |
| Marketplace Platforms | Commerce Systems (one model among four) | Software Development | Stripe, Next.js, PostgreSQL | Yes: a distinct product type the Work Area covers briefly | Yes, for founders | **CREATE LATER** | Status is REVIEW; needs depth beyond the Commerce Systems row and a demand check |
| Payment Integration | Commerce Systems, API Integrations | API and Systems Integration | Stripe, PayPal (later), Shopify, WooCommerce | Partly: the Stripe page already covers a major provider's integration | Maybe | **CREATE LATER** | A provider-neutral page adds value only after WooCommerce and PayPal decisions and the country waves |
| SaaS Platforms | Digital Products | Software Development | Next.js, React, Node.js (next wave), PostgreSQL, AWS, Stripe | Partly: Digital Products covers software products broadly; SaaS adds multi-tenancy, billing and onboarding | Yes | **CREATE LATER** | Distinct, but it must not be a clone of Digital Products |
| Subscription Platforms | Commerce Systems | Ecommerce | Stripe, Shopify | No: the Commerce Systems page has the subscription model; SaaS covers billing | No | **REPRESENT THROUGH EXISTING WORK AREA** | One model within a Work Area |
| Workflow Automation | Workflow Automation | Automation | n8n, Make, Zapier, Airtable | No: identical name | No | **REPRESENT THROUGH EXISTING WORK AREA** | The Work Area is the page |

Tally of the 22: KEEP 6; MERGE 1; REPRESENT THROUGH A WORK AREA 9; CREATE LATER 5; GRAPH-ONLY 1; REMOVE 0.

## 6. Recommended Solution architecture

### 6.1 Which Solutions receive pages, and which do not

| Treatment | Solutions |
|---|---|
| Canonical pages, first wave (6) | AI Customer Support, Business Dashboards, Business Process Automation, Cloud Migration, CRM Integration, Legacy System Modernization |
| Deferred, build only on evidence (5) | AI Knowledge Systems, Booking Platforms, Marketplace Platforms, Payment Integration, SaaS Platforms |
| Merged (1) | AI Automation, into Business Process Automation |
| Represented by an existing Work Area (9) | AI Agents, API Integration, Customer Portal Development, Data Systems, Digital Transformation, Ecommerce Systems, Internal Business Software, Subscription Platforms, Workflow Automation |
| Graph-only (1) | Customer Experience Systems |
| Should not exist as stand-alone concepts | Customer Experience Systems and Data Systems (no buyer phrasing); Digital Transformation, API Integration and Ecommerce Systems as separate Solution pages (they duplicate a service and a Work Area) |

All 22 entities stay in the graph. Those represented by a Work Area keep their relations (to the Work Area, the service and the problem entities) so the Solutions finder can send a visitor to the right page. [Recommended]

### 6.2 The surviving pages

| Canonical slug | Search intent | Primary audience and problem | Primary outcome | Services | Work Areas | Technologies | Industries (first wave) | Linking role | Why it deserves its own page |
|---|---|---|---|---|---|---|---|---|---|
| `/solutions/business-process-automation/` | "business process automation" | Operations and finance leads doing repeated manual work | Hours saved, fewer errors | Automation; Software Development; Consulting | Automation Systems, Workflow Automation, Internal Business Tools, Operations Platforms | Zapier, Make, n8n, Power Automate, Airtable, Python | Professional Services, Logistics, Real Estate, Property Management, Manufacturing, Insurance | The problem-led door to the whole automation cluster | Entry for ten of the thirty problem entities; Work Areas stay the system detail |
| `/solutions/legacy-system-modernization/` | "legacy system modernization" | Owners of old systems that block change | A safer, updated system without a stoppage | Software Development; Cloud; Consulting | Custom Software Systems, Operations Platforms, Integration Platforms | Java, PHP, .NET, Python, Docker, AWS | Banking, Insurance, Manufacturing, Healthcare, Transportation | Joins problems (old software) to technologies and migration | A project with risk and staging; no Work Area describes it |
| `/solutions/cloud-migration/` | "cloud migration services" | Teams with costly or fragile servers | Reliable systems in the cloud at controlled cost | Cloud; Cybersecurity; Consulting | Cloud Platforms, DevOps and Infrastructure | AWS, Azure, Google Cloud, Docker, Kubernetes, Terraform | Banking, Finance, Healthcare, Manufacturing, Retail | Brings the cloud technology pages into one decision path | Process and risk content (`AGENTS.md` 75), distinct from platform choice |
| `/solutions/crm-integration/` | "CRM integration services" | Teams whose CRM disagrees with other tools | One customer record shared across tools | API and Systems Integration; Automation | Integration Platforms, API Integrations | HubSpot, Salesforce, Zapier, Make, Stripe | Real Estate, Professional Services, Insurance, Education | Connects the HubSpot and Salesforce pages to the problem | Generic need, distinct from either vendor page |
| `/solutions/business-dashboards/` | "business dashboard development" | Leaders without trusted current numbers | One view that updates itself | Data and Analytics; Software Development | Data and Analytics Systems | PostgreSQL, BigQuery (next wave), React, Python | Finance, Logistics, Manufacturing, Retail, Professional Services | Problem-led entry to the data cluster | The purchase intent is the dashboard, not the pipeline |
| `/solutions/ai-customer-support/` | "AI customer support", "AI chatbot for customer service" | Support leads with repeated questions and waiting customers | Faster first answers, fewer repeat tickets | AI and Machine Learning; Automation | AI Solutions, AI Agents | OpenAI, Claude, LangChain, HubSpot, Salesforce | Retail, Ecommerce, Banking, Insurance, Education | Connects AI provider pages to a business function | A function-led buyer, with hand-off and accuracy risks of its own |

Deferred pages (same fields, to be written only if evidence supports them): AI Knowledge Systems, Booking Platforms, Marketplace Platforms, Payment Integration, SaaS Platforms. Industries for these are inferred and should not be treated as approved.

Industry mapping above is **Inferred** from the first-wave industry list in the taxonomy (Banking, Ecommerce, Education, Finance, Healthcare, Insurance, Logistics, Manufacturing, Professional Services, Property Management, Real Estate, Retail, Transportation). It needs confirmation before it drives any page.

### 6.3 Problem entities and their destination

Each of the 30 problem entities opens a destination, not a page of its own (plan section 10). Recommended mapping, to be recorded as relations after approval:

| Problem entities | Destination |
|---|---|
| legacy-software, outdated-software, need-to-replace-legacy-systems | Solution: Legacy System Modernization |
| manual-data-entry, need-to-automate-repetitive-work, slow-business-processes, need-business-automation, need-ai-automation, poor-lead-management | Solution: Business Process Automation |
| need-workflow-automation | Work Area: Workflow Automation |
| too-many-spreadsheets | Work Area: Internal Business Tools (with Business Process Automation) |
| manual-reporting | Solution: Business Dashboards |
| need-ai-chatbot, slow-customer-support | Solution: AI Customer Support |
| need-ai-agent | Work Area: AI Agents |
| need-ai-implementation, need-to-adopt-ai, need-ai-integration | Work Area: AI Solutions (and the AI service) |
| disconnected-systems, need-api-integration, need-software-integration, need-to-connect-business-tools | Work Areas: API Integrations and Integration Platforms |
| need-crm-integration | Solution: CRM Integration |
| need-cloud-migration | Solution: Cloud Migration |
| need-custom-software | Work Area: Custom Software Systems |
| need-mobile-application | Work Area: Mobile Apps |
| need-ecommerce-automation | Work Areas: Commerce Systems and Automation Systems (a gap: see section 7) |
| outdated-website, website-not-converting | Work Area: Business Web Platforms (with UI/UX and SEO services) |
| poor-customer-experience | Work Area: Customer Portals (with UI/UX and AI Customer Support) |

## 7. Cross-graph validation

Measured from the registry and relation data, not estimated.

| Check | Finding | Action |
|---|---|---|
| Technology pages with no meaningful service relationship | None: all 32 sit under their canonical service and link to it (validated) | None |
| Technology pages with no meaningful Work Area relationship | None: every page links at least one Work Area | None |
| Work Areas with no service relationship | None: all 25 have a primary service and at least one service edge | None |
| Work Areas with no published technology page | Two: UI/UX and Product Design (the technology there is Figma, entity-only) and Digital Transformation (no technology by nature). Five more have only one: Brand Systems, SEO and Search Visibility, Digital Marketing Systems, API Integrations, Cybersecurity Systems | Acceptable. These are disciplines. Improves with the next wave (BigQuery, Power Automate, Node.js feed API Integrations and data) |
| Services with no technology page | Consulting has none. Thin: Branding 1, SEO 2, Digital Marketing 2, Ecommerce 2 | Consulting by nature. WooCommerce lifts Ecommerce to 3 |
| Solutions with no meaningful business problem | 17 of 22 have no relation to a problem entity (only Business Dashboards, Customer Portal Development, Internal Business Software, Legacy System Modernization and SaaS Platforms have one or more). One problem entity (need-ai-automation) has no relation at all | Record the section 6.3 mapping as relations after approval |
| Solutions duplicating Work Areas | Nine, plus AI Automation as a near-duplicate | Section 5 and 6 |
| Solutions duplicating technology pages | None fully. Payment Integration partly overlaps the Stripe page; CRM Integration is generic against the HubSpot and Salesforce vendor pages | Differentiate in content; Payment Integration deferred |
| Solutions with industry relations | None of the 22 has an industry edge (109 industry edges exist elsewhere) | Add after the first-wave industry mapping is confirmed |
| Entities with no appropriate representation | Back-end frameworks (now grouped, awaiting confirmation); BI tools (removed pending confirmation); the "ecommerce automation" intent, which only reaches a service; Microsoft 365 and Google Workspace (LATER) | Decisions in section 8 |
| Navigation and data drift | The three menus and the two directories are generated from `nav.yaml`; a validator requires every technology page and Work Area page to be placed once | None |

No page needs to be added to close any of these. The fixes are relations and copy.

## 8. Decisions requiring Samuel's approval

Status after the owner's review: see section 10. Decisions 4, 5 and 6 are partly settled (the wave is under consideration; the open-model group and the Firebase and Supabase category are documented as recommendations), 7 is approved in principle, and 8 is held. The table below is as originally submitted.

| # | Decision | My recommendation |
|---|---|---|
| 1 | Confirm the final dispositions of the 19 entities (section 3) | Approve: keep Node.js and .NET; group the 8; remove the 9 |
| 2 | Are the named back-end frameworks (Express, NestJS, Django, FastAPI, Flask, Spring Boot, Laravel) part of DECHY's capability? | Only if DECHY genuinely works with them. If yes, name them inside the language pages, not as pages |
| 3 | Are named BI tools (Power BI, Tableau, Looker) part of the capability? | Only if yes. If so, reinstate as a group under Business Dashboards and Data and Analytics |
| 4 | Approve the next technology wave (section 4.1) and its order | Approve the four HIGH first, the six MEDIUM after |
| 5 | Create a group entity for open models (`/ai/open-models/`) | Yes, but only if you want self-hosted AI to be a stated capability |
| 6 | Parent service and menu category for Firebase and Supabase | Keep Cloud and DevOps as the parent; show them under Languages and Backend in the menu |
| 7 | Approve the Solutions architecture (section 6.1): 6 pages first, 5 deferred, 9 through Work Areas | Approve. It replaces the plan's twelve first-wave Solutions |
| 8 | Apply the recommended `pagePolicy` to the 15 Solution entities whose treatment changes (merge, represent, graph-only, create later) | Yes, with the approval of decision 7. Held until then |
| 9 | Treatment of the `/solutions/` hub after approval | List the six pages and route the other problems to Work Areas. A content change, not made here |
| 10 | Add new Solution candidates the graph lacks (for example "replace spreadsheets" or "ecommerce automation") | No. Cover them through the Work Areas and the finder |
| 11 | The AI Knowledge Systems page | Decide after the content refinement; do not build before |

## 9. Recommended sequence for the next implementation phase

1. **Samuel reviews this document** and answers section 8.
2. **Apply the approved data changes** (resolve the nine confirmation-required entities, apply `pagePolicy` for the Solutions as listed in section 10.2, and add the confirmed industry relations). The problem and Solution relations from section 10.5 are already recorded. No pages.
3. **Technology wave A (four pages):** Node.js, .NET, Power Automate, WooCommerce. These are also the dependencies of the first Solutions: Legacy System Modernization links Java, PHP and .NET; Business Process Automation links Power Automate with Zapier, Make and n8n.
4. **Technology wave B (six pages, plus open models if approved):** BigQuery before the Business Dashboards Solution; then Firebase, Supabase, Vue, Angular, Snowflake.
5. **Phase 4, Solutions first wave:** the six pages, written problem-first and linking to Work Areas and technology pages; then the first-wave industries.
6. **Deferred Solutions and LATER technologies** only on evidence.
7. **Content refinement pass** (already planned) runs alongside. It decides AI Knowledge Systems, and tidies Phase 2 wording that overlaps the new Solution pages.

Dependencies to respect: a Solution page should not be built before the technology pages it links to exist, because an unbuilt link renders as plain text. The sequence above builds the technology pages first for that reason.

## 10. Decision Resolution

Recorded 6 October 2026 after Samuel's review of sections 1 to 9. Sections 1 to 9 stay the source of the recommendations; this section records what the review decided. The status words are exact: **approved** is Samuel's decision, **confirmation required** needs a fact only Samuel can supply, **deferred** is parked on purpose, **architectural review** is a design question that must be settled before it is built.

### 10.1 Decisions now approved

| Decision | Detail | Effect on data |
|---|---|---|
| Six Solutions approved in principle as the first standalone Solution-page candidates | Business Process Automation, Legacy System Modernization, Cloud Migration, CRM Integration, Business Dashboards, AI Customer Support | None. No page is created |
| Nine Solutions represented primarily through existing Work Areas | AI Agents, API Integration, Customer Portal Development, Data Systems, Digital Transformation, Ecommerce Systems, Internal Business Software, Subscription Platforms, Workflow Automation | None yet. Their `pagePolicy` change is held |
| AI Automation stays merged into Business Process Automation | | None yet |
| Customer Experience Systems stays graph-only | | None yet |
| Eight groupings accepted in principle | Express and NestJS to Node.js; Django, FastAPI and Flask to Python; Spring Boot to Java; Laravel to PHP; Elasticsearch to the approved search and log-stack relationship (ELK). They remain non-standalone-page relationships; the underlying entities are not deleted | `MERGE / CONSOLIDATE` kept on the eight entities |
| Node.js and .NET confirmed as approved public-page candidates | Already in approved technology planning; part of the next wave | `CREATE LATER` kept; not built |
| The nine confirmation-required entities are not removed, promoted or paged | See 10.3 | Their `pagePolicy` is back to `REVIEW`, marked CONFIRMATION REQUIRED |
| The next-wave candidates stay under consideration | See 10.4 | None |
| No Solution `pagePolicy` change is applied now | The recommendation stays in this document | None |
| No routes, pages, copy, navigation or Work Areas change | | None |

### 10.2 The 22 Solutions: current and pending policy

The pending column is what the recommendation would set when Samuel authorizes it. Nothing in this column is applied.

| Solution | Decision | Status | `pagePolicy` today | `pagePolicy` when applied |
|---|---|---|---|---|
| Business Process Automation | Standalone page candidate (absorbs AI Automation) | Approved in principle | CREATE LATER | No change |
| Legacy System Modernization | Standalone page candidate | Approved in principle | CREATE LATER | No change |
| Cloud Migration | Standalone page candidate | Approved in principle | CREATE LATER | No change |
| CRM Integration | Standalone page candidate | Approved in principle | CREATE LATER | No change |
| Business Dashboards | Standalone page candidate | Approved in principle | CREATE LATER | No change |
| AI Customer Support | Standalone page candidate | Approved in principle | CREATE LATER | No change |
| AI Agents | Through the AI Agents Work Area | Approved | CREATE LATER | MERGE / CONSOLIDATE |
| API Integration | Through API Integrations and Integration Platforms | Approved | CREATE LATER | MERGE / CONSOLIDATE |
| Customer Portal Development | Through Customer Portals | Approved | CREATE LATER | MERGE / CONSOLIDATE |
| Data Systems | Through Data and Analytics Systems | Approved | REVIEW | MERGE / CONSOLIDATE |
| Digital Transformation | Through the Digital Transformation Work Area | Approved | REVIEW | MERGE / CONSOLIDATE |
| Ecommerce Systems | Through Ecommerce Platforms and Commerce Systems | Approved | REVIEW | MERGE / CONSOLIDATE |
| Internal Business Software | Through Internal Business Tools | Approved | CREATE LATER | MERGE / CONSOLIDATE |
| Subscription Platforms | Through Commerce Systems | Approved | REVIEW | MERGE / CONSOLIDATE |
| Workflow Automation | Through the Workflow Automation Work Area | Approved | CREATE LATER | MERGE / CONSOLIDATE |
| AI Automation | Merged into Business Process Automation | Approved | REVIEW | MERGE / CONSOLIDATE |
| AI Knowledge Systems | Deferred | Deferred | CREATE LATER | No change |
| Booking Platforms | Deferred | Deferred | REVIEW | CREATE LATER |
| Marketplace Platforms | Deferred | Deferred | REVIEW | CREATE LATER |
| Payment Integration | Deferred | Deferred | REVIEW | CREATE LATER |
| SaaS Platforms | Deferred | Deferred | REVIEW | CREATE LATER |
| Customer Experience Systems | Graph-only | Approved | REVIEW | DO NOT CREATE |

Fifteen entities would change policy and seven stay as they are (the six page candidates and AI Knowledge Systems). "Represented through a Work Area" does not delete the entity or its relations: the Solutions finder and the graph keep sending visitors to the right Work Area page.

### 10.3 Decisions requiring factual confirmation

The nine entities below are approved only as far as their **capability category** is approved. Whether DECHY actually supports and may name the specific product is a fact for Samuel. Until then they are kept as entities: not paged, not promoted, not deleted. Capability recognition and page qualification are separate steps: confirming a capability makes it a recognized entity and an allowed name in copy; it does not by itself earn a page.

| Entity | Approved category | Question for Samuel | If confirmed | If not confirmed |
|---|---|---|---|---|
| Ruby on Rails | Backend Development | Does DECHY build with Rails? | Recognized entity under Software Development; no page (Ruby itself has none) | Remove the entity |
| Power BI | Business Intelligence Systems | Does DECHY build or deliver on Power BI? | Recognized entity; named in the Business Dashboards Solution and data pages; page only if it later qualifies | Remove |
| Tableau | Business Intelligence Systems | As above | As above | Remove |
| Looker | Business Intelligence Systems | As above | As above | Remove |
| Apache Kafka | Event-driven architecture (concept) | Does DECHY build with Kafka? | Recognized entity under API and Systems Integration; no page | Remove |
| RabbitMQ | Event-driven architecture (concept) | Does DECHY build with RabbitMQ? | As above | Remove |
| OpenSearch | Search technologies | Does DECHY work with OpenSearch as well as the ELK stack? | Recognized entity beside ELK; no page | Remove |
| Datadog | Observability (approved through Prometheus, Grafana, OpenTelemetry, ELK) | Does DECHY set up Datadog? | Recognized entity under Cloud and DevOps; no page | Remove |
| Sentry | Observability | Does DECHY set up Sentry? | As above | Remove |

Other facts that need confirmation:

| Item | Why it matters |
|---|---|
| Whether the grouped frameworks (Express, NestJS, Django, FastAPI, Flask, Spring Boot, Laravel) may be named as DECHY capabilities inside the language pages | The grouping is accepted in principle, but naming a framework in copy is a capability claim. No page copy changes until confirmed |
| Whether Together AI and Groq may be named as hosting options on the open-models page | They are on the approved provider list, but the page does not exist yet |
| Industry relationships for each Solution (10.6) | No Solution-level industry mapping is approved |

### 10.4 Next technology wave after the decisions

All candidates stay under consideration. Nothing is built.

| Priority | Technologies |
|---|---|
| HIGH | Node.js, WooCommerce, .NET, Power Automate |
| MEDIUM | BigQuery, MySQL (requalified, section 4.3), Vue, Angular, Firebase, Supabase, Snowflake |
| Grouped, decision required | Open models (section 4.5) |

Firebase and Supabase: parent service Cloud and DevOps, menu category Cloud and DevOps (section 4.4). Open-model group: proposed entity `tech.open-models`, members Llama, Mistral and Hugging Face (section 4.5). Both are recommendations only.

### 10.5 Problem to Solution relationships

**Rule applied.** An edge is recorded only if the problem names the same need as the Solution and the Solution's own service already addresses that problem in the approved Phase 1 edges. Anything interpretive is documented here, marked "requires confirmation", and not stored. No new problem entity and no problem page was created, and no Solution was given an invented problem.

**Result.** Solutions with at least one problem relationship: 5 before, 14 after. Nineteen edges were added in `data/relations/problem-solution.yaml`: 18 `solves` edges, plus one service edge for the one problem that had no relation at all ("Need AI automation", which Automation, Workflows and AI Solutions now addresses). Every one of the 30 problems still has a service; 8 problems have no Solution and open a service or Work Area instead (listed below).

| Solution | Primary problem | Secondary problems | Status |
|---|---|---|---|
| AI Agents | Need an AI agent | Need to automate repetitive work (requires confirmation) | Primary established, recorded |
| AI Automation | Need AI automation | The Business Process Automation problems, through the merge | Primary established, recorded |
| AI Customer Support | Slow customer support | Need an AI chatbot (established, recorded); Poor customer experience (requires confirmation) | Established, recorded |
| AI Knowledge Systems | **Gap**: no problem entity says "staff cannot find answers" | Closest: Need to adopt AI (requires confirmation) | Gap; nothing recorded |
| API Integration | Need API integration | Disconnected systems; Need software integration; Need to connect business tools | Established, recorded |
| Booking Platforms | **Gap**: no problem entity | Closest: Need custom software (requires confirmation) | Gap; nothing recorded |
| Business Dashboards | Manual reporting | None | Established earlier |
| Business Process Automation | Slow business processes | Need business automation; Need to automate repetitive work; Manual data entry (established, recorded); Poor lead management (requires confirmation) | Established, recorded |
| Cloud Migration | Need cloud migration | None | Established, recorded |
| CRM Integration | Need CRM integration | Disconnected systems; Need to connect business tools | Established, recorded |
| Customer Experience Systems | Poor customer experience | None | Established, recorded |
| Customer Portal Development | Poor customer experience | Need custom software (requires confirmation) | Existing edge kept; broad, flagged |
| Data Systems | **Gap**: no direct problem entity | Closest: Manual reporting (requires confirmation) | Gap; nothing recorded |
| Digital Transformation | **Gap**: no direct problem entity | Closest: Legacy software, Outdated software, Slow business processes (require confirmation) | Gap; nothing recorded |
| Ecommerce Systems | Need ecommerce automation (requires confirmation: the problem names automation, the Solution is wider) | None | Requires confirmation; nothing recorded |
| Internal Business Software | Too many spreadsheets | Need custom software; Manual data entry | Established earlier |
| Legacy System Modernization | Legacy software | Outdated software; Need to replace legacy systems | Established earlier |
| Marketplace Platforms | **Gap**: no problem entity | Closest: Need custom software (requires confirmation) | Gap; nothing recorded |
| Payment Integration | **Gap**: no direct problem entity | Closest: Need API integration (requires confirmation) | Gap; nothing recorded |
| SaaS Platforms | Need custom software | None | Existing edge kept; broad, flagged |
| Subscription Platforms | **Gap**: no problem entity | None justified | Gap; nothing recorded |
| Workflow Automation | Need workflow automation | Slow business processes (requires confirmation) | Established, recorded |

Problems with no Solution (they open a service or Work Area, as plan section 10 allows): Need AI implementation, Need AI integration and Need to adopt AI (AI Solutions Work Area); Need mobile application (Mobile Apps); Outdated website and Website not converting (Business Web Platforms); Need ecommerce automation (Commerce Systems and Automation Systems); Poor lead management (Automation). None of these should become a Solution page to fill the graph.

The graph can now be followed as Problem, Solution, Service, Work Area, Technology for the 14 connected Solutions. The Industry end is the open item below.

### 10.6 Solution to Industry relationships

**Finding.** No Solution-level industry mapping exists in the approved architecture, so no edge was added. Evidence reviewed:

- `AGENTS.md` section 3 lists 13 industry software opportunities, but only under **Software Development** (Healthcare, Real Estate, Construction, Finance, Education, Logistics, Retail, Ecommerce, Manufacturing, Hospitality, Legal, Government, Professional Services). That is an approved Service by Industry link, and the graph already carries it (the Software Development service has 13 `appliesToIndustry` edges). No other service has an approved industry list.
- `AGENTS.md` section 26 names Service by Industry as a legitimate intersection to qualify, but it names no pairs.
- The industries on the technology pages were chosen when those pages were written. They are technology to industry links, not Solution to industry links, and are not approved as such.

| Solutions | Position |
|---|---|
| The seven owned by Software Development (Booking Platforms, Customer Portal Development, Internal Business Software, Legacy System Modernization, Marketplace Platforms, SaaS Platforms, Subscription Platforms) | Inherit the service's 13 industries at service level. Copying 13 edges onto each Solution would add no information, so none are stored. A Solution page should name industries only where it can say something specific, and that needs confirmation |
| The other 15 Solutions | No approved industry list for their services. Nothing established |
| The first-wave six | The proposed shortlists in section 6.2 are **Inferred** from the approved industry list and **require confirmation** |

**What would establish them.** Samuel confirms, per first-wave Solution, a short industry list (three to six). Each confirmed pair is then recorded as one `appliesToIndustry` edge. No industry page is created and no industry family is started.

### 10.7 Deferred

| Item | Parked until |
|---|---|
| Booking Platforms, Marketplace Platforms, Payment Integration, SaaS Platforms, AI Knowledge Systems | Evidence of demand, or a client need; AI Knowledge Systems after the content refinement pass |
| Open-model group entity | Samuel's decision (10.4) |
| Applying any Solution `pagePolicy` change | Authorization of the next implementation phase |
| The `/solutions/` hub treatment | The Solutions architecture is applied |
| LATER technologies (21) | Evidence per section 4.2 |
| All technology and Solution pages | The next build authorization |

### 10.8 Still requiring architectural review

| Question | Why it is open |
|---|---|
| Plan section 9 still lists twelve first-wave Solutions; the approved set is six | The plan text needs an amendment note when the policies are applied, so the two documents do not disagree |
| A "part of" relation for groups | The schema has no such type, and the open-model group, the headless CMS group and the machine-learning frameworks group would all need one |
| How the Solutions hub should present six pages and sixteen concepts that route to Work Areas or stay deferred | The hub exists from Phase 2; its content is not changed here |
| Whether `solves` edges for interpretive links (the "requires confirmation" rows in 10.5) should ever be stored | Recorded only when Samuel confirms; the graph should not carry guessed edges |
| Firebase and Supabase menu category | Recommended (section 4.4); decide at build |
| Whether the Cloud and DevOps technology category needs a sub-grouping once Firebase and Supabase join | Menu width and clarity |
