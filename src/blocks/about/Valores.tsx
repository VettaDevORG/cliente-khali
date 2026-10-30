import { CheckDot, Container, Section, SectionHeading, reveal } from "@/components/ui";
import { sentence } from "@/lib/format";
import type { BlockProps } from "../types";
import { aboutTitle } from "./shared";

/** 02 Nosotros · 02 Valores: the story as the lead and the values as a row of tinted tiles. Needs no photo. */
export default function AboutValores({ site, t, ctx }: BlockProps) {
  const { about, mission, values } = site.identity;
  const cols = values.length <= 2 ? "sm:grid-cols-2" : values.length === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <Section id={ctx.anchor} tone={ctx.tone}>
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <SectionHeading title={aboutTitle(site, t)} hidden={ctx.hideTitle} />
          <div {...reveal(1)}>
            <p className="text-lg leading-relaxed text-ink-2">{about}</p>
            {mission && <p className="mt-5 font-heading text-xl leading-snug text-ink sm:text-2xl">{mission}</p>}
          </div>
        </div>
        {values.length > 0 && (
          <ul className={`mt-12 grid gap-5 ${cols}`}>
            {values.slice(0, 6).map((v, i) => (
              <li key={v} {...reveal(2 + i)} className="lift flex items-start gap-3 rounded-card bg-primary-light/60 p-5 ring-1 ring-primary/10">
                <CheckDot tone="secondary" />
                <p className="font-semibold leading-snug">{sentence(v)}</p>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </Section>
  );
}
