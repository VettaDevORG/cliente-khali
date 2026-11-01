import type { MetadataRoute } from "next";
import { getSite, isIndexable, siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const site = getSite();
  // Until the site is delivered (or if it is a sample) nothing is crawlable; the header X-Robots-Tag says the same.
  if (!isIndexable(site)) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/__forms.html"] }],
    sitemap: siteUrl(site, "/sitemap.xml"),
  };
}
