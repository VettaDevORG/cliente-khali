import type { CSSProperties } from "react";
import { preload } from "react-dom";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import Analytics from "@/components/Analytics";
import CookieBanner from "@/components/CookieBanner";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import SampleBanner from "@/components/SampleBanner";
import StickyCta from "@/components/StickyCta";
import { fontCssVars, fontFaceCss } from "@/lib/fonts";
import { buildCta, buildNav, secondaryCta } from "@/lib/nav";
import { getPreset, motionCssVars, presetCssVars, resolveMotion } from "@/lib/presets";
import { baseMetadata, localBusinessSchema, websiteSchema } from "@/lib/seo";
import { getSite, getT, isSample } from "@/lib/site";
import { derivePalette, paletteToCssVars } from "@/lib/theme";

export function generateMetadata(): Metadata {
  return baseMetadata(getSite());
}

export function generateViewport(): Viewport {
  return { themeColor: getSite().brand.colors.primary, width: "device-width", initialScale: 1 };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const site = getSite();
  const t = getT(site);
  const palette = derivePalette(site.brand.colors.primary, site.brand.colors.secondary);
  const preset = getPreset(site.web.preset);
  const motion = resolveMotion(preset, site.web.motion);
  // Brand colors, fonts and the preset tokens travel as CSS variables; Tailwind utilities read them (globals.css).
  const vars = { ...paletteToCssVars(palette), ...fontCssVars(site.fonts), ...presetCssVars(preset), ...motionCssVars(motion) } as CSSProperties;
  const nav = buildNav(site, t);
  // The CTA target for "form" depends on the page; the header uses the home-relative version.
  const cta = buildCta(site, t, "/");
  const secondary = secondaryCta(site, t, cta);
  const gaId = site.web.ga4_measurement_id ?? null;

  // Self-hosted fonts: one preload per family so the first paint already has them.
  preload(site.fonts.body.src, { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  if (site.fonts.heading) preload(site.fonts.heading.src, { as: "font", type: "font/woff2", crossOrigin: "anonymous" });

  return (
    <html lang={site.business.language} style={vars} data-motion={motion === "none" ? undefined : motion}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: fontFaceCss(site.fonts) }} />
        {/* Reveal-on-scroll hides nothing when JavaScript is off. */}
        <noscript>
          <style dangerouslySetInnerHTML={{ __html: "[data-reveal]{opacity:1!important;transform:none!important}.rise{animation:none!important}" }} />
        </noscript>
      </head>
      <body className="min-h-screen pb-20 md:pb-0">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-fg"
        >
          {t.skipToContent}
        </a>
        <JsonLd data={[localBusinessSchema(site), websiteSchema(site)]} />
        {isSample(site) && <SampleBanner />}
        <Header
          logo={site.assets.logo}
          name={site.trade_name}
          items={nav}
          cta={cta}
          labels={{ menu: t.menu, closeMenu: t.closeMenu, home: t.home }}
        />
        <main id="contenido">{children}</main>
        <Footer site={site} t={t} items={nav} />
        <StickyCta primary={cta} secondary={secondary} />
        {motion !== "none" && <Reveal />}
        {gaId && <CookieBanner texts={t.cookies} />}
        {gaId && <Analytics gaId={gaId} />}
      </body>
    </html>
  );
}
