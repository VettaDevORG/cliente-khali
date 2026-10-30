import MapOnClick from "@/components/MapOnClick";
import { Card, Chip, Container, Section, SectionHeading } from "@/components/ui";
import { fullAddress, mapsEmbedUrl, mapsSearchUrl, splitList } from "@/lib/format";
import type { BlockProps } from "../types";

/** 09 Zona de trabajo · 01 Mapa y pueblos: the towns as chips, the map on click, and what the business does not do. */
export default function ServiceAreaMapa({ site, t, ctx }: BlockProps) {
  const b = site.business;
  const towns = splitList(b.service_area);
  const address = fullAddress(b.address);
  return (
    <Section id={ctx.anchor} tone={ctx.tone}>
      <Container className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
        <div>
          <SectionHeading title={t.sections.service_area} lead={`${t.area.lead} ${b.service_area}.`} hidden={ctx.hideTitle} />
          {towns.length > 1 && (
            <ul className="mt-7 flex flex-wrap gap-2">
              {towns.map((town) => (
                <li key={town}>
                  <Chip>{town}</Chip>
                </li>
              ))}
            </ul>
          )}
          {b.policies.not_offered && (
            <Card className="mt-7 p-5 text-sm">
              <p className="font-semibold">{t.area.notOffered}</p>
              <p className="mt-1 text-ink-2">{b.policies.not_offered}</p>
            </Card>
          )}
        </div>
        <MapOnClick embedUrl={mapsEmbedUrl(address)} directionsUrl={mapsSearchUrl(address)} address={address} labels={{ seeMap: t.cta.seeMap, directions: t.cta.directions }} />
      </Container>
    </Section>
  );
}
