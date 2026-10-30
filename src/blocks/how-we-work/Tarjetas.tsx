import { Card, Container, Numeral, Section, SectionHeading, reveal } from "@/components/ui";
import type { BlockProps } from "../types";

/** 05 Cómo trabajamos · 01 Tarjetas numeradas: a card per step, plus the booking policy as a footnote. */
export default function HowWeWorkTarjetas({ site, t, ctx }: BlockProps) {
  const steps = site.web.copy.how_we_work ?? [];
  const cols = steps.length === 4 ? "md:grid-cols-2 lg:grid-cols-4" : steps.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3";
  return (
    <Section id={ctx.anchor} tone={ctx.tone}>
      <Container>
        <SectionHeading title={t.sections.how_we_work} hidden={ctx.hideTitle} />
        <ol className={`mt-10 grid gap-6 ${cols}`}>
          {steps.map((step, i) => (
            <Card key={step.title} as="li" hover {...reveal(i)}>
              <Numeral n={i + 1} />
              <h3 className="mt-5 text-lg font-bold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">{step.text}</p>
            </Card>
          ))}
        </ol>
        {site.business.policies.booking && <p className="mt-6 text-sm text-ink-2">{site.business.policies.booking}</p>}
      </Container>
    </Section>
  );
}
