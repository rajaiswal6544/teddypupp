import Link from "next/link";
import { PupBuddy } from "@/components/pup/PupBuddy";
import { site } from "@/lib/site";

import { ChatDriver } from "./ChatDriver";

export function HomeJourney() {
  return (
    <div data-section="journey">
      <section data-pup-scene="true" data-tone="light" className="tp-scene tp-chat" style={{ "--sky-top": "#f7d18d", "--sky-bottom": "#f0b866" }} aria-labelledby="journey-title">
        <ChatDriver />
        <div className="tp-chat__grid gutter" data-pin-range="true">
          <div className="tp-chat__story">
            <h2 id="journey-title" className="font-plush text-huge">
              Your puppy journey
            </h2>
            <p className="text-lede mt-5 max-w-[42ch] text-[var(--ink-soft)]">
              A premium, step-by-step concierge experience. We make adoption simple, secure, and purely joyful.
            </p>
            <ol className="tp-chat__steps">
              <li className="tp-chat__step" data-done="true">
                <span className="tp-chat__num font-plush" aria-hidden="true">
                  1
                </span>
                <h3 className="font-plush tp-chat__title">
                  Choose your breed
                </h3>
                <p className="tp-chat__text">
                  {"Select your preferred breed or tell us what you're looking for. We'll guide you based on availability and your lifestyle."}
                </p>
              </li>
              <li className="tp-chat__step" data-done="true">
                <span className="tp-chat__num font-plush" aria-hidden="true">
                  2
                </span>
                <h3 className="font-plush tp-chat__title">
                  {"Get photos & details"}
                </h3>
                <p className="tp-chat__text">
                  Our team will share real photos, health details, and all necessary information directly on WhatsApp.
                </p>
              </li>
              <li className="tp-chat__step" data-active="true">
                <span className="tp-chat__num font-plush" aria-hidden="true">
                  3
                </span>
                <h3 className="font-plush tp-chat__title">
                  {"Secure & safe delivery"}
                </h3>
                <p className="tp-chat__text">
                  Once confirmed, we handle everything professionally and ensure your puppy reaches you safely and stress-free.
                </p>
              </li>
            </ol>
            <Link className="btn btn-ghost tp-chat__cta" href="/how-it-works">
              How it works
            </Link>
          </div>
          <div className="tp-chat__side">
            <div className="tp-phone" aria-label="A WhatsApp conversation with TeddyPups U.A.E." role="group">
              <div className="tp-phone__bar">
                <img alt="" loading="lazy" width="40" height="40" className="tp-phone__avatar" style={{ color: "transparent" }} src="/brand/logo.png" />
                <span>
                  <span className="tp-phone__name">
                    TeddyPups U.A.E.
                  </span>
                  <span className="tp-phone__status">
                    online
                  </span>
                </span>
              </div>
              <div className="tp-phone__screen">
                <p className="tp-msg tp-msg--me">
                  {"Hi TeddyPups! I'd love to know more about your puppies."}
                </p>
                <div className="tp-msg-group" data-step="0" data-show="true">
                  <div className="tp-msg tp-msg--them">
                    <p>
                      {"Select your preferred breed or tell us what you're looking for. We'll guide you based on availability and your lifestyle."}
                    </p>
                    <ul className="tp-chips" aria-label="Breeds we have now">
                      <li>
                        <Link href="/puppies?breed=maltipoo">
                          Maltipoo
                        </Link>
                      </li>
                      <li>
                        <Link href="/puppies?breed=pomeranian">
                          Pomeranian
                        </Link>
                      </li>
                      <li>
                        <Link href="/puppies?breed=poodle">
                          Poodle
                        </Link>
                      </li>
                      <li>
                        <Link href="/puppies?breed=cavapoo">
                          Cavapoo
                        </Link>
                      </li>
                      <li>
                        <Link href="/puppies?breed=shih-tzu">
                          Shih Tzu
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="tp-msg-group" data-step="1" data-show="true">
                  <div className="tp-msg tp-msg--them tp-msg--media">
                    <div className="tp-snaps">
                      <span className="tp-snaps__one">
                        <img alt="A tiny apricot teddy bear puppy held up in the TeddyPups showroom" loading="lazy" style={{ position: "absolute", height: "100%", width: "100%", left: "0", top: "0", right: "0", bottom: "0", objectFit: "cover", objectPosition: "54.3% 48.3%", color: "transparent", backgroundColor: "#685848", backgroundSize: "cover", backgroundPosition: "54.3% 48.3%", backgroundRepeat: "no-repeat" }} src="/media/FHyoHcIosLZE/60f6e7e00a/27b888_323008bb0f6a41d4bde2a0da7206cd98f000.jpg" />
                      </span>
                      <span className="tp-snaps__one">
                        <img alt="The apricot teddy bear puppy from our showroom, close up" loading="lazy" style={{ position: "absolute", height: "100%", width: "100%", left: "0", top: "0", right: "0", bottom: "0", objectFit: "cover", objectPosition: "46.0% 44.4%", color: "transparent", backgroundColor: "#685848", backgroundSize: "cover", backgroundPosition: "46.0% 44.4%", backgroundRepeat: "no-repeat" }} src="/media/Vi-kzyvemRl4/e740ed8a24/27b888_323008bb0f6a41d4bde2a0da7206cd98f001.jpg" />
                      </span>
                      <span className="tp-snaps__one">
                        <img alt="The apricot teddy bear puppy from our showroom, looking up" loading="lazy" style={{ position: "absolute", height: "100%", width: "100%", left: "0", top: "0", right: "0", bottom: "0", objectFit: "cover", objectPosition: "43.7% 40.2%", color: "transparent", backgroundColor: "#080818", backgroundSize: "cover", backgroundPosition: "43.7% 40.2%", backgroundRepeat: "no-repeat" }} src="/media/g_e4ebbc7fyG/8276289ae7/27b888_323008bb0f6a41d4bde2a0da7206cd98f002.jpg" />
                      </span>
                      <span className="tp-snaps__one">
                        <img alt="The apricot teddy bear puppy from our showroom, held up to say hello" loading="lazy" style={{ position: "absolute", height: "100%", width: "100%", left: "0", top: "0", right: "0", bottom: "0", objectFit: "cover", objectPosition: "45.3% 44.4%", color: "transparent", backgroundColor: "#685848", backgroundSize: "cover", backgroundPosition: "45.3% 44.4%", backgroundRepeat: "no-repeat" }} src="/media/skvodl2NZiKq/cefab5eee9/27b888_323008bb0f6a41d4bde2a0da7206cd98f003.jpg" />
                      </span>
                    </div>
                  </div>
                  <div className="tp-msg tp-msg--them tp-msg--media">
                    <div className="tp-clip">
                      <video src="/media/dSAUmXs8Qai9/ef39cbea20/27b888_323008bb0f6a41d4bde2a0da7206cd98-720p.mp4" poster="/media/FHyoHcIosLZE/60f6e7e00a/27b888_323008bb0f6a41d4bde2a0da7206cd98f000.jpg" muted loop playsInline preload="none" aria-label="Video of a tiny apricot teddy bear puppy in the TeddyPups showroom" />
                      <button type="button" className="tp-clip__play" aria-pressed="false" aria-label="Play video">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="tp-msg tp-msg--them">
                    Our team will share real photos, health details, and all necessary information directly on WhatsApp.
                  </p>
                </div>
                <div className="tp-msg-group" data-step="2" data-show="true">
                  <div className="tp-msg tp-msg--them">
                    <p>
                      Once confirmed, we handle everything professionally and ensure your puppy reaches you safely and stress-free.
                    </p>
                    <svg viewBox="0 0 220 70" className="tp-route" aria-hidden="true">
                      <path d="M14 52 C 60 6, 120 70, 170 28" className="tp-route__line" />
                      <circle cx="14" cy="52" r="5" className="tp-route__dot" />
                      <path d="M164 32 l12 -12 l12 12 v14 h-24 z" className="tp-route__home" />
                      <path d="M176 42 c-2-3-7-2-6 2c1 3 6 5 6 5s5-2 6-5c1-4-4-5-6-2z" className="tp-route__heart" />
                      <path d="M32 30.5c-7.6 0-15.6 8.3-15.6 15.5 0 5.4 4.2 8.3 9.2 8.3 2.6 0 4.5-1.1 6.4-1.1s3.8 1.1 6.4 1.1c5 0 9.2-2.9 9.2-8.3 0-7.2-8-15.5-15.6-15.5zM19.28 26.71C21.07 30.08 20.42 33.92 17.84 35.29C15.25 36.67 11.71 35.05 9.92 31.69C8.13 28.32 8.78 24.48 11.36 23.11C13.95 21.73 17.49 23.35 19.28 26.71ZM29.62 15.64C30.32 19.62 28.46 23.26 25.47 23.79C22.48 24.32 19.48 21.53 18.78 17.56C18.08 13.58 19.94 9.94 22.93 9.41C25.92 8.88 28.92 11.67 29.62 15.64ZM45.22 17.56C44.52 21.53 41.52 24.32 38.53 23.79C35.54 23.26 33.68 19.62 34.38 15.64C35.08 11.67 38.08 8.88 41.07 9.41C44.06 9.94 45.92 13.58 45.22 17.56ZM54.08 31.69C52.29 35.05 48.75 36.67 46.16 35.29C43.58 33.92 42.93 30.08 44.72 26.71C46.51 23.35 50.05 21.73 52.64 23.11C55.22 24.48 55.87 28.32 54.08 31.69Z" transform="translate(70 22) scale(.3) rotate(70 32 32)" className="tp-route__paw" />
                      <path d="M32 30.5c-7.6 0-15.6 8.3-15.6 15.5 0 5.4 4.2 8.3 9.2 8.3 2.6 0 4.5-1.1 6.4-1.1s3.8 1.1 6.4 1.1c5 0 9.2-2.9 9.2-8.3 0-7.2-8-15.5-15.6-15.5zM19.28 26.71C21.07 30.08 20.42 33.92 17.84 35.29C15.25 36.67 11.71 35.05 9.92 31.69C8.13 28.32 8.78 24.48 11.36 23.11C13.95 21.73 17.49 23.35 19.28 26.71ZM29.62 15.64C30.32 19.62 28.46 23.26 25.47 23.79C22.48 24.32 19.48 21.53 18.78 17.56C18.08 13.58 19.94 9.94 22.93 9.41C25.92 8.88 28.92 11.67 29.62 15.64ZM45.22 17.56C44.52 21.53 41.52 24.32 38.53 23.79C35.54 23.26 33.68 19.62 34.38 15.64C35.08 11.67 38.08 8.88 41.07 9.41C44.06 9.94 45.92 13.58 45.22 17.56ZM54.08 31.69C52.29 35.05 48.75 36.67 46.16 35.29C43.58 33.92 42.93 30.08 44.72 26.71C46.51 23.35 50.05 21.73 52.64 23.11C55.22 24.48 55.87 28.32 54.08 31.69Z" transform="translate(104 38) scale(.3) rotate(100 32 32)" className="tp-route__paw" />
                    </svg>
                  </div>
                </div>
                <p className="tp-typing" data-show="false" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </p>
              </div>
              <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="tp-phone__compose">
                <span>
                  Say hello on WhatsApp
                </span>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 20l18-8L3 4v6l12 2-12 2z" />
                </svg>
              </a>
            </div>
            <div data-pup-stop="true" data-pose="sit" data-facing="right" className="pup-stop tp-chat__teddy">
              <PupBuddy pose="sitWing" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
