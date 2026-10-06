# Phase 3 review: technology inventory

Superseded for dispositions by `14-technology-and-solutions-qualification.md` (the authoritative qualification gate); this file stays as the first-pass generated inventory.

Status: REVIEW MATERIAL, kept as the technology master inventory. Generated from `data/taxonomy/` on 6 October 2026, after the graph completion in ADR 0005. Dispositions are recommendations, not decisions: a page is built only after qualification.

Codes: BUILT (public page exists), NEXT (recommended public page in Phase 4), LATER (candidate once demand or evidence exists), MERGE (represented inside another page, with the page named), ENTITY (entity only), RESOURCE (concept: belongs in resources and articles, not a technology page).

Entities in scope: 329 technology-like entities (of 774 taxonomy entities; a further 316 are capabilities). RESOURCE 28, NEXT 12, MERGE 102, ENTITY 131, LATER 24, BUILT 32.


## AI & Machine Learning

| Entity | Type | Category | Public page | Disposition | Phase | Why |
|---|---|---|---|---|---|---|
| Anthropic Claude | provider | AI providers | `/ai/anthropic-claude/` | BUILT | 3 | Built in Phase 3 |
| Google Gemini | provider | AI providers | `/ai/google-gemini/` | BUILT | 3 | Built in Phase 3 |
| LangChain | framework | AI frameworks | `/ai/langchain/` | BUILT | 3 | Built in Phase 3 |
| OpenAI | provider | AI providers | `/ai/openai/` | BUILT | 3 | Built in Phase 3 |
| AI Gateways | technology | AI/vector infrastructure | No | ENTITY | - | Narrow intent; covered by AI service content |
| Amazon Bedrock | provider | AI providers | No | MERGE | - | Represented inside the AWS page and the AI service |
| Chroma | technology | AI/vector infrastructure | No | ENTITY | - | Narrow intent; covered by AI service content |
| Cohere | provider | AI providers | No | ENTITY | - | Narrow intent; covered by the model-provider pages |
| FAISS | technology | AI/vector infrastructure | No | ENTITY | - | Narrow intent; covered by AI service content |
| Groq | provider | AI providers | No | ENTITY | - | Narrow intent; covered by the model-provider pages |
| Haystack | framework | AI frameworks | No | ENTITY | - | Narrow intent; covered by AI service content |
| Hugging Face | provider | AI providers | No | MERGE | - | Represented inside a combined open-models page (Phase 4 candidate) |
| Keras | framework | AI frameworks | No | ENTITY | - | Narrow intent; covered by the machine-learning frameworks page if built |
| LlamaIndex | framework | AI frameworks | No | MERGE | - | Represented inside the LangChain page (shown as an alternative) |
| Meta Llama | provider | AI providers | No | NEXT | 4 | One combined page on open-weight models (Llama, Mistral, Hugging Face), not three |
| Microsoft Azure AI | provider | AI providers | No | MERGE | - | Represented inside the Azure page and the AI service |
| Milvus | technology | AI/vector infrastructure | No | ENTITY | - | Narrow intent; covered by AI service content |
| Mistral | provider | AI providers | No | MERGE | - | Represented inside a combined open-models page (Phase 4 candidate) |
| Model APIs | technology | AI/vector infrastructure | No | ENTITY | - | Narrow intent; covered by AI service content |
| Model Orchestration | technology | AI/vector infrastructure | No | ENTITY | - | Narrow intent; covered by AI service content |
| Pinecone | technology | AI/vector infrastructure | No | MERGE | - | Represented inside a vector databases page, if built |
| PyTorch | framework | AI frameworks | No | LATER | 5+ | Candidate for one combined machine-learning frameworks page with TensorFlow and scikit-learn |
| Qdrant | technology | AI/vector infrastructure | No | ENTITY | - | Narrow intent; covered by AI service content |
| RAG Infrastructure | technology | AI/vector infrastructure | No | ENTITY | - | Narrow intent; covered by AI service content |
| scikit-learn | framework | AI frameworks | No | MERGE | - | Represented inside a combined machine-learning frameworks page (later) |
| Semantic Kernel | framework | AI frameworks | No | MERGE | - | Represented inside the LangChain page (shown as an alternative) |
| TensorFlow | framework | AI frameworks | No | MERGE | - | Represented inside a combined machine-learning frameworks page (later) |
| Together AI | provider | AI providers | No | ENTITY | - | Narrow intent; covered by the model-provider pages |
| Vector Databases | technology | AI/vector infrastructure | No | LATER | 5+ | Concept-led intent; best as one vector databases page or a resource |
| Weaviate | technology | AI/vector infrastructure | No | ENTITY | - | Narrow intent; covered by AI service content |

## API & Systems Integration

