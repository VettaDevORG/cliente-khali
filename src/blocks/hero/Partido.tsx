import CtaPair from "@/components/CtaPair";
import Icon from "@/components/Icon";
import { Container, Glow, Media } from "@/components/ui";
import { summarizeHours } from "@/lib/hours";
import type { BlockProps } from "../types";
import { HeroMedia, HoursLine, PlaceLabel, TrustStrip, rise } from "./shared";

/**
 * 01 Hero · 01 Partido: text on the left, the photo on the right standing on a solid block of the accent color,
 * with the opening hours floating over it. Without photo, centered text. The memorable thing: the offset color block.
 */
export default function HeroPartido({ site, t, ctx }: BlockProps) {
  const copy = site.web.copy;
  const img = site.assets.hero;
  const hours = site.business.opening_hours.length > 0 ? summarizeHours(site.business.opening_hours) : null;
  return (
    <section id={ctx.anchor} className="relative isolate overflow-hidden bg-primary-light/60">
      <Glow strength={0.8} />
      <div aria-hidden="true" className="bg-dots mask-fade-b absolute inset-y-0 right-0 -z-10 hidden w-1/2 opacity-70 lg:block" />
      <Container className={`grid gap-12 py-16 sm:py-20 lg:py-24 ${img ? "lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16" : ""}`}>
        <div className={img ? "" : "mx-auto max-w-3xl text-center"}>
          <div {...rise(0)}>
            <PlaceLabel site={site} center={!img} />
          </div>
          <h1 {...rise(1)} className="rise display mt-5 text-balance text-[2.6rem] sm:text-6xl lg:text-[4rem]">
            {copy.hero_title}
          </h1>
          <p {...rise(2)} className="rise mt-6 max-w-xl text-lg leading-relaxed text-ink-2 sm:text-xl">
            {copy.hero_subtitle}
          </p>
          <div {...rise(3)}>
            <CtaPair site={site} t={t} pagePath={ctx.pagePath} place="hero" center={!img} className="mt-9" />
          </div>
          <p {...rise(4)} className={`rise mt-7 max-w-xl text-sm leading-relaxed text-ink-2 ${img ? "" : "mx-auto"}`}>
            {copy.why_us}
          </p>
          {!img && (
            <div {...rise(5)}>
              <HoursLine site={site} center className="mt-2" />
            </div>
          )}
        </div>
        {img && (
          <div {...rise(2)} className="rise relative">
            <div aria-hidden="true" className="absolute -bottom-4 -right-4 h-full w-full rounded-media bg-secondary sm:-bottom-5 sm:-right-5" />
            <Media className="relative ring-1 ring-black/5">
              <HeroMedia site={site} sizes="(min-width: 1024px) 45vw, 100vw" className="aspect-[4/3] h-auto w-full object-cover" />
            </Media>
            {hours && (
              <p className="absolute bottom-4 left-4 inline-flex max-w-[85%] items-center gap-2 rounded-card bg-surface/95 px-4 py-3 text-sm font-medium shadow-lg ring-1 ring-line/60 backdrop-blur">
                <Icon name="clock" className="h-4 w-4 text-primary-text" />
                {hours}
              </p>
            )}
          </div>
        )}
      </Container>
      <TrustStrip site={site} />
    </section>
  );
}
