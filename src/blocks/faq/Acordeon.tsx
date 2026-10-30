import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import { Container, Section, SectionHeading, reveal } from "@/components/ui";
import { faqSchema } from "@/lib/seo";
import type { BlockProps } from "../types";

/** 10 Preguntas frecuentes · 01 Acordeón: questions folded, each opens on click. FAQPage structured data. */
export default function FaqAcordeon({ site, t, ctx }: BlockProps) {
  const items = site.business.faq;
  return (
    <Section id={ctx.anchor} tone={ctx.tone}>
      <Container narrow>
        <SectionHeading title={t.sections.faq} hidden={ctx.hideTitle} />
        <JsonLd data={faqSchema(items)} />
        <div {...reveal(1)} className="mt-10 divide-y divide-line rounded-card bg-surface ring-1 ring-line shadow-card">
          {items.map((item) => (
            <details key={item.question} className="group px-6">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-left font-semibold [&::-webkit-details-marker]:hidden">
                {item.question}
                <Icon name="chevron" className="h-5 w-5 shrink-0 text-ink-3 transition-transform group-open:rotate-180" />
              </summary>
              <p className="pb-5 leading-relaxed text-ink-2">{item.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </Section>
  );
}