| Entity | Type | Category | Public page | Disposition | Phase | Why |
|---|---|---|---|---|---|---|
| Stripe | integration | Business/payment integrations | `/api-integration/stripe/` | BUILT | 3 | Built in Phase 3 |
| Adyen | integration | Business/payment integrations | No | MERGE | - | Represented inside the Stripe page (alternative); one 'payment providers' comparison is a resource candidate |
| Apache Kafka | technology | Messaging and streaming | No | MERGE | - | Represented inside API and systems integration content (event-driven architecture) |
| API Gateway | technology | API technologies | No | ENTITY | - | Covered by service content |
| Braintree | integration | Business/payment integrations | No | MERGE | - | Represented inside the Stripe page (alternative) |
| Event-Driven Architecture | technology | API technologies | No | ENTITY | - | Covered by service content |
| Flutterwave | integration | Business/payment integrations | No | LATER | 5+ | Regional payment provider; build with the Africa market wave |
| Google APIs | integration | Business/payment integrations | No | LATER | 5+ | Moderate intent; one page on Google integrations |
| GraphQL | technology | API technologies | No | ENTITY | - | Covered by service content |
| gRPC | technology | API technologies | No | ENTITY | - | Covered by service content |
| HubSpot API | integration | Business/payment integrations | No | MERGE | - | Represented inside the HubSpot page |
| Microservices | technology | API technologies | No | ENTITY | - | Covered by service content |
| Microsoft Graph | integration | Business/payment integrations | No | LATER | 5+ | Moderate intent; pair with Microsoft 365 |
| OpenID Connect | technology | API technologies | No | ENTITY | - | Covered by service content |
| PayPal | integration | Business/payment integrations | No | LATER | 5+ | Payment provider; shown as an alternative on the Stripe page |
| Paystack | integration | Business/payment integrations | No | LATER | 5+ | Regional payment provider; build with the Africa market wave |
| RabbitMQ | technology | Messaging and streaming | No | ENTITY | - | Narrow intent |
| REST | technology | API technologies | No | ENTITY | - | Covered by service content |
| Salesforce API | integration | Business/payment integrations | No | MERGE | - | Represented inside the Salesforce page |
| Shopify API | integration | Business/payment integrations | No | MERGE | - | Represented inside the Shopify page |
| SOAP | technology | API technologies | No | ENTITY | - | Covered by service content |
| Square | integration | Business/payment integrations | No | MERGE | - | Represented inside the Stripe page (alternative) |
| Webhooks | technology | API technologies | No | ENTITY | - | Covered by service content |
| WebSockets | technology | API technologies | No | ENTITY | - | Covered by service content |
| Wix APIs | integration | Business/payment integrations | No | ENTITY | - | Narrow intent |
| WooCommerce API | integration | Business/payment integrations | No | MERGE | - | Represented inside the WooCommerce page, if built |
| WordPress REST API | integration | Business/payment integrations | No | MERGE | - | Represented inside the WordPress page |

## Automation, Workflows & AI Solutions

| Entity | Type | Category | Public page | Disposition | Phase | Why |
|---|---|---|---|---|---|---|
| Airtable | platform | Workflow/business platforms | `/automation/airtable/` | BUILT | 3 | Built in Phase 3 |
| HubSpot | platform | Workflow/business platforms | `/automation/hubspot/` | BUILT | 3 | Built in Phase 3 |
| Make | technology | Automation platforms and technologies | `/automation/make/` | BUILT | 3 | Built in Phase 3 |
| n8n | technology | Automation platforms and technologies | `/automation/n8n/` | BUILT | 3 | Built in Phase 3 |
| Salesforce | platform | Workflow/business platforms | `/automation/salesforce/` | BUILT | 3 | Built in Phase 3 |
| Zapier | technology | Automation platforms and technologies | `/automation/zapier/` | BUILT | 3 | Built in Phase 3 |
| APIs | technology | Automation platforms and technologies | No | RESOURCE | 5 | A concept; suits resources |
| Asana | platform | Workflow/business platforms | No | MERGE | - | Represented inside a combined project-management platforms page (later) |
| ClickUp | platform | Workflow/business platforms | No | MERGE | - | Represented inside a combined project-management platforms page (later) |
| Cross-Platform Automation | technology | Automation platforms and technologies | No | MERGE | - | Represented inside the Automation service |
| Google Workspace | platform | Workflow/business platforms | No | LATER | 5+ | Business platform; pair with Gemini content |
| Low-Code Automation | technology | Automation platforms and technologies | No | MERGE | - | Represented inside the Automation service and the Zapier, Make and n8n pages |
| Microsoft 365 | platform | Workflow/business platforms | No | LATER | 5+ | Business platform; pair with Power Automate if built |
| Microsoft Power Automate | technology | Automation platforms and technologies | No | NEXT | 4 | Major automation platform; named as an alternative on three Phase 3 pages |
| Monday.com | platform | Workflow/business platforms | No | MERGE | - | Represented inside a combined project-management platforms page (later) |
| No-Code Automation | technology | Automation platforms and technologies | No | MERGE | - | Represented inside the Automation service and the Zapier, Make and n8n pages |
| Notion | platform | Workflow/business platforms | No | LATER | 5+ | Business platform; moderate intent |
| REST APIs | technology | Automation platforms and technologies | No | RESOURCE | 5 | A concept; suits resources |
| RPA | technology | Automation platforms and technologies | No | MERGE | - | Represented inside the Automation service and Automation Systems Work Area |
| SaaS Integrations | technology | Automation platforms and technologies | No | MERGE | - | Represented inside the API and Systems Integration service |
| Zoho | platform | Workflow/business platforms | No | LATER | 5+ | CRM and business suite; moderate intent |

