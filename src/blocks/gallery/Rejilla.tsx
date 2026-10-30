import Image from "next/image";
import { Container, Media, Section, SectionHeading, reveal } from "@/components/ui";
import type { BlockProps } from "../types";

/** 07 Galería · 01 Rejilla: same-size photos in a grid, with their captions. */
export default function GalleryRejilla({ site, t, ctx }: BlockProps) {
  const images = site.assets.gallery;
  return (
    <Section id={ctx.anchor} tone={ctx.tone}>
      <Container>
        <SectionHeading title={t.sections.gallery} hidden={ctx.hideTitle} />
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          {images.map((img, i) => (
            <li key={img.src} {...reveal(i)}>
              <figure>
                <Media>
                  <Image src={img.src} alt={img.alt} width={img.width} height={img.height} sizes="(min-width: 1024px) 33vw, 50vw" className="aspect-[4/3] h-auto w-full object-cover" />
                </Media>
                {img.caption && <figcaption className="mt-2 text-sm text-ink-2">{img.caption}</figcaption>}
              </figure>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
