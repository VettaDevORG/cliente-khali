import Image from "next/image";
import { Container, Section, SectionHeading, reveal } from "@/components/ui";
import { initials } from "@/lib/format";
import type { BlockProps } from "../types";

/** 08 Equipo · 02 Lista: rows with a small round photo (or initials) and the bio beside it. */
export default function TeamLista({ site, t, ctx }: BlockProps) {
  const members = site.team;
  return (
    <Section id={ctx.anchor} tone={ctx.tone}>
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <SectionHeading title={t.sections.team} lead={t.team.lead} hidden={ctx.hideTitle} />
        <ul className="divide-y divide-line">
          {members.map((m, i) => (
            <li key={m.name} {...reveal(i)} className="flex gap-5 py-6 first:pt-0 last:pb-0">
              {m.photo ? (
                <Image src={m.photo.src} alt={m.photo.alt || m.name} width={m.photo.width} height={m.photo.height} sizes="96px" className="h-20 w-20 shrink-0 rounded-full object-cover sm:h-24 sm:w-24" />
              ) : (
                <div aria-hidden="true" className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary-light font-heading text-2xl font-bold text-primary-text sm:h-24 sm:w-24">
                  {initials(m.name)}
                </div>
              )}
              <div className="min-w-0">
                <h3 className="text-lg font-bold">{m.name}</h3>
                <p className="text-sm font-medium text-primary-text">{m.role}</p>
                {m.bio && <p className="mt-2 text-sm leading-relaxed text-ink-2">{m.bio}</p>}
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
