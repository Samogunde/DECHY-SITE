import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

/**
 * Content Security Policy.
 *
 * Next.js static pages carry inline bootstrap scripts, so `script-src` must allow 'unsafe-inline'
 * unless nonces are used, and nonces would force dynamic rendering of every page. The policy
 * compensates by locking down everything else (no objects, no framing, no foreign origins, no
 * foreign form targets, no base-tag hijack). Revisit with hash/SRI-based CSP when Next.js support
 * for static hashing is stable. Applied in production builds only because dev tooling needs eval.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "accelerometer=(), autoplay=(), camera=(), display-capture=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), interest-cohort=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  trailingSlash: true,
  poweredByHeader: false,
  // Next.js can append an agent-rules block to AGENTS.md during `next dev`. AGENTS.md is the
  // governing DECHY specification and must only change by owner-approved edit, so it is disabled.
  agentRules: false,
  reactStrictMode: true,
  // The API and admin routes read the content registry (content/ and data/ YAML) at request time.
  // File access is excluded from automatic tracing (so the whole project is never bundled), so the
  // files those routes need are declared here.
  outputFileTracingIncludes: {
    "/api/**/*": ["./content/**/*.yaml", "./data/**/*.yaml"],
    "/admin/**/*": ["./content/**/*.yaml", "./data/**/*.yaml"],
  },
  images: {
    // WebP only: at the same visual budget AVIF measurably softened photographic detail (hair,
    // fabric, on-screen text). Photographs use quality 85, the logo 92.
    formats: ["image/webp"],
    qualities: [85, 92],
    // On Netlify, request the Image CDN directly with an explicit WebP format (it would otherwise
    // pick AVIF from the Accept header). Local and test builds use the built-in optimizer.
    ...(process.env.NETLIFY === "true"
      ? { loader: "custom" as const, loaderFile: "./src/lib/netlify-image-loader.ts" }
      : {}),
    deviceSizes: [320, 360, 390, 430, 640, 768, 1024, 1280, 1440, 1920, 2560, 2880],
    imageSizes: [16, 32, 64, 96, 128, 256, 384],
  },
  async headers() {
    if (!isProd) return [];
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
