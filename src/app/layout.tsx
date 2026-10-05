import type { Metadata, Viewport } from "next";
import { Manrope, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/patterns/SiteHeader";
import { SiteFooter } from "@/components/patterns/SiteFooter";
import { MotionProvider } from "@/components/primitives/MotionProvider";
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
  // No favicon has been supplied or approved, and none is invented. An empty data URL stops browsers
  // from requesting /favicon.ico (no 404 noise) until the owner supplies an approved mark.
  icons: { icon: [{ url: "data:," }] },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F7F6F2",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${sourceSans.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <SiteFooter />
        <MotionProvider />
      </body>
    </html>
  );
}
