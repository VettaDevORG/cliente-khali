import JsonLd from "@/components/JsonLd";
import { Container, Section, SectionHeading, reveal } from "@/components/ui";
import { faqSchema } from "@/lib/seo";
import type { BlockProps } from "../types";

/** 10 Preguntas frecuentes · 02 Dos columnas: every answer visible, in two columns. For few, short answers. */
export default function FaqColumnas({ site, t, ctx }: BlockProps) {
  const items = site.business.faq;
  return (
    <Section id={ctx.anchor} tone={ctx.tone}>
      <Container>
        <SectionHeading title={t.sections.faq} hidden={ctx.hideTitle} />
        <JsonLd data={faqSchema(items)} />
        <dl className="mt-10 grid gap-x-12 gap-y-8 md:grid-cols-2">
          {items.map((item, i) => (
            <div key={item.question} {...reveal(i)} className="border-t border-line pt-5">
              <dt className="font-semibold">{item.question}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-ink-2">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </Section>
  );
}
