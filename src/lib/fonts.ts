import type { SiteConfig } from "./ficha";

/** @font-face rules for the fonts materialize copied into public/client/fonts. Self-hosted, latin subset, swap. */
export function fontFaceCss(fonts: SiteConfig["fonts"]): string {
  const face = (f: SiteConfig["fonts"]["body"]) =>
    `@font-face{font-family:"${f.family}";font-style:normal;font-weight:${f.weights};font-display:swap;src:url(${f.src}) format("woff2");}`;
  return face(fonts.body) + (fonts.heading ? face(fonts.heading) : "");
}

export function fontCssVars(fonts: SiteConfig["fonts"]): Record<string, string> {
  const body = `"${fonts.body.family}", ${fonts.body.fallback}`;
  const heading = fonts.heading ? `"${fonts.heading.family}", ${fonts.heading.fallback}` : body;
  return { "--font-body": body, "--font-heading": heading };
}
