// Agency voice pass on the service pages (owner direction and consultant brief, 20 October 2026):
// a promise in every H1, "we" to "you" leads, no hedging openers, positive "how we choose" sections,
// buyer-language headings, and cost and timeline answers with real ranges. Edits are applied in
// place (comments and formatting kept). Run once: node scripts/voice-pass.mjs
import fs from "node:fs";
import YAML from "yaml";

const T = "How we pick the right approach";

/** Per page: hero fields, section edits by id ({ field: value }), and FAQ answers by question. */
const EDITS = {
  "software-development": {
    hero: {
      lead: "At DECHY, we design, build, and look after custom software that fits how your business runs: business tools, customer portals, online platforms, dashboards, and internal systems. You get one team from the first workshop to years of support, and software your staff actually want to use.",
    },
    sections: {
      "what-is": { heading: "Custom software that fits your business, not the other way round" },
      quality: { heading: "Quality assurance, security, and speed in every release" },
      technology: { heading: "The technology we build with" },
    },
    faq: {
      "How much does custom software cost?":
        "Most custom software projects cost $15,000 to $100,000 or more. An internal tool usually costs $15,000 to $30,000, a customer portal $25,000 to $50,000, and a full business platform or SaaS product $50,000 to $100,000 or more. Every quote is fixed in writing after a short discovery call, and it includes testing, security, documentation, and launch support.",
      "How long does a custom software project take?":
        "Most projects take 4 weeks to 4 months. An internal tool usually goes live in 4 to 6 weeks, a portal in 6 to 8 weeks, and a larger platform in 2 to 4 months. We release in stages, so your team uses working software early instead of waiting for one big launch.",
    },
  },
  "web-development": {
    hero: {
      lead: "We build fast, good-looking websites and web apps that your team can edit and your customers enjoy using. You get a site that loads in a blink, works on every screen, ranks in search, and turns visitors into inquiries and sales.",
      support: null,
    },
    sections: {
      "what-is": { heading: "Websites that win customers, and web apps that do the work" },
      process: {
        intro: "Most business websites go live in 1 to 2 weeks, and most web apps in 1 to 6 weeks.",
      },
      technology: { heading: "The technology behind our websites" },
      handover: { heading: "Website care after launch" },
    },
    callouts: {
      title: T,
      paragraphs: [
        "We match the build to your goal. A well-chosen template or content system is often the fastest, most affordable route. A custom build pays off when you need special features, top performance, or full control.",
        "We recommend the option that gives you the best result for your budget, and we show you exactly what each choice includes.",
      ],
    },
    faq: {
      "How much does a website cost?":
        "Most business websites cost $2,000 to $10,000. A landing page starts around $2,000, a business website costs $3,000 to $7,000, and a larger content site $5,000 to $10,000. Web apps cost $5,000 to $50,000 or more depending on accounts, dashboards, payments, and integrations. Every quote is fixed in writing.",
      "How long does it take?":
        "A business website usually goes live in 1 to 2 weeks and a larger site in 2 to 3 weeks. Web apps take 1 to 6 weeks depending on features. We plan content and decisions with you up front, so nothing waits.",
    },
  },
  "mobile-app-development": {
    hero: {
      lead: "We design, build, and launch mobile apps for iPhone and Android, then keep them fast and up to date. You get an app people keep on their home screen, connected to your website, customer records, and payments.",
      support: null,
    },
    sections: {
      problem: { heading: "Apps that earn a place on your customer's phone" },
      technology: { heading: "The technology behind our apps" },
      stores: { heading: "App updates and support after launch" },
    },
    callouts: {
      title: T,
      paragraphs: [
        "We start from how often your customers will use it. An app wins when people return often or need the phone's camera, location, or notifications. For one-off use, a fast web app gives the same result for less.",
        "We recommend the format that fits your customers and budget, then build it properly.",
      ],
    },
    faq: {
      "How much does an app cost?":
        "Most mobile apps cost $10,000 to $60,000 or more. A focused first version (MVP, short for minimum viable product) costs $10,000 to $20,000, a business app with accounts and payments $20,000 to $35,000, and a marketplace or complex app $30,000 to $60,000 or more. Every quote is fixed in writing after a short call.",
      "How long does it take?":
        "Most apps take 2 to 8 weeks. A first version usually reaches the app stores in 2 to 4 weeks, and larger apps in 6 to 8 weeks. App store review adds a few days, which we plan into the launch date.",
    },
  },
  ecommerce: {
    hero: {
      headline: "Online stores that sell more and run themselves",
      lead: "We build and grow online stores that are easy to buy from and easy to run. You get a fast store on the right platform, connected to payments, stock, shipping, and accounting, so orders flow from checkout to delivery without manual work.",
      support: null,
    },
    sections: {
      "what-is": { heading: "A store built to convert, and the systems that fulfill every order" },
      technology: { heading: "The platforms and technology we build on" },
    },
    callouts: {
      title: T,
      paragraphs: [
        "Most stores do best on a well-set-up hosted platform such as Shopify or WooCommerce, which keeps running costs low. We go custom when you need features no platform offers, such as complex pricing, marketplaces, or headless storefronts.",
        "You get a clear recommendation and a fixed quote for the route that sells best for your budget.",
      ],
    },
    faq: {
      "How much does an online store cost?":
        "Most online stores cost $3,000 to $25,000. A Shopify or WooCommerce store usually costs $3,000 to $8,000, a custom store with integrations $8,000 to $25,000, and a headless store or marketplace $25,000 to $60,000 or more. We also show the running costs, such as platform and payment fees, before you start.",
    },
  },
  ai: {
    hero: {
      headline: "AI solutions that save time and answer customers",
      lead: "We build AI that does real work for your business: assistants that answer from your own documents, tools that read and sort paperwork, agents that handle routine tasks, and predictions that support decisions. You get measurable time saved, with people in control.",
    },
    sections: {
      "what-is": { heading: "AI that pays for itself" },
      technology: { heading: "The models and tools we build with" },
    },
    callouts: {
      title: T,
      paragraphs: [
        "We use AI where it adds the most value: reading unstructured documents, answering questions, and making suggestions. Where a simple rule or a connection between systems does the job, we use that instead, because it is cheaper to run.",
        "You get the most reliable solution for the job, measured against real results.",
      ],
    },
    faq: {
      "How long does an AI project take?":
        "A focused AI assistant or document tool usually goes live in 1 to 4 weeks. AI agents connected to your systems take 4 to 6 weeks, and custom models or platforms 2 to 3 months. Typical costs range from $5,000 to $150,000 or more depending on scope.",
    },
  },
  automation: {
    hero: {
      headline: "Business automation that takes repetitive work off your team",
      lead: "We automate the approvals, updates, data entry, and reports your team repeats every day. You get workflows that run on their own across the tools you already use, with AI where it helps and people in control of the decisions that matter.",
    },
    sections: {
      "what-is": { heading: "Hours back every week, without hiring" },
      technology: { heading: "The automation tools we build with" },
    },
    callouts: {
      title: T,
      paragraphs: [
        "Most workflows run best on clear rules, dependable connections, and good monitoring. They are fast, cheap to run, and easy to explain.",
        "We add [AI](ref:svc.ai) where a step really needs it: reading an unstructured email, summarizing a long document, or sorting a request. A person can always review the result.",
      ],
    },
    calloutsById: {
      "when-not": {
        title: "We fix the process first",
        paragraphs: [
          "Automation works best on a process that is clear and stable. When a process changes every week, we tidy it with your team first, then automate it, so the automation keeps working.",
        ],
      },
    },
  },
  "data-analytics": {
    hero: {
      headline: "Data analytics and dashboards your team trusts",
      lead: "We turn scattered information into numbers you can act on. We bring data together from your tools, clean it, agree what every figure means, and build dashboards and reports that update themselves.",
      support: null,
    },
    sections: {
      "what-is": { heading: "Decisions made on numbers, not guesses" },
      technology: { heading: "The data tools we build with" },
    },
    callouts: {
      title: T,
      paragraphs: [
        "A dashboard is only as good as the data behind it. When information is recorded inconsistently, we fix how it is captured first, then build the charts, so the numbers stay right.",
        "You get reports people trust, not just reports that look good.",
      ],
    },
  },
  "api-integration": {
    hero: {
      headline: "API and systems integration that connects your tools",
      lead: "We connect the systems your business runs on, so a customer, an order, or a payment is entered once and appears everywhere it should. You stop retyping data, your reports agree, and automation and AI finally have clean data to work with.",
      support: null,
    },
    sections: {
      technology: { heading: "The integration technology we use" },
    },
    callouts: {
      title: T,
      paragraphs: [
        "We connect what can be connected well. When a tool is too limited to integrate cleanly, we show you what replacing it would cost against working around it, so you choose with the numbers in front of you.",
      ],
    },
    faq: {
      "How long does an integration take?":
        "A single integration between two systems usually takes about a week and costs $2,000 to $6,000. Connecting several systems takes 2 to 4 weeks and costs $6,000 to $20,000. Larger integration platforms take 6 to 10 weeks.",
    },
  },
  cloud: {
    hero: {
      headline: "Cloud and DevOps services for reliable, affordable software",
      lead: "We move, set up, and run your software in the cloud so it stays fast, secure, and affordable. You get automatic deployments, monitoring, and backups, and a team that keeps everything running after launch.",
      support: null,
    },
    sections: {
      technology: { heading: "The cloud platforms and tools we use" },
    },
    callouts: {
      title: T,
      paragraphs: [
        "We compare cloud, hosted, and existing setups on cost, performance, and the rules about where your data may live. Then we recommend the option that gives you the best reliability for the money.",
        "Sometimes that is a full move, sometimes a smaller upgrade. You see the numbers either way.",
      ],
    },
  },
  cybersecurity: {
    hero: {
      headline: "Cybersecurity services that protect your business and your customers",
      lead: "We find the weak points in your software, systems, and habits, then fix them in order of real risk. You get practical protection, clear evidence for customers and auditors, and security built into everything we build.",
      support: null,
    },
    sections: {
      technology: { heading: "The security tools and standards we use" },
    },
    callouts: {
      title: "What we promise",
      paragraphs: [
        "Security lowers risk; it never removes it completely. What we promise is an honest assessment, fixes ranked by real risk, and clear explanations your team and your customers understand.",
        "Every finding comes with evidence, and every fix is tested.",
      ],
    },
  },
  "ui-ux": {
    hero: {
      headline: "UI/UX and product design people understand at a glance",
      lead: "We design websites, apps, and software that feel obvious to use. You get research with real users, clickable prototypes, and finished screens that developers can build exactly, so your product looks good and works the first time.",
      support: null,
    },
    sections: {
      technology: { heading: "The design tools we use" },
    },
  },
  branding: {
    hero: {
      headline: "Branding and creative that make you look as good as you are",
      lead: "We create brand identities that work everywhere: logo, colors, type, voice, and the templates your team uses every day. You get a brand that looks current, feels consistent, and is ready to roll out across your website and channels.",
      support: null,
    },
    faq: {
      "How long does a branding project take?":
        "A logo and starter identity usually takes about a week and costs $1,500 to $4,000. A full identity with guidelines takes 2 to 3 weeks and costs $4,000 to $12,000. A rebrand with messaging and rollout takes 4 to 6 weeks.",
    },
  },
  "seo-aeo-geo": {
    hero: {
      headline: "SEO, AEO, and GEO services to be found in search and AI answers",
      lead: "We help customers find you on Google, Bing, and AI assistants such as ChatGPT. That covers SEO (search engine optimization, ranking in search results), AEO (answer engine optimization, being the direct answer to a question), and GEO (generative engine optimization, being described correctly by AI assistants).",
      support:
        "You get a site search engines and AI tools understand, content that answers buyers' questions, and honest monthly reporting.",
    },
    callouts: {
      title: "What we promise",
      paragraphs: [
        "No one controls rankings or what an AI assistant says, so we never sell guarantees. We promise the work that moves visibility: removing technical obstacles, making your content clear and quotable, and measuring what changes every month.",
      ],
    },
    faq: {
      "How long does SEO take to work?":
        "Technical fixes often show results within weeks. Content and authority usually take 3 to 6 months to build momentum. A technical audit with fixes costs $1,500 to $5,000, and monthly programs cost $1,000 to $4,000 a month.",
    },
  },
  "digital-marketing": {
    hero: {
      headline: "Digital marketing that brings in qualified leads and sales",
      lead: "We run focused campaigns across search, social, and email, track every one from first click to customer, and connect the results to your sales records. You see exactly what each channel earns and where to spend next.",
      support: null,
    },
    callouts: {
      title: T,
      paragraphs: [
        "Marketing works best when the offer is clear, the site is fast, and inquiries are answered quickly. We check those first, so every dollar of ad spend has the best chance to turn into sales.",
      ],
    },
    faq: {
      "How much should we spend on marketing?":
        "Campaign setup usually costs $1,500 to $4,000, and monthly management $1,000 to $5,000 plus ad spend. We start with a measured test budget, then put more behind the channels that bring customers.",
    },
  },
  consulting: {
    hero: {
      headline: "Technology consulting and digital transformation that pays off",
      lead: "We help you decide what to build, buy, or fix before you spend the money. You get a clear view of your systems, options in plain language, and a costed roadmap you can follow, whether or not we build it.",
      support: null,
    },
    callouts: {
      title: T,
      paragraphs: [
        "When a problem is clear and the solution is standard, you need a good provider and a short brief, and we will write that brief with you. When the choice is bigger or riskier, an assessment saves far more than it costs.",
      ],
    },
    faq: {
      "How long does a consulting project take?":
        "A technology assessment usually takes 1 to 2 weeks and costs $2,500 to $7,000. A full transformation roadmap takes 2 to 4 weeks and costs $7,000 to $20,000. Ongoing advisory starts at $3,000 a month.",
    },
  },
};

