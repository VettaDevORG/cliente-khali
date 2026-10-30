import type { CSSProperties, ReactNode } from "react";
import { initials } from "@/lib/format";

/*
 * Primitives shared by every block variant. Radius, shadow, soft background, section spacing and motion come from
 * the preset tokens (rounded-card, rounded-btn, rounded-media, shadow-card, bg-soft, .section-y, .lift, [data-reveal]),
 * colors from the brand, so a variant never hardcodes a look: it composes these.
 */

/** Props for an element that settles into place when it scrolls into view; i staggers siblings. */
export function reveal(i = 0): { "data-reveal": string; style: CSSProperties } {
  return { "data-reveal": "", style: { "--i": i } as CSSProperties };
}

export function Container({ children, className = "", narrow = false }: { children: ReactNode; className?: string; narrow?: boolean }) {
  return <div className={`mx-auto w-full ${narrow ? "max-w-3xl" : "max-w-6xl"} px-4 sm:px-6 ${className}`}>{children}</div>;
}

export type SectionTone = "default" | "soft" | "primary" | "secondary";

const tones: Record<SectionTone, string> = {
  default: "",
  soft: "bg-soft",
  primary: "bg-primary text-primary-fg",
  secondary: "bg-secondary text-secondary-fg",
};

export function Section({
  children,
  id,
  tone = "default",
  className = "",
}: {
  children: ReactNode;
  id?: string;
  tone?: SectionTone;
  className?: string;
}) {
  return (
    <section id={id} className={`section-y relative ${tones[tone]} ${className}`}>
      {children}
    </section>
  );
}

/** Short label before a title: a small accent bar and sentence-case text. Only where it adds information (a place, a category). */
export function Kicker({ children, onDark = false, className = "" }: { children: ReactNode; onDark?: boolean; className?: string }) {
  return (
    <p className={`inline-flex items-center gap-2.5 text-sm font-semibold ${onDark ? "text-white/85" : "text-secondary-text"} ${className}`}>
      <span aria-hidden="true" className={`h-0.5 w-6 rounded-full ${onDark ? "bg-white/70" : "bg-secondary"}`} />
      {children}
    </p>
  );
}

export function SectionHeading({
  title,
  lead,
  kicker,
  onDark = false,
  center = false,
  hidden = false,
  as: Tag = "h2",
}: {
  title: string;
  lead?: string;
  kicker?: string;
  onDark?: boolean;
  center?: boolean;
  /** The page header already shows the title: render only the lead, if any. */
  hidden?: boolean;
  as?: "h1" | "h2";
}) {
  if (hidden) {
    // The heading stays in the document (screen readers, heading order h1 → h2 → h3); only the eyes skip it.
    return (
      <>
        <Tag className="sr-only">{title}</Tag>
        {lead && <p className={`max-w-2xl text-lg ${onDark ? "opacity-90" : "text-ink-2"}`}>{lead}</p>}
      </>
    );
  }
  return (
    <div {...reveal()} className={`${center ? "mx-auto text-center" : ""} max-w-2xl`}>
      {kicker && <Kicker onDark={onDark} className="mb-4">{kicker}</Kicker>}
      <Tag className="display text-balance text-3xl sm:text-4xl lg:text-[2.75rem]">{title}</Tag>
      {lead && <p className={`mt-4 text-lg leading-relaxed ${onDark ? "opacity-90" : "text-ink-2"}`}>{lead}</p>}
    </div>
  );
}

export const buttonBase =
  "group inline-flex min-h-12 items-center justify-center gap-2 rounded-btn px-6 py-3 text-base font-semibold transition-[background-color,box-shadow,transform,color] duration-200 active:scale-[0.98]";

export const buttonVariants = {
  primary: `${buttonBase} bg-primary text-primary-fg shadow-md shadow-primary/20 hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/25`,
  secondary: `${buttonBase} bg-secondary text-secondary-fg shadow-md shadow-secondary/25 hover:bg-secondary-dark hover:shadow-lg hover:shadow-secondary/30`,
  whatsapp: `${buttonBase} bg-wa text-white shadow-md shadow-wa/25 hover:bg-wa-dark hover:shadow-lg`,
  outline: `${buttonBase} bg-surface text-ink ring-1 ring-line hover:ring-ink-3 hover:bg-white`,
  light: `${buttonBase} bg-white text-ink shadow-sm hover:bg-surface-2`,
  /** On a dark photo overlay: translucent white, white text. */
  ghost: `${buttonBase} bg-white/15 text-white ring-1 ring-white/40 backdrop-blur-sm hover:bg-white/25`,
  /** On a bg-primary band: translucent, in the foreground color that reads on the primary. */
  ghostPrimary: `${buttonBase} bg-primary-fg/15 text-primary-fg ring-1 ring-primary-fg/40 hover:bg-primary-fg/25`,
};

