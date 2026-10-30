import Image from "next/image";
import { Card, Container, Media, Section, SectionHeading, reveal } from "@/components/ui";
import { initials } from "@/lib/format";
import type { BlockProps } from "../types";

/** 08 Equipo · 01 Tarjetas: a card per person with the photo, or the initials when there is none. */
export default function TeamTarjetas({ site, t, ctx }: BlockProps) {
  const members = site.team;
  const cols = members.length === 1 ? "sm:grid-cols-1 sm:max-w-sm" : members.length === 2 || members.length === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <Section id={ctx.anchor} tone={ctx.tone}>
      <Container>
        <SectionHeading title={t.sections.team} lead={t.team.lead} hidden={ctx.hideTitle} />
        <ul className={`mt-10 grid gap-6 ${cols}`}>
          {members.map((m, i) => (
            <Card key={m.name} as="li" hover {...reveal(i)}>
              {m.photo ? (
                <Media>
                  <Image src={m.photo.src} alt={m.photo.alt || m.name} width={m.photo.width} height={m.photo.height} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="aspect-square h-auto w-full object-cover" />
                </Media>
              ) : (
                <div aria-hidden="true" className="flex aspect-square w-full items-center justify-center rounded-media bg-primary-light font-heading text-5xl font-bold text-primary-text">
                  {initials(m.name)}
                </div>
              )}
              <h3 className="mt-5 text-lg font-bold">{m.name}</h3>
              <p className="text-sm font-medium text-primary-text">{m.role}</p>
              {m.bio && <p className="mt-2 text-sm leading-relaxed text-ink-2">{m.bio}</p>}
            </Card>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
