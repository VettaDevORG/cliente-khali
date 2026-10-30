import Image from "next/image";
import { Container, Section, SectionHeading, reveal } from "@/components/ui";
import type { BlockProps } from "../types";
import ServicesTarjetas from "./Tarjetas";
import { PriceLine, SeeMore, ServiceName, listedServices, serviceDuration, servicePrice, serviceTitle } from "./shared";

/** 03 Servicios · 03 Destacado: the first service large, with its photo or a brand panel, and the rest compact. */
export default function ServicesDestacado(props: BlockProps) {
  const { site, t, ctx } = props;
  // On a service page the block lists "other services": the plain cards read better there.
  if (ctx.service) return <ServicesTarjetas {...props} />;
  const services = listedServices(site, ctx);
  if (services.length < 2) return <ServicesTarjetas {...props} />;
  const [first, ...rest] = services;
  // Its own photo, else a gallery photo that is not already the hero, else a brand panel.
  const img = site.assets.services[first.id] ?? site.assets.gallery.find((g) => g.src !== site.assets.hero?.src) ?? null;
  const firstCopy = site.web.copy.services?.[first.id];
  const cols = rest.length === 1 ? "sm:grid-cols-1" : rest.length === 2 || rest.length === 4 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <Section id={ctx.anchor} tone={ctx.tone}>
      <Container>
        <SectionHeading title={serviceTitle(t, ctx)} hidden={ctx.hideTitle} />
        <article {...reveal()} className="zoom-media mt-10 grid overflow-hidden rounded-card bg-surface ring-1 ring-line shadow-card lg:grid-cols-2">
          {img ? (
            <div className="overflow-hidden">
              <Image src={img.src} alt={img.alt} width={img.width} height={img.height} sizes="(min-width: 1024px) 50vw, 100vw" className="aspect-[3/2] h-full w-full object-cover" />
            </div>
          ) : (
            <div aria-hidden="true" className="flex min-h-56 items-end bg-primary p-8 text-primary-fg">
              <span className="font-heading text-6xl font-bold opacity-30">01</span>
            </div>
          )}
          <div className="flex flex-col p-7 sm:p-10">
            <h3 className="display text-2xl sm:text-3xl">
              <ServiceName site={site} s={first} />
            </h3>
            <p className="mt-4 flex-1 text-base leading-relaxed text-ink-2">{firstCopy?.intro ?? first.description}</p>
            {firstCopy?.includes && firstCopy.includes.length > 0 && (
              <ul className="mt-5 grid gap-2 text-sm text-ink-2 sm:grid-cols-2">
                {firstCopy.includes.slice(0, 4).map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
            <PriceLine price={servicePrice(site, first, t)} duration={serviceDuration(first)} t={t} className="mt-6 text-lg" />
            <SeeMore site={site} s={first} t={t} className="mt-3" />
          </div>
        </article>
        <ul className={`mt-6 grid gap-5 ${cols}`}>
          {rest.map((s, i) => (
            <li key={s.id} {...reveal(i + 1)} className="lift flex gap-4 rounded-card bg-surface p-5 ring-1 ring-line shadow-card hover:shadow-lg hover:ring-primary/20">
              <span aria-hidden="true" className="font-heading text-xl font-bold text-primary-text/40">
                {String(i + 2).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold">
                  <ServiceName site={site} s={s} />
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-2">{s.description}</p>
                <PriceLine price={servicePrice(site, s, t)} duration={serviceDuration(s)} t={t} className="mt-3 text-sm" />
                <SeeMore site={site} s={s} t={t} className="mt-2" />
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
