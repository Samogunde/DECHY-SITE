import type { Metadata } from "next";
import type { Page } from "@/lib/content/schema";
import { DESCRIPTOR, SITE_NAME, absoluteUrl, indexingEnabled } from "@/lib/site";

export const OG_IMAGE = {
  path: "/og/dechy-technology-solutions-social-image.png",
  width: 1200,
  height: 630,
  alt: `${SITE_NAME}: ${DESCRIPTOR}`,
};

/** Search metadata for a page record. Indexing requires BOTH the page and the environment to allow it. */
export function pageMetadata(page: Page): Metadata {
  const url = absoluteUrl(page.path);
  const index = indexingEnabled() && page.indexing === "index";
  const image = absoluteUrl(OG_IMAGE.path);
  return {
    title: { absolute: page.title },
    description: page.description,
    alternates: { canonical: url },
    robots: index ? { index: true, follow: true } : { index: false, follow: false, nocache: true },
    openGraph: {
      type: "website",
      url,
      siteName: SITE_NAME,
      title: page.title,
      description: page.description,
      locale: "en_US",
      images: [{ url: image, width: OG_IMAGE.width, height: OG_IMAGE.height, alt: OG_IMAGE.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [{ url: image, alt: OG_IMAGE.alt }],
    },
  };
}