## Cloud & DevOps

| Entity | Type | Category | Public page | Disposition | Phase | Why |
|---|---|---|---|---|---|---|
| AWS | platform | Cloud platforms | `/cloud/aws/` | BUILT | 3 | Built in Phase 3 |
| Azure | platform | Cloud platforms | `/cloud/azure/` | BUILT | 3 | Built in Phase 3 |
| Docker | tool | DevOps | `/cloud/docker/` | BUILT | 3 | Built in Phase 3 |
| Google Cloud | platform | Cloud platforms | `/cloud/google-cloud/` | BUILT | 3 | Built in Phase 3 |
| Kubernetes | tool | DevOps | `/cloud/kubernetes/` | BUILT | 3 | Built in Phase 3 |
| Terraform | tool | DevOps | `/cloud/terraform/` | BUILT | 3 | Built in Phase 3 |
| AKS | technology | Azure | No | MERGE | - | Represented inside the Azure page (a named service of that cloud) |
| Amplify | technology | AWS | No | MERGE | - | Represented inside the AWS page (a named service of that cloud) |
| Ansible | tool | DevOps | No | MERGE | - | Represented inside the Terraform page (alternative) |
| Apache | tool | DevOps | No | ENTITY | - | Infrastructure tool or operating system; covered by DevOps content |
| API Management | technology | Azure | No | MERGE | - | Represented inside the Azure page (a named service of that cloud) |
| App Service | technology | Azure | No | MERGE | - | Represented inside the Azure page (a named service of that cloud) |
| Argo CD | tool | DevOps | No | ENTITY | - | Infrastructure tool or operating system; covered by DevOps content |
| Aurora | technology | AWS | No | MERGE | - | Represented inside the AWS page (a named service of that cloud) |
| Azure DevOps | technology | Azure | No | MERGE | - | Represented inside the Azure page (a named service of that cloud) |
| Azure Functions | technology | Azure | No | MERGE | - | Represented inside the Azure page (a named service of that cloud) |
| Azure SQL | technology | Azure | No | MERGE | - | Represented inside the Azure page (a named service of that cloud) |
| Azure Storage | technology | Azure | No | MERGE | - | Represented inside the Azure page (a named service of that cloud) |
| Blob Storage | technology | Azure | No | MERGE | - | Represented inside the Azure page (a named service of that cloud) |
| CDK | technology | AWS | No | MERGE | - | Represented inside the AWS page (a named service of that cloud) |
| CDN | technology | Azure | No | MERGE | - | Represented inside the Azure page (a named service of that cloud) |
| CircleCI | tool | DevOps | No | ENTITY | - | Infrastructure tool or operating system; covered by DevOps content |
| Cloud Build | technology | Google Cloud | No | MERGE | - | Represented inside the Google Cloud page (a named service of that cloud) |
| Cloud Functions | technology | Google Cloud | No | MERGE | - | Represented inside the Google Cloud page (a named service of that cloud) |
| Cloud Run | technology | Google Cloud | No | MERGE | - | Represented inside the Google Cloud page (a named service of that cloud) |
| Cloud SQL | technology | Google Cloud | No | MERGE | - | Represented inside the Google Cloud page (a named service of that cloud) |
| Cloud Storage | technology | Google Cloud | No | MERGE | - | Represented inside the Google Cloud page (a named service of that cloud) |
| Cloudflare | platform | Cloud platforms | No | LATER | 5+ | Network and edge platform; moderate intent |
| CloudFormation | technology | AWS | No | MERGE | - | Represented inside the AWS page (a named service of that cloud) |
| CloudFront | technology | AWS | No | MERGE | - | Represented inside the AWS page (a named service of that cloud) |
| CloudWatch | technology | AWS | No | MERGE | - | Represented inside the AWS page (a named service of that cloud) |
| Cognito | technology | AWS | No | MERGE | - | Represented inside the AWS page (a named service of that cloud) |
| Compute Engine | technology | Google Cloud | No | MERGE | - | Represented inside the Google Cloud page (a named service of that cloud) |
| Container Apps | technology | Azure | No | MERGE | - | Represented inside the Azure page (a named service of that cloud) |
| Cosmos DB | technology | Azure | No | MERGE | - | Represented inside the Azure page (a named service of that cloud) |
| Datadog | platform | Observability | No | ENTITY | - | Observability tool; covered by DevOps content |
| Debian | tool | DevOps | No | ENTITY | - | Infrastructure tool or operating system; covered by DevOps content |
| DigitalOcean | platform | Cloud platforms | No | ENTITY | - | Alternative host; shown on the AWS page |
| EC2 | technology | AWS | No | MERGE | - | Represented inside the AWS page (a named service of that cloud) |
| ECS | technology | AWS | No | MERGE | - | Represented inside the AWS page (a named service of that cloud) |
| EKS | technology | AWS | No | MERGE | - | Represented inside the AWS page (a named service of that cloud) |
| Elastic Beanstalk | technology | AWS | No | MERGE | - | Represented inside the AWS page (a named service of that cloud) |
| Elastic Load Balancing | technology | AWS | No | MERGE | - | Represented inside the AWS page (a named service of that cloud) |
| ELK | tool | DevOps | No | ENTITY | - | Infrastructure tool or operating system; covered by DevOps content |
| Entra ID | technology | Azure | No | MERGE | - | Represented inside the Azure page (a named service of that cloud) |
| EventBridge | technology | AWS | No | MERGE | - | Represented inside the AWS page (a named service of that cloud) |
| Firebase | platform | Cloud platforms | No | NEXT | 4 | Popular back-end platform for mobile and web; distinct intent |
| GitHub Actions | tool | DevOps | No | MERGE | - | Represented inside the DevOps and Infrastructure Work Area and the Terraform and Docker pages |
| GitLab CI/CD | tool | DevOps | No | ENTITY | - | CI tool; covered by DevOps content |
| GKE | technology | Google Cloud | No | MERGE | - | Represented inside the Google Cloud page (a named service of that cloud) |
| Grafana | tool | DevOps | No | MERGE | - | Represented inside an observability section of DevOps content |
| HAProxy | tool | DevOps | No | ENTITY | - | Infrastructure tool or operating system; covered by DevOps content |
| Helm | tool | DevOps | No | ENTITY | - | Infrastructure tool or operating system; covered by DevOps content |
| Jenkins | tool | DevOps | No | ENTITY | - | CI tool; covered by DevOps content |
| Key Vault | technology | Azure | No | MERGE | - | Represented inside the Azure page (a named service of that cloud) |
| Lambda | technology | AWS | No | MERGE | - | Represented inside the AWS page (a named service of that cloud) |
| Linux | tool | DevOps | No | ENTITY | - | Infrastructure tool or operating system; covered by DevOps content |
| Load Balancing | technology | Google Cloud | No | MERGE | - | Represented inside the Google Cloud page (a named service of that cloud) |
| Monitor | technology | Azure | No | MERGE | - | Represented inside the Azure page (a named service of that cloud) |
| Netlify | platform | Cloud platforms | No | MERGE | - | Represented inside the Next.js and Webflow pages (hosting) |
| Nginx | tool | DevOps | No | ENTITY | - | Infrastructure tool or operating system; covered by DevOps content |
| OpenTelemetry | tool | DevOps | No | ENTITY | - | Infrastructure tool or operating system; covered by DevOps content |
| Prometheus | tool | DevOps | No | MERGE | - | Represented inside an observability section of DevOps content |
| Pub/Sub | technology | Google Cloud | No | MERGE | - | Represented inside the Google Cloud page (a named service of that cloud) |
| Pulumi | tool | DevOps | No | MERGE | - | Represented inside the Terraform page (alternative) |
| Railway | platform | Cloud platforms | No | ENTITY | - | Developer hosting; narrow intent |
| RDS | technology | AWS | No | MERGE | - | Represented inside the AWS page (a named service of that cloud) |
| Render | platform | Cloud platforms | No | ENTITY | - | Developer hosting; narrow intent |
| Rocky Linux | tool | DevOps | No | ENTITY | - | Infrastructure tool or operating system; covered by DevOps content |
| S3 | technology | AWS | No | MERGE | - | Represented inside the AWS page (a named service of that cloud) |
| Secrets Manager | technology | AWS | No | MERGE | - | Represented inside the AWS page (a named service of that cloud) |
| Sentry | platform | Observability | No | ENTITY | - | Observability tool; covered by DevOps content |
| SNS | technology | AWS | No | MERGE | - | Represented inside the AWS page (a named service of that cloud) |
| SQS | technology | AWS | No | MERGE | - | Represented inside the AWS page (a named service of that cloud) |
| Step Functions | technology | AWS | No | MERGE | - | Represented inside the AWS page (a named service of that cloud) |
| Supabase | platform | Cloud platforms | No | NEXT | 4 | Popular back-end platform; distinct intent from AWS or Firebase |
| Travis CI | tool | DevOps | No | ENTITY | - | Infrastructure tool or operating system; covered by DevOps content |
| Ubuntu | tool | DevOps | No | ENTITY | - | Infrastructure tool or operating system; covered by DevOps content |
| Vercel | platform | Cloud platforms | No | MERGE | - | Represented inside the Next.js page (hosting) |
| Vertex AI | technology | Google Cloud | No | MERGE | - | Represented inside the Google Cloud page (a named service of that cloud) |
| WAF | technology | AWS | No | MERGE | - | Represented inside the AWS page (a named service of that cloud) |

