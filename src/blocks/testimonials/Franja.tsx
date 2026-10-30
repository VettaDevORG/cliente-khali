import Icon from "@/components/Icon";
import { Container, Section, SectionHeading, reveal } from "@/components/ui";
import type { BlockProps } from "../types";
import { AllOnGoogle, TestimonialFooter, testimonialKey } from "./shared";

/** 06 Opiniones · 03 Franja: on the primary color, the reviews in translucent cards. A strong band in the middle of the page. */
export default function TestimonialsFranja({ site, t, ctx }: BlockProps) {
  const items = site.business.testimonials;
  const cols = items.length === 1 ? "md:grid-cols-1 md:max-w-xl" : items.length === 2 || items.length === 4 ? "md:grid-cols-2" : "md:grid-cols-3";
  return (
    <Section id={ctx.anchor} tone="primary" className="overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-primary-fg/10 blur-3xl" />
      <Container>
        <SectionHeading title={t.sections.testimonials} hidden={ctx.hideTitle} onDark />
        <ul className={`mt-10 grid gap-6 ${cols}`}>
          {items.map((item, i) => (
            <li key={testimonialKey(item)} {...reveal(i)} className="lift flex flex-col rounded-card bg-primary-fg/10 p-6 ring-1 ring-primary-fg/15 backdrop-blur-sm">
              <Icon name="quote" className="h-7 w-7 text-primary-fg/50" />
              <blockquote className="mt-3 flex-1">
                <p className="leading-relaxed text-primary-fg/90">{item.text}</p>
              </blockquote>
              <TestimonialFooter item={item} t={t} onDark />
            </li>
          ))}
        </ul>
        <AllOnGoogle site={site} t={t} onDark />
      </Container>
    </Section>
  );
}
