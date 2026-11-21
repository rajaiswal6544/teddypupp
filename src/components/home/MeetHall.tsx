"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Pins the "Meet the pups" stage and converts vertical scroll into a
 * horizontal walk past the doors (desktop/tablet only). Doors swing open as
 * their centre crosses the middle of the screen.
 */
export function MeetHall({ children }: { children: React.ReactNode }) {
  const rangeRef = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);
  const SPEED = 1.25; // px of track movement per px of scroll

  useEffect(() => {
    const range = rangeRef.current!;
    const section = range.closest("section")!;
    const mq = window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");
    let raf = 0;
    let maxX = 0;

    const doors = () => Array.from(range.querySelectorAll<HTMLElement>(".tp-door"));
    const track = () => range.querySelector<HTMLElement>(".tp-meet__track")!;
    const hall = () => range.querySelector<HTMLElement>(".tp-meet__hall")!;

    const measure = () => {
      if (!mq.matches) {
        setPinned(false);
        section.removeAttribute("data-pinned");
        range.style.height = "";
        track().style.transform = "";
        doors().forEach((d) => (d.dataset.open = "true"));
        return;
      }
      section.setAttribute("data-pinned", "true");
      setPinned(true);
      track().style.transform = "none";
      maxX = Math.max(0, track().scrollWidth - window.innerWidth);
      range.style.height = `${window.innerHeight + maxX / SPEED}px`;
      update();
    };

    const update = () => {
      if (!mq.matches) return;
      const top = range.getBoundingClientRect().top;
      const x = Math.min(maxX, Math.max(0, -top * SPEED));
      track().style.transform = x ? `translateX(${-x}px)` : "none";
      hall().style.setProperty("--floor-x", `${(-x).toFixed(1)}px`);
      const mid = window.innerWidth * 0.4; // matches the reference: doors open a little left of centre
      for (const d of doors()) {
        const r = d.getBoundingClientRect();
        d.dataset.open = String(r.left + r.width / 2 < mid);
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    mq.addEventListener("change", measure);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      mq.removeEventListener("change", measure);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={rangeRef} data-pin-range="true" style={{ "--pinned": pinned ? "1" : "0" }}>
      {children}
    </div>
  );
}