export type ButtonVariant = keyof typeof buttonVariants;

export function Card({
  children,
  className = "",
  as: Tag = "div",
  hover = false,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
  /** Lifts on hover (amount from the motion level). */
  hover?: boolean;
} & Record<string, unknown>) {
  return (
    <Tag {...rest} className={`rounded-card bg-surface p-6 ring-1 ring-line shadow-card ${hover ? "lift hover:shadow-lg hover:ring-primary/20" : ""} ${className}`}>
      {children}
    </Tag>
  );
}

/** Small rounded label: towns, tags. */
export function Chip({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`inline-flex items-center rounded-full bg-primary-light px-3 py-1.5 text-sm font-medium text-primary-text ${className}`}>{children}</span>;
}

/** Step number in a circle. Only for real sequences. */
export function Numeral({ n, size = "md", onDark = false }: { n: number | string; size?: "sm" | "md" | "lg"; onDark?: boolean }) {
  const sizes = { sm: "h-8 w-8 text-sm", md: "h-10 w-10 text-base", lg: "h-14 w-14 text-xl" };
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full font-heading font-bold ${sizes[size]} ${
        onDark ? "bg-white/15 text-white ring-1 ring-white/30" : "bg-primary text-primary-fg shadow-md shadow-primary/25"
      }`}
    >
      {n}
    </span>
  );
}

/** Rounded frame for photos, with the preset radius and shadow, and a gentle zoom of the image on hover. */
export function Media({ children, className = "", zoom = true }: { children: ReactNode; className?: string; zoom?: boolean }) {
  return <div className={`overflow-hidden rounded-media shadow-card ${zoom ? "zoom-media" : ""} ${className}`}>{children}</div>;
}

/** A check mark in a small tinted circle, for lists of included things and differentiators. */
export function CheckDot({ onDark = false, tone = "primary" }: { onDark?: boolean; tone?: "primary" | "secondary" }) {
  return (
    <span
      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
        onDark ? "bg-white/20 text-white" : tone === "secondary" ? "bg-secondary text-secondary-fg" : "bg-primary text-primary-fg"
      }`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </span>
  );
}

/** Initials in a tinted circle for people without a photo (reviews, team). The tint alternates by name length. */
export function Avatar({ name, size = "md", className = "" }: { name: string; size?: "sm" | "md" | "lg"; className?: string }) {
  const sizes = { sm: "h-9 w-9 text-xs", md: "h-11 w-11 text-sm", lg: "h-20 w-20 text-2xl sm:h-24 sm:w-24" };
  const tint = name.length % 2 === 0 ? "bg-primary-light text-primary-text" : "bg-secondary-light text-secondary-text";
  return (
    <span aria-hidden="true" className={`flex shrink-0 items-center justify-center rounded-full font-heading font-bold ${sizes[size]} ${tint} ${className}`}>
      {initials(name)}
    </span>
  );
}

/**
 * Two soft glows in the brand colors behind a hero, drifting slowly. Pure CSS, no request, clipped by the parent
 * (which needs `relative overflow-hidden`). Decorative: hidden from assistive tech.
 */
export function Glow({ strength = 1 }: { strength?: number }) {
  const a = `color-mix(in srgb, var(--brand-primary) ${Math.round(22 * strength)}%, transparent)`;
  const b = `color-mix(in srgb, var(--brand-secondary) ${Math.round(18 * strength)}%, transparent)`;
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="drift absolute -left-[10%] -top-[20%] h-[60vmin] w-[60vmin] rounded-full blur-3xl" style={{ background: `radial-gradient(closest-side, ${a}, transparent)` }} />
      <div className="drift-slow absolute -bottom-[25%] -right-[5%] h-[55vmin] w-[55vmin] rounded-full blur-3xl" style={{ background: `radial-gradient(closest-side, ${b}, transparent)` }} />
    </div>
  );
}
