"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A figure from products.web.copy.stats ("15", "0 €", "100 %", "+5", "2.000") that counts up from zero the first
 * time it is on screen. Prefix, suffix and thousands separator are kept; without a number, or with motion off,
 * it renders the text as is. Server-rendered with the final value, so there is nothing to wait for without JS.
 */
export default function CountUp({ value, className = "" }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [text, setText] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const motion = document.documentElement.dataset.motion;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const match = value.match(/^([^\d]*)([\d.]+)(.*)$/);
    if (!motion || reduced || !match) return;
    const [, prefix, digits, suffix] = match;
    const target = Number(digits.replace(/\./g, ""));
    if (!Number.isFinite(target) || target === 0) return;
    const sep = digits.includes(".");
    const format = (n: number) => (sep ? n.toLocaleString("es-ES") : String(n));
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const start = performance.now();
        const duration = 1100;
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setText(`${prefix}${format(Math.round(target * eased))}${suffix}`);
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        setText(`${prefix}${format(0)}${suffix}`);
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
}
