"use client";

import { useState } from "react";
import type { Media } from "@/lib/data";
import { MediaImg } from "@/components/ui/MediaImg";
import { PhotoViewer } from "@/components/ui/PhotoViewer";

/**
 * Puppy photo book: a big "page" with prev/next, a row of thumbnails, and a
 * full-screen viewer. Videos show their poster in the book and play in the viewer.
 */
export function Gallery({ name, media }: { name: string; media: Media[] }) {
  const [index, setIndex] = useState(0);
  const [viewer, setViewer] = useState<number | null>(null);
  const [turn, setTurn] = useState<"next" | "prev" | null>(null);
  const total = media.length;
  const current = media[index];
  const kindLabel = (m: Media) => (m.kind === "video" ? "video" : "photo");

  const go = (delta: number) => {
    setTurn(delta > 0 ? "next" : "prev");
    setIndex((i) => (i + delta + total) % total);
  };

  return (
    <div>
      <div className="tp-storypage relative aspect-[4/5] md:aspect-[5/6]">
        <button
          type="button"
          key={current.id}
          data-turn={turn ?? undefined}
          className="tp-storypage__leaf absolute inset-0 block size-full"
          aria-label={`Open ${name}, ${kindLabel(current)} ${index + 1} of ${total} full screen`}
          onClick={() => setViewer(index)}
        >
          <MediaImg media={current} priority={index === 0} alt={current.alt} />
          {current.kind === "video" ? (
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid size-20 place-items-center rounded-full border-[3px] border-cocoa bg-milk/95 text-3xl text-cocoa">▶</span>
            </span>
          ) : null}
        </button>
        {total > 1 ? (
          <div className="absolute inset-x-4 bottom-4 flex justify-between">
            <button
              type="button"
              onClick={() => go(-1)}
              className="grid size-12 place-items-center rounded-full border-2 border-cocoa bg-milk/95 text-xl font-bold"
              aria-label="Previous photo"
            >
              ‹
            </button>
            <span className="self-center rounded-full bg-cocoa/80 px-3 py-1 text-sm font-semibold text-milk">
              {index + 1} / {total}
            </span>
            <button
              type="button"
              onClick={() => go(1)}
              className="grid size-12 place-items-center rounded-full border-2 border-cocoa bg-milk/95 text-xl font-bold"
              aria-label="Next photo"
            >
              ›
            </button>
          </div>
        ) : null}
      </div>
      {total > 1 ? (
        <ul className="mt-3 flex gap-3 overflow-x-auto px-1 pb-2 pt-2 [scrollbar-width:thin]" aria-label={`All photos of ${name}`}>
          {media.map((m, i) => (
            <li key={m.id} className="shrink-0">
              <button
                type="button"
                aria-label={`${name}, ${kindLabel(m)} ${i + 1} of ${total}`}
                aria-current={i === index}
                onClick={() => {
                  setTurn(i > index ? "next" : "prev");
                  setIndex(i);
                }}
                className={`relative block h-24 w-20 overflow-hidden rounded-[0.9rem] border-[3px] transition-transform duration-300 md:h-28 md:w-24 ${
                  i === index ? "-rotate-3 -translate-y-1 border-toffee-deep" : "border-cocoa/30 hover:-rotate-2 hover:border-cocoa"
                }`}
              >
                <MediaImg media={m} alt="" />
                {m.kind === "video" ? (
                  <span className="absolute inset-0 grid place-items-center bg-cocoa/30 text-lg text-milk">▶</span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <PhotoViewer photos={media} index={viewer} onIndex={setViewer} label={`${name} photos`} />
    </div>
  );
}
