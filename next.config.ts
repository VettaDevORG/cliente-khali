import type { NextConfig } from "next";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Reads client/site.json for the things that live in the config: redirects from the old site and the
 * analytics id for the Content-Security-Policy. The kit without an active client still builds.
 */
type SiteLite = { web?: { redirects?: { from: string; to: string }[]; ga4_measurement_id?: string | null } };

function readSite(): SiteLite {
  const file = join(process.cwd(), "client", "site.json");
  if (!existsSync(file)) return {};
  try {
    return JSON.parse(readFileSync(file, "utf8")) as SiteLite;
  } catch {
    return {};
  }
}

const site = readSite();
const analytics = Boolean(site.web?.ga4_measurement_id);

const csp = [
  "default-src 'self'",
  // React needs eval() in development for its debugging tools; never in the production build.
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}${analytics ? " https://www.googletagmanager.com https://www.google-analytics.com" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  `img-src 'self' data: blob:${analytics ? " https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com" : ""}`,
  // The map loads only when the visitor clicks "Ver mapa".
  "frame-src https://www.google.com https://maps.google.com",
  `connect-src 'self'${analytics ? " https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com" : ""}`,
  "form-action 'self'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Content-Security-Policy", value: csp },
];

const nextConfig: NextConfig = {
  // The project is its own workspace root; without this, a lockfile in a parent folder makes Next guess wrong.
  turbopack: { root: process.cwd() },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  async redirects() {
    return (site.web?.redirects ?? []).map((r) => ({ source: r.from, destination: r.to, permanent: true }));
  },
};

export default nextConfig;
