import Link from "next/link";
import type { Puppy } from "@/lib/data";
import { MediaImg } from "@/components/ui/MediaImg";
import { Paw } from "@/components/ui/icons";

export const DOOR_COLOURS = ["#a24a1a", "#5a3a28", "#d4893f", "#b8644a", "#7a4a2e"];

/** "Maltipoo, boy, 3 months, with video" */
export function PuppyMeta({ puppy }: { puppy: Puppy }) {
  const hasVideo = puppy.media.some((m) => m.kind === "video");
  return (
    <>
      {puppy.name ? `${puppy.breed}, ` : ""}
      {puppy.genderLabel.toLowerCase()}
      {puppy.age ? `, ${puppy.age}` : ""}
      {hasVideo ? ", with video" : ""}
    </>
  );
}

/** A puppy behind an arched door: the door swings open to reveal the photo. */
export function Door({ puppy, index, open }: { puppy: Puppy; index: number; open?: boolean }) {
  return (
    <li className="tp-door" data-open={open ?? true}>
      <Link className="tp-door__link" style={{ "--door": DOOR_COLOURS[index % DOOR_COLOURS.length] }} href={`/puppies/${puppy.slug}`}>
        <span className="tp-door__plate">
          <span className="font-plush tp-door__name">{puppy.displayName}</span>
          <span className="tp-door__meta">
            <PuppyMeta puppy={puppy} />
          </span>
        </span>
        <span className="tp-door__frame">
          <span className="tp-door__room">
            <MediaImg media={puppy.cover} />
          </span>
          <span aria-hidden="true" className="tp-door__way">
            <span className="tp-door__leaf">
              <Paw className="tp-door__peephole" />
              <span className="tp-door__knob" />
            </span>
          </span>
          <span className="tp-door__tag font-scrawl">{puppy.status === "available" ? "Available" : "Reserved"}</span>
        </span>
      </Link>
    </li>
  );
}
