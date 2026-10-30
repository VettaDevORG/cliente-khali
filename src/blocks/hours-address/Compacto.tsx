import Icon from "@/components/Icon";
import SocialLinks from "@/components/SocialLinks";
import TrackedLink from "@/components/TrackedLink";
import { Card, Container, Section, SectionHeading, buttonVariants } from "@/components/ui";
import { fullAddress, mapsSearchUrl, telHref, whatsappUrl } from "@/lib/format";
import type { BlockProps } from "../types";
import { HoursTable } from "./shared";

/** 12 Horario y dirección · 02 Compacto: one card with the hours and the address side by side; the map opens in Google Maps. */
export default function HoursAddressCompacto({ site, t, ctx }: BlockProps) {
  const b = site.business;
  const address = fullAddress(b.address);
  return (
    <Section id={ctx.anchor} tone={ctx.tone}>
      <Container>
        <SectionHeading title={t.sections.hours_address} hidden={ctx.hideTitle} />
        <Card className="mt-10 grid gap-8 p-7 sm:p-9 md:grid-cols-2 md:gap-12">
          <HoursTable site={site} t={t} />
          <div className="flex flex-col">
            <h3 className="flex items-center gap-2 font-semibold">
              <Icon name="pin" className="h-4 w-4 text-primary-text" />
              {t.hours.address}
            </h3>
            <p className="mt-2 text-sm text-ink-2">{address}</p>
            <a href={mapsSearchUrl(address)} target="_blank" rel="noopener noreferrer" className={`${buttonVariants.outline} mt-4 self-start !min-h-11 !px-5 text-sm`}>
              {t.cta.directions}
              <Icon name="external" className="h-4 w-4" />
            </a>
            <ul className="mt-6 space-y-1.5 border-t border-line pt-5 text-sm">
              <li>
                <TrackedLink href={telHref(b.phone)} event="phone_click" place="hours" className="inline-flex items-center gap-2 font-medium text-ink hover:text-primary-text">
                  <Icon name="phone" className="h-4 w-4 text-primary-text" />
                  {b.phone}
                </TrackedLink>
              </li>
              <li>
                <TrackedLink href={whatsappUrl(b.whatsapp.number, b.whatsapp.prefilled_message)} event="whatsapp_click" place="hours" external className="inline-flex items-center gap-2 font-medium text-ink hover:text-primary-text">
                  <Icon name="whatsapp" className="h-4 w-4 text-primary-text" />
                  {b.whatsapp.number}
                </TrackedLink>
              </li>
              <li>
                <a href={`mailto:${b.public_email}`} className="inline-flex items-center gap-2 font-medium text-ink hover:text-primary-text">
                  <Icon name="mail" className="h-4 w-4 text-primary-text" />
                  {b.public_email}
                </a>
              </li>
            </ul>
            <SocialLinks social={b.social} className="mt-4" />
          </div>
        </Card>
      </Container>
    </Section>
  );
}
