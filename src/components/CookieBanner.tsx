"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "cookie-consent";

export type ConsentValue = "accepted" | "rejected" | null;

export function getStoredConsent(): ConsentValue {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === "accepted" || v === "rejected" ? v : null;
  } catch {
    return null;
  }
}

/**
 * Consent bar. Rendered only when analytics is configured: without GA4 the site sets no cookies and there
 * is nothing to ask. Appears on the first scroll or tap (or after 8 s) so it never covers the first view.
 * Publishes its height as --cookie-h so the sticky contact bar can sit above it.
 */
export default function CookieBanner({
  texts,
}: {
  texts: { message: string; accept: string; reject: string; more: string };
}) {
  const [visible, setVisible] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (getStoredConsent() !== null) return;
    const show = () => {
      setVisible(true);
      cleanup();
    };
    const events: (keyof WindowEventMap)[] = ["scroll", "pointerdown", "keydown"];
    const timer = setTimeout(show, 8000);
    function cleanup() {
      clearTimeout(timer);
      for (const e of events) window.removeEventListener(e, show);
    }
    for (const e of events) window.addEventListener(e, show, { passive: true, once: true });
    return cleanup;
  }, []);

  useEffect(() => {
    const el = barRef.current;
    const root = document.documentElement;
    if (!visible || !el) {
      root.style.removeProperty("--cookie-h");
      return;
    }
    const ro = new ResizeObserver(() => root.style.setProperty("--cookie-h", `${el.offsetHeight}px`));
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.style.removeProperty("--cookie-h");
    };
  }, [visible]);

  function setConsent(value: "accepted" | "rejected") {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Private mode or blocked storage: the bar simply shows again next visit.
    }
    window.dispatchEvent(new CustomEvent("cookie-consent", { detail: value }));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      ref={barRef}
      role="region"
      aria-label="Cookies"
      className="fixed inset-x-0 bottom-0 z-[90] border-t border-line bg-white px-4 py-3 shadow-[0_-4px_16px_rgb(0_0_0/0.06)] sm:px-6"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-2">
          {texts.message}{" "}
          <Link href="/cookies" className="font-medium text-primary-text underline underline-offset-4">
            {texts.more}
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => setConsent("rejected")}
            className="min-h-11 rounded-full px-4 text-sm font-semibold text-ink-2 ring-1 ring-line hover:bg-surface-2"
          >
            {texts.reject}
          </button>
          <button
            type="button"
            onClick={() => setConsent("accepted")}
            className="min-h-11 rounded-full bg-primary px-4 text-sm font-semibold text-primary-fg hover:bg-primary-dark"
          >
            {texts.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
