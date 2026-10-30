import CountUp from "@/components/CountUp";
import { Container, Section, SectionHeading, reveal } from "@/components/ui";
import type { BlockProps } from "../types";
import { aboutTitle } from "./shared";

/** 02 Nosotros · 03 Cifras: the story next to two to four big figures from products.web.copy.stats that count up when seen. */
export default function AboutCifras({ site, t, ctx }: BlockProps) {
  const { about, mission } = site.identity;
  const stats = site.web.copy.stats ?? [];
  return (
    <Section id={ctx.anchor} tone={ctx.tone}>
      <Container className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-20">
        <div>
          <SectionHeading title={aboutTitle(site, t)} hidden={ctx.hideTitle} />
          <p {...reveal(1)} className="mt-6 text-lg leading-relaxed text-ink-2">
            {about}
          </p>
          {mission && (
            <p {...reveal(2)} className="mt-5 font-heading text-xl leading-snug text-ink sm:text-2xl">
              {mission}
            </p>
          )}
        </div>
        <dl className={`grid gap-4 ${stats.length === 3 ? "sm:grid-cols-3 lg:grid-cols-1" : "sm:grid-cols-2"}`}>
          {stats.map((s, i) => (
            <div key={`${s.value}-${s.label}`} {...reveal(i)} className="lift rounded-card bg-primary-light/70 p-6 ring-1 ring-primary/10">
              <dd className="display font-heading text-4xl text-primary-text sm:text-5xl">
                <CountUp value={s.value} />
              </dd>
              <dt className="mt-2 text-sm font-medium text-ink-2">{s.label}</dt>
            </div>
          ))}
        </dl>
      </Container>
    </Section>
  );
}
