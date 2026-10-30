import Icon from "@/components/Icon";
import { Avatar } from "@/components/ui";
import type { SiteConfig } from "@/lib/ficha";
import type { Strings } from "@/lib/strings";

type Testimonial = SiteConfig["business"]["testimonials"][number];

export function testimonialKey(item: Testimonial): string {
  return `${item.name}-${item.text.slice(0, 20)}`;
}

/** Author line: initials in a tinted circle, the name, and the link to the review when there is one. */
export function TestimonialFooter({ item, t, onDark = false }: { item: Testimonial; t: Strings; onDark?: boolean }) {
  return (
    <footer className="mt-5 flex items-center gap-3 text-sm">
      <Avatar name={item.name} size="sm" />
      <cite className={`font-semibold not-italic ${onDark ? "text-primary-fg" : ""}`}>{item.name}</cite>
      {item.url && (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`ml-auto inline-flex items-center gap-1 font-medium ${onDark ? "text-primary-fg/80 hover:text-primary-fg" : "text-primary-text"}`}
        >
          {t.testimonials.seeOnGoogle}
          <Icon name="external" className="h-3.5 w-3.5" />
        </a>
      )}
    </footer>
  );
}

/** A big quotation mark in the accent color, faded, as the card's only ornament. */
export function QuoteMark({ className = "" }: { className?: string }) {
  return <Icon name="quote" className={`h-8 w-8 text-secondary/60 ${className}`} />;
}

/** Link to all the reviews on Google Business, when the ficha has the profile. */
export function AllOnGoogle({ site, t, onDark = false }: { site: SiteConfig; t: Strings; onDark?: boolean }) {
  const google = site.business.social.google_business;
  if (!google) return null;
  return (
    <p className="mt-10 text-center">
      <a
        href={google}
        target="_blank"
        rel="noopener noreferrer"
        className={`link-draw inline-flex items-center gap-2 font-semibold ${onDark ? "text-primary-fg" : "text-primary-text"}`}
      >
        <Icon name="google" className="h-4 w-4" />
        {t.testimonials.allOnGoogle}
      </a>
    </p>
  );
}
