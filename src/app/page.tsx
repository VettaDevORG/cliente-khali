import type { Metadata } from "next";
import { renderSections } from "@/blocks";
import { pageMetadata } from "@/lib/seo";
import { getSite, getT, homePage } from "@/lib/site";

export function generateMetadata(): Metadata {
  const site = getSite();
  return pageMetadata(site, {
    path: "/",
    title: `${site.trade_name} · ${site.web.copy.hero_title}`,
    description: site.web.copy.hero_subtitle,
    absoluteTitle: true,
  });
}

/** Home: the landing sections, or the sections of the page with slug "" in the full website. */
export default function HomePage() {
  const site = getSite();
  const t = getT(site);
  const sections = site.web.package === "landing" ? site.web.sections : (homePage(site)?.sections ?? []);
  return <>{renderSections(sections, site, t, { pagePath: "/", isHome: true })}</>;
}
