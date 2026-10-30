import { z } from "zod";
import { getPreset, PRESET_IDS } from "./presets";
import { BLOCK_META, blockLabel, describeFallback, normalizeVariant, resolveVariant, type VariantCode } from "./variants";

/**
 * Client record ("ficha") schema, version 1.
 * The core is defined by vettadev-ops (clientes/README.md). This repo only adds fields inside
 * `products.web`; every addition is listed in docs/ficha-web.md.
 */

/** The closed catalog of blocks, in catalog order (01..13). Variants and names: src/lib/variants.ts. */
export const SECTION_IDS = [
  "hero",
  "about",
  "services",
  "pricing",
  "how_we_work",
  "testimonials",
  "gallery",
  "team",
  "service_area",
  "faq",
  "contact",
  "hours_address",
  "notice",
] as const;
export type SectionId = (typeof SECTION_IDS)[number];
export const SectionIdSchema = z.enum(SECTION_IDS);

/** Named looks: default variant per block plus design tokens. Defined in src/lib/presets.ts. */
export const PresetIdSchema = z.enum(PRESET_IDS);
export type { PresetId } from "./presets";

export const MAX_LANDING_SECTIONS = 6;
export const MAX_WEB_PAGES = 6;
/** Slugs the kit uses for its own routes; a page in products.web.pages cannot take them. */
export const RESERVED_SLUGS = ["servicios", "aviso-legal", "privacidad", "cookies", "kit"];

const nullableString = z.string().nullable().optional();
const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, "color hex de 6 dígitos, por ejemplo #0B5FA5");
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "fecha AAAA-MM-DD");
const slugString = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "minúsculas, números y guiones");

export const AddressSchema = z.object({
  street: z.string(),
  postal_code: z.string(),
  city: z.string(),
  province: z.string(),
  country: z.string().default("ES"),
});

export const OpeningHoursSchema = z.object({
  days: z.string(),
  open: z.string().regex(/^\d{1,2}:\d{2}$/),
  close: z.string().regex(/^\d{1,2}:\d{2}$/),
});

export const ServiceSchema = z.object({
  id: slugString,
  name: z.string(),
  description: z.string(),
  price: z.number().nullable(),
  price_type: z.enum(["fixed", "from", "quote", "hidden"]),
  duration_minutes: z.number().nullable().optional(),
  bookable: z.boolean().optional().default(false),
});

export const FaqSchema = z.object({ question: z.string(), answer: z.string() });

export const TestimonialSchema = z.object({
  name: z.string(),
  text: z.string(),
  url: nullableString,
});

export const PoliciesSchema = z.object({
  booking: nullableString,
  cancellation: nullableString,
  payment: nullableString,
  not_offered: nullableString,
});

export const SocialSchema = z.object({
  instagram: nullableString,
  facebook: nullableString,
  linkedin: nullableString,
  tiktok: nullableString,
  google_business: nullableString,
});

export const BusinessSchema = z.object({
  description: z.string(),
  sector: z.string(),
  language: z.string().default("es"),
  extra_languages: z.array(z.string()).default([]),
  address: AddressSchema,
  service_area: z.string(),
  opening_hours: z.array(OpeningHoursSchema),
  holidays: z.array(isoDate).default([]),
  phone: z.string(),
  whatsapp: z.object({ number: z.string(), prefilled_message: z.string() }),
  public_email: z.string(),
  social: SocialSchema.default({}),
  services: z.array(ServiceSchema),
  faq: z.array(FaqSchema).default([]),
  testimonials: z.array(TestimonialSchema).default([]),
  policies: PoliciesSchema.default({}),
});

export const IdentitySchema = z.object({
  about: z.string(),
  mission: z.string(),
  values: z.array(z.string()),
  audience: z.string(),
  personality: z.array(z.string()),
  differentiators: z.array(z.string()),
  design: z.object({
    direction: z.string(),
    mood: z.array(z.string()),
    references: z.array(z.object({ url: z.string(), what_we_like: z.string() })).default([]),
    avoid: z.array(z.string()).default([]),
    imagery: z.string(),
  }),
});

export const BrandSchema = z.object({
  logo: z.string().nullable(),
  colors: z.object({ primary: hexColor, secondary: hexColor }),
  font: z.enum(["a", "b", "c"]),
  tone: z.enum(["tu", "usted"]),
  assistant_name: nullableString,
});