## Cybersecurity

| Entity | Type | Category | Public page | Disposition | Phase | Why |
|---|---|---|---|---|---|---|
| Encryption | concept | Technologies/concepts | No | RESOURCE | 5 | Concept: explained in resources and in service pages, not as a technology page |
| IAM | technology | Technologies/concepts | No | RESOURCE | 5 | A concept; suits resources and the Cybersecurity service |
| JWT | concept | Technologies/concepts | No | RESOURCE | 5 | Concept: explained in resources and in service pages, not as a technology page |
| MFA | concept | Technologies/concepts | No | RESOURCE | 5 | Concept: explained in resources and in service pages, not as a technology page |
| OAuth | concept | Technologies/concepts | No | RESOURCE | 5 | Concept: explained in resources and in service pages, not as a technology page |
| OAuth2 | concept | Technologies/concepts | No | RESOURCE | 5 | Concept: explained in resources and in service pages, not as a technology page |
| OWASP | concept | Technologies/concepts | No | RESOURCE | 5 | Concept: explained in resources and in service pages, not as a technology page |
| Secrets Management | concept | Technologies/concepts | No | RESOURCE | 5 | Concept: explained in resources and in service pages, not as a technology page |
| Secure Coding | concept | Technologies/concepts | No | RESOURCE | 5 | Concept: explained in resources and in service pages, not as a technology page |
| TLS/SSL | concept | Technologies/concepts | No | RESOURCE | 5 | Concept: explained in resources and in service pages, not as a technology page |
| Zero Trust | concept | Technologies/concepts | No | RESOURCE | 5 | Concept: explained in resources and in service pages, not as a technology page |

