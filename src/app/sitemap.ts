import type { MetadataRoute } from "next";
import { getSite, hasServicePages, innerPages, servicePath, siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSite();
  const lastModified = new Date(site.generated_at);
  const entries: MetadataRoute.Sitemap = [{ url: siteUrl(site), lastModified, changeFrequency: "monthly", priority: 1 }];
  for (const p of innerPages(site)) {
    entries.push({ url: siteUrl(site, `/${p.slug}`), lastModified, changeFrequency: "monthly", priority: 0.8 });
  }
  if (hasServicePages(site)) {
    for (const s of site.business.services) {
      entries.push({ url: siteUrl(site, servicePath(s)), lastModified, changeFrequency: "monthly", priority: 0.7 });
    }
  }
  for (const legal of ["/aviso-legal", "/privacidad", "/cookies"]) {
    entries.push({ url: siteUrl(site, legal), lastModified, changeFrequency: "yearly", priority: 0.2 });
  }
  return entries;
}
