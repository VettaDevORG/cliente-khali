import Link from "next/link";
import type { Service, SiteConfig } from "@/lib/ficha";
import { durationLabel, priceLabel } from "@/lib/format";
import { hasServicePages, servicePath } from "@/lib/site";
import type { Strings } from "@/lib/strings";
import type { BlockContext } from "../types";

/** The services to list: all of them, or all but the current one on a service page. */
export function listedServices(site: SiteConfig, ctx: BlockContext): Service[] {
  return site.business.services.filter((s) => s.id !== ctx.service?.id);
}

export function serviceTitle(t: Strings, ctx: BlockContext): string {
  return ctx.service ? t.service.otherServices : t.sections.services;
}

export function servicePrice(site: SiteConfig, s: Service, t: Strings): string | null {
  return priceLabel(s, site.web.copy.services?.[s.id]?.price_label, t);
}

export function serviceDuration(s: Service): string | null {
  return durationLabel(s.duration_minutes);
}

/** Name as a link to the service page in the full website, plain text otherwise. */
export function ServiceName({ site, s, className = "" }: { site: SiteConfig; s: Service; className?: string }) {
  return hasServicePages(site) ? (
    <Link href={servicePath(s)} className={`hover:text-primary-text ${className}`}>
      {s.name}
    </Link>
  ) : (
    <span className={className}>{s.name}</span>
  );
}

export function SeeMore({ site, s, t, className = "" }: { site: SiteConfig; s: Service; t: Strings; className?: string }) {
  if (!hasServicePages(site)) return null;
  return (
    <Link href={servicePath(s)} className={`link-draw inline-block text-sm font-semibold text-primary-text ${className}`}>
      {t.cta.seeMore}
    </Link>
  );
}

export function PriceLine({ price, duration, t, className = "" }: { price: string | null; duration: string | null; t: Strings; className?: string }) {
  if (!price && !duration) return null;
  return (
    <p className={`flex items-baseline justify-between gap-3 ${className}`}>
      {price && <span className="font-semibold text-primary-text">{price}</span>}
      {duration && (
        <span className="text-xs text-ink-3">
          {t.services.duration} {duration}
        </span>
      )}
    </p>
  );
}
