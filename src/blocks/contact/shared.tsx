import ContactForm from "@/components/ContactForm";
import Icon from "@/components/Icon";
import TrackedLink from "@/components/TrackedLink";
import type { SiteConfig } from "@/lib/ficha";
import { fullAddress, telHref, whatsappUrl } from "@/lib/format";
import { summarizeHours } from "@/lib/hours";
import type { Strings } from "@/lib/strings";

export function waHref(site: SiteConfig): string {
  return whatsappUrl(site.business.whatsapp.number, site.business.whatsapp.prefilled_message);
}

/** The direct channels: phone, email, address, hours. Vertical list or a row of items. */
export function Channels({ site, place, layout = "list", onDark = false }: { site: SiteConfig; place: string; layout?: "list" | "row"; onDark?: boolean }) {
  const b = site.business;
  const link = `inline-flex items-center gap-2 font-semibold ${onDark ? "text-primary-fg hover:text-primary-fg/80" : "text-ink hover:text-primary-text"}`;
  const icon = `h-4 w-4 shrink-0 ${onDark ? "text-primary-fg/70" : "text-primary-text"}`;
  const muted = onDark ? "text-primary-fg/80" : "text-ink-2";
  const items = [
    <TrackedLink key="phone" href={telHref(b.phone)} event="phone_click" place={place} className={link}>
      <Icon name="phone" className={icon} />
      {b.phone}
    </TrackedLink>,
    <a key="mail" href={`mailto:${b.public_email}`} className={link}>
      <Icon name="mail" className={icon} />
      {b.public_email}
    </a>,
    <span key="pin" className={`inline-flex items-start gap-2 ${muted}`}>
      <Icon name="pin" className={`mt-0.5 ${icon}`} />
      {fullAddress(b.address)}
    </span>,
    ...(b.opening_hours.length > 0
      ? [
          <span key="clock" className={`inline-flex items-start gap-2 ${muted}`}>
            <Icon name="clock" className={`mt-0.5 ${icon}`} />
            {summarizeHours(b.opening_hours)}
          </span>,
        ]
      : []),
  ];
  return (
    <ul className={layout === "row" ? "flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm" : "space-y-3 text-sm"}>
      {items.map((el) => (
        <li key={el.key}>{el}</li>
      ))}
    </ul>
  );
}

export function Form({ site, t }: { site: SiteConfig; t: Strings }) {
  return (
    <ContactForm
      t={t.contact}
      services={site.business.services.map((s) => s.name)}
      whatsappHref={waHref(site)}
      email={site.business.public_email}
      healthData={site.legal.health_data}
    />
  );
}