## Data & Analytics

| Entity | Type | Category | Public page | Disposition | Phase | Why |
|---|---|---|---|---|---|---|
| MongoDB | technology | NoSQL/distributed systems | `/data-analytics/mongodb/` | BUILT | 3 | Built in Phase 3 |
| PostgreSQL | technology | Relational databases | `/data-analytics/postgresql/` | BUILT | 3 | Built in Phase 3 |
| Appwrite | platform | Backend/database platforms | No | ENTITY | - | Narrow intent |
| BigQuery | technology | Analytics/data platforms | No | NEXT | 4 | Data warehouse; strong data and AI intent |
| Cassandra | technology | NoSQL/distributed systems | No | ENTITY | - | Covered by the database and data-platform pages |
| ClickHouse | platform | Analytics/data platforms | No | ENTITY | - | Covered by the database and data-platform pages |
| CockroachDB | technology | Relational databases | No | ENTITY | - | Covered by the database and data-platform pages |
| Couchbase | technology | NoSQL/distributed systems | No | ENTITY | - | Covered by the database and data-platform pages |
| Databricks | platform | Analytics/data platforms | No | LATER | 5+ | Specialist data platform; build when data work is evidenced |
| DynamoDB | technology | NoSQL/distributed systems | No | MERGE | - | Represented inside the AWS page |
| Elasticsearch | technology | Search technologies | No | ENTITY | - | Narrow intent; covered by data and search content |
| Firestore | technology | NoSQL/distributed systems | No | MERGE | - | Represented inside the Firebase page |
| Looker | platform | Business intelligence | No | ENTITY | - | Narrow intent; covered by BigQuery content if built |
| MariaDB | technology | Relational databases | No | ENTITY | - | Covered by the database and data-platform pages |
| MySQL | technology | Relational databases | No | NEXT | 4 | High-intent relational database; pairs with the PostgreSQL page |
| Neo4j | technology | NoSQL/distributed systems | No | ENTITY | - | Covered by the database and data-platform pages |
| OpenSearch | technology | Search technologies | No | ENTITY | - | Narrow intent |
| Oracle | technology | Relational databases | No | ENTITY | - | Covered by the database and data-platform pages |
| PocketBase | platform | Backend/database platforms | No | ENTITY | - | Narrow intent |
| Power BI | platform | Business intelligence | No | LATER | 5+ | Business intelligence tool; build when BI work is evidenced |
| Redis | technology | NoSQL/distributed systems | No | LATER | 5+ | Caching and data store; moderate intent |
| Redshift | platform | Analytics/data platforms | No | ENTITY | - | Covered by the database and data-platform pages |
| Snowflake | platform | Analytics/data platforms | No | NEXT | 4 | Data warehouse; strong enterprise intent |
| SQL Server | technology | Relational databases | No | ENTITY | - | Covered by the database and data-platform pages |
| SQLite | technology | Relational databases | No | ENTITY | - | Covered by the database and data-platform pages |
| Tableau | platform | Business intelligence | No | LATER | 5+ | Business intelligence tool; build when BI work is evidenced |
| Xano | platform | Backend/database platforms | No | ENTITY | - | Narrow intent |

## Ecommerce Solutions

| Entity | Type | Category | Public page | Disposition | Phase | Why |
|---|---|---|---|---|---|---|
| Shopify | platform | Platforms | `/ecommerce/shopify/` | BUILT | 3 | Built in Phase 3 |
| BigCommerce | platform | Platforms | No | LATER | 5+ | Ecommerce platform; build when demand is shown |
| Magento / Adobe Commerce | platform | Platforms | No | LATER | 5+ | Ecommerce platform with migration intent |
| OpenCart | platform | Platforms | No | ENTITY | - | Platform with limited standalone intent |
| PrestaShop | platform | Platforms | No | ENTITY | - | Platform with limited standalone intent |
| Shopify Plus | platform | Platforms | No | MERGE | - | Represented inside the Shopify page |
| Squarespace Commerce | platform | Platforms | No | ENTITY | - | Low-complexity builder |
| Webflow Ecommerce | platform | Platforms | No | MERGE | - | Represented inside the Webflow and Shopify pages |
| Wix Ecommerce | platform | Platforms | No | ENTITY | - | Low-complexity builder; covered by Wix if built |
| WooCommerce | platform | Platforms | No | NEXT | 4 | High-intent ecommerce platform; omitted from the plan's list although the entity exists |