export const LegalSchema = z.object({
  owner: z.string(),
  tax_id: z.string(),
  address: z.string(),
  privacy_email: z.string(),
  dpa_signed: nullableString,
  health_data: z.boolean().default(false),
});

export const ProfessionalRegistrySchema = z
  .object({ body: nullableString, number: nullableString })
  .nullable()
  .optional();

export const CompanySchema = z.object({
  trade_name: z.string(),
  legal_name: z.string(),
  tax_id: z.string(),
  address: AddressSchema,
  commercial_registry: nullableString,
  professional_registry: ProfessionalRegistrySchema,
  billing_email: z.string().optional(),
  contact: z
    .object({ name: z.string(), phone: z.string(), email: z.string(), whatsapp: z.string().optional() })
    .optional(),
  approver: z.object({ name: z.string(), email: z.string() }).optional(),
});

/* ---------- products.web: core fields plus the ones this repo adds ---------- */

export const PageSchema = z.object({
  /** "" is the home page. */
  slug: z.string().regex(/^[a-z0-9]*(?:-[a-z0-9]+)*$/, "minúsculas, números y guiones; vacío para la portada"),
  title: z.string(),
  description: z.string().optional(),
  sections: z.array(SectionIdSchema).min(1),
});

export const StepSchema = z.object({ title: z.string(), text: z.string() });

export const ImageRefSchema = z.object({
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
});

export const TeamMemberSchema = z.object({
  name: z.string(),
  role: z.string(),
  photo: z.string().optional(),
  bio: z.string().optional(),
});

export const ServiceCopySchema = z.object({
  intro: z.string().optional(),
  includes: z.array(z.string()).optional(),
  /** Overrides the automatic price text, e.g. "89 €/mes". */
  price_label: z.string().optional(),
});

export const StatSchema = z.object({
  /** Short figure as shown: "15", "4", "100 %", "0 €". */
  value: z.string(),
  /** What the figure is: "años en la zona sur". */
  label: z.string(),
});

export const WebCopySchema = z.object({
  hero_title: z.string(),
  hero_subtitle: z.string(),
  why_us: z.string(),
  how_we_work: z.array(StepSchema).max(4).optional(),
  notice: z.object({ text: z.string(), link: z.string().optional(), link_label: z.string().optional() }).optional(),
  services: z.record(z.string(), ServiceCopySchema).optional(),
  // Added by vettadev-web-kit (docs/ficha-web.md)
  /** Title of the "about" block; default "Quiénes somos". */
  about_title: z.string().optional(),
  /** Figures for the "about" block, variant 03 Cifras. */
  stats: z.array(StatSchema).max(4).optional(),
});

export const ProductsWebSchema = z.object({
  package: z.enum(["landing", "web"]),
  domain: z.string(),
  domain_registrar: z.string().nullable().optional(),
  domain_owned_by_client: z.boolean().default(true),
  email_provider: z.string().nullable().optional(),
  sections: z.array(SectionIdSchema).default([]),
  pages: z.array(PageSchema).default([]),
  form_recipients: z.array(z.string()).min(1),
  ga4_measurement_id: nullableString,
  search_console: z.boolean().default(false),
  google_business: z.boolean().default(false),
  photos: z.enum(["own", "stock"]),
  copy: WebCopySchema,
  extras: z.array(z.string()).default([]),
  // Added by vettadev-web-kit (docs/ficha-web.md)
  primary_cta: z.enum(["whatsapp", "call", "form"]).default("whatsapp"),
  /** Named look (default variants + design tokens). Missing: "sereno" with a warning. */
  preset: PresetIdSchema.optional(),
  /** Variant per block, by code ("02"), slug ("centrado") or both ("02-centrado"). Overrides the preset. */
  variants: z.record(z.string(), z.string()).default({}),
  /** How much the page moves (reveals, hero entrance, hover lifts). Missing: the preset decides. "none" for clients who asked for no animation. */
  motion: z.enum(["none", "calm", "lively"]).optional(),
  images: z
    .object({
      /** Path relative to the ficha folder, or { src, alt }. */
      hero: z.union([z.string(), ImageRefSchema]).optional(),
      /** Photo for the "about" block; falls back to the bank slot "about", then to the gallery. */
      about: z.union([z.string(), ImageRefSchema]).optional(),
      gallery: z.array(ImageRefSchema).optional(),
      services: z.record(z.string(), z.union([z.string(), ImageRefSchema])).optional(),
    })
    .default({}),
  team: z.array(TeamMemberSchema).default([]),
  /**
   * Short clip for the hero (mp4 H.264 for every browser, or webm), muted and looping, relative to the ficha folder.
   * The poster is images.hero (own or bank) unless `poster` is given. Plays only when visible and when motion is on.
   */
  video: z
    .object({
      hero: z.union([z.string(), z.object({ src: z.string(), poster: z.string().optional() })]).optional(),
    })
    .default({}),
  service_pages: z.boolean().default(false),
  redirects: z.array(z.object({ from: z.string(), to: z.string() })).default([]),
});

