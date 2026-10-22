import Image from "next/image";
import type { Partnerships } from "@/lib/content/certifications";

type Partner = Partnerships["partners"][number];

/** Each logo's width to height, so it draws at its true shape at any height. */
const RATIO: Record<string, number> = {
  "aws.svg": 304 / 182,
  "microsoft.svg": 1,
  "google-cloud.svg": 181 / 28,
  "salesforce.svg": 273 / 191,
  "adobe.svg": 133 / 118,
  "oracle.svg": 231 / 30,
  "figma.svg": 200 / 300,
  "cisco.svg": 1,
  "meta.svg": 1,
  "shopify.svg": 1,
  "squarespace.svg": 1,
  "wix.svg": 1,
  "wordpress.svg": 1,
};

/** Optical size: compact marks draw taller so every logo reads at the same weight. */
const SCALE: Record<string, number> = {
  "salesforce.svg": 1.55,
  "aws.svg": 1.3,
  "oracle.svg": 0.62,
  "cisco.svg": 1.7,
  "wix.svg": 1.5,
};

/**
 * A partner's official logo (data/partners/partnerships.yaml), with its name beside it when the
 * logo is a symbol only. Without a logo file, the name alone.
 */
export function PartnerLogo({ partner, height = 28 }: { partner: Partner; height?: number }) {
  if (!partner.logo) return <span className="partner-logo-name">{partner.short}</span>;
  const h = Math.round(height * (SCALE[partner.logo] ?? 1));
  const width = Math.round(h * (RATIO[partner.logo] ?? 2));
  return (
    <span className="partner-logo">
      <Image
        src={`/partners/${partner.logo}`}
        alt={partner.wordmark ? partner.name : ""}
        width={width}
        height={h}
        unoptimized
        className="partner-logo-img"
        style={{ height: h, width: "auto" }}
      />
      {partner.wordmark ? null : <span className="partner-logo-name">{partner.short}</span>}
    </span>
  );
}
