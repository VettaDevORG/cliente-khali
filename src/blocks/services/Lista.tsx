import { Container, Section, SectionHeading, reveal } from "@/components/ui";
import type { BlockProps } from "../types";
import { SeeMore, ServiceName, listedServices, serviceDuration, servicePrice, serviceTitle } from "./shared";

/** 03 Servicios · 02 Lista: numbered rows with the price on the right. Reads well with many services. */
export default function ServicesLista({ site, t, ctx }: BlockProps) {
  const services = listedServices(site, ctx);
  if (services.length === 0) return <></>;
  return (
    <Section id={ctx.anchor} tone={ctx.tone}>
      <Container narrow>
        <SectionHeading title={serviceTitle(t, ctx)} hidden={!ctx.service && ctx.hideTitle} />
        <ol className="mt-10 divide-y divide-line border-y border-line">
          {services.map((s, i) => {
            const price = servicePrice(site, s, t);
            const duration = serviceDuration(s);
            return (
              <li key={s.id} {...reveal(i)} className="grid gap-3 py-6 sm:grid-cols-[3rem_1fr_auto] sm:gap-6">
                <span aria-hidden="true" className="font-heading text-2xl font-bold text-primary-text/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-lg font-bold">
                    <ServiceName site={site} s={s} />
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{s.description}</p>
                  <SeeMore site={site} s={s} t={t} className="mt-2" />
                </div>
                {(price || duration) && (
                  <div className="text-left sm:text-right">
                    {price && <p className="text-lg font-bold text-primary-text">{price}</p>}
                    {duration && (
                      <p className="text-xs text-ink-3">
                        {t.services.duration} {duration}
                      </p>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </Container>
    </Section>
  );
}
