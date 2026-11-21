import type { Media } from "@/lib/data";

const TILTS = ["-2.2deg", "1.6deg", "-0.9deg", "2.4deg", "-1.5deg", "0.8deg", "-2.6deg", "1.2deg"];
const TAPES = ["#f6d79a", "#f9cdbf", "#cfe5f6", "#f6d79a", "#e9dcc4"];

/** Deterministic "hand-placed" look for the i-th print: tilt and tape colour. */
export function scatter(i: number) {
  return { tilt: TILTS[i % TILTS.length], tape: TAPES[i % TAPES.length] };
}

type Props = {
  photo: Media;
  index: number;
  tape: "center" | "left" | "right" | "tl" | "tr";
  /** Render the caption strip even when empty (keeps prints the same height on the wall). */
  keepCaption?: boolean;
  priority?: boolean;
};

/** A taped-up instant photo with an optional handwritten caption. */
export function Polaroid({ photo, index, tape, keepCaption, priority }: Props) {
  const { tilt, tape: tapeColour } = scatter(index);
  return (
    <span className="tp-polaroid" style={{ "--tilt": tilt, "--tape": tapeColour, "--i": String(index) }}>
      <span aria-hidden="true" className={`tp-tape tp-tape--${tape}`} />
      <span className="tp-polaroid__photo">
        <img
          alt={photo.alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
          width={photo.width}
          height={photo.height}
          src={photo.url}
          style={{ width: "100%", height: "auto", backgroundColor: photo.color }}
        />
      </span>
      {photo.caption || keepCaption ? <span className="tp-polaroid__caption font-scrawl">{photo.caption}</span> : null}
    </span>
  );
}
