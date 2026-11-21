"use client";

import { useEffect, useRef } from "react";

/**
 * Drives the "Your puppy journey" phone: as each numbered step scrolls past
 * the middle of the screen, the matching WhatsApp messages appear (after a
 * short "typing…" indicator). Also wires the in-chat video play button.
 */
export function ChatDriver() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = ref.current!.closest<HTMLElement>(".tp-chat")!;
    const steps = Array.from(section.querySelectorAll<HTMLElement>(".tp-chat__step"));
    const groups = Array.from(section.querySelectorAll<HTMLElement>(".tp-msg-group"));
    const typing = section.querySelector<HTMLElement>(".tp-typing");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let shown = -1;
    let timer = 0;
    let raf = 0;

    const setStep = (active: number) => {
      steps.forEach((s, i) => {
        s.toggleAttribute("data-active", i === active);
        if (i === active) s.setAttribute("data-active", "true");
        s.toggleAttribute("data-done", i < active);
        if (i < active) s.setAttribute("data-done", "true");
      });
      if (active > shown) {
        // reveal earlier groups immediately, the newest one after "typing…"
        groups.forEach((g, i) => i < active && g.setAttribute("data-show", "true"));
        window.clearTimeout(timer);
        if (reduce) {
          groups[active]?.setAttribute("data-show", "true");
        } else {
          typing?.setAttribute("data-show", "true");
          timer = window.setTimeout(() => {
            typing?.setAttribute("data-show", "false");
            groups[active]?.setAttribute("data-show", "true");
          }, 650);
        }
      } else if (active < shown) {
        groups.forEach((g, i) => g.setAttribute("data-show", String(i <= active)));
      }
      shown = active;
    };

    const update = () => {
      const line = window.innerHeight * 0.62;
      let active = 0;
      steps.forEach((s, i) => {
        if (s.getBoundingClientRect().top < line) active = i;
      });
      if (active !== shown) setStep(active);
    };

    // start from a clean slate (server HTML shows everything for no-JS visitors)
    groups.forEach((g) => g.setAttribute("data-show", "false"));
    steps.forEach((s) => {
      s.removeAttribute("data-active");
      s.removeAttribute("data-done");
    });
    update();

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const onClick = (e: MouseEvent) => {
      const btn = (e.target as Element).closest<HTMLButtonElement>(".tp-clip__play");
      if (!btn) return;
      const video = btn.parentElement?.querySelector("video");
      if (!video) return;
      if (video.paused) {
        void video.play();
        btn.setAttribute("aria-pressed", "true");
        btn.setAttribute("aria-label", "Pause video");
      } else {
        video.pause();
        btn.setAttribute("aria-pressed", "false");
        btn.setAttribute("aria-label", "Play video");
      }
    };
    section.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      section.removeEventListener("click", onClick);
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <span ref={ref} hidden />;
}
