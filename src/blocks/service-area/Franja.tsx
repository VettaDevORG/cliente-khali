import Icon from "@/components/Icon";
import { Container, Kicker, Section, buttonVariants } from "@/components/ui";
import { fullAddress, mapsSearchUrl, splitList } from "@/lib/format";
import type { BlockProps } from "../types";

/** 09 Zona de trabajo · 02 Franja: a tinted band with the towns in large type and the directions button. No embed. */
export default function ServiceAreaFranja({ site, t, ctx }: BlockProps) {
  const b = site.business;
  const towns = splitList(b.service_area);
  const address = fullAddress(b.address);
  return (
    <Section id={ctx.anchor} className="bg-primary-light/70">
      <Container className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          {!ctx.hideTitle && <Kicker>{t.sections.service_area}</Kicker>}
          <p className="display mt-3 font-heading text-2xl text-ink sm:text-3xl">
            {t.area.lead}{" "}
            {towns.length > 1
              ? towns.map((town, i) => (
                  <span key={town}>
                    <span className="text-primary-text">{town}</span>
                    {i < towns.length - 2 ? ", " : i === towns.length - 2 ? ` ${t.area.and} ` : "."}
                  </span>
                ))
              : `${b.service_area}.`}
          </p>
          {b.policies.not_offered && (
            <p className="mt-4 max-w-2xl text-sm text-ink-2">
              <strong className="font-semibold text-ink">{t.area.notOffered}:</strong> {b.policies.not_offered}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          <a href={mapsSearchUrl(address)} target="_blank" rel="noopener noreferrer" className={buttonVariants.primary}>
            <Icon name="pin" className="h-5 w-5" />
            {t.cta.directions}
          </a>
          <p className="max-w-xs text-sm text-ink-2 sm:self-center lg:self-start">{address}</p>
        </div>
      </Container>
    </Section>
  );
}
