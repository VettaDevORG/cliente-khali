import Icon from "./Icon";
import TrackedLink from "./TrackedLink";
import { buttonVariants } from "./ui";
import type { SiteConfig } from "@/lib/ficha";
import { buildCta, secondaryCta, type Cta } from "@/lib/nav";
import type { Strings } from "@/lib/strings";

export const ctaEvent = (kind: Cta["kind"]) => (kind === "whatsapp" ? "whatsapp_click" : kind === "call" ? "phone_click" : "cta_click");

function CtaIcon({ kind }: { kind: Cta["kind"] }) {
  if (kind === "whatsapp") return <Icon name="whatsapp" className="h-5 w-5" />;
  if (kind === "call") return <Icon name="phone" className="h-5 w-5" />;
  return null;
}

/**
 * The primary call to action (products.web.primary_cta) and the secondary channel next to it.
 * Used by the hero variants, the contact band and the service pages so every CTA tracks the same events.
 */
export default function CtaPair({
  site,
  t,
  pagePath,
  place,
  onDark = false,
  center = false,
  className = "",
}: {
  site: SiteConfig;
  t: Strings;
  pagePath: string;
  place: string;
  onDark?: boolean;
  center?: boolean;
  className?: string;
}) {
  const cta = buildCta(site, t, pagePath);
  const secondary = secondaryCta(site, t, cta);
  return (
    <div className={`flex flex-col gap-3 sm:flex-row ${center ? "sm:justify-center" : ""} ${className}`}>
      <TrackedLink href={cta.href} event={ctaEvent(cta.kind)} place={place} external={cta.external} className={buttonVariants.secondary}>
        <CtaIcon kind={cta.kind} />
        {cta.label}
      </TrackedLink>
      {secondary && (
        <TrackedLink
          href={secondary.href}
          event={ctaEvent(secondary.kind)}
          place={place}
          external={secondary.external}
          className={onDark ? buttonVariants.ghost : buttonVariants.outline}
        >
          <CtaIcon kind={secondary.kind} />
          {secondary.label}
        </TrackedLink>
      )}
    </div>
  );
}