export const FichaSchema = z
  .object({
    schema_version: z.literal(1),
    slug: slugString,
    status: z.enum(["onboarding", "building", "delivered", "churned"]).optional(),
    company: CompanySchema,
    business: BusinessSchema,
    identity: IdentitySchema,
    brand: BrandSchema,
    legal: LegalSchema,
    products: z.object({ web: ProductsWebSchema.nullable() }).loose(),
  })
  .loose();

export type Ficha = z.infer<typeof FichaSchema>;
export type ProductsWeb = z.infer<typeof ProductsWebSchema>;
export type Service = z.infer<typeof ServiceSchema>;
export type Page = z.infer<typeof PageSchema>;
export type Business = z.infer<typeof BusinessSchema>;
export type Identity = z.infer<typeof IdentitySchema>;
export type Stat = z.infer<typeof StatSchema>;
export type OpeningHours = z.infer<typeof OpeningHoursSchema>;

/* ---------- SiteConfig: what the generated site ships with ---------- */

export const ResolvedImageSchema = z.object({
  src: z.string(),
  alt: z.string(),
  width: z.number(),
  height: z.number(),
  caption: z.string().optional(),
  credit: z.string().optional(),
});
export type ResolvedImage = z.infer<typeof ResolvedImageSchema>;

export const FontFaceSchema = z.object({
  family: z.string(),
  src: z.string(),
  weights: z.string(),
  fallback: z.string(),
});
export type FontFace = z.infer<typeof FontFaceSchema>;

export const SiteConfigSchema = z.object({
  schema_version: z.literal(1),
  slug: slugString,
  trade_name: z.string(),
  generated_at: isoDate,
  business: BusinessSchema,
  identity: IdentitySchema,
  brand: BrandSchema,
  legal: LegalSchema.extend({ professional_registry: ProfessionalRegistrySchema }),
  web: ProductsWebSchema.omit({ images: true, team: true, video: true }),
  assets: z.object({
    logo: z.object({ src: z.string(), width: z.number(), height: z.number() }).nullable(),
    hero: ResolvedImageSchema.nullable(),
    /** The hero clip, if the client gave one; its poster is `hero`. */
    hero_video: z.object({ src: z.string(), type: z.string() }).nullable().default(null),
    about: ResolvedImageSchema.nullable().default(null),
    gallery: z.array(ResolvedImageSchema),
    services: z.record(z.string(), ResolvedImageSchema),
  }),
  team: z.array(TeamMemberSchema.omit({ photo: true }).extend({ photo: ResolvedImageSchema.optional() })),
  fonts: z.object({ body: FontFaceSchema, heading: FontFaceSchema.nullable() }),
});
export type SiteConfig = z.infer<typeof SiteConfigSchema>;

/* ---------- Rules beyond the schema ---------- */

export type Issue = { level: "error" | "warning"; path: string; message: string };

/** What each section needs, expressed so that it can be read from a ficha or from a generated site. */
export type SectionInput = {
  business: Business;
  identity: Identity;
  copy: z.infer<typeof WebCopySchema>;
  primaryCta: "whatsapp" | "call" | "form";
  formRecipients: number;
  teamCount: number;
  /** null while stock photos are not resolved yet (the bank will fill the gallery). */
  galleryCount: number | null;
  /** null while stock photos are not resolved yet. */
  heroImage: boolean | null;
  aboutImage: boolean | null;
};

