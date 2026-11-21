import Link from "next/link";
import { PupBuddy } from "@/components/pup/PupBuddy";
import type { Metadata } from "next";
import { Suspense } from "react";
import { breedFilters, gonePuppies, puppies } from "@/lib/data";
import { Sketch, goneCard, puppyCard } from "@/components/puppies/Sketch";
import { PuppyFilters, type FilterablePup } from "@/components/puppies/PuppyFilters";

export const metadata: Metadata = {
  title: "Available puppies",
  description: "Teacup and teddy bear puppies available now in Dubai, with real photos and videos of every puppy.",
};

const breedOptions = breedFilters.map((b) => ({ value: b.slug, label: b.name }));

const filterable: FilterablePup[] = puppies.map((p) => ({
  card: puppyCard(p),
  where: [p.origin.slug, ...p.collections.map((c) => c.slug)],
  breeds: p.breeds.map((b) => b.slug),
  gender: p.gender,
}));

// "where" stickers come from the data: origins first, then collections (e.g. Korean Teacup).
const whereOptions = [
  ...new Map(
    puppies.flatMap((p) => [
      [p.origin.slug, p.origin.slug === "local" ? "In Dubai" : p.origin.name] as const,
      ...p.collections.map((c) => [c.slug, c.name] as const),
    ]),
  ),
].map(([value, label]) => ({ value, label }));

/** No-JS / pre-hydration fallback: every puppy, unfiltered. */
function AllSketches() {
  return (
    <ul className="tp-sketches mt-20">
      {puppies.map((p, i) => (
        <li key={p.id}>
          <Sketch card={puppyCard(p)} index={i} />
        </li>
      ))}
    </ul>
  );
}

export default function PuppiesPage() {
  return (
    <div data-page="pups" className="tp-page">
      <section aria-labelledby="pups-title" className="tp-sketchbook">
        <div className="gutter mx-auto max-w-[110rem] pb-24 pt-10 md:pt-16">
          <div className="tp-sketchbook__head">
            <div className="tp-sketchbook__words">
              <p className="font-scrawl text-lg text-toffee-ink" data-reveal="true">
                {"from Teddy's sketchbook"}
              </p>
              <h1 id="pups-title" className="font-plush text-giant tp-sketchbook__title" data-reveal="true">
                Available puppies
                <svg aria-hidden="true" viewBox="0 0 400 24" preserveAspectRatio="none" className="tp-sketchbook__underline">
                  <path d="M4 15c40-9 70 5 112-2s70-9 112 0 74 8 116-1 38-4 52 1" pathLength="1" />
                </svg>
              </h1>
              <p className="tp-sketchbook__lede text-lede mt-6 max-w-[46ch] text-cocoa-soft" data-reveal="true">
                Every listing shows real photos of the actual puppy. Open a profile to see them all, then ask us about them on WhatsApp.
              </p>
            </div>
            <div className="tp-sketchbook__self" data-reveal="true">
              <PupBuddy pose="sit" facing="left" label="Teddy, the TeddyPups puppy" />
              <span className="font-scrawl tp-sketchbook__caption">
                self-portrait
              </span>
            </div>
          </div>
          <div className="mt-12">
            <Suspense fallback={<AllSketches />}>
              <PuppyFilters pups={filterable} whereOptions={whereOptions} breedOptions={breedOptions} />
            </Suspense>
          </div>
        </div>
      </section>
      <section aria-labelledby="gone-title" className="tp-gone-strip">
        <div className="gutter mx-auto flex max-w-[110rem] flex-col gap-10 md:flex-row md:items-center">
          <div className="md:w-1/3" data-reveal="true">
            <h2 id="gone-title" className="font-plush text-big">
              Already gone home
            </h2>
            <p className="mt-3 text-cocoa-soft">
              These puppies have found their families.
            </p>
            <Link className="btn btn-primary mt-6" href="/gone-home">
              {"See the puppies who've gone home"}
            </Link>
          </div>
          <ul className="tp-gone-strip__row" aria-label="Some puppies who have gone home">
              {gonePuppies.slice(0, 5).map((p, i) => (
                <li key={p.slug}>
                  <Sketch card={goneCard(p)} index={i} small />
                </li>
              ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
