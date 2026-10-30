import Link from "next/link";
import Icon from "./Icon";
import Logo from "./Logo";
import SocialLinks from "./SocialLinks";
import TrackedLink from "./TrackedLink";
import type { SiteConfig } from "@/lib/ficha";
import { fullAddress, telHref, whatsappUrl } from "@/lib/format";
import { summarizeHours } from "@/lib/hours";
import type { NavItem } from "@/lib/nav";
import type { Strings } from "@/lib/strings";

/** Credit line at the bottom of every generated site. A kit setting, not a client one: see docs/bloques.md. */
const CREDIT = { name: "Vettadev", url: "https://vettadev.com" };

export default function Footer({ site, t, items }: { site: SiteConfig; t: Strings; items: NavItem[] }) {
  const b = site.business;
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <Logo logo={site.assets.logo} name={site.trade_name} />
          <p className="mt-3 text-sm text-ink-2">{b.description}</p>
          <p className="mt-3 flex items-start gap-2 text-sm text-ink-2">
            <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0" />
            {fullAddress(b.address)}
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-3">{t.sections.contact}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <TrackedLink href={telHref(b.phone)} event="phone_click" place="footer" className="inline-flex items-center gap-2 font-medium text-ink hover:text-primary-text">
                <Icon name="phone" className="h-4 w-4" />
                {b.phone}
              </TrackedLink>
            </li>
            <li>
              <TrackedLink
                href={whatsappUrl(b.whatsapp.number, b.whatsapp.prefilled_message)}
                event="whatsapp_click"
                place="footer"
                external
                className="inline-flex items-center gap-2 font-medium text-ink hover:text-primary-text"
              >
                <Icon name="whatsapp" className="h-4 w-4" />
                WhatsApp {b.whatsapp.number}
              </TrackedLink>
            </li>
            <li>
              <a href={`mailto:${b.public_email}`} className="inline-flex items-center gap-2 font-medium text-ink hover:text-primary-text">
                <Icon name="mail" className="h-4 w-4" />
                {b.public_email}
              </a>
            </li>
            <li className="flex items-start gap-2 text-ink-2">
              <Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0" />
              {summarizeHours(b.opening_hours)}
            </li>
          </ul>
          <SocialLinks social={b.social} className="mt-4" />
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-3">{site.trade_name}</h2>
          <ul className="mt-3 space-y-0.5">
            {items.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="inline-block py-1.5 text-sm text-ink-2 hover:text-primary-text">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <li>
              <Link href="/aviso-legal" className="text-ink-2 hover:text-primary-text">
                {t.footer.legal}
              </Link>
            </li>
            <li>
              <Link href="/privacidad" className="text-ink-2 hover:text-primary-text">
                {t.footer.privacy}
              </Link>
            </li>
            <li>
              <Link href="/cookies" className="text-ink-2 hover:text-primary-text">
                {t.footer.cookies}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 px-4 py-5 text-xs text-ink-3 sm:px-6">
          <span>
            © {year} {site.trade_name}
          </span>
          <span>
            {t.footer.madeBy}{" "}
            <a href={CREDIT.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-ink">
              {CREDIT.name}
            </a>
          </span>
        </p>
      </div>
    </footer>
  );
}
