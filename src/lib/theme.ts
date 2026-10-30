/**
 * Colors derived from the two brand colors in the ficha, and the three font choices of the catalog.
 * Everything here is pure: the layout turns the palette into CSS variables.
 */

export type Rgb = { r: number; g: number; b: number };

export function hexToRgb(hex: string): Rgb {
  const h = hex.replace("#", "");
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
}

export function rgbToHex({ r, g, b }: Rgb): string {
  const to = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

function rgbToHsl({ r, g, b }: Rgb): { h: number; s: number; l: number } {
  const rn = r / 255,
    gn = g / 255,
    bn = b / 255;
  const max = Math.max(rn, gn, bn),
    min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
  else if (max === gn) h = ((bn - rn) / d + 2) / 6;
  else h = ((rn - gn) / d + 4) / 6;
  return { h, s, l };
}

function hslToRgb({ h, s, l }: { h: number; s: number; l: number }): Rgb {
  if (s === 0) return { r: l * 255, g: l * 255, b: l * 255 };
  const hue = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return { r: hue(p, q, h + 1 / 3) * 255, g: hue(p, q, h) * 255, b: hue(p, q, h - 1 / 3) * 255 };
}

export function luminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const ch = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
}

/** WCAG contrast ratio between two hex colors. */
export function contrast(a: string, b: string): number {
  const la = luminance(a),
    lb = luminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

export function adjustLightness(hex: string, delta: number): string {
  const hsl = rgbToHsl(hexToRgb(hex));
  return rgbToHex(hslToRgb({ ...hsl, l: Math.max(0, Math.min(1, hsl.l + delta)) }));
}

export function mix(hex: string, withHex: string, amount: number): string {
  const a = hexToRgb(hex),
    b = hexToRgb(withHex);
  return rgbToHex({ r: a.r + (b.r - a.r) * amount, g: a.g + (b.g - a.g) * amount, b: a.b + (b.b - a.b) * amount });
}

export const INK = "#111827";
export const WHITE = "#ffffff";

/** White or ink, whichever reads better on the color. */
export function foregroundFor(hex: string): string {
  return contrast(hex, WHITE) >= contrast(hex, INK) ? WHITE : INK;
}

/** Darkens the color until it passes AA (4.5:1) as text on every one of the given backgrounds. */
export function ensureTextContrast(hex: string, backgrounds: string[] = [WHITE], ratio = 4.5): string {
  let out = hex;
  for (let i = 0; i < 60 && backgrounds.some((bg) => contrast(out, bg) < ratio); i++) out = adjustLightness(out, -0.025);
  return out;
}

/** Nudges a fill color, darker or lighter, until white or ink text on it passes AA (4.5:1). */
export function ensureFillContrast(hex: string, ratio = 4.5): string {
  let out = hex;
  for (let i = 0; i < 40 && contrast(out, foregroundFor(out)) < ratio; i++) out = adjustLightness(out, foregroundFor(out) === WHITE ? -0.02 : 0.02);
  return out;
}

/** Page background and the gray of alternating sections: text colors must read on them as well as on white. */
export const SURFACES = ["#fafaf9", "#f3f4f6"];

export type Palette = {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  primaryFg: string;
  primaryText: string;
  secondary: string;
  secondaryDark: string;
  secondaryLight: string;
  secondaryFg: string;
  secondaryText: string;
};

export function derivePalette(primaryHex: string, secondaryHex: string): Palette {
  // Brand colors are used as solid fills (buttons, bands). A mid-lightness color can miss AA by a hair, so nudge it.
  const primary = ensureFillContrast(primaryHex);
  const secondary = ensureFillContrast(secondaryHex);
  const primaryLight = mix(primary, WHITE, 0.9);
  const secondaryLight = mix(secondary, WHITE, 0.88);
  // Text tones are used on white, on the page surfaces and on both light tints (hero, chips, notice).
  const backgrounds = [WHITE, ...SURFACES, primaryLight, secondaryLight];
  return {
    primary,
    primaryDark: adjustLightness(primary, -0.1),
    primaryLight,
    primaryFg: foregroundFor(primary),
    primaryText: ensureTextContrast(primary, backgrounds),
    secondary,
    secondaryDark: adjustLightness(secondary, -0.1),
    secondaryLight,
    secondaryFg: foregroundFor(secondary),
    secondaryText: ensureTextContrast(secondary, backgrounds),
  };
}

export function paletteToCssVars(p: Palette): Record<string, string> {
  return {
    "--brand-primary": p.primary,
    "--brand-primary-dark": p.primaryDark,
    "--brand-primary-light": p.primaryLight,
    "--brand-primary-fg": p.primaryFg,
    "--brand-primary-text": p.primaryText,
    "--brand-secondary": p.secondary,
    "--brand-secondary-dark": p.secondaryDark,
    "--brand-secondary-light": p.secondaryLight,
    "--brand-secondary-fg": p.secondaryFg,
    "--brand-secondary-text": p.secondaryText,
  };
}

/* ---------- Fonts: the three choices of brand.font ---------- */

export type FontFile = {
  family: string;
  /** npm package under @fontsource-variable and file inside its files/ folder. */
  pkg: string;
  file: string;
  weights: string;
  fallback: string;
};

export type FontChoice = { label: string; body: FontFile; heading: FontFile | null };

const SANS_FALLBACK = "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif";

const inter: FontFile = {
  family: "Inter Variable",
  pkg: "inter",
  file: "inter-latin-wght-normal.woff2",
  weights: "100 900",
  fallback: SANS_FALLBACK,
};
const manrope: FontFile = {
  family: "Manrope Variable",
  pkg: "manrope",
  file: "manrope-latin-wght-normal.woff2",
  weights: "200 800",
  fallback: SANS_FALLBACK,
};
const fraunces: FontFile = {
  family: "Fraunces Variable",
  pkg: "fraunces",
  file: "fraunces-latin-wght-normal.woff2",
  weights: "100 900",
  fallback: "Georgia, Times New Roman, serif",
};

export const FONT_CHOICES: Record<"a" | "b" | "c", FontChoice> = {
  a: { label: "Inter: sobria, para oficios y servicios técnicos", body: inter, heading: null },
  b: { label: "Manrope: cercana y redondeada, para salud, cuidado y hogar", body: manrope, heading: null },
  c: {
    label: "Fraunces en títulos con Inter en texto: elegante, para formación, estética y restauración",
    body: inter,
    heading: fraunces,
  },
};
