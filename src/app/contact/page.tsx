import { PupBuddy } from "@/components/pup/PupBuddy";
import { Paw } from "@/components/ui/icons";
import { site } from "@/lib/site";
import type { Metadata } from "next";
import { puppies } from "@/lib/data";
import { LetterForm } from "@/components/forms/LetterForm";

export const metadata: Metadata = {
  title: "Visit & contact",
  description: "Visit our Downtown Dubai showroom or send us a note — we'll help you find your new best friend.",
};

const puppyOptions = puppies.map((p) => ({
  id: p.id,
  label: `${p.displayName} (${p.name ? `${p.breed}, ` : ""}${p.genderLabel.toLowerCase()})`,
}));

export default function ContactPage() {
  return (
    <div data-page="contact" className="tp-page">
      <section data-pup-scene="true" data-tone="light" className="tp-scene " style={{ "--sky-top": "#fff9ee", "--sky-bottom": "#f9dca4" }} aria-labelledby="contact-title">
        <div className="gutter mx-auto max-w-[110rem] pb-24 pt-10 md:pt-16">
          <header className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <h1 id="contact-title" className="font-plush text-giant max-w-[12ch] lg:col-span-7">
              Get in touch with us
            </h1>
            <p className="text-lede text-[var(--ink-soft)] lg:col-span-5 lg:pb-3">
              {"Have questions about our puppies or adoption process? Fill out the form, and our team will get back to you promptly. Whether ready to adopt or just seeking info, we'd love to hear from you!"}
            </p>
          </header>
          <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7 lg:col-start-6 lg:row-start-1">
              <LetterForm puppies={puppyOptions} />
              <PupBuddy pose="sit" facing="left" label="Teddy, waiting for your letter" className="ml-auto mr-6 -mt-3 w-36 md:w-40" />
            </div>
            <div className="lg:col-span-5 lg:row-start-1">
              <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp w-full sm:w-auto">
                WhatsApp +971 50 000 0000
              </a>
              <dl className="mt-10 space-y-6">
                <div>
                  <dt className="font-scrawl text-[var(--ink-soft)]">
                    call us
                  </dt>
                  <dd className="mt-1 text-lg font-semibold">
                    <a className="link-ink" href={site.phoneHref}>
                      +971 50 000 0000
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-scrawl text-[var(--ink-soft)]">
                    email
                  </dt>
                  <dd className="mt-1 break-all text-lg font-semibold">
                    <a className="link-ink" href={`mailto:${site.email}`}>
                      {site.email}
                    </a>
                  </dd>
                </div>
              </dl>
              <section aria-labelledby="visit-title" className="tp-shopfront mt-12">
                <svg viewBox="0 0 300 120" className="absolute -bottom-1 right-0 w-3/4 text-toffee/30" aria-hidden="true">
                  <path d="M4 116h292M20 116V78h16v38M44 116V60h18v56M70 116V84h12v32M150 116V36l4-6v-14l3-4 3 4v14l4 6v80M118 116V70l12-8v54M174 116V64l14 8v44M200 116V82h18v34M226 116V56h14v60M248 116V88h22v28" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="tp-visit relative p-7 pt-6">
                  <div>
                    <h2 id="visit-title" className="font-plush text-[2rem] leading-tight">
                      Visit us in Downtown Dubai
                    </h2>
                    <p className="mt-3 max-w-[38ch] text-cocoa-soft">
                      Step into our Downtown Dubai showroom and experience the joy of choosing your puppy face-to-face.
                    </p>
                    <p className="mt-4 flex items-center gap-2 font-semibold">
                      <Paw className="size-5 shrink-0 text-toffee-deep" />
                      Downtown Dubai, United Arab Emirates
                    </p>
                    <a href="https://www.google.com/maps/search/?api=1&query=Downtown+Dubai" target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-6 !bg-milk">
                      Open in Google Maps
                    </a>
                  </div>
                  <figure className="tp-visit__photo">
                    <img alt="The apricot teddy bear puppy from our showroom, held up to say hello" loading="lazy" style={{ position: "absolute", height: "100%", width: "100%", left: "0", top: "0", right: "0", bottom: "0", objectFit: "cover", objectPosition: "45.3% 44.4%", color: "transparent", backgroundColor: "#685848", backgroundSize: "cover", backgroundPosition: "45.3% 44.4%", backgroundRepeat: "no-repeat" }} src="/media/skvodl2NZiKq/cefab5eee9/27b888_323008bb0f6a41d4bde2a0da7206cd98f003.jpg" />
                  </figure>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
