import Icon from "@/components/Icon";
import TrackedLink from "@/components/TrackedLink";
import { ctaEvent } from "@/components/CtaPair";
import { Container, Section, SectionHeading, buttonVariants, reveal } from "@/components/ui";
import { priceLabel } from "@/lib/format";
import { buildCta } from "@/lib/nav";
import type { BlockProps } from "../types";

/** 04 Precios · 02 Tarjetas: a card per service with the price large, what it includes and a button. */
export default function PricingTarjetas({ site, t, ctx }: BlockProps) {
  const rows = site.business.services.filter((s) => s.price_type !== "hidden");
  const payment = site.business.policies.payment;
  const cta = buildCta(site, t, ctx.pagePath);
  const cols = rows.length === 1 ? "md:grid-cols-1 md:max-w-md" : rows.length === 2 || rows.length === 4 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3";
  return (
    <Section id={ctx.anchor} tone={ctx.tone}>
      <Container>
        <SectionHeading title={t.sections.pricing} lead={t.pricing.lead} hidden={ctx.hideTitle} center />
        <ul className={`mx-auto mt-10 grid gap-6 ${cols}`}>
          {rows.map((s, i) => {
            const copy = site.web.copy.services?.[s.id];
            const price = priceLabel(s, copy?.price_label, t);
            return (
              <li key={s.id} {...reveal(i)} className="lift flex flex-col rounded-card bg-surface p-7 ring-1 ring-line shadow-card hover:shadow-lg hover:ring-primary/20">
                <h3 className="text-lg font-bold">{s.name}</h3>
                {price && <p className="display mt-3 font-heading text-3xl text-primary-text sm:text-4xl">{price}</p>}
                <p className="mt-3 text-sm leading-relaxed text-ink-2">{s.description}</p>
                {copy?.includes && copy.includes.length > 0 && (
                  <ul className="mt-5 space-y-2 border-t border-line pt-5 text-sm text-ink-2">
                    {copy.includes.slice(0, 4).map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-primary-text" strokeWidth={3} />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex-1" />
                <TrackedLink href={cta.href} event={ctaEvent(cta.kind)} place="pricing" external={cta.external} className={`${buttonVariants.primary} mt-6 w-full`}>
                  {cta.kind === "whatsapp" && <Icon name="whatsapp" className="h-5 w-5" />}
                  {cta.kind === "call" && <Icon name="phone" className="h-5 w-5" />}
                  {cta.label}
                </TrackedLink>
              </li>
            );
          })}
        </ul>
        {payment && (
          <p className="mt-6 text-center text-sm text-ink-3">
            <strong className="font-semibold text-ink-2">{t.pricing.paymentLabel}:</strong> {payment}
          </p>
        )}
      </Container>
    </Section>
  );
}
