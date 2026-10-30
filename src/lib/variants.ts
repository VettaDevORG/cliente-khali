import type { SectionId, SectionInput } from "./ficha";

/**
 * The numbered catalog: 13 blocks, each with 2 or 3 variants. This module is pure metadata (no React), so the
 * scripts can validate a ficha with it and the catalog page can list it. The components live in src/blocks.
 *
 * Naming: a block is "NN Nombre" and a variant is "NN Nombre" inside its block, so "01 Hero · 03 Portada" is
 * unambiguous in a call with the client. In the ficha the variant is written by code: "variants": { "hero": "03" }.
 * The slug ("portada") and the code with slug ("03-portada") are accepted too.
 */

export type VariantCode = "01" | "02" | "03";

export type VariantMeta = {
  code: VariantCode;
  /** Short lowercase name, also accepted in the ficha instead of the code. */
  slug: string;
  /** Name shown to people. */
  name: string;
  /** One line: what it looks like and when to use it. */
  description: string;
  /** Null when the variant can render with this data; otherwise what it needs, in Spanish. */
  needs?: (input: SectionInput) => string | null;
  /** False when the variant paints its own background and must not take part in the alternation. */
  alternates?: boolean;
};

export type BlockMeta = {
  id: SectionId;
  number: string;
  name: string;
  description: string;
  variants: VariantMeta[];
};

const hasHeroImage = (i: SectionInput) => i.heroImage !== false;
const hasAnyImage = (i: SectionInput) => i.heroImage !== false || i.aboutImage !== false || i.galleryCount !== 0;

