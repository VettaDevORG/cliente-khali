import CtaPair from "@/components/CtaPair";
import { Container, Glow, Media } from "@/components/ui";
import type { BlockProps } from "../types";
import { HeroMedia, HoursLine, PlaceLabel, TrustStrip, rise } from "./shared";

/**
 * 01 Hero · 02 Centrado: a big centered headline over two slow brand-colored glows, the wide photo under it.
 * Calm and airy. The memorable thing: the type, with the glows as the only decoration.
 */
export default function HeroCentrado({ site, t, ctx }: BlockProps) {
  const copy = site.web.copy;
  const img = site.assets.hero;
  return (
    <section id={ctx.anchor} className="relative isolate overflow-hidden bg-primary-light/50">
      <Glow strength={1.4} />
      <div aria-hidden="true" className="bg-dots mask-fade-b absolute inset-x-0 top-0 -z-10 h-[70%] opacity-60" />
      <Container className="pt-16 sm:pt-24 lg:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <div {...rise(0)}>
            <PlaceLabel site={site} center />
          </div>
          <h1 {...rise(1)} className="rise display mt-6 text-balance text-[2.6rem] sm:text-6xl lg:text-7xl">
            {copy.hero_title}
          </h1>
          <p {...rise(2)} className="rise mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-ink-2 sm:text-xl">
            {copy.hero_subtitle}
          </p>
          <div {...rise(3)}>
            <CtaPair site={site} t={t} pagePath={ctx.pagePath} place="hero" center className="mt-9" />
          </div>
          <div {...rise(4)} className="rise mt-7 flex flex-col items-center gap-1.5 text-sm text-ink-2">
            <p className="max-w-xl">{copy.why_us}</p>
            <HoursLine site={site} center />
          </div>
        </div>
        {img ? (
          <div {...rise(5)} className="rise relative mt-12 sm:mt-16">
            <Media className="relative ring-1 ring-black/5">
              <HeroMedia site={site} sizes="(min-width: 1152px) 1152px, 100vw" className="aspect-[16/9] h-auto w-full object-cover sm:aspect-[21/9]" />
            </Media>
          </div>
        ) : (
          <div className="pb-12 sm:pb-16" />
        )}
      </Container>
      <div className={img ? "mt-10 sm:mt-14" : ""}>
        <TrustStrip site={site} />
      </div>
    </section>
  );
}
