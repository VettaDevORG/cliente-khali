import { Container, Numeral, Section, SectionHeading, reveal } from "@/components/ui";
import type { BlockProps } from "../types";

/** 05 Cómo trabajamos · 02 Línea de tiempo: the steps in a column joined by a line. Unhurried reading. */
export default function HowWeWorkLinea({ site, t, ctx }: BlockProps) {
  const steps = site.web.copy.how_we_work ?? [];
  return (
    <Section id={ctx.anchor} tone={ctx.tone}>
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <SectionHeading title={t.sections.how_we_work} hidden={ctx.hideTitle} />
          {site.business.policies.booking && <p className="mt-5 text-sm leading-relaxed text-ink-2">{site.business.policies.booking}</p>}
        </div>
        <ol className="relative">
          <span aria-hidden="true" className="absolute left-5 top-5 bottom-5 w-px bg-line" />
          {steps.map((step, i) => (
            <li key={step.title} {...reveal(i)} className="relative flex gap-6 pb-10 last:pb-0">
              <Numeral n={i + 1} />
              <div className="pt-1.5">
                <h3 className="text-lg font-bold">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-2">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