export function sectionInputFromFicha(ficha: Ficha): SectionInput {
  const web = ficha.products.web!;
  const stock = web.photos === "stock";
  return {
    business: ficha.business,
    identity: ficha.identity,
    copy: web.copy,
    primaryCta: web.primary_cta,
    formRecipients: web.form_recipients.length,
    teamCount: web.team.length,
    galleryCount: stock ? null : (web.images.gallery?.length ?? 0),
    heroImage: web.images.hero ? true : stock ? null : false,
    aboutImage: web.images.about ? true : stock ? null : false,
  };
}

export function sectionInputFromSite(site: SiteConfig): SectionInput {
  return {
    business: site.business,
    identity: site.identity,
    copy: site.web.copy,
    primaryCta: site.web.primary_cta,
    formRecipients: site.web.form_recipients.length,
    teamCount: site.team.length,
    galleryCount: site.assets.gallery.length,
    heroImage: site.assets.hero !== null,
    aboutImage: site.assets.about !== null,
  };
}

/** The variant asked for a block: products.web.variants when set and valid, otherwise the preset default. */
export function chosenVariant(web: { preset?: string | null; variants: Record<string, string> }, id: SectionId): VariantCode {
  const raw = web.variants[id];
  return (raw && normalizeVariant(id, raw)) || getPreset(web.preset).variants[id];
}

/** Which ficha fields each section needs. Used by `check` and by the renderer to skip empty blocks. */
export function sectionIssues(id: SectionId, input: SectionInput): string[] {
  const b = input.business;
  const copy = input.copy;
  switch (id) {
    case "hero":
      return [
        !copy.hero_title && "falta products.web.copy.hero_title",
        !copy.hero_subtitle && "falta products.web.copy.hero_subtitle",
      ].filter(Boolean) as string[];
    case "about":
      return input.identity.about.trim() ? [] : ["falta identity.about"];
    case "services":
      return b.services.length === 0 ? ["business.services está vacío"] : [];
    case "pricing":
      return b.services.some((s) => s.price_type === "fixed" || s.price_type === "from")
        ? []
        : ["ningún servicio tiene price_type fixed o from; el bloque pricing no tiene nada que mostrar"];
    case "how_we_work":
      return copy.how_we_work && copy.how_we_work.length >= 2 ? [] : ["products.web.copy.how_we_work necesita al menos 2 pasos"];
    case "testimonials":
      return b.testimonials.length === 0 ? ["business.testimonials está vacío"] : [];
    case "gallery":
      return input.galleryCount === 0 ? ["no hay fotos para la galería: añade products.web.images.gallery o pon photos en stock"] : [];
    case "team":
      return input.teamCount === 0 ? ["products.web.team está vacío"] : [];
    case "service_area":
      return !b.service_area ? ["falta business.service_area"] : [];
    case "faq":
      return b.faq.length === 0 ? ["business.faq está vacío"] : [];
    case "contact":
      return input.formRecipients === 0 ? ["products.web.form_recipients está vacío"] : [];
    case "hours_address":
      return b.opening_hours.length === 0 ? ["business.opening_hours está vacío"] : [];
    case "notice":
      return copy.notice?.text ? [] : ["falta products.web.copy.notice.text"];
  }
}

