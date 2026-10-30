"use client";

import type { ReactNode } from "react";
import { track } from "./Analytics";

/**
 * Anchor that reports a GA4 event when clicked. Server components use it for WhatsApp and phone links
 * so the rest of the page stays on the server.
 */
export default function TrackedLink({
  href,
  event,
  place,
  external = false,
  className,
  ariaLabel,
  children,
}: {
  href: string;
  event: "whatsapp_click" | "phone_click" | "cta_click" | "map_open";
  place: string;
  external?: boolean;
  className?: string;
  ariaLabel?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className={className}
      aria-label={ariaLabel}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onClick={() => track(event, { place })}
    >
      {children}
    </a>
  );
}
