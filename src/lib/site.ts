import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { SiteConfigSchema, type SiteConfig, type Page, type Service } from "./ficha";
import { getStrings, type Strings } from "./strings";

/**
 * The generated site reads one file: client/site.json. It is written by `npm run use -- <fixture>` in the kit
 * and by `new-client` in a client repo. Server components only; never import this from a client component.
 */
const SITE_PATH = join(process.cwd(), "client", "site.json");

let cached: SiteConfig | undefined;
let cachedStamp = 0;

export function getSite(): SiteConfig {
  if (!existsSync(SITE_PATH)) {
    throw new Error(
      "No existe client/site.json. En el kit ejecuta `npm run use -- fontanero` (o academia). En un repo de cliente, vuelve a generar con new-client.",
    );
  }
  // Cached by modification time, so `npm run use -- <fixture>` takes effect in a running dev server.
  const stamp = statSync(SITE_PATH).mtimeMs;
  if (cached && cachedStamp === stamp) return cached;
  cached = SiteConfigSchema.parse(JSON.parse(readFileSync(SITE_PATH, "utf8")));
  cachedStamp = stamp;
  return cached;
}

export function getT(site: SiteConfig = getSite()): Strings {
  return getStrings(site.brand.tone);
}

export function siteUrl(site: SiteConfig, path = "/"): string {
  return `https://${site.web.domain}${path === "/" ? "" : path}`;
}

export function homePage(site: SiteConfig): Page | undefined {
  return site.web.pages.find((p) => p.slug === "");
}

export function innerPages(site: SiteConfig): Page[] {
  return site.web.pages.filter((p) => p.slug !== "");
}

export function pagePath(page: Page): string {
  return page.slug === "" ? "/" : `/${page.slug}`;
}

export function servicePath(service: Service): string {
  return `/servicios/${service.id}`;
}

export function hasServicePages(site: SiteConfig): boolean {
  return site.web.package === "web" && site.web.service_pages;
}

/**
 * Absolute link to the given section: on the current page if it has it, otherwise on the first page that does.
 * Absolute paths work from any page, and on the same page the browser treats them as a plain anchor jump.
 */
export function sectionHref(site: SiteConfig, section: "contact" | "services", anchor: string, currentPath: string): string {
  if (site.web.package === "landing") return `/#${anchor}`;
  const current = site.web.pages.find((p) => pagePath(p) === currentPath && p.sections.includes(section));
  const page = current ?? site.web.pages.find((p) => p.sections.includes(section));
  if (!page) return "/";
  return `${pagePath(page)}#${anchor}`;
}
