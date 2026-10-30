import { Container, Section, SectionHeading, reveal } from "@/components/ui";
import type { BlockProps } from "../types";

/** 05 Cómo trabajamos · 03 Pasos en fila: big numerals side by side, joined by a line on wide screens. */
export default function HowWeWorkFila({ site, t, ctx }: BlockProps) {
  const steps = site.web.copy.how_we_work ?? [];
  const cols = steps.length === 4 ? "md:grid-cols-4" : steps.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3";
  return (
    <Section id={ctx.anchor} tone={ctx.tone}>
      <Container>
        <SectionHeading title={t.sections.how_we_work} hidden={ctx.hideTitle} center />
        <ol className={`relative mt-12 grid gap-10 md:gap-8 ${cols}`}>
          <span aria-hidden="true" className="absolute left-0 right-0 top-7 hidden h-px bg-line md:block" />
          {steps.map((step, i) => (
            <li key={step.title} {...reveal(i)} className="relative text-center md:px-2">
              <span className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary font-heading text-xl font-bold text-primary-fg shadow-md">
                {i + 1}
              </span>
              <h3 className="mt-5 text-lg font-bold">{step.title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-ink-2">{step.text}</p>
            </li>
          ))}
        </ol>
        {site.business.policies.booking && <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-ink-2">{site.business.policies.booking}</p>}
      </Container>
    </Section>
  );
}
