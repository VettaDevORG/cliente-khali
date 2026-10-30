import type { SectionId, SiteConfig } from "./ficha";
import { telHref, whatsappUrl } from "./format";
import { pagePath, sectionHref } from "./site";
import type { Strings } from "./strings";

/** Anchor of each block inside a page. Also the id used by the navigation. */
export const ANCHORS: Record<SectionId, string> = {
  hero: "inicio",
  about: "nosotros",
  services: "servicios",
  pricing: "precios",
  how_we_work: "como-trabajamos",
  testimonials: "opiniones",
  gallery: "galeria",
  team: "equipo",
  service_area: "zona",
  faq: "preguntas",
  contact: "contacto",
  hours_address: "horario",
  notice: "aviso",
};

/** Sections that do not get a navigation entry. */
const NO_NAV: SectionId[] = ["hero", "notice"];

export type NavItem = { href: string; label: string };
export type Cta = { href: string; label: string; shortLabel: string; kind: "whatsapp" | "call" | "form"; external: boolean };

export function buildNav(site: SiteConfig, t: Strings): NavItem[] {
  if (site.web.package === "landing") {
    // "/#ancla", not "#ancla": from the legal pages or the 404 a bare anchor would do nothing.
    return site.web.sections
      .filter((id) => !NO_NAV.includes(id))
      .map((id) => ({ href: `/#${ANCHORS[id]}`, label: t.navLabels[id] ?? t.sections[id] }));
  }
  return site.web.pages.map((p) => ({ href: pagePath(p), label: p.slug === "" ? t.home : p.title }));
}

export function buildCta(site: SiteConfig, t: Strings, currentPath: string): Cta {
  switch (site.web.primary_cta) {
    case "call":
      return { href: telHref(site.business.phone), label: t.cta.call, shortLabel: t.cta.callShort, kind: "call", external: false };
    case "form":
      return {
        href: sectionHref(site, "contact", ANCHORS.contact, currentPath),
        label: t.cta.form,
        shortLabel: t.cta.formShort,
        kind: "form",
        external: false,
      };
    default:
      return {
        href: whatsappUrl(site.business.whatsapp.number, site.business.whatsapp.prefilled_message),
        label: t.cta.whatsapp,
        shortLabel: t.cta.whatsappShort,
        kind: "whatsapp",
        external: true,
      };
  }
}

/** The secondary channel shown next to the primary one in the sticky bar and the hero. */
export function secondaryCta(site: SiteConfig, t: Strings, primary: Cta): Cta | null {
  if (primary.kind !== "call" && site.business.phone) {
    return { href: telHref(site.business.phone), label: t.cta.call, shortLabel: t.cta.callShort, kind: "call", external: false };
  }
  if (primary.kind === "call" && site.business.whatsapp.number) {
    return {
      href: whatsappUrl(site.business.whatsapp.number, site.business.whatsapp.prefilled_message),
      label: t.cta.whatsapp,
      shortLabel: t.cta.whatsappShort,
      kind: "whatsapp",
      external: true,
    };
  }
  return null;
}
