import type { Service } from "./ficha";
import type { Strings } from "./strings";

/** "+34 600 000 001" → "tel:+34600000001" */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/** "+34 600 000 001" → "34600000001" for wa.me */
export function whatsappDigits(number: string): string {
  return number.replace(/\D/g, "");
}

export function whatsappUrl(number: string, message: string): string {
  return `https://wa.me/${whatsappDigits(number)}?text=${encodeURIComponent(message)}`;
}

export function euro(amount: number): string {
  const s = Number.isInteger(amount) ? String(amount) : amount.toFixed(2).replace(".", ",");
  return `${s.replace(/\B(?=(\d{3})+(?!\d))/g, ".")} €`;
}

/** Price text by price_type, or the override from products.web.copy.services[id].price_label. Null when hidden. */
export function priceLabel(service: Service, override: string | undefined, t: Strings): string | null {
  if (override) return override;
  switch (service.price_type) {
    case "fixed":
      return service.price === null ? null : euro(service.price);
    case "from":
      return service.price === null ? null : `${t.services.fromPrice} ${euro(service.price)}`;
    case "quote":
      return t.services.quote;
    case "hidden":
      return null;
  }
}

export function durationLabel(minutes: number | null | undefined): string | null {
  if (!minutes) return null;
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60),
    m = minutes % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

export function mapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function mapsEmbedUrl(query: string): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed&hl=es`;
}

export function fullAddress(a: { street: string; postal_code: string; city: string; province: string }): string {
  const cityLine = a.province && a.province !== a.city ? `${a.city} (${a.province})` : a.city;
  return `${a.street}, ${a.postal_code} ${cityLine}`;
}

/** "Alcorcón, Móstoles, Leganés, Fuenlabrada y Getafe" → five items. */
export function splitList(text: string): string[] {
  return text
    .split(/,| y /)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** "método" → "Método". Values and differentiators often come in lowercase in the ficha. */
export function sentence(text: string): string {
  return text.charAt(0).toLocaleUpperCase("es") + text.slice(1);
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/** Letter of the monogram shown when there is no logo: the initial of the first word that is not an article ("La Academia Delta" gives "A"). */
export function monogramLetter(name: string): string {
  const ARTICLES = new Set(["el", "la", "los", "las", "un", "una", "the"]);
  const words = name.trim().split(/\s+/).filter(Boolean);
  const word = words.find((w) => !ARTICLES.has(w.toLowerCase())) ?? words[0] ?? "?";
  return word.charAt(0).toUpperCase();
}
