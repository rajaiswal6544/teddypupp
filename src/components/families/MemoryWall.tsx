"use client";

import { useState } from "react";
import type { Media } from "@/lib/data";
import { Paw } from "@/components/ui/icons";
import { PhotoViewer } from "@/components/ui/PhotoViewer";
import { Polaroid } from "./Polaroid";

const TAPES = ["center", "center", "left", "right", "tl", "tr", "center", "right", "left"] as const;

/** Every family photo pinned to the wall; click any print to browse them full screen. */
export function MemoryWall({ photos }: { photos: Media[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div>
      <ul className="tp-wall" aria-label="Photos from TeddyPups families">
        {photos.map((photo, i) => (
          <li key={photo.id} className="tp-wall__item" data-reveal="true" style={{ "--d": `${(i % 4) * 60}ms` }}>
            <button type="button" className="tp-wall__print" aria-label={`Open photo ${i + 1} of ${photos.length}`} onClick={() => setOpen(i)}>
              <Polaroid photo={photo} index={i} tape={TAPES[i % TAPES.length]} keepCaption priority={i < 2} />
            </button>
            <Paw className="tp-wall__paw" />
          </li>
        ))}
      </ul>
      <PhotoViewer photos={photos} index={open} onIndex={setOpen} />
    </div>
  );
}
