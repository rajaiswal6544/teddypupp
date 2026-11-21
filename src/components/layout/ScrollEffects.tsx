"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Page-wide scroll behaviours, re-armed on every route change:
 *  - Lenis smooth scrolling (skipped for reduced motion)
 *  - [data-reveal] elements get data-armed, then data-revealed when on screen
 *  - .tp-scene sections get data-visited / data-here as you scroll past them
 */
export function ScrollEffects() {
  const pathname = usePathname();

  useEffect(() => {
    // Flag for CSS: enhanced (JS-driven) animations are available.
    document.documentElement.setAttribute("data-js", "");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1 });
    let raf = requestAnimationFrame(function loop(t) {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    });
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const reveals = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.setAttribute("data-revealed", "true");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    for (const el of reveals) {
      // Only hide things that are still below the fold; on-screen content stays visible.
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92) {
        el.setAttribute("data-armed", "true");
        el.setAttribute("data-revealed", "true");
      } else {
        el.setAttribute("data-armed", "true");
        io.observe(el);
      }
    }

    const scenes = Array.from(document.querySelectorAll<HTMLElement>(".tp-scene"));
    const ratios = new Map<Element, number>();
    const so = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          ratios.set(e.target, e.intersectionRatio);
          if (e.isIntersecting) e.target.setAttribute("data-visited", "true");
        }
        let best: Element | null = null;
        let max = 0;
        ratios.forEach((v, k) => {
          if (v > max) {
            max = v;
            best = k;
          }
        });
        for (const s of scenes) s.setAttribute("data-here", String(s === best));
      },
      { threshold: [0, 0.15, 0.3, 0.5, 0.7, 1] },
    );
    for (const s of scenes) {
      if (!s.hasAttribute("data-visited")) s.setAttribute("data-visited", "false");
      so.observe(s);
    }
    return () => {
      io.disconnect();
      so.disconnect();
    };
  }, [pathname]);

  return null;
}
