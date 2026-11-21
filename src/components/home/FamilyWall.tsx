"use client";

import { useState } from "react";
import type { Media } from "@/lib/data";
import { Polaroid } from "@/components/families/Polaroid";
import { PhotoViewer } from "@/components/ui/PhotoViewer";

// Hand-tuned per-print reveal delay and tape placement for the 8 home prints.
const LAYOUT = [
  { d: 330, tape: "center" },
  { d: 0, tape: "left", look: true },
  { d: 550, tape: "right" },
  { d: 110, tape: "tl" },
  { d: 660, tape: "center", look: true },
  { d: 220, tape: "right" },
  { d: 770, tape: "left" },
  { d: 440, tape: "center" },
] as const;

/** The 8 captioned family prints on the home page; any print opens the full set. */
export function FamilyWall({ photos }: { photos: Media[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const prints = photos.slice(0, LAYOUT.length);
  return (
    <>
      <ul className="tp-photowall__prints" aria-label="Photos from TeddyPups families">
        {prints.map((photo, i) => (
          <li key={photo.id} data-reveal="true" data-pup-look={"look" in LAYOUT[i] ? "" : undefined} style={{ "--d": `${LAYOUT[i].d}ms` }}>
            <button
              type="button"
              className="tp-photowall__print"
              aria-label={`Open photo ${i + 1} of ${photos.length}${photo.caption ? `: ${photo.caption}` : ""}`}
              onClick={() => setOpen(i)}
            >
              <Polaroid photo={photo} index={i} tape={LAYOUT[i].tape} />
            </button>
          </li>
        ))}
      </ul>
      <PhotoViewer photos={photos} index={open} onIndex={setOpen} />
    </>
  );
}