export const BLOCKS_META: BlockMeta[] = [
  {
    id: "hero",
    number: "01",
    name: "Hero",
    description: "Titular, subtítulo, llamada a la acción, horario y franja de confianza con los diferenciadores. Con vídeo del cliente, el clip se reproduce sobre la foto.",
    variants: [
      { code: "01", slug: "partido", name: "Partido", description: "Texto a la izquierda y foto a la derecha. Sin foto, texto centrado.", alternates: false },
      { code: "02", slug: "centrado", name: "Centrado", description: "Titular centrado y foto panorámica debajo. Mucho aire.", alternates: false },
      {
        code: "03",
        slug: "portada",
        name: "Portada",
        description: "Foto a sangre con el texto encima, en blanco. Impacto.",
        needs: (i) => (hasHeroImage(i) ? null : "necesita foto de portada (products.web.images.hero o banco de fotos del sector)"),
        alternates: false,
      },
    ],
  },
  {
    id: "about",
    number: "02",
    name: "Nosotros",
    description: "Quiénes somos: identity.about, la misión y los valores. Cifras opcionales desde products.web.copy.stats.",
    variants: [
      {
        code: "01",
        slug: "texto-foto",
        name: "Texto y foto",
        description: "Foto a un lado, texto y valores al otro.",
        needs: (i) => (hasAnyImage(i) ? null : "necesita alguna foto (images.about, images.hero o galería)"),
      },
      { code: "02", slug: "valores", name: "Valores", description: "Texto arriba y los valores en fichas teñidas con una marca." },
      {
        code: "03",
        slug: "cifras",
        name: "Cifras",
        description: "Texto con tres o cuatro cifras grandes al lado y la misión debajo.",
        needs: (i) => ((i.copy.stats?.length ?? 0) >= 2 ? null : "necesita al menos dos entradas en products.web.copy.stats"),
      },
    ],
  },
  {
    id: "services",
    number: "03",
    name: "Servicios",
    description: "Una entrada por servicio de business.services, con su precio y, en la web completa, el enlace a su página.",
    variants: [
      { code: "01", slug: "tarjetas", name: "Tarjetas", description: "Rejilla de tarjetas, con foto si la hay." },
      { code: "02", slug: "lista", name: "Lista", description: "Filas numeradas con el precio a la derecha. Para muchos servicios." },
      {
        code: "03",
        slug: "destacado",
        name: "Destacado",
        description: "El primer servicio en grande y el resto en tarjetas compactas.",
        needs: (i) => (i.business.services.length >= 2 ? null : "necesita al menos dos servicios"),
      },
    ],
  },
  {
    id: "pricing",
    number: "04",
    name: "Precios",
    description: "Los servicios con precio fijo o desde, y la política de pago.",
    variants: [
      { code: "01", slug: "lista", name: "Lista", description: "Una fila por servicio con el precio a la derecha." },
      { code: "02", slug: "tarjetas", name: "Tarjetas", description: "Tarjetas con el precio en grande y un botón en cada una." },
    ],
  },
  {
    id: "how_we_work",
    number: "05",
    name: "Cómo trabajamos",
    description: "Los pasos de products.web.copy.how_we_work y la política de reservas.",
    variants: [
      { code: "01", slug: "tarjetas", name: "Tarjetas numeradas", description: "Una tarjeta por paso con su número." },
      { code: "02", slug: "linea", name: "Línea de tiempo", description: "Pasos en vertical unidos por una línea. Lectura pausada." },
      { code: "03", slug: "fila", name: "Pasos en fila", description: "Números grandes en horizontal. Para tres o cuatro pasos." },
    ],
  },
  {
    id: "testimonials",
    number: "06",
    name: "Opiniones",
    description: "business.testimonials tal cual, con enlace a la reseña y a Google si hay ficha.",
    variants: [
      { code: "01", slug: "tarjetas", name: "Tarjetas", description: "Una tarjeta por opinión." },
      { code: "02", slug: "destacada", name: "Destacada", description: "La primera opinión en grande y el resto debajo." },
      { code: "03", slug: "franja", name: "Franja", description: "Fondo del color principal con las opiniones en claro.", alternates: false },
    ],
  },
  {
    id: "gallery",
    number: "07",
    name: "Galería",
    description: "Fotos propias o del banco del sector, con sus pies.",
    variants: [
      { code: "01", slug: "rejilla", name: "Rejilla", description: "Fotos del mismo tamaño en rejilla." },
      {
        code: "02",
        slug: "mosaico",
        name: "Mosaico",
        description: "La primera foto en grande y el resto alrededor.",
        needs: (i) => (i.galleryCount === null || i.galleryCount >= 3 ? null : "necesita al menos tres fotos"),
      },
      { code: "03", slug: "tira", name: "Tira", description: "Fotos altas en una tira horizontal con botones, arrastre con el ratón, deslizar en el móvil y teclado." },
    ],
  },
  {
    id: "team",
    number: "08",
    name: "Equipo",
    description: "products.web.team. Sin foto se muestran las iniciales; nunca personas del banco.",
    variants: [
      { code: "01", slug: "tarjetas", name: "Tarjetas", description: "Una tarjeta por persona con foto o iniciales." },
      { code: "02", slug: "lista", name: "Lista", description: "Filas con la foto pequeña a la izquierda y la bio al lado." },
    ],
  },
  {
    id: "service_area",
    number: "09",
    name: "Zona de trabajo",
    description: "Los municipios de business.service_area, el mapa al pulsar y lo que no se hace.",
    variants: [
      { code: "01", slug: "mapa", name: "Mapa y pueblos", description: "Municipios a un lado y el mapa al otro." },
      { code: "02", slug: "franja", name: "Franja", description: "Banda de color con los municipios en grande y el botón de cómo llegar.", alternates: false },
    ],
  },
  {
    id: "faq",
    number: "10",
    name: "Preguntas frecuentes",
    description: "business.faq con datos estructurados FAQPage.",
    variants: [
      { code: "01", slug: "acordeon", name: "Acordeón", description: "Preguntas plegadas; se abren al pulsar." },
      { code: "02", slug: "columnas", name: "Dos columnas", description: "Todas las respuestas visibles, en dos columnas." },
    ],
  },
  {
    id: "contact",
    number: "11",
    name: "Contacto",
    description: "El formulario de Netlify y los canales directos: WhatsApp con mensaje, teléfono, correo, dirección y horario.",
    variants: [
      { code: "01", slug: "formulario-datos", name: "Formulario y datos", description: "Canales a la izquierda y formulario a la derecha." },
      { code: "02", slug: "centrado", name: "Formulario centrado", description: "Formulario estrecho en el centro y los canales debajo." },
      {
        code: "03",
        slug: "franja",
        name: "Franja de llamada",
        description: "Sin formulario: banda de color con WhatsApp, teléfono y correo.",
        needs: (i) => (i.primaryCta === "form" ? "primary_cta es form y esta variante no lleva formulario" : null),
        alternates: false,
      },
    ],
  },
  {
    id: "hours_address",
    number: "12",
    name: "Horario y dirección",
    description: "La tabla de horario, los festivos que quedan, la dirección con el mapa y los canales.",
    variants: [
      { code: "01", slug: "columnas", name: "Dos columnas con mapa", description: "Datos a la izquierda y mapa a la derecha." },
      { code: "02", slug: "compacto", name: "Compacto", description: "Una sola tarjeta con horario y dirección; el mapa se abre en Google Maps." },
    ],
  },
  {
    id: "notice",
    number: "13",
    name: "Aviso",
    description: "Mensaje destacado de products.web.copy.notice, para campañas o avisos urgentes.",
    variants: [
      { code: "01", slug: "franja", name: "Franja", description: "Banda del color de acento a todo el ancho.", alternates: false },
      { code: "02", slug: "tarjeta", name: "Tarjeta", description: "Tarjeta suave dentro del contenido, con icono.", alternates: false },
    ],
  },
];

