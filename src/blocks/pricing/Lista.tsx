import { Container, Section, SectionHeading } from "@/components/ui";
import { priceLabel } from "@/lib/format";
import type { BlockProps } from "../types";

/** 04 Precios · 01 Lista: one row per service with the price on the right, and the payment policy under it. */
export default function PricingLista({ site, t, ctx }: BlockProps) {
  const rows = site.business.services.filter((s) => s.price_type !== "hidden");
  const payment = site.business.policies.payment;
  return (
    <Section id={ctx.anchor} tone={ctx.tone}>
      <Container narrow>
        <SectionHeading title={t.sections.pricing} lead={t.pricing.lead} hidden={ctx.hideTitle} />
        <ul className="mt-10 divide-y divide-line overflow-hidden rounded-card bg-surface ring-1 ring-line shadow-card">
          {rows.map((s) => (
            <li key={s.id} className="flex flex-col gap-1 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
              <div>
                <p className="font-semibold">{s.name}</p>
                <p className="text-sm text-ink-2">{s.description}</p>
              </div>
              <p className="shrink-0 text-lg font-bold text-primary-text">{priceLabel(s, site.web.copy.services?.[s.id]?.price_label, t)}</p>
            </li>
          ))}
        </ul>
        {payment && (
          <p className="mt-5 text-sm text-ink-3">
            <strong className="font-semibold text-ink-2">{t.pricing.paymentLabel}:</strong> {payment}
          </p>
        )}
      </Container>
    </Section>
  );
}
