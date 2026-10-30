import Icon from "./Icon";
import TrackedLink from "./TrackedLink";
import { buttonVariants } from "./ui";
import type { Cta } from "@/lib/nav";

/**
 * Bottom bar on phones with the primary call to action and the secondary channel.
 * Stays above the cookie banner through --cookie-h. Hidden from md up, where the header carries the button.
 */
export default function StickyCta({ primary, secondary }: { primary: Cta; secondary: Cta | null }) {
  const event = (c: Cta) => (c.kind === "whatsapp" ? "whatsapp_click" : c.kind === "call" ? "phone_click" : "cta_click");
  const icon = (c: Cta) => (c.kind === "whatsapp" ? "whatsapp" : c.kind === "call" ? "phone" : "mail");
  return (
    <div
      className="fixed inset-x-0 z-[80] border-t border-line bg-bg/95 px-3 py-2 backdrop-blur md:hidden"
      style={{ bottom: "var(--cookie-h, 0px)", paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex max-w-md gap-2">
        {secondary && (
          <TrackedLink
            href={secondary.href}
            event={event(secondary)}
            place="sticky"
            external={secondary.external}
            className={`${buttonVariants.outline} flex-1 !px-4 text-sm`}
          >
            <Icon name={icon(secondary)} className="h-5 w-5" />
            {secondary.shortLabel}
          </TrackedLink>
        )}
        <TrackedLink
          href={primary.href}
          event={event(primary)}
          place="sticky"
          external={primary.external}
          className={`${buttonVariants.secondary} flex-[1.4] !px-4 text-sm`}
        >
          <Icon name={icon(primary)} className="h-5 w-5" />
          {primary.shortLabel}
        </TrackedLink>
      </div>
    </div>
  );
}
