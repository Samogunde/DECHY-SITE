import type { MetadataRoute } from "next";
import { DESCRIPTOR, SITE_NAME } from "@/lib/site";

/** Web app manifest: the approved DECHY monogram as the app icon (scripts/brand-derivatives.ts). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME}: ${DESCRIPTOR}`,
    short_name: SITE_NAME,
    start_url: "/",
    display: "browser",
    background_color: "#F7F6F2",
    theme_color: "#F7F6F2",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
