import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPupView, gonePuppies, puppies, type PupView } from "@/lib/data";
import { site } from "@/lib/site";
import { Gallery } from "@/components/puppies/Gallery";
import { ScrollRibbon } from "@/components/puppies/ScrollRibbon";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { MediaImg } from "@/components/ui/MediaImg";
import { PupBuddy } from "@/components/pup/PupBuddy";
import { Paw } from "@/components/ui/icons";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return [...puppies.map((p) => ({ slug: p.slug })), ...gonePuppies.map((p) => ({ slug: p.slug }))];
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const pup = getPupView((await params).slug);
  if (!pup) return {};
  const title = pup.name === pup.breed ? `${pup.name} puppy` : `${pup.name}, ${pup.breed} puppy`;
  return {
    title,
    description: `${pup.name} — ${pup.breed}, ${pup.gender.toLowerCase()}, ${pup.age}. ${pup.gone ? "Gone home to a loving family." : "Available now at TeddyPups U.A.E."}`,
    openGraph: { images: [pup.media[0]?.kind === "video" ? pup.media[0].poster!.url : pup.media[0].url] },
  };
}

const INCLUDED = ["Vaccinated", "Dewormed", "Verified health certificate from licensed vets", "Thoroughly checked before joining your family"];

const WAY_HOME = {
  imported: {
    title: "Coming home from abroad",
    steps: [
      ["Reserve your puppy", "Tell us which puppy has captured your heart."],
      ["Personalized consultation", "We finalize details with you and share updates on your puppy's journey."],
      ["Import and arrival", "We manage health checks, travel arrangements, and documentation."],
      ["Welcome home", "We help your new puppy settle in and ensure a smooth transition into your home."],
    ],
  },
  local: {
    title: "Meeting you in Dubai",
    steps: [
      ["Say hello", "Tell us you'd like to meet this puppy."],
      ["Visit the showroom", "Spend time bonding in our Downtown Dubai showroom."],
      ["Decide together", "Ask us anything about health, care and temperament."],
      ["Pick-up or delivery", "Take your puppy home the same day or have them delivered within Dubai."],
    ],
  },
} as const;

