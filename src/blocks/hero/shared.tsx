import type { CSSProperties } from "react";
import Image from "next/image";
import HeroVideo from "@/components/HeroVideo";
import Icon from "@/components/Icon";
import { CheckDot, Container } from "@/components/ui";
import type { SiteConfig } from "@/lib/ficha";
import { summarizeHours } from "@/lib/hours";

/**
 * The hero picture: the photo (own or bank), preloaded as the largest element of the page, and over it the clip
 * when the client gave one. The photo stays underneath as poster, so the first paint never waits for the video.
 */
export function HeroMedia({ site, sizes, className, kenburns = false }: { site: SiteConfig; sizes: string; className: string; kenburns?: boolean }) {
  const img = site.assets.hero;
  const video = site.assets.hero_video;
  if (!img) return null;
  return (
    <>
      <Image src={img.src} alt={video ? "" : img.alt} width={img.width} height={img.height} sizes={sizes} preload className={`${className} ${kenburns && !video ? "kenburns" : ""}`} />
      {video && <HeroVideo src={video.src} type={video.type} className="absolute inset-0 h-full w-full object-cover" />}
    </>
  );
}

/** Entrance step for hero children: the i-th element rises a little later than the previous one. */
export const rise = (i: number) => ({ className: "rise", style: { "--i": i } as CSSProperties });

/** Up to three differentiators from identity, as a trust strip under the hero. */
export function TrustStrip({ site, onDark = false, glass = false }: { site: SiteConfig; onDark?: boolean; glass?: boolean }) {
  const items = site.identity.differentiators.slice(0, 3);
  if (items.length === 0) return null;
  const list = (
    <ul className={`grid gap-3 sm:grid-cols-3 ${glass ? "" : "py-5"}`}>
      {items.map((d, i) => (
        <li
          key={d}
          {...rise(5 + i)}
          className={`rise flex items-start gap-2.5 text-sm font-medium ${onDark ? "text-white/90" : ""} ${
            glass ? "rounded-card bg-white/10 px-4 py-3 ring-1 ring-white/15 backdrop-blur-sm" : ""
          }`}
        >
          <CheckDot onDark={onDark} tone="secondary" />
          {d}
        </li>
      ))}
    </ul>
  );
  if (glass) return <Container className="pb-8 sm:pb-10">{list}</Container>;
  return (
    <div className={onDark ? "border-t border-white/15" : "border-t border-line/60 bg-surface/70"}>
      <Container>{list}</Container>
    </div>
  );
}

export function HoursLine({ site, onDark = false, center = false, className = "" }: { site: SiteConfig; onDark?: boolean; center?: boolean; className?: string }) {
  if (site.business.opening_hours.length === 0) return null;
  return (
    <p className={`inline-flex items-center gap-2 text-sm ${onDark ? "text-white/80" : "text-ink-2"} ${center ? "justify-center" : ""} ${className}`}>
      <Icon name="clock" className="h-4 w-4" />
      {summarizeHours(site.business.opening_hours)}
    </p>
  );
}

/** The service area as a location label with a pin: it says where, which is why it earns its place above the title. */
export function PlaceLabel({ site, onDark = false, center = false }: { site: SiteConfig; onDark?: boolean; center?: boolean }) {
  return (
    <p className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${center ? "justify-center" : ""} ${
      onDark ? "bg-white/10 text-white/90 ring-1 ring-white/20" : "bg-surface text-primary-text ring-1 ring-primary/15 shadow-sm"
    }`}>
      <Icon name="pin" className={`h-4 w-4 ${onDark ? "text-white/80" : "text-secondary-text"}`} />
      {site.business.service_area}
    </p>
  );
}
