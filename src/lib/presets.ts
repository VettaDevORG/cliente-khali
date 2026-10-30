import type { SectionId } from "./ficha";
import type { VariantCode } from "./variants";

export const PRESET_IDS = ["oficio", "sereno", "moderno", "editorial"] as const;
export type PresetId = (typeof PRESET_IDS)[number];

/**
 * A preset is a named look: which variant each block uses by default and a handful of design tokens
 * (corner radius, spacing, heading weight, soft background, shadows). Vettadev picks it from identity.design;
 * products.web.variants then overrides single blocks. Colors, fonts, texts and photos always come from the ficha,
 * so the same preset looks like a different brand for every client.
 */

export type MotionLevel = "none" | "calm" | "lively";

export type PresetTokens = {
  radiusCard: string;
  radiusButton: string;
  radiusMedia: string;
  /** Vertical padding of a section on phones and from sm up. */
  sectionYSm: string;
  sectionY: string;
  headingWeight: string;
  headingTracking: string;
  /** Background of the alternating "soft" sections. */
  softBg: string;
  cardShadow: string;
  /** How much things move: reveals on scroll, hero entrance, hover lifts. products.web.motion overrides it. */
  motion: MotionLevel;
};

export type Preset = {
  id: PresetId;
  name: string;
  description: string;
  forWhom: string;
  variants: Record<SectionId, VariantCode>;
  tokens: PresetTokens;
};

const TINT_SOFT = "color-mix(in srgb, var(--brand-primary) 6%, white)";

export const PRESETS: Record<PresetId, Preset> = {
  oficio: {
    id: "oficio",
    name: "Oficio",
    description: "Directo y sólido: esquinas poco redondeadas, títulos pesados, secciones compactas, botones a la vista.",
    forWhom: "Fontaneros, electricistas, cerrajeros, reformas, talleres.",
    variants: {
      hero: "01",
      about: "02",
      services: "01",
      pricing: "01",
      how_we_work: "01",
      testimonials: "01",
      gallery: "01",
      team: "01",
      service_area: "01",
      faq: "01",
      contact: "01",
      hours_address: "01",
      notice: "01",
    },
    tokens: {
      radiusCard: "0.75rem",
      radiusButton: "0.625rem",
      radiusMedia: "0.75rem",
      sectionYSm: "3rem",
      sectionY: "4.5rem",
      headingWeight: "800",
      headingTracking: "-0.025em",
      softBg: "#f3f4f6",
      cardShadow: "0 0 0 0 transparent",
      motion: "calm",
    },
  },
  sereno: {
    id: "sereno",
    name: "Sereno",
    description: "Mucho aire, esquinas suaves, títulos con peso medio y fondos teñidos del color principal.",
    forWhom: "Academias, clínicas, consultas, terapias, asesorías.",
    variants: {
      hero: "02",
      about: "01",
      services: "01",
      pricing: "02",
      how_we_work: "02",
      testimonials: "02",
      gallery: "02",
      team: "01",
      service_area: "01",
      faq: "01",
      contact: "02",
      hours_address: "01",
      notice: "02",
    },
    tokens: {
      radiusCard: "1.25rem",
      radiusButton: "9999px",
      radiusMedia: "1.5rem",
      sectionYSm: "4rem",
      sectionY: "6rem",
      headingWeight: "600",
      headingTracking: "-0.015em",
      softBg: TINT_SOFT,
      cardShadow: "0 1px 2px rgb(17 24 39 / 0.04), 0 8px 24px -12px rgb(17 24 39 / 0.12)",
      motion: "calm",
    },
  },
  moderno: {
    id: "moderno",
    name: "Moderno",
    description: "Portada a sangre, cifras, esquinas muy redondeadas, sombras suaves y franjas de color.",
    forWhom: "Gimnasios, estudios, agencias, tiendas con marca propia.",
    variants: {
      hero: "03",
      about: "03",
      services: "03",
      pricing: "02",
      how_we_work: "03",
      testimonials: "03",
      gallery: "03",
      team: "02",
      service_area: "02",
      faq: "02",
      contact: "01",
      hours_address: "02",
      notice: "01",
    },
    tokens: {
      radiusCard: "1.5rem",
      radiusButton: "9999px",
      radiusMedia: "1.75rem",
      sectionYSm: "3.5rem",
      sectionY: "5.5rem",
      headingWeight: "700",
      headingTracking: "-0.03em",
      softBg: "#f3f4f6",
      cardShadow: "0 1px 2px rgb(17 24 39 / 0.05), 0 12px 32px -16px rgb(17 24 39 / 0.18)",
      motion: "lively",
    },
  },
  editorial: {
    id: "editorial",
    name: "Editorial",
    description: "Esquinas rectas, listas con líneas finas en vez de tarjetas, tipografía protagonista y fondo cálido.",
    forWhom: "Restaurantes, estudios de arquitectura y fotografía, artesanos, abogados.",
    variants: {
      hero: "02",
      about: "01",
      services: "02",
      pricing: "01",
      how_we_work: "02",
      testimonials: "02",
      gallery: "02",
      team: "02",
      service_area: "02",
      faq: "02",
      contact: "02",
      hours_address: "02",
      notice: "02",
    },
    tokens: {
      radiusCard: "0.25rem",
      radiusButton: "0.25rem",
      radiusMedia: "0.25rem",
      sectionYSm: "4rem",
      sectionY: "6.5rem",
      headingWeight: "500",
      headingTracking: "-0.02em",
      softBg: "#f6f3ee",
      cardShadow: "0 0 0 0 transparent",
      motion: "calm",
    },
  },
};

export const DEFAULT_PRESET: PresetId = "sereno";

export function getPreset(id: string | null | undefined): Preset {
  return PRESETS[id && (PRESET_IDS as readonly string[]).includes(id) ? (id as PresetId) : DEFAULT_PRESET];
}

export function presetCssVars(p: Preset): Record<string, string> {
  const t = p.tokens;
  return {
    "--kit-radius-card": t.radiusCard,
    "--kit-radius-btn": t.radiusButton,
    "--kit-radius-media": t.radiusMedia,
    "--kit-section-y-sm": t.sectionYSm,
    "--kit-section-y": t.sectionY,
    "--kit-heading-weight": t.headingWeight,
    "--kit-heading-tracking": t.headingTracking,
    "--kit-soft-bg": t.softBg,
    "--kit-card-shadow": t.cardShadow,
    ...motionCssVars(t.motion),
  };
}

/** Reveal distance, duration and hover lift by motion level; "none" keeps everything static and visible. */
export function motionCssVars(level: MotionLevel): Record<string, string> {
  if (level === "none") return { "--kit-reveal-y": "0px", "--kit-reveal-duration": "0s", "--kit-hover-lift": "0px" };
  if (level === "calm") return { "--kit-reveal-y": "10px", "--kit-reveal-duration": "0.55s", "--kit-hover-lift": "-2px" };
  return { "--kit-reveal-y": "22px", "--kit-reveal-duration": "0.7s", "--kit-hover-lift": "-4px" };
}

/** The motion level of a site: products.web.motion when set, else the preset token. */
export function resolveMotion(preset: Preset, override: string | null | undefined): MotionLevel {
  return override === "none" || override === "calm" || override === "lively" ? override : preset.tokens.motion;
}
