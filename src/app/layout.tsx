import type { Metadata, Viewport } from "next";
import { Manrope, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { DESCRIPTOR, SITE_NAME, indexingEnabled, siteOrigin } from "@/lib/site";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin()),
  applicationName: SITE_NAME,
  title: { default: `${SITE_NAME} | ${DESCRIPTOR}`, template: "%s" },
  robots: indexingEnabled()
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
  formatDetection: { telephone: false, email: false, address: false },
  // Icons come from the approved DECHY monogram (scripts/brand-derivatives.ts): favicon.ico,
  // icon.png, and apple-icon.png in this folder are picked up by Next.js; manifest.ts adds the
  // larger app icons.
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F7F6F2",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${sourceSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