## Mobile App Development

| Entity | Type | Category | Public page | Disposition | Phase | Why |
|---|---|---|---|---|---|---|
| Flutter | technology | Technologies | `/mobile-app-development/flutter/` | BUILT | 3 | Built in Phase 3 |
| Kotlin | technology | Technologies | `/mobile-app-development/kotlin/` | BUILT | 3 | Built in Phase 3 |
| React Native | technology | Technologies | `/mobile-app-development/react-native/` | BUILT | 3 | Built in Phase 3 |
| Swift | technology | Technologies | `/mobile-app-development/swift/` | BUILT | 3 | Built in Phase 3 |
| .NET MAUI | technology | Technologies | No | ENTITY | - | Narrow intent; covered by a .NET page if built |
| Android SDK | technology | Technologies | No | MERGE | - | Represented inside the Kotlin page |
| Dart | language | General | No | MERGE | - | Represented inside the Flutter page |
| FlutterFlow | technology | Technologies | No | MERGE | - | Represented inside the Flutter page |
| Ionic | technology | Technologies | No | ENTITY | - | Declining demand |
| iOS SDK | technology | Technologies | No | MERGE | - | Represented inside the Swift page |
| Jetpack Compose | technology | Technologies | No | MERGE | - | Represented inside the Kotlin page |
| Kotlin Multiplatform | technology | Technologies | No | MERGE | - | Represented inside the Kotlin page |
| Objective-C | language | General | No | ENTITY | - | Legacy; covered by the Swift page where relevant |
| SwiftUI | technology | Technologies | No | MERGE | - | Represented inside the Swift page |

## SEO, AEO & GEO

| Entity | Type | Category | Public page | Disposition | Phase | Why |
|---|---|---|---|---|---|---|
| Bing | ecosystem | Target search/AI ecosystem | No | ENTITY | - | A search or AI ecosystem we optimize for (GEO), not a technology we build with |
| ChatGPT | ecosystem | Target search/AI ecosystem | No | ENTITY | - | A search or AI ecosystem we optimize for (GEO), not a technology we build with |
| Claude | ecosystem | Target search/AI ecosystem | No | ENTITY | - | A search or AI ecosystem we optimize for (GEO), not a technology we build with |
| Gemini | ecosystem | Target search/AI ecosystem | No | ENTITY | - | A search or AI ecosystem we optimize for (GEO), not a technology we build with |
| Google AI Mode | ecosystem | Target search/AI ecosystem | No | ENTITY | - | A search or AI ecosystem we optimize for (GEO), not a technology we build with |
| Google AI Overviews | ecosystem | Target search/AI ecosystem | No | ENTITY | - | A search or AI ecosystem we optimize for (GEO), not a technology we build with |
| Google Search | ecosystem | Target search/AI ecosystem | No | ENTITY | - | A search or AI ecosystem we optimize for (GEO), not a technology we build with |
| Grok | ecosystem | Target search/AI ecosystem | No | ENTITY | - | A search or AI ecosystem we optimize for (GEO), not a technology we build with |
| Meta AI | ecosystem | Target search/AI ecosystem | No | ENTITY | - | A search or AI ecosystem we optimize for (GEO), not a technology we build with |
| Microsoft Copilot | ecosystem | Target search/AI ecosystem | No | ENTITY | - | A search or AI ecosystem we optimize for (GEO), not a technology we build with |
| Perplexity | ecosystem | Target search/AI ecosystem | No | ENTITY | - | A search or AI ecosystem we optimize for (GEO), not a technology we build with |

## Software Development

