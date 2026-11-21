import Link from "next/link";
import { PupBuddy } from "@/components/pup/PupBuddy";

import { familyPhotos } from "@/lib/data";
import { FamilyWall } from "./FamilyWall";

// Captioned prints first, as on the reference home page.
const homePhotos = [...familyPhotos.filter((p) => p.caption), ...familyPhotos.filter((p) => !p.caption)];

export function HomeFamilies() {
  return (
    <div data-section="families">
      <section data-pup-scene="true" data-tone="dark" className="tp-scene tp-dusk" style={{ "--sky-top": "#a65a30", "--sky-bottom": "#4d2b19" }} aria-labelledby="dusk-title">
        <div className="tp-dusk__sky gutter">
          <div className="tp-dusk__head">
            <h2 id="dusk-title" className="font-plush text-huge">
              {"Happy families & puppies"}
            </h2>
            <p className="text-lede mt-5 max-w-[50ch] text-[var(--ink-soft)]">
              We are truly honored to see our puppies become cherished members of loving families. These heartwarming moments have been shared by our valued clients who welcomed a Teddy Pup into their homes and hearts.
            </p>
          </div>
          <figure className="tp-dusk__note">
            <blockquote className="font-plush-text">
              “TeddyPups truly made our dream a reality. They supported us at every step of the import journey. Our Maltipoo arrived healthy, cheerful, and absolutely perfect. Having 24/7 support throughout the process gave us complete peace of mind.”
            </blockquote>
            <figcaption className="font-scrawl">
              Sarah M., Dubai, UAE
            </figcaption>
          </figure>
        </div>
        <div className="tp-photowall">
          <div className="tp-photowall__wall">
            <FamilyWall photos={homePhotos} />
            <div className="tp-facade__ground">
              <span aria-hidden="true" className="tp-facade__door" />
              <span aria-hidden="true" className="tp-lamp">
                <span className="tp-lamp__light" />
              </span>
              <Link className="btn btn-primary tp-facade__cta" href="/happy-families">
                See every happy family
              </Link>
              <div data-pup-stop="true" data-pose="sit" data-facing="right" className="pup-stop tp-dusk__teddy">
                <PupBuddy pose="sitWing" />
              </div>
            </div>
          </div>
          <div aria-hidden="true" className="tp-street__pavement" />
        </div>
        <dialog aria-label="Photo viewer" className="m-0 h-dvh max-h-none w-screen max-w-none bg-cocoa/95 p-0 text-milk backdrop:bg-cocoa/70" data-lenis-prevent="true" />
      </section>
    </div>
  );
}
