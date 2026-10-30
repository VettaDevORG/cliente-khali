import type { MetadataRoute } from "next";
import { getSite, siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const site = getSite();
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/__forms.html"] }],
    sitemap: siteUrl(site, "/sitemap.xml"),
  };
}
