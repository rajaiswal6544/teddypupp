import Link from "next/link";
import type { GonePuppy } from "@/lib/data";
import { MediaImg } from "@/components/ui/MediaImg";

const TILTS = ["-1.4deg", "1.1deg", "-0.6deg", "1.6deg", "-1.1deg", "0.8deg"];

/** "One ticket home": a stub-and-ticket card for a puppy who has found a family. */
export function Ticket({ puppy, index }: { puppy: GonePuppy; index: number }) {
  return (
    <li className="tp-ticket" data-reveal="true" style={{ "--tilt": TILTS[index % TILTS.length], "--i": String(index) }}>
      <Link className="tp-ticket__link" href={`/puppies/${puppy.slug}`}>
        <span className="tp-ticket__main">
          <span className="tp-ticket__photo">
            <MediaImg media={puppy.media[0]} />
          </span>
          <span className="tp-ticket__body">
            <span className="font-scrawl tp-ticket__kicker">one ticket home</span>
            <span className="font-plush tp-ticket__name">{puppy.ticketName}</span>
            <span className="tp-ticket__meta">{puppy.ticketMeta}</span>
            <span className="tp-ticket__route">
              <span>{puppy.routeFrom}</span>
              <svg viewBox="0 0 60 12" aria-hidden="true">
                <path d="M2 6h46" />
                <path d="M44 2l6 4-6 4" />
              </svg>
              <span>home ♥</span>
            </span>
          </span>
        </span>
        <span aria-hidden="true" className="tp-ticket__stub">
          <span className="font-plush">admit one</span>
        </span>
      </Link>
    </li>
  );
}