| Entity | Type | Category | Public page | Disposition | Phase | Why |
|---|---|---|---|---|---|---|
| Java | language | General | `/software-development/java/` | BUILT | 3 | Built in Phase 3 |
| Python | language | General | `/software-development/python/` | BUILT | 3 | Built in Phase 3 |
| .NET | technology | Backend frameworks | No | NEXT | 4 | Strategic technology named in the master plan; added to the graph in ADR 0005; C# is covered by it |
| API Architecture | concept | General | No | RESOURCE | 5 | Concept: explained in resources and in service pages, not as a technology page |
| Bash | language | General | No | ENTITY | - | Language with limited standalone service intent |
| C | language | General | No | ENTITY | - | Language with limited standalone service intent |
| C# | language | General | No | MERGE | - | Represented inside the .NET page (Phase 4 candidate) |
| C++ | language | General | No | ENTITY | - | Language with limited standalone service intent |
| Clean Architecture | concept | General | No | RESOURCE | 5 | Concept: explained in resources and in service pages, not as a technology page |
| Cloud Architecture | concept | General | No | RESOURCE | 5 | Concept: explained in resources and in service pages, not as a technology page |
| Database Architecture | concept | General | No | RESOURCE | 5 | Concept: explained in resources and in service pages, not as a technology page |
| Distributed Systems | concept | General | No | RESOURCE | 5 | Concept: explained in resources and in service pages, not as a technology page |
| Django | framework | Backend frameworks | No | MERGE | - | Represented inside the Python page |
| Domain-Driven Design | concept | General | No | RESOURCE | 5 | Concept: explained in resources and in service pages, not as a technology page |
| Express | framework | Backend frameworks | No | MERGE | - | Represented inside the Node.js page |
| FastAPI | framework | Backend frameworks | No | MERGE | - | Represented inside the Python page |
| Flask | framework | Backend frameworks | No | MERGE | - | Represented inside the Python page |
| Functional Programming | concept | General | No | RESOURCE | 5 | Concept: explained in resources and in service pages, not as a technology page |
| Go | language | General | No | LATER | 5+ | Moderate intent; build when back-end work is evidenced |
| Headless Architecture | concept | General | No | RESOURCE | 5 | Concept: explained in resources and in service pages, not as a technology page |
| Lua | language | General | No | ENTITY | - | Language with limited standalone service intent |
| MATLAB | language | General | No | ENTITY | - | Language with limited standalone service intent |
| Monolithic Architecture | concept | General | No | RESOURCE | 5 | Concept: explained in resources and in service pages, not as a technology page |
| Multi-Tenant Systems | concept | General | No | RESOURCE | 5 | Concept: explained in resources and in service pages, not as a technology page |
| MVC | concept | General | No | RESOURCE | 5 | Concept: explained in resources and in service pages, not as a technology page |
| MVVM | concept | General | No | RESOURCE | 5 | Concept: explained in resources and in service pages, not as a technology page |
| NestJS | framework | Backend frameworks | No | MERGE | - | Represented inside the Node.js page |
| Node.js | technology | Backend frameworks | No | NEXT | 4 | Strategic technology named in the master plan; very high intent; added to the graph in ADR 0005 |
| OOP | concept | General | No | RESOURCE | 5 | Concept: explained in resources and in service pages, not as a technology page |
| Perl | language | General | No | ENTITY | - | Language with limited standalone service intent |
| PowerShell | language | General | No | ENTITY | - | Language with limited standalone service intent |
| R | language | General | No | ENTITY | - | Language with limited standalone service intent |
| Ruby | language | General | No | LATER | 5+ | Low to moderate intent; needs the Rails entity |
| Ruby on Rails | framework | Backend frameworks | No | ENTITY | - | Narrow intent; Ruby is entity-only |
| Rust | language | General | No | ENTITY | - | Narrow intent |
| Scala | language | General | No | ENTITY | - | Language with limited standalone service intent |
| Serverless | concept | General | No | RESOURCE | 5 | Concept: explained in resources and in service pages, not as a technology page |
| Spring Boot | framework | Backend frameworks | No | MERGE | - | Represented inside the Java page |
| SQL | language | General | No | RESOURCE | 5 | A skill and concept more than a service; suits resources |
| Visual Basic | language | General | No | ENTITY | - | Language with limited standalone service intent |

## UI/UX & Product Design

| Entity | Type | Category | Public page | Disposition | Phase | Why |
|---|---|---|---|---|---|---|
| Adobe XD | tool | Tools | No | ENTITY | - | Design tool; covered by the UI/UX service |
| Canva | tool | Tools | No | ENTITY | - | Design tool; covered by the UI/UX service |
| Figma | tool | Tools | No | LATER | 5+ | Design tool; low service intent but real tool intent |
| Illustrator | tool | Tools | No | ENTITY | - | Design tool; covered by the UI/UX service |
| Photoshop | tool | Tools | No | ENTITY | - | Design tool; covered by the UI/UX service |

## Web Development

