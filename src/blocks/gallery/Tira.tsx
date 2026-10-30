import Image from "next/image";
import Strip from "@/components/Strip";
import { Media, Section, SectionHeading, reveal } from "@/components/ui";
import type { BlockProps } from "../types";

/**
 * 07 Galería · 03 Tira: tall photos in a horizontal strip with previous/next buttons, mouse drag, swipe and keyboard.
 * Captions under each.
 */
export default function GalleryTira({ site, t, ctx }: BlockProps) {
  const images = site.assets.gallery;
  return (
    <Section id={ctx.anchor} tone={ctx.tone} className="overflow-hidden">
      <Strip header={<SectionHeading title={t.sections.gallery} hidden={ctx.hideTitle} />} labels={{ prev: t.gallery.prev, next: t.gallery.next }}>
        {images.map((img, i) => (
          <figure key={img.src} {...reveal(i)} className="w-[72vw] shrink-0 snap-start sm:w-[44vw] lg:w-[26rem]">
            <Media>
              <Image
                src={img.src}
                alt={img.alt}
                width={img.width}
                height={img.height}
                sizes="(min-width: 1024px) 416px, (min-width: 640px) 44vw, 72vw"
                draggable={false}
                className="aspect-[3/4] h-auto w-full object-cover"
              />
            </Media>
            {img.caption && <figcaption className="mt-3 text-sm text-ink-2">{img.caption}</figcaption>}
          </figure>
        ))}
      </Strip>
    </Section>
  );
}
