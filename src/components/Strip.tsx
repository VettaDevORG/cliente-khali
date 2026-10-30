"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import Icon from "./Icon";

/**
 * Horizontal strip that works on every input: previous/next buttons, mouse drag, trackpad and touch swipe, and the
 * keyboard (the strip is focusable and scrolls with the arrow keys). Snapping stays on except while dragging.
 * `header` is rendered on the left of the buttons, inside the content width; the strip itself bleeds to the edges.
 */
export default function Strip({
  header,
  children,
  labels,
  itemSelector = "figure",
}: {
  header?: ReactNode;
  children: ReactNode;
  labels: { prev: string; next: string };
  itemSelector?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const [dragging, setDragging] = useState(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft <= 2, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2 });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const step = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const item = el.querySelector<HTMLElement>(itemSelector);
    const gap = parseFloat(getComputedStyle(el).columnGap || getComputedStyle(el).gap || "0") || 0;
    const width = item ? item.getBoundingClientRect().width + gap : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * width, behavior: "smooth" });
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = ref.current;
    if (!el) return;
    drag.current = { x: e.clientX, left: el.scrollLeft, moved: false };
    el.setPointerCapture(e.pointerId);
    setDragging(true);
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!drag.current || !el) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 3) drag.current.moved = true;
    el.scrollLeft = drag.current.left - dx;
  };
  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!drag.current || !el) return;
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    const moved = drag.current.moved;
    drag.current = null;
    setDragging(false);
    // A drag must not end as a click on a link or image inside the strip.
    if (moved) {
      const stop = (ev: Event) => {
        ev.preventDefault();
        ev.stopPropagation();
      };
      el.addEventListener("click", stop, { capture: true, once: true });
      window.setTimeout(() => el.removeEventListener("click", stop, { capture: true }), 0);
    }
  };

  const button = "flex h-11 w-11 items-center justify-center rounded-full bg-surface text-ink ring-1 ring-line shadow-sm transition-[background-color,opacity] hover:bg-surface-2 disabled:cursor-default disabled:opacity-35 disabled:hover:bg-surface";

  return (
    <div data-strip="">
      <div className="mx-auto flex w-full max-w-6xl items-end justify-between gap-6 px-4 sm:px-6">
        <div className="min-w-0 flex-1">{header}</div>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={() => step(-1)} disabled={edges.start} aria-label={labels.prev} className={button}>
            <Icon name="arrow" className="h-5 w-5 rotate-180" />
          </button>
          <button type="button" onClick={() => step(1)} disabled={edges.end} aria-label={labels.next} className={button}>
            <Icon name="arrow" className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div
        ref={ref}
        tabIndex={0}
        role="region"
        aria-roledescription="carrusel"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className={`no-scrollbar mt-8 flex gap-4 overflow-x-auto px-4 pb-2 scroll-pl-4 outline-none focus-visible:outline-3 focus-visible:outline-primary-text sm:gap-6 sm:px-6 sm:scroll-pl-6 lg:px-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] lg:scroll-pl-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] ${
          dragging ? "cursor-grabbing select-none" : "cursor-grab snap-x snap-mandatory"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
