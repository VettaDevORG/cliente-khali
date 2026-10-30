import type { JSX } from "react";
import { chosenVariant, sectionInputFromSite, sectionIssues, type SectionId, type Service, type SiteConfig } from "@/lib/ficha";
import { ANCHORS } from "@/lib/nav";
import type { Strings } from "@/lib/strings";
import { describeFallback, resolveVariant, variantMeta, type VariantCode } from "@/lib/variants";
import type { BlockContext, BlockDef } from "./types";
import about from "./about";
import contact from "./contact";
import faq from "./faq";
import gallery from "./gallery";
import hero from "./hero";
import hoursAddress from "./hours-address";
import howWeWork from "./how-we-work";
import notice from "./notice";
import pricing from "./pricing";
import serviceArea from "./service-area";
import services from "./services";
import team from "./team";
import testimonials from "./testimonials";

/**
 * The closed catalog, by block id. Each folder in src/blocks exports its variants keyed by code; the numbers,
 * names and requirements live in src/lib/variants.ts so the scripts can validate without React.
 * Adding a variant: a file in the block folder, a line in its index.tsx, an entry in variants.ts, a line in docs/bloques.md.
 */
export const BLOCKS: Record<SectionId, BlockDef> = {
  hero,
  about,
  services,
  pricing,
  how_we_work: howWeWork,
  testimonials,
  gallery,
  team,
  service_area: serviceArea,
  faq,
  contact,
  hours_address: hoursAddress,
  notice,
};

export type RenderBase = { pagePath: string; isHome: boolean; service?: Service; pageTitle?: string };

/** Renders one block in one variant. Used by renderSections and by the catalog page (/kit). */
export function renderBlock(id: SectionId, code: VariantCode, site: SiteConfig, t: Strings, ctx: BlockContext, key?: string): JSX.Element {
  const def = BLOCKS[id];
  const Component = def.variants[code] ?? def.variants["01"]!;
  return <Component key={key ?? `${id}-${code}`} site={site} t={t} ctx={ctx} />;
}

/**
 * Renders the sections of a page in order, each in the variant the ficha asks for (products.web.variants) or the
 * preset default. A block whose data is missing is skipped with a build warning, and a variant whose data is
 * missing falls back to one that works; the page never shows sample text or an empty frame.
 */
export function renderSections(sections: SectionId[], site: SiteConfig, t: Strings, base: RenderBase): JSX.Element[] {
  const input = sectionInputFromSite(site);
  let alternating = 0;
  const out: JSX.Element[] = [];
  const { pageTitle, ...rest } = base;
  sections.forEach((id, i) => {
    const issues = sectionIssues(id, input);
    if (issues.length > 0) {
      console.warn(`[web-kit] bloque "${id}" omitido en ${base.pagePath}: ${issues.join("; ")}`);
      return;
    }
    const resolved = resolveVariant(id, chosenVariant(site.web, id), input);
    const fallback = describeFallback(id, resolved);
    if (fallback) console.warn(`[web-kit] ${base.pagePath}: ${fallback}`);
    const alternates = variantMeta(id, resolved.code).alternates !== false;
    const tone = alternates ? (alternating++ % 2 === 0 ? "default" : "soft") : "default";
    // An inner page called "Equipo" whose first block is team would show the title twice.
    const hideTitle = out.length === 0 && pageTitle !== undefined && t.sections[id] === pageTitle;
    out.push(renderBlock(id, resolved.code, site, t, { ...rest, tone, hideTitle, anchor: ANCHORS[id] }, `${id}-${i}`));
  });
  return out;
}