for (const [slug, e] of Object.entries(EDITS)) {
  const file = `content/pages/en/${slug}.yaml`;
  const doc = YAML.parseDocument(fs.readFileSync(file, "utf8"));
  const sections = doc.get("sections");
  const idx = (pred) => sections.items.findIndex((s) => pred(s.toJSON()));
  const heroAt = idx((s) => s.type === "hero");
  for (const [k, v] of Object.entries(e.hero ?? {})) {
    if (v === null) doc.deleteIn(["sections", heroAt, k]);
    else doc.setIn(["sections", heroAt, k], v);
  }
  for (const [id, fields] of Object.entries(e.sections ?? {})) {
    const at = idx((s) => s.id === id);
    if (at < 0) throw new Error(`${slug}: no section ${id}`);
    for (const [k, v] of Object.entries(fields)) doc.setIn(["sections", at, k], v);
  }
  // The first callout on the page (the "when we are not the answer" one) becomes "how we choose".
  if (e.callouts) {
    const at = idx((s) => s.type === "callout");
    if (at < 0) throw new Error(`${slug}: no callout`);
    doc.setIn(["sections", at, "title"], e.callouts.title);
    doc.setIn(["sections", at, "paragraphs"], doc.createNode(e.callouts.paragraphs));
  }
  for (const [id, c] of Object.entries(e.calloutsById ?? {})) {
    const at = idx((s) => s.id === id);
    if (at < 0) throw new Error(`${slug}: no callout ${id}`);
    doc.setIn(["sections", at, "title"], c.title);
    doc.setIn(["sections", at, "paragraphs"], doc.createNode(c.paragraphs));
  }
  if (e.faq) {
    const at = idx((s) => s.type === "faq");
    const items = doc.getIn(["sections", at, "items"]);
    for (const [q, a] of Object.entries(e.faq)) {
      const k = items.items.findIndex((it) => it.get("q") === q);
      if (k < 0) throw new Error(`${slug}: no question ${q}`);
      doc.setIn(["sections", at, "items", k, "a"], a);
    }
  }
  fs.writeFileSync(file, doc.toString({ lineWidth: 100 }));
  console.log("updated", slug);
}