export const BLOCK_META = Object.fromEntries(BLOCKS_META.map((b) => [b.id, b])) as Record<SectionId, BlockMeta>;

export function blockLabel(id: SectionId): string {
  const b = BLOCK_META[id];
  return `${b.number} ${b.name}`;
}

export function variantMeta(id: SectionId, code: VariantCode): VariantMeta {
  return BLOCK_META[id].variants.find((v) => v.code === code) ?? BLOCK_META[id].variants[0];
}

export function variantLabel(id: SectionId, code: VariantCode): string {
  const v = variantMeta(id, code);
  return `${v.code} ${v.name}`;
}

/** "02", "2", "centrado" or "02-centrado" → "02". Null when nothing matches. */
export function normalizeVariant(id: SectionId, raw: string): VariantCode | null {
  const value = raw.trim().toLowerCase();
  const variants = BLOCK_META[id].variants;
  const padded = /^\d{1,2}$/.test(value) ? value.padStart(2, "0") : value;
  const found = variants.find((v) => v.code === padded || v.slug === value || `${v.code}-${v.slug}` === value);
  return found ? found.code : null;
}

export type ResolvedVariant = { code: VariantCode; fallbackFrom?: VariantCode; reason?: string };

/**
 * The variant that will render: the chosen one when its data is there, otherwise the first variant of the block
 * that works. Nothing is ever left empty; the warning tells what the chosen one needed.
 */
export function resolveVariant(id: SectionId, chosen: VariantCode, input: SectionInput): ResolvedVariant {
  const variants = BLOCK_META[id].variants;
  const wanted = variants.find((v) => v.code === chosen) ?? variants[0];
  const reason = wanted.needs?.(input) ?? null;
  if (!reason) return { code: wanted.code };
  const alternative = variants.find((v) => !v.needs?.(input)) ?? variants[0];
  return { code: alternative.code, fallbackFrom: wanted.code, reason };
}

/** Human line for a fallback, used by the renderer and the scripts. */
export function describeFallback(id: SectionId, r: ResolvedVariant): string | null {
  if (!r.fallbackFrom) return null;
  return `${blockLabel(id)} · ${variantLabel(id, r.fallbackFrom)} ${r.reason}; se usa ${variantLabel(id, r.code)}`;
}
