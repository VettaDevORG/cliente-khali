import CtaPair from "@/components/CtaPair";
import { Container } from "@/components/ui";
import type { BlockProps } from "../types";
import { HeroMedia, HoursLine, PlaceLabel, TrustStrip, rise } from "./shared";

/**
 * 01 Hero · 03 Portada: the photo bleeds behind a dark brand gradient and zooms very slowly; white text and CTAs on
 * top, the differentiators as glass cards at the bottom. The memorable thing: the photo itself, moving.
 */
export default function HeroPortada({ site, t, ctx }: BlockProps) {
  const copy = site.web.copy;
  return (
    <section id={ctx.anchor} className="relative isolate overflow-hidden bg-primary-dark text-white">
      <div aria-hidden="true" className="absolute inset-0 -z-20">
        <HeroMedia site={site} sizes="100vw" className="absolute inset-0 h-full w-full object-cover" kenburns />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(100deg, color-mix(in srgb, var(--brand-primary-dark) 92%, black) 0%, color-mix(in srgb, var(--brand-primary-dark) 72%, black) 45%, rgb(0 0 0 / 0.35) 100%)",
        }}
      />
      <Container className="pt-20 sm:pt-28 lg:pt-36">
        <div className="max-w-2xl pb-14 sm:pb-20">
          <div {...rise(0)}>
            <PlaceLabel site={site} onDark />
          </div>
          <h1 {...rise(1)} className="rise display mt-6 text-balance text-[2.6rem] text-white sm:text-6xl lg:text-7xl">
            {copy.hero_title}
          </h1>
          <p {...rise(2)} className="rise mt-7 max-w-xl text-lg leading-relaxed text-white/85 sm:text-xl">
            {copy.hero_subtitle}
          </p>
          <div {...rise(3)}>
            <CtaPair site={site} t={t} pagePath={ctx.pagePath} place="hero" onDark className="mt-9" />
          </div>
          <p {...rise(4)} className="rise mt-7 max-w-xl text-sm leading-relaxed text-white/80">
            {copy.why_us}
          </p>
          <div {...rise(4)}>
            <HoursLine site={site} onDark className="mt-2" />
          </div>
        </div>
      </Container>
      <TrustStrip site={site} onDark glass />
    </section>
  );
}
