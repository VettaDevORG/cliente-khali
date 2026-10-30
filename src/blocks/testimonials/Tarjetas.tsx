import { Card, Container, Section, SectionHeading, reveal } from "@/components/ui";
import type { BlockProps } from "../types";
import { AllOnGoogle, QuoteMark, TestimonialFooter, testimonialKey } from "./shared";

/** 06 Opiniones · 01 Tarjetas: a card per review, as given, never invented. */
export default function TestimonialsTarjetas({ site, t, ctx }: BlockProps) {
  const items = site.business.testimonials;
  const cols = items.length === 1 ? "md:grid-cols-1 md:max-w-xl" : items.length === 2 || items.length === 4 ? "md:grid-cols-2" : "md:grid-cols-3";
  return (
    <Section id={ctx.anchor} tone={ctx.tone}>
      <Container>
        <SectionHeading title={t.sections.testimonials} hidden={ctx.hideTitle} />
        <ul className={`mt-10 grid gap-6 ${cols}`}>
          {items.map((item, i) => (
            <Card key={testimonialKey(item)} as="li" hover {...reveal(i)} className="flex flex-col">
              <QuoteMark />
              <blockquote className="mt-3 flex-1">
                <p className="leading-relaxed text-ink-2">{item.text}</p>
              </blockquote>
              <TestimonialFooter item={item} t={t} />
            </Card>
          ))}
        </ul>
        <AllOnGoogle site={site} t={t} />
      </Container>
    </Section>
  );
}
