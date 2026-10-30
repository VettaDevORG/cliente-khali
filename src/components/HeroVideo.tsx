"use client";

import { useEffect, useRef } from "react";

/**
 * The hero clip: muted, looping, no controls, with the hero photo as poster. It only starts when the hero is on
 * screen and pauses when it leaves, so it costs nothing while the visitor reads the rest. With motion off, with
 * prefers-reduced-motion, or when the browser asks to save data, the poster stays and the clip is never fetched.
 */
export default function HeroVideo({ src, type, poster, className = "" }: { src: string; type: string; poster?: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const motion = document.documentElement.dataset.motion;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (!motion || reduced || saveData) return;
    // Attach the source only now: before this line nothing is downloaded.
    const source = document.createElement("source");
    source.src = src;
    source.type = type;
    video.appendChild(source);
    video.load();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) video.play().catch(() => {});
          else video.pause();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(video);
    return () => {
      io.disconnect();
      video.pause();
    };
  }, [src, type]);

  return <video ref={ref} muted loop playsInline autoPlay preload="none" poster={poster} aria-hidden="true" tabIndex={-1} className={className} />;
}