function Chapter({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <p className="tp-chapter">
      <span aria-hidden="true" className="tp-chapter__n font-plush">
        {n}
      </span>
      <span className="font-scrawl">{children}</span>
    </p>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 32 32" className="mt-0.5 size-6 shrink-0 text-toffee-deep" aria-hidden="true">
      <path d="M5 17l7 7L27 8" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SiblingLink({ pup, label }: { pup: PupView["prev"]; label: string }) {
  return (
    <Link
      className="group flex items-center gap-5 rounded-[2rem] border-[3px] border-cocoa bg-milk p-4 transition-transform duration-500 hover:-rotate-1 sm:last:flex-row-reverse sm:last:text-right"
      href={`/puppies/${pup.slug}`}
    >
      <span className="relative h-24 w-20 shrink-0 overflow-hidden rounded-[999px_999px_0.6rem_0.6rem] border-[3px] border-cocoa bg-honey-soft">
        <MediaImg media={pup.cover} />
      </span>
      <span>
        <span className="font-scrawl block text-sm text-cocoa-soft">{label}</span>
        <span className="font-plush text-[1.6rem]">{pup.name}</span>
      </span>
    </Link>
  );
}

export default async function PuppyPage({ params }: Params) {
  const pup = getPupView((await params).slug);
  if (!pup) notFound();
  const cover = pup.media[0].kind === "video" ? pup.media[0].poster! : pup.media[0];
  const way = WAY_HOME[pup.origin];
  const details: [string, string | undefined][] = [
    ["Breed", pup.breed],
    ["Boy or girl", pup.gender],
    ["Age", pup.age],
    ["Colour", pup.colour],
    ["Where", pup.where],
  ];
  let chapter = 0;

  return (
    <div data-page="pup" className="tp-page">
      <article
        className="tp-storybook"
        style={{ background: `linear-gradient(180deg, color-mix(in oklab, ${cover.color} 24%, var(--color-milk)) 0, var(--color-milk) 85%)` }}
      >
        <ScrollRibbon />
        <div className="gutter mx-auto max-w-[110rem] pb-20 pt-8 md:pt-12">
          <nav aria-label="Breadcrumb" className="text-[0.95rem] font-semibold text-cocoa-soft">
            <Link className="link-ink" href={pup.gone ? "/gone-home" : "/puppies"}>
              {pup.gone ? "Gone home" : "Available puppies"}
            </Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">{pup.name}</span>
          </nav>
          <Chapter n={++chapter}>{pup.gone ? "the day they went home" : "hello, it's me"}</Chapter>
          <div className="mt-4 grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="min-w-0 lg:col-span-7">
              <Gallery name={pup.name} media={pup.media} />
            </div>
            <div className="min-w-0 lg:col-span-5">
              <div className="lg:sticky lg:top-[calc(var(--header-h)+5.5rem)]">
                <div className="tp-tag tp-board mt-16 !rounded-[2.2rem_2.2rem_2.2rem_0.6rem] !p-7 md:!p-9 lg:mt-20" data-reveal="true">
                  <span aria-hidden="true" className="tp-tag__ring" />
                  <PupBuddy pose="peekTag" label={`Teddy, peeking over ${pup.name}'s tag`} className="absolute -top-[4.8rem] right-6 w-[9.5rem]" />
                  {pup.gone ? (
                    <span className="font-scrawl text-lg text-toffee-ink">Gone home ♥</span>
                  ) : (
                    <span className="chip">
                      <Paw className="size-4 text-toffee" />
                      Available
                    </span>
                  )}
                  <h1 className="font-plush mt-4 text-[clamp(2.6rem,5vw,4.6rem)]">{pup.name}</h1>
                  <p className="mt-2 text-lg font-semibold text-cocoa-soft">{pup.breed}</p>
                  <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4">
                    {details
                      .filter(([, v]) => v)
                      .map(([k, v]) => (
                        <div key={k}>
                          <dt className="font-scrawl text-sm text-cocoa-soft">{k}</dt>
                          <dd className="mt-0.5 text-[1.05rem] font-semibold">{v}</dd>
                        </div>
                      ))}
                  </dl>
                  <div className="mt-8 flex flex-col gap-3">
                    <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                      {pup.gone ? "Ask about a puppy like this" : `Ask about ${pup.name} on WhatsApp`}
                    </a>
                    <a href={`#enquire-${pup.slug}`} className="btn btn-ghost">
                      Send an enquiry
                    </a>
                  </div>
                </div>
                <div className="tp-paper mt-8 -rotate-1">
                  <Chapter n={++chapter}>what comes with {pup.name}</Chapter>
                  <h2 className="font-plush mt-1 text-[1.9rem]">Every Teddy Pup comes</h2>
                  <ul className="mt-4 space-y-2.5">
                    {INCLUDED.map((item) => (
                      <li key={item} className="flex items-start gap-3 font-semibold">
                        <Check />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {!pup.gone ? (
            <section aria-labelledby={`home-steps-${pup.slug}`} className="mt-20">
              <Chapter n={++chapter}>the way home</Chapter>
              <h2 id={`home-steps-${pup.slug}`} className="font-plush text-big mt-3">
                {way.title}
              </h2>
              <ol className="tp-trail tp-trail--row tp-trail--paws mt-10">
                {way.steps.map(([title, text], i) => (
                  <li key={title}>
                    <span aria-hidden="true" className="tp-trail__num font-plush">
                      {i + 1}
                    </span>
                    <h3 className="font-plush-text text-xl font-bold leading-tight">{title}</h3>
                    <p className="mt-2 max-w-[38ch] text-cocoa-soft">{text}</p>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          <section id={`enquire-${pup.slug}`} aria-labelledby={`enquire-title-${pup.slug}`} className="tp-letter mt-20 grid gap-10 lg:grid-cols-12">
            <span aria-hidden="true" className="tp-letter__stamp">
              <Paw className="size-9" />
            </span>
            <div className="lg:col-span-4">
              <Chapter n={++chapter}>dear TeddyPups…</Chapter>
              <h2 id={`enquire-title-${pup.slug}`} className="font-plush text-big mt-2">
                {pup.gone ? "Looking for a puppy like this?" : `Ask about ${pup.name}`}
              </h2>
              <p className="mt-4 text-cocoa-soft">
                Leave your details and our team will get back to you promptly — or message us on WhatsApp for the quickest reply.
              </p>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <EnquiryForm puppyId={pup.id} defaultMessage={`Hi! I'd love to know more about ${pup.name} (${pup.breed}).`} />
            </div>
          </section>

          <nav aria-label="More puppies" className="mt-16 grid gap-4 sm:grid-cols-2">
            <SiblingLink pup={pup.prev} label="Previous pup" />
            <SiblingLink pup={pup.next} label="Next pup" />
          </nav>
        </div>
      </article>
    </div>
  );
}
