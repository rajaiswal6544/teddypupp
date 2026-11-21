"use client";

import { useCallback, useEffect, useRef } from "react";
import type { Media } from "@/lib/data";

type Props = {
  photos: Media[];
  index: number | null; // null = closed
  onIndex: (i: number | null) => void;
  label?: string;
};

/**
 * Full-screen photo viewer built on <dialog>: arrow keys / swipe to move,
 * Esc or Close to dismiss. Shows "n / total — caption".
 */
export function PhotoViewer({ photos, index, onIndex, label = "Photo viewer" }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const touchX = useRef<number | null>(null);
  const open = index !== null;
  const total = photos.length;

  const go = useCallback(
    (delta: number) => {
      if (index === null) return;
      onIndex((index + delta + total) % total);
    },
    [index, onIndex, total],
  );

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go]);

  const photo = index !== null ? photos[index] : null;

  return (
    <dialog
      ref={ref}
      aria-label={label}
      data-lenis-prevent="true"
      onClose={() => onIndex(null)}
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-cocoa/95 p-0 text-milk backdrop:bg-cocoa/70"
    >
      {photo ? (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-4 px-4 py-3">
            <p className="font-scrawl text-lg">
              {index! + 1} / {total}
              {photo.caption ? ` — ${photo.caption}` : ""}
            </p>
            <button type="button" onClick={() => onIndex(null)} className="h-11 rounded-full bg-milk px-5 font-semibold text-cocoa">
              Close
            </button>
          </div>
          <div
            className="relative flex-1 overflow-hidden"
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
              touchX.current = null;
            }}
          >
            {photo.kind === "video" ? (
              <video
                key={photo.id}
                src={photo.url}
                poster={photo.poster?.url}
                className="absolute inset-0 h-full w-full object-contain"
                controls
                autoPlay
                playsInline
              />
            ) : (
              <img
                key={photo.id}
                alt={photo.alt}
                src={photo.url}
                className="absolute inset-0 h-full w-full object-contain"
                decoding="async"
              />
            )}
          </div>
          <div className="flex justify-center gap-3 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3">
            <button type="button" onClick={() => go(-1)} className="h-12 rounded-full border-2 border-milk px-6 font-semibold">
              Previous
            </button>
            <button type="button" onClick={() => go(1)} className="h-12 rounded-full bg-honey px-6 font-semibold text-cocoa">
              Next
            </button>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
