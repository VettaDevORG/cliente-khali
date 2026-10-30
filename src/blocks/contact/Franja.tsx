import Icon from "@/components/Icon";
import TrackedLink from "@/components/TrackedLink";
import { Container, Section, SectionHeading, buttonVariants } from "@/components/ui";
import { telHref } from "@/lib/format";
import type { BlockProps } from "../types";
import { Channels, waHref } from "./shared";

/** 11 Contacto · 03 Franja de llamada: no form. A band on the primary color with WhatsApp and phone buttons. */
export default function ContactFranja({ site, t, ctx }: BlockProps) {
  const b = site.business;
  return (
    <Section id={ctx.anchor} tone="primary">
      <Container className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-16">
        <div>
          <SectionHeading title={t.contact.title} lead={t.contact.leadDirect} onDark />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <TrackedLink href={waHref(site)} event="whatsapp_click" place="contact" external className={buttonVariants.whatsapp}>
              <Icon name="whatsapp" className="h-5 w-5" />
              {t.cta.whatsapp}
            </TrackedLink>
            <TrackedLink href={telHref(b.phone)} event="phone_click" place="contact" className={buttonVariants.ghostPrimary}>
              <Icon name="phone" className="h-5 w-5" />
              {t.cta.call}
            </TrackedLink>
          </div>
        </div>
        <div className="rounded-card bg-primary-fg/10 p-6 ring-1 ring-primary-fg/15">
          <Channels site={site} place="contact" onDark />
        </div>
      </Container>
    </Section>
  );
}
