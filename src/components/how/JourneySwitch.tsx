"use client";

import { useEffect, useRef } from "react";

/**
 * Progressive enhancement for the "Two ways home" tabs. The server renders
 * both journeys (readable without JS); once hydrated, this turns them into an
 * accessible tablist with a sliding thumb and arrow-key support.
 */
export function JourneySwitch() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = ref.current!.closest<HTMLElement>(".tp-journeys")!;
    const list = root.querySelector<HTMLElement>('[role="tablist"]')!;
    const tabs = Array.from(list.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const panels = tabs.map((t) => document.getElementById(t.getAttribute("aria-controls")!)!);

    const select = (i: number, focus = false) => {
      tabs.forEach((t, j) => {
        t.setAttribute("aria-selected", String(i === j));
        t.tabIndex = i === j ? 0 : -1;
        panels[j].hidden = i !== j;
      });
      list.style.setProperty("--at", String(i));
      root.dataset.way = tabs[i].id.replace("tab-", "");
      if (focus) tabs[i].focus();
    };

    const onClick = (e: MouseEvent) => {
      const i = tabs.indexOf((e.target as Element).closest('[role="tab"]') as HTMLButtonElement);
      if (i >= 0) select(i);
    };
    const onKey = (e: KeyboardEvent) => {
      const i = tabs.indexOf(document.activeElement as HTMLButtonElement);
      if (i < 0) return;
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        select((i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length, true);
      }
    };

    // Deep link: /how-it-works#imported opens the imported journey.
    const start = location.hash === "#imported" ? 1 : 0;
    select(start);
    root.dataset.ready = "true";
    list.addEventListener("click", onClick);
    list.addEventListener("keydown", onKey);
    return () => {
      list.removeEventListener("click", onClick);
      list.removeEventListener("keydown", onKey);
    };
  }, []);

  return <span ref={ref} hidden />;
}