| Entity | Type | Category | Public page | Disposition | Phase | Why |
|---|---|---|---|---|---|---|
| Next.js | framework | Frontend technologies | `/web-development/nextjs/` | BUILT | 3 | Built in Phase 3 |
| PHP | language | General | `/web-development/php/` | BUILT | 3 | Built in Phase 3 |
| React | framework | Frontend technologies | `/web-development/react/` | BUILT | 3 | Built in Phase 3 |
| TypeScript | language | General | `/web-development/typescript/` | BUILT | 3 | Built in Phase 3 |
| Webflow | platform | Platforms | `/web-development/webflow/` | BUILT | 3 | Built in Phase 3 |
| WordPress | platform | Platforms | `/web-development/wordpress/` | BUILT | 3 | Built in Phase 3 |
| Alpine.js | framework | Frontend technologies | No | ENTITY | - | Alternative front-end framework; named on the Next.js and React pages |
| Angular | framework | Frontend technologies | No | NEXT | 4 | High-intent front-end framework; common in enterprise work |
| Ant Design | tool | Frontend tools/frameworks | No | ENTITY | - | Developer tooling; no buyer intent of its own |
| Astro | framework | Frontend technologies | No | ENTITY | - | Alternative front-end framework; named on the Next.js and React pages |
| Babel | tool | Frontend tools/frameworks | No | ENTITY | - | Developer tooling; no buyer intent of its own |
| Bootstrap | tool | Frontend tools/frameworks | No | ENTITY | - | Developer tooling; no buyer intent of its own |
| Bulma | tool | Frontend tools/frameworks | No | ENTITY | - | Developer tooling; no buyer intent of its own |
| Chakra UI | tool | Frontend tools/frameworks | No | ENTITY | - | Developer tooling; no buyer intent of its own |
| Contentful | platform | Platforms | No | MERGE | - | Represented inside one 'headless CMS' page (Phase 4 candidate) with Sanity and Strapi |
| Directus | platform | Platforms | No | ENTITY | - | Platform with limited standalone intent |
| Drupal | platform | Platforms | No | LATER | 5+ | CMS with migration and enterprise intent |
| Ember | framework | Frontend technologies | No | ENTITY | - | Alternative front-end framework; named on the Next.js and React pages |
| ESLint | tool | Frontend tools/frameworks | No | ENTITY | - | Developer tooling; no buyer intent of its own |
| Foundation | tool | Frontend tools/frameworks | No | ENTITY | - | Developer tooling; no buyer intent of its own |
| Gatsby | framework | Frontend technologies | No | ENTITY | - | Alternative front-end framework; named on the Next.js and React pages |
| Ghost | platform | Platforms | No | ENTITY | - | Narrow intent |
| HubSpot CMS | platform | Platforms | No | MERGE | - | Represented inside the HubSpot page |
| JavaScript | language | General | No | MERGE | - | Represented inside the TypeScript and React pages |
| Joomla | platform | Platforms | No | ENTITY | - | Declining demand; migration intent is covered by the WordPress and Drupal pages |
| Laravel | framework | Backend frameworks | No | MERGE | - | Represented inside the PHP page |
| Lit | framework | Frontend technologies | No | ENTITY | - | Alternative front-end framework; named on the Next.js and React pages |
| Material UI | tool | Frontend tools/frameworks | No | ENTITY | - | Developer tooling; no buyer intent of its own |
| npm | tool | Frontend tools/frameworks | No | ENTITY | - | Developer tooling; no buyer intent of its own |
| Nuxt | framework | Frontend technologies | No | ENTITY | - | Alternative front-end framework; named on the Next.js and React pages |
| Parcel | tool | Frontend tools/frameworks | No | ENTITY | - | Developer tooling; no buyer intent of its own |
| pnpm | tool | Frontend tools/frameworks | No | ENTITY | - | Developer tooling; no buyer intent of its own |
| Preact | framework | Frontend technologies | No | ENTITY | - | Alternative front-end framework; named on the Next.js and React pages |
| Prettier | tool | Frontend tools/frameworks | No | ENTITY | - | Developer tooling; no buyer intent of its own |
| Prismic | platform | Platforms | No | ENTITY | - | Platform with limited standalone intent |
| Remix | framework | Frontend technologies | No | ENTITY | - | Alternative front-end framework; named on the Next.js and React pages |
| Rollup | tool | Frontend tools/frameworks | No | ENTITY | - | Developer tooling; no buyer intent of its own |
| Sanity | platform | Platforms | No | MERGE | - | Represented inside one 'headless CMS' page (Phase 4 candidate) |
| SolidJS | framework | Frontend technologies | No | ENTITY | - | Alternative front-end framework; named on the Next.js and React pages |
| Squarespace | platform | Platforms | No | LATER | 5+ | Builder platform; migration intent |
| Storyblok | platform | Platforms | No | ENTITY | - | Platform with limited standalone intent |
| Strapi | platform | Platforms | No | MERGE | - | Represented inside one 'headless CMS' page (Phase 4 candidate) |
| Svelte | framework | Frontend technologies | No | ENTITY | - | Alternative front-end framework; named on the Next.js and React pages |
| SvelteKit | framework | Frontend technologies | No | ENTITY | - | Alternative front-end framework; named on the Next.js and React pages |
| Tailwind CSS | tool | Frontend tools/frameworks | No | ENTITY | - | Developer tooling; no buyer intent of its own |
| Vite | tool | Frontend tools/frameworks | No | ENTITY | - | Developer tooling; no buyer intent of its own |
| Vue | framework | Frontend technologies | No | NEXT | 4 | High-intent front-end framework; entity exists; not in the plan's 34 |
| Webpack | tool | Frontend tools/frameworks | No | ENTITY | - | Developer tooling; no buyer intent of its own |
| Wix | platform | Platforms | No | LATER | 5+ | Builder platform; migration intent |
| Wix Studio | platform | Platforms | No | ENTITY | - | Platform with limited standalone intent |
| Wix Velo | platform | Platforms | No | ENTITY | - | Platform with limited standalone intent |
| Yarn | tool | Frontend tools/frameworks | No | ENTITY | - | Developer tooling; no buyer intent of its own |

## Graph completion (ADR 0005)

The Phase 3 review found gaps in the approved capability categories. Nineteen entities were added in `data/taxonomy/technologies-completion.yaml`: Node.js and .NET (named in the master plan), and back-end frameworks, business intelligence, messaging, search, and observability tools within capabilities that were already approved. None has a public page.

