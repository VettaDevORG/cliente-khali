import Image from "next/image";
import { Container, Section, SectionHeading, reveal } from "@/components/ui";
import type { BlockProps } from "../types";
import { PriceLine, SeeMore, ServiceName, listedServices, serviceDuration, servicePrice, serviceTitle } from "./shared";

/** 03 Servicios · 01 Tarjetas: a card per service that lifts on hover, with its photo zooming gently when there is one. */
export default function ServicesTarjetas({ site, t, ctx }: BlockProps) {
  const services = listedServices(site, ctx);
  if (services.length === 0) return <></>;
  const cols = services.length === 1 ? "md:grid-cols-1 md:max-w-xl" : services.length === 2 || services.length === 4 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3";
  return (
    <Section id={ctx.anchor} tone={ctx.tone}>
      <Container>
        <SectionHeading title={serviceTitle(t, ctx)} hidden={!ctx.service && ctx.hideTitle} />
        <ul className={`mt-10 grid gap-6 ${cols}`}>
          {services.map((s, i) => {
            const img = site.assets.services[s.id];
            return (
              <li key={s.id} {...reveal(i)} className="lift zoom-media group flex flex-col overflow-hidden rounded-card bg-surface ring-1 ring-line shadow-card hover:shadow-lg hover:ring-primary/20">
                {img ? (
                  <div className="overflow-hidden">
                    <Image src={img.src} alt={img.alt} width={img.width} height={img.height} sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="aspect-[3/2] h-auto w-full object-cover" />
                  </div>
                ) : (
                  <div aria-hidden="true" className="h-1.5 w-full bg-gradient-to-r from-primary to-secondary" />
                )}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-bold">
                    <ServiceName site={site} s={s} />
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-2">{s.description}</p>
                  <PriceLine price={servicePrice(site, s, t)} duration={serviceDuration(s)} t={t} className="mt-4" />
                  <SeeMore site={site} s={s} t={t} className="mt-3 self-start" />
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
