"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Icon from "./Icon";
import Logo from "./Logo";
import { track } from "./Analytics";
import { buttonVariants } from "./ui";
import type { Cta, NavItem } from "@/lib/nav";

export default function Header({
  logo,
  name,
  items,
  cta,
  labels,
}: {
  logo: { src: string; width: number; height: number } | null;
  name: string;
  items: NavItem[];
  cta: Cta;
  labels: { menu: string; closeMenu: string; home: string };
}) {
  const pathname = usePathname();
  // The menu closes from the links themselves (onClick), so there is no effect on the route.
  const [open, setOpen] = useState(false);
  // Flat at the top of the page; a hairline and a shadow once the visitor has scrolled.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => href.startsWith("/") && (pathname === href || (href !== "/" && pathname.startsWith(`${href}/`)));
  const ctaEvent = cta.kind === "whatsapp" ? "whatsapp_click" : cta.kind === "call" ? "phone_click" : "cta_click";

  return (
    <header className={`sticky top-0 z-50 border-b bg-bg/90 backdrop-blur transition-[box-shadow,border-color] duration-300 ${scrolled || open ? "border-line/80 shadow-[0_8px_24px_-16px_rgb(17_24_39/0.25)]" : "border-transparent"}`}>
      <nav aria-label="Principal" className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label={`${name}, ${labels.home.toLowerCase()}`} className="min-w-0 shrink">
          <Logo logo={logo} name={name} />
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {items.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                isActive(l.href) ? "bg-primary-light text-primary-text" : "text-ink-2 hover:bg-surface-2 hover:text-ink"
              }`}
              aria-current={isActive(l.href) ? "page" : undefined}
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href={cta.href}
            {...(cta.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            onClick={() => track(ctaEvent, { place: "header" })}
            // max-sm:hidden, not `hidden`: Tailwind 4 would let the base inline-flex of the button win over `hidden`.
            className={`${buttonVariants.secondary} max-sm:hidden min-h-10! px-4! py-2! text-sm`}
          >
            {cta.kind === "whatsapp" && <Icon name="whatsapp" className="h-4 w-4" />}
            {cta.kind === "call" && <Icon name="phone" className="h-4 w-4" />}
            {cta.shortLabel}
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? labels.closeMenu : labels.menu}
            className="flex h-11 w-11 items-center justify-center rounded-full text-ink ring-1 ring-line lg:hidden"
          >
            <Icon name={open ? "x" : "menu"} className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {open && (
        <div id="menu-movil" className="border-t border-line bg-bg px-4 pb-6 pt-3 shadow-lg lg:hidden">
          <ul className="flex flex-col">
            {items.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-xl px-3 py-3 text-base font-medium ${isActive(l.href) ? "bg-primary-light text-primary-text" : "text-ink"}`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={cta.href}
            {...(cta.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            onClick={() => {
              track(ctaEvent, { place: "menu" });
              setOpen(false);
            }}
            className={`${buttonVariants.secondary} mt-3 w-full`}
          >
            {cta.kind === "whatsapp" && <Icon name="whatsapp" className="h-5 w-5" />}
            {cta.kind === "call" && <Icon name="phone" className="h-5 w-5" />}
            {cta.label}
          </a>
        </div>
      )}
    </header>
  );
}
