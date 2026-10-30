import Icon from "@/components/Icon";
import { Avatar, Card, Container, Section, SectionHeading, reveal } from "@/components/ui";
import type { BlockProps } from "../types";
import { AllOnGoogle, TestimonialFooter, testimonialKey } from "./shared";

/** 06 Opiniones · 02 Destacada: the first review large, in the heading font, and the rest in small cards. */
export default function TestimonialsDestacada({ site, t, ctx }: BlockProps) {
  const [first, ...rest] = site.business.testimonials;
  const cols = rest.length === 1 ? "sm:grid-cols-1 sm:max-w-xl" : rest.length === 2 || rest.length === 4 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <Section id={ctx.anchor} tone={ctx.tone}>
      <Container>
        <SectionHeading title={t.sections.testimonials} hidden={ctx.hideTitle} center />
        <figure {...reveal(1)} className="relative mx-auto mt-10 max-w-3xl text-center">
          <Icon name="quote" aria-hidden="true" className="pointer-events-none absolute -top-10 left-1/2 h-24 w-24 -translate-x-1/2 text-secondary/15" />
          <blockquote className="relative">
            <p className="display font-heading text-2xl leading-snug text-ink sm:text-[2rem]">{first.text}</p>
          </blockquote>
          <figcaption className="mt-7 flex items-center justify-center gap-3 text-sm">
            <Avatar name={first.name} />
            <cite className="font-semibold not-italic">{first.name}</cite>
            {first.url && (
              <a href={first.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-primary-text">
                {t.testimonials.seeOnGoogle}
                <Icon name="external" className="h-3.5 w-3.5" />
              </a>
            )}
          </figcaption>
        </figure>
        {rest.length > 0 && (
          <ul className={`mx-auto mt-12 grid gap-5 ${cols}`}>
            {rest.map((item, i) => (
              <Card key={testimonialKey(item)} as="li" hover {...reveal(2 + i)} className="flex flex-col p-5">
                <blockquote className="flex-1">
                  <p className="text-sm leading-relaxed text-ink-2">{item.text}</p>
                </blockquote>
                <TestimonialFooter item={item} t={t} />
              </Card>
            ))}
          </ul>
        )}
        <AllOnGoogle site={site} t={t} />
      </Container>
    </Section>
  );
}
