import Icon from "@/components/Icon";
import TrackedLink from "@/components/TrackedLink";
import { Container, Section, SectionHeading, buttonVariants } from "@/components/ui";
import type { BlockProps } from "../types";
import { Channels, Form, waHref } from "./shared";

/** 11 Contacto · 01 Formulario y datos: channels on the left, the Netlify form on the right. */
export default function ContactFormularioDatos({ site, t, ctx }: BlockProps) {
  return (
    <Section id={ctx.anchor} tone={ctx.tone}>
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.25fr] lg:items-start lg:gap-16">
        <div>
          <SectionHeading title={t.contact.title} lead={t.contact.lead} />
          <TrackedLink href={waHref(site)} event="whatsapp_click" place="contact" external className={`${buttonVariants.whatsapp} mt-7`}>
            <Icon name="whatsapp" className="h-5 w-5" />
            {t.cta.whatsapp}
          </TrackedLink>
          <div className="mt-7">
            <Channels site={site} place="contact" />
          </div>
        </div>
        <Form site={site} t={t} />
      </Container>
    </Section>
  );
}