export function webIssues(ficha: Ficha): Issue[] {
  const issues: Issue[] = [];
  const web = ficha.products.web;
  if (!web) return [{ level: "error", path: "products.web", message: "products.web es null: este cliente no tiene web contratada" }];
  const input = sectionInputFromFicha(ficha);
  const err = (path: string, message: string) => issues.push({ level: "error", path, message });
  const warn = (path: string, message: string) => issues.push({ level: "warning", path, message });

  if (web.package === "landing") {
    if (web.sections.length === 0) err("products.web.sections", "una landing necesita secciones");
    if (web.sections.length > MAX_LANDING_SECTIONS)
      warn("products.web.sections", `${web.sections.length} secciones; el paquete incluye ${MAX_LANDING_SECTIONS} (50 € por sección extra según el alcance)`);
    if (web.pages.length > 0) err("products.web.pages", "una landing no tiene páginas; usa sections");
    if (web.service_pages) err("products.web.service_pages", "las páginas por servicio son de la web completa");
    if (!web.sections.includes("hero")) warn("products.web.sections", "no hay hero; la portada empieza sin titular");
    if (!web.sections.includes("contact")) warn("products.web.sections", "no hay contact; la landing no tiene formulario");
    for (const id of web.sections) for (const m of sectionIssues(id, input)) err(`products.web.sections[${id}]`, m);
  } else {
    if (web.pages.length === 0) err("products.web.pages", "una web completa necesita páginas");
    if (web.sections.length > 0) warn("products.web.sections", "en la web completa se ignora sections; cada página lleva las suyas");
    if (!web.pages.find((p) => p.slug === "")) err("products.web.pages", "falta la portada: una página con slug vacío");
    const slugs = new Set<string>();
    for (const p of web.pages) {
      if (slugs.has(p.slug)) err(`products.web.pages[${p.slug}]`, "slug repetido");
      slugs.add(p.slug);
      if (RESERVED_SLUGS.includes(p.slug)) err(`products.web.pages[${p.slug}]`, "slug reservado por el kit");
      for (const id of p.sections) for (const m of sectionIssues(id, input)) err(`products.web.pages[${p.slug}].${id}`, m);
    }
    const total = web.pages.length + (web.service_pages ? ficha.business.services.length : 0);
    if (total > MAX_WEB_PAGES)
      warn("products.web.pages", `${total} páginas contando las de servicio; el paquete incluye ${MAX_WEB_PAGES} (90 € por página extra según el alcance)`);
    if (web.service_pages) {
      for (const s of ficha.business.services) {
        if (!web.copy.services?.[s.id]?.intro)
          warn(`products.web.copy.services.${s.id}.intro`, "la página del servicio solo tendrá la frase de business.services; conviene un intro");
      }
    }
  }

  const ids = new Set(ficha.business.services.map((s) => s.id));
  for (const id of Object.keys(web.copy.services ?? {})) if (!ids.has(id)) err(`products.web.copy.services.${id}`, "no hay ningún servicio con ese id");
  for (const id of Object.keys(web.images.services ?? {})) if (!ids.has(id)) err(`products.web.images.services.${id}`, "no hay ningún servicio con ese id");

  const usesSection = (id: SectionId) =>
    web.package === "landing" ? web.sections.includes(id) : web.pages.some((p) => p.sections.includes(id));
  if (web.primary_cta === "form" && !usesSection("contact"))
    err("products.web.primary_cta", "primary_cta es form pero ninguna página tiene el bloque contact");

  // Look: preset and per-block variants (src/lib/variants.ts, src/lib/presets.ts)
  if (!web.preset) warn("products.web.preset", `sin preset; se usa "sereno". Elige uno leyendo identity.design: ${PRESET_IDS.join(", ")}`);
  for (const [key, raw] of Object.entries(web.variants)) {
    if (!(SECTION_IDS as readonly string[]).includes(key)) {
      err(`products.web.variants.${key}`, `no existe el bloque "${key}"; los ids son ${SECTION_IDS.join(", ")}`);
      continue;
    }
    const id = key as SectionId;
    const code = normalizeVariant(id, raw);
    if (!code) {
      err(`products.web.variants.${id}`, `"${raw}" no es una variante de ${blockLabel(id)}: ${BLOCK_META[id].variants.map((v) => `${v.code} ${v.name}`).join(", ")}`);
      continue;
    }
    if (!usesSection(id)) warn(`products.web.variants.${id}`, `el bloque ${blockLabel(id)} no se usa en ninguna página`);
  }
  for (const id of SECTION_IDS) {
    if (!usesSection(id)) continue;
    const chosen = chosenVariant(web, id);
    const line = describeFallback(id, resolveVariant(id, chosen, input));
    if (line) warn(`products.web.variants.${id}`, line);
  }
  if (web.photos === "own" && !web.images.hero && usesSection("hero"))
    err("products.web.images.hero", "photos es own y no hay foto de portada; añade images.hero o cambia photos a stock");
  if (!web.ga4_measurement_id) warn("products.web.ga4_measurement_id", "sin GA4: no habrá analítica ni banner de cookies hasta que se rellene");
  if (ficha.business.testimonials.length > 0 && ficha.business.testimonials.length < 3)
    warn("business.testimonials", "menos de 3 opiniones; el bloque se verá escaso");
  return issues;
}

export function formatIssues(issues: Issue[]): string {
  return issues.map((i) => `${i.level === "error" ? "ERROR" : "aviso"}  ${i.path}: ${i.message}`).join("\n");
}

export function formatZodError(error: z.ZodError): string {
  return error.issues.map((i) => `ERROR  ${i.path.join(".") || "(raíz)"}: ${i.message}`).join("\n");
}
