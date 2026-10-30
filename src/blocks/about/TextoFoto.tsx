import Image from "next/image";
import { CheckDot, Container, Media, Section, SectionHeading, reveal } from "@/components/ui";
import { sentence } from "@/lib/format";
import type { BlockProps } from "../types";
import { aboutImage, aboutTitle } from "./shared";

/** 02 Nosotros · 01 Texto y foto: the photo on one side with a soft accent block behind it; story, mission and values on the other. */
export default function AboutTextoFoto({ site, t, ctx }: BlockProps) {
  const img = aboutImage(site);
  const { about, mission, values } = site.identity;
  return (
    <Section id={ctx.anchor} tone={ctx.tone}>
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-20">
        {img && (
          <div {...reveal()} className="relative order-last lg:order-first">
            <div aria-hidden="true" className="absolute -left-4 -top-4 h-2/3 w-2/3 rounded-media bg-primary-light" />
            <Media className="relative ring-1 ring-black/5">
              <Image src={img.src} alt={img.alt} width={img.width} height={img.height} sizes="(min-width: 1024px) 45vw, 100vw" className="aspect-[4/5] h-auto w-full object-cover sm:aspect-[4/3] lg:aspect-[4/5]" />
            </Media>
          </div>
        )}
        <div>
          <SectionHeading title={aboutTitle(site, t)} hidden={ctx.hideTitle} />
          <p {...reveal(1)} className="mt-6 text-lg leading-relaxed text-ink-2">
            {about}
          </p>
          {mission && (
            <blockquote {...reveal(2)} className="mt-7">
              <p className="font-heading text-xl leading-snug text-ink sm:text-2xl">
                <span aria-hidden="true" className="mr-1 text-secondary">
                  “
                </span>
                {mission}
                <span aria-hidden="true" className="ml-1 text-secondary">
                  ”
                </span>
              </p>
            </blockquote>
          )}
          {values.length > 0 && (
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {values.slice(0, 6).map((v, i) => (
                <li key={v} {...reveal(3 + i)} className="flex items-start gap-2.5 text-sm font-medium">
                  <CheckDot />
                  {sentence(v)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>
    </Section>
  );
}
