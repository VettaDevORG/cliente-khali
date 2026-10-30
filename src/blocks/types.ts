import type { JSX } from "react";
import type { SectionTone } from "@/components/ui";
import type { SectionId, Service, SiteConfig } from "@/lib/ficha";
import type { Strings } from "@/lib/strings";
import type { VariantCode } from "@/lib/variants";

export type BlockContext = {
  /** Path of the page the block is rendered on, for CTAs that point to another page. */
  pagePath: string;
  isHome: boolean;
  /** Background chosen by the renderer so consecutive blocks alternate. */
  tone: SectionTone;
  /** Set on service pages: the block adapts (services lists the others, pricing shows this one). */
  service?: Service;
  /** True when the page header already shows this block's title (an inner page named like its first block). */
  hideTitle?: boolean;
  /** Anchor id of the section; the renderer sets it so the catalog can render a block more than once. */
  anchor: string;
};

export type BlockProps = { site: SiteConfig; t: Strings; ctx: BlockContext };

export type VariantComponent = (props: BlockProps) => JSX.Element;

/** A block folder exports one of these: the components of its variants, keyed by code. Names live in lib/variants.ts. */
export type BlockDef = {
  id: SectionId;
  variants: Partial<Record<VariantCode, VariantComponent>>;
};
