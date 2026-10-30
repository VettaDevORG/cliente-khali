import Icon from "@/components/Icon";
import TrackedLink from "@/components/TrackedLink";
import { Container, Section, SectionHeading, buttonVariants } from "@/components/ui";
import type { BlockProps } from "../types";
import { Channels, Form, waHref } from "./shared";

/** 11 Contacto · 02 Formulario centrado: narrow form in the middle, WhatsApp above it, channels as a row below. */
export default function ContactCentrado({ site, t, ctx }: BlockProps) {
  return (
    <Section id={ctx.anchor} tone={ctx.tone}>
      <Container narrow>
        <SectionHeading title={t.contact.title} lead={t.contact.lead} center />
        <p className="mt-7 text-center">
          <TrackedLink href={waHref(site)} event="whatsapp_click" place="contact" external className={buttonVariants.whatsapp}>
            <Icon name="whatsapp" className="h-5 w-5" />
            {t.cta.whatsapp}
          </TrackedLink>
        </p>
        <p className="my-7 flex items-center gap-4 text-sm text-ink-3">
          <span className="h-px flex-1 bg-line" />
          {t.contact.orForm}
          <span className="h-px flex-1 bg-line" />
        </p>
        <Form site={site} t={t} />
        <div className="mt-10">
          <Channels site={site} place="contact" layout="row" />
        </div>
      </Container>
    </Section>
  );
}
