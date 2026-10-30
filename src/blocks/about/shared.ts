import type { ResolvedImage, SiteConfig } from "@/lib/ficha";
import type { Strings } from "@/lib/strings";

/** The photo of the about block: its own, else a gallery photo that is not the hero, else the hero. */
export function aboutImage(site: SiteConfig): ResolvedImage | null {
  if (site.assets.about) return site.assets.about;
  const other = site.assets.gallery.find((g) => g.src !== site.assets.hero?.src);
  return other ?? site.assets.hero ?? null;
}

export function aboutTitle(site: SiteConfig, t: Strings): string {
  return site.web.copy.about_title ?? t.sections.about;
}
