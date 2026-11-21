import Link from "next/link";
import { PupBuddy } from "@/components/pup/PupBuddy";

import { Door } from "@/components/puppies/Door";
import { puppies } from "@/lib/data";
import { MeetHall } from "./MeetHall";

const meetPuppies = puppies.filter((p) => p.status === "available");

export function HomeMeet() {
  return (
    <div data-section="meet">
      <section data-pup-scene="true" data-tone="light" className="tp-scene tp-meet" style={{ "--sky-top": "#fff1d8", "--sky-bottom": "#fbe3b4" }} aria-labelledby="meet-title">
        <MeetHall>
          <div className="tp-meet__stage">
            <header className="tp-meet__head gutter">
              <div>
                <h2 id="meet-title" className="font-plush text-huge">
                  Meet the pups
                </h2>
                <p className="text-lede mt-3 max-w-[44ch] text-[var(--ink-soft)]">
                  Real puppies, real photos, looking for their families right now.
                </p>
              </div>
              <Link className="btn btn-primary shrink-0" href="/puppies">
                See all available puppies
              </Link>
            </header>
            <div className="tp-meet__hall">
              <ol className="tp-meet__track" data-treadmill="true" aria-label="Puppies looking for a family">
                {meetPuppies.map((p, i) => (
                  <Door key={p.id} puppy={p} index={i} />
                ))}
                <li className="tp-door tp-door--all" data-open="true">
                  <Link className="tp-door__link" href="/puppies">
                    <span className="tp-door__frame tp-door__frame--all">
                      <span className="font-plush tp-door__all">
                        Meet them all
                      </span>
                    </span>
                  </Link>
                </li>
              </ol>
              <div aria-hidden="true" className="tp-meet__floor" />
              <div data-pup-stop="true" data-pose="walk" data-facing="right" data-act="treadmill" className="pup-stop tp-meet__teddy">
                <PupBuddy pose="sitWing" />
              </div>
            </div>
          </div>
        </MeetHall>
      </section>
    </div>
  );
}
