import {
  siAsana,
  siBrevo,
  siClickup,
  siElementor,
  siFramer,
  siGlide,
  siGoogle,
  siGoogleanalytics,
  siGooglesearchconsole,
  siGooglesheets,
  siGoogleslides,
  siMailchimp,
  siSemrush,
  siAirtable,
  siAngular,
  siAnthropic,
  siCloudflare,
  siDocker,
  siDotnet,
  siFigma,
  siFirebase,
  siFlutter,
  siGo,
  siGooglecloud,
  siGooglegemini,
  siHubspot,
  siJavascript,
  siKotlin,
  siKubernetes,
  siMake,
  siMongodb,
  siMysql,
  siN8n,
  siNextdotjs,
  siNodedotjs,
  siPaypal,
  siPhp,
  siPostgresql,
  siPython,
  siReact,
  siShopify,
  siSquarespace,
  siStripe,
  siSupabase,
  siSwift,
  siTerraform,
  siTypescript,
  siVuedotjs,
  siWebflow,
  siWix,
  siWoocommerce,
  siWordpress,
  siZapier,
  siGithubactions,
  siSvelte,
  siLaravel,
  siDrupal,
  siBigcommerce,
  siNotion,
  siRedis,
  siAdyen,
  siJetpackcompose,
  siGraphql,
  siSnowflake,
  siGooglebigquery,
  siDatabricks,
  siLangchain,
  siVercel,
  siNetlify,
  type SimpleIcon,
} from "simple-icons";

/**
 * Official technology marks (Simple Icons, CC0) by entity id. Marks the brand owner has withdrawn
 * from Simple Icons (AWS, Azure, Java, OpenAI, Salesforce) show the name as a wordmark instead;
 * a mark is never redrawn. The marks name technologies we build with and imply no partnership.
 */
const LOGOS: Record<string, SimpleIcon> = {
  "fw.react": siReact,
  "fw.nextjs": siNextdotjs,
  "fw.vue": siVuedotjs,
  "fw.angular": siAngular,
  "lang.typescript": siTypescript,
  "lang.javascript": siJavascript,
  "lang.python": siPython,
  "lang.php": siPhp,
  "lang.go": siGo,
  "tech.nodejs": siNodedotjs,
  "tech.dotnet": siDotnet,
  "tech.flutter": siFlutter,
  "tech.react-native": siReact,
  "tech.swift": siSwift,
  "tech.kotlin": siKotlin,
  "plat.wordpress": siWordpress,
  "plat.shopify": siShopify,
  "plat.webflow": siWebflow,
  "plat.woocommerce": siWoocommerce,
  "plat.wix": siWix,
  "plat.squarespace": siSquarespace,
  "prov.anthropic-claude": siAnthropic,
  "prov.google-gemini": siGooglegemini,
  "tech.postgresql": siPostgresql,
  "tech.mongodb": siMongodb,
  "tech.mysql": siMysql,
  "plat.firebase": siFirebase,
  "plat.supabase": siSupabase,
  "tech.zapier": siZapier,
  "tech.n8n": siN8n,
  "tech.make": siMake,
  "plat.google-cloud": siGooglecloud,
  "plat.cloudflare": siCloudflare,
  "int.stripe": siStripe,
  "int.paypal": siPaypal,
  "tool.docker": siDocker,
  "tool.kubernetes": siKubernetes,
  "tool.terraform": siTerraform,
  "plat.hubspot": siHubspot,
  "tool.figma": siFigma,
  "plat.airtable": siAirtable,
  "tool.github-actions": siGithubactions,
  "fw.svelte": siSvelte,
  "fw.laravel": siLaravel,
  "plat.drupal": siDrupal,
  "plat.bigcommerce": siBigcommerce,
  "plat.notion": siNotion,
  "tech.redis": siRedis,
  "int.adyen": siAdyen,
  "tech.jetpack-compose": siJetpackcompose,
  "tech.graphql": siGraphql,
  "plat.snowflake": siSnowflake,
  "tech.bigquery": siGooglebigquery,
  "plat.databricks": siDatabricks,
  "fw.langchain": siLangchain,
  "plat.vercel": siVercel,
  "plat.netlify": siNetlify,
  "plat.elementor": siElementor,
  "plat.framer": siFramer,
  "plat.glide": siGlide,
  "tool.google-slides": siGoogleslides,
  "tool.google-search-console": siGooglesearchconsole,
  "tool.semrush": siSemrush,
  "plat.mailchimp": siMailchimp,
  "plat.brevo": siBrevo,
  "plat.clickup": siClickup,
  "plat.asana": siAsana,
  "tool.google-sheets": siGooglesheets,
  "tool.google-analytics": siGoogleanalytics,
  "plat.wix-studio": siWix,
  "plat.wix-velo": siWix,
  "plat.wix-bookings": siWix,
  "plat.google-workspace": siGoogle,
};

/** Brand color for hover, lifted when the brand color is too dark to read on the dark tiles. */
function hoverColor(hex: string): string {
  const n = parseInt(hex, 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return lum < 0.28 ? "#ffffff" : `#${hex}`;
}

export function TechLogo({ id, name }: { id: string; name: string }) {
  const icon = LOGOS[id];
  // No logo: a monogram, never the full name (the name is always printed beside the mark).
  if (!icon) {
    const words = name
      .replace(/[^A-Za-z0-9 ]/g, " ")
      .split(/\s+/)
      .filter(Boolean);
    const mono =
      words.length > 1
        ? words
            .map((w) => w[0])
            .slice(0, 2)
            .join("")
        : (words[0] ?? "").slice(0, 2);
    return (
      <span className="tech-wordmark tech-monogram" aria-hidden="true">
        {mono}
      </span>
    );
  }
  return (
    <svg
      className="tech-logo"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      style={{ "--brand": hoverColor(icon.hex) } as React.CSSProperties}
    >
      <path d={icon.path} fill="currentColor" />
    </svg>
  );
}
