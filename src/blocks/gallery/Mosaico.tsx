import Image from "next/image";
import { Container, Section, SectionHeading, reveal } from "@/components/ui";
import type { BlockProps } from "../types";

/** 07 Galería · 02 Mosaico: the first photo large, the others around it. Captions as an overlay on hover/focus. */
export default function GalleryMosaico({ site, t, ctx }: BlockProps) {
  const images = site.assets.gallery;
  return (
    <Section id={ctx.anchor} tone={ctx.tone}>
      <Container>
        <SectionHeading title={t.sections.gallery} hidden={ctx.hideTitle} />
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {images.map((img, i) => (
            <li key={img.src} {...reveal(i)} className={i === 0 ? "col-span-2 row-span-2" : ""}>
              <figure className="zoom-media group relative h-full overflow-hidden rounded-media shadow-card">
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={img.width}
                  height={img.height}
                  sizes={i === 0 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
                  className={`h-full w-full object-cover ${i === 0 ? "aspect-square" : "aspect-square"}`}
                />
                {img.caption && (
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-3 pt-10 text-sm font-medium text-white">
                    {img.caption}
                  </figcaption>
                )}
              </figure>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
