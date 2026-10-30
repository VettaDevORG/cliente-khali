import Icon from "@/components/Icon";
import MapOnClick from "@/components/MapOnClick";
import SocialLinks from "@/components/SocialLinks";
import TrackedLink from "@/components/TrackedLink";
import { Container, Section, SectionHeading } from "@/components/ui";
import { fullAddress, mapsEmbedUrl, mapsSearchUrl, telHref, whatsappUrl } from "@/lib/format";
import type { BlockProps } from "../types";
import { HoursTable } from "./shared";

/** 12 Horario y dirección · 01 Dos columnas con mapa: hours, address and channels on the left, the map on the right. */
export default function HoursAddressColumnas({ site, t, ctx }: BlockProps) {
  const b = site.business;
  const address = fullAddress(b.address);
  return (
    <Section id={ctx.anchor} tone={ctx.tone}>
      <Container>
        <SectionHeading title={t.sections.hours_address} hidden={ctx.hideTitle} />
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-start lg:gap-16">
          <div className="space-y-7">
            <HoursTable site={site} t={t} />
            <div>
              <h3 className="flex items-center gap-2 font-semibold">
                <Icon name="pin" className="h-4 w-4 text-primary-text" />
                {t.hours.address}
              </h3>
              <p className="mt-2 text-sm text-ink-2">{address}</p>
            </div>
            <div>
              <h3 className="flex items-center gap-2 font-semibold">
                <Icon name="phone" className="h-4 w-4 text-primary-text" />
                {t.sections.contact}
              </h3>
              <ul className="mt-2 space-y-1.5 text-sm">
                <li>
                  <TrackedLink href={telHref(b.phone)} event="phone_click" place="hours" className="font-medium text-ink hover:text-primary-text">
                    {b.phone}
                  </TrackedLink>
                </li>
                <li>
                  <TrackedLink href={whatsappUrl(b.whatsapp.number, b.whatsapp.prefilled_message)} event="whatsapp_click" place="hours" external className="font-medium text-ink hover:text-primary-text">
                    WhatsApp {b.whatsapp.number}
                  </TrackedLink>
                </li>
                <li>
                  <a href={`mailto:${b.public_email}`} className="font-medium text-ink hover:text-primary-text">
                    {b.public_email}
                  </a>
                </li>
              </ul>
              <SocialLinks social={b.social} className="mt-4" />
            </div>
          </div>
          <MapOnClick embedUrl={mapsEmbedUrl(address)} directionsUrl={mapsSearchUrl(address)} address={address} labels={{ seeMap: t.cta.seeMap, directions: t.cta.directions }} />
        </div>
      </Container>
    </Section>
  );
}
