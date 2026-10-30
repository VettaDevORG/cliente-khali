"use client";

import { useEffect } from "react";

/**
 * Marks [data-reveal] elements with data-inview when they enter the viewport; globals.css does the rest.
 * Mounted once in the layout. Elements already on screen at load settle immediately; the rest as the visitor
 * scrolls, once. Without JavaScript nothing is hidden (the CSS only applies under html[data-motion]).
 */
export default function Reveal() {
  useEffect(() => {
    const root = document.documentElement;
    if (!root.dataset.motion) return;
    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (items.length === 0) return;
    if (!("IntersectionObserver" in window)) {
      for (const el of items) el.dataset.inview = "";
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          (e.target as HTMLElement).dataset.inview = "";
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    for (const el of items) io.observe(el);
    // Safety net: whatever did not get observed in three seconds is shown anyway.
    const timer = window.setTimeout(() => {
      for (const el of items) el.dataset.inview = "";
    }, 3000);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  });
  return null;
}
