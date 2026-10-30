"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { getStoredConsent } from "./CookieBanner";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/** Sends a GA4 event when analytics is loaded. Safe to call anywhere on the client. */
export function track(event: string, params: Record<string, string | number> = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", event, params);
}

/**
 * Loads Google Analytics 4 only after the visitor accepts cookies. Until then no request leaves the page.
 * Rendered only when the ficha has products.web.ga4_measurement_id.
 */
export default function Analytics({ gaId }: { gaId: string }) {
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const initial = setTimeout(() => {
      if (getStoredConsent() === "accepted") setAccepted(true);
    }, 0);
    function onConsent(e: Event) {
      setAccepted((e as CustomEvent<string>).detail === "accepted");
    }
    window.addEventListener("cookie-consent", onConsent);
    return () => {
      clearTimeout(initial);
      window.removeEventListener("cookie-consent", onConsent);
    };
  }, []);

  if (!accepted) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
