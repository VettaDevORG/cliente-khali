import type { Metadata } from "next";
import type { Service, SiteConfig } from "./ficha";
import { euro, fullAddress, splitList } from "./format";
import { openingHoursSchema } from "./hours";
import { isIndexable, servicePath, siteUrl } from "./site";

export function baseMetadata(site: SiteConfig): Metadata {
  const name = site.trade_name;
  return {
    metadataBase: new URL(siteUrl(site)),
    title: { default: `${name} · ${site.web.copy.hero_title}`, template: `%s | ${name}` },
    description: site.web.copy.hero_subtitle,
    applicationName: name,
    robots: isIndexable(site)
      ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } }
      : { index: false, follow: false, googleBot: { index: false, follow: false } },
    openGraph: { type: "website", siteName: name, locale: "es_ES", url: siteUrl(site) },
    twitter: { card: "summary_large_image" },
    formatDetection: { telephone: true, email: true, address: true },
  };
}

export function pageMetadata(
  site: SiteConfig,
  { path, title, description, absoluteTitle = false }: { path: string; title: string; description: string; absoluteTitle?: boolean },
): Metadata {
  const url = siteUrl(site, path);
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", siteName: site.trade_name, locale: "es_ES", title, description, url },
    twitter: { card: "summary_large_image", title, description },
  };
}

/**
 * The schema.org type that fits business.sector, so Google shows the right kind of local result. Matched on the
 * sector as written in the ficha (lowercase, accents ignored); anything unknown is a plain LocalBusiness.
 */
const SECTOR_TYPES: [RegExp, string | string[]][] = [
  [/fontan/, "Plumber"],
  [/electric/, "Electrician"],
  [/cerraj/, "Locksmith"],
  [/reforma|construc|alban|albañ/, "HomeAndConstructionBusiness"],
  [/pint/, "HousePainter"],
  [/climatiz|aire acondicionado|calefac/, "HVACBusiness"],
  [/jardin/, "LocalBusiness"],
  [/limpieza/, "LocalBusiness"],
  [/academia|formacion|clases|idiomas|escuela/, ["LocalBusiness", "EducationalOrganization"]],
  [/autoescuela/, ["LocalBusiness", "EducationalOrganization"]],
  [/dentis|odont/, "Dentist"],
  [/fisio/, "Physiotherapy"],
  [/clinic|medic|salud/, "MedicalClinic"],
  [/psicol/, "Psychologist"],
  [/veterin/, "VeterinaryCare"],
  [/canin|mascot|perro|gato/, "LocalBusiness"],
  [/peluq|barber/, "HairSalon"],
  [/estetic|belleza|unas|uñas/, "BeautySalon"],
  [/gimnas|fitness|entren/, "ExerciseGym"],
  [/restaur|bar|cafe|cafeter/, "Restaurant"],
  [/abogad|legal|jurid/, "LegalService"],
  [/asesor|gestor|contab/, "AccountingService"],
  [/inmobil/, "RealEstateAgent"],
  [/taller|mecanic|neumat/, "AutoRepair"],
  [/fotograf/, ["LocalBusiness", "Photographer"]],
  [/arquitect/, ["LocalBusiness", "ProfessionalService"]],
  [/tienda|comercio/, "Store"],
];

export function businessType(sector: string): string | string[] {
  const s = sector.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  return SECTOR_TYPES.find(([re]) => re.test(s))?.[1] ?? "LocalBusiness";
}

/** "desde 45 € – 350 €" style range for schema.org priceRange, from the services that show a price. */
export function priceRange(site: SiteConfig): string | null {
  const prices = site.business.services.filter((s) => (s.price_type === "fixed" || s.price_type === "from") && s.price !== null).map((s) => s.price as number);
  if (prices.length === 0) return null;
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? euro(min) : `${euro(min)} - ${euro(max)}`;
}

export function localBusinessSchema(site: SiteConfig) {
  const b = site.business;
  const sameAs = Object.values(b.social).filter((v): v is string => Boolean(v));
  const range = priceRange(site);
  const images = [site.assets.hero?.src, site.assets.about?.src, ...site.assets.gallery.slice(0, 2).map((g) => g.src)].filter((v): v is string => Boolean(v));
  return {
    "@context": "https://schema.org",
    "@type": businessType(b.sector),
    "@id": `${siteUrl(site)}/#business`,
    name: site.trade_name,
    legalName: site.legal.owner,
    url: siteUrl(site),
    logo: siteUrl(site, site.assets.logo?.src ?? "/icon"),
    image: [siteUrl(site, "/opengraph-image"), ...images.map((src) => siteUrl(site, src))],
    description: b.description,
    telephone: b.phone,
    email: b.public_email,
    address: {
      "@type": "PostalAddress",
      streetAddress: b.address.street,
      postalCode: b.address.postal_code,
      addressLocality: b.address.city,
      addressRegion: b.address.province,
      addressCountry: b.address.country,
    },
    areaServed: splitList(b.service_area).map((name) => ({ "@type": "Place", name })),
    openingHoursSpecification: openingHoursSchema(b.opening_hours),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: b.phone,
      email: b.public_email,
      contactType: "customer service",
      availableLanguage: [b.language, ...b.extra_languages],
    },
    currenciesAccepted: "EUR",
    ...(b.policies.payment ? { paymentAccepted: b.policies.payment } : {}),
    ...(range ? { priceRange: range } : {}),
    ...(sameAs.length ? { sameAs } : {}),
    ...(b.services.length
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Servicios",
            itemListElement: b.services.map((s) => ({
              "@type": "Offer",
              ...(site.web.package === "web" && site.web.service_pages ? { url: siteUrl(site, servicePath(s)) } : {}),
              ...(s.price !== null && (s.price_type === "fixed" || s.price_type === "from") ? { price: s.price, priceCurrency: "EUR" } : {}),
              itemOffered: { "@type": "Service", name: s.name, description: s.description },
            })),
          },
        }
      : {}),
  };
}

export function websiteSchema(site: SiteConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl(site)}/#website`,
    name: site.trade_name,
    url: siteUrl(site),
    inLanguage: site.business.language,
    publisher: { "@id": `${siteUrl(site)}/#business` },
  };
}

export function serviceSchema(site: SiteConfig, service: Service) {
  const price = service.price_type === "fixed" || service.price_type === "from" ? service.price : null;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    serviceType: service.name,
    description: site.web.copy.services?.[service.id]?.intro ?? service.description,
    url: siteUrl(site, servicePath(service)),
    provider: { "@id": `${siteUrl(site)}/#business` },
    areaServed: splitList(site.business.service_area).map((name) => ({ "@type": "Place", name })),
    ...(site.assets.services[service.id] ? { image: siteUrl(site, site.assets.services[service.id].src) } : {}),
    ...(price !== null
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "EUR",
            price,
            url: siteUrl(site, servicePath(service)),
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.question,
      acceptedAnswer: { "@type": "Answer", text: i.answer },
    })),
  };
}

export function breadcrumbSchema(site: SiteConfig, items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: siteUrl(site, item.path),
    })),
  };
}

export function postalAddressText(site: SiteConfig): string {
  return fullAddress(site.business.address);
}
