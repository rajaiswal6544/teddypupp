import puppiesJson from "@/data/puppies.json";
import goneJson from "@/data/gone-home.json";
import photosJson from "@/data/family-photos.json";
import faqsJson from "@/data/faqs.json";
import journeysJson from "@/data/journeys.json";

export type Media = {
  id: string;
  url: string;
  kind: "image" | "video";
  width: number;
  height: number;
  alt: string;
  caption?: string;
  focalX: number;
  focalY: number;
  color: string;
  blurDataUrl?: string | null;
  durationS?: number | null;
  poster?: Media | null;
};

export type Puppy = {
  id: string;
  slug: string;
  name: string;
  displayName: string;
  breed: string;
  gender: "male" | "female" | string;
  genderLabel: string;
  age: string;
  colour: string;
  description: string;
  status: string;
  cover: Media;
  media: Media[];
  origin: { slug: "local" | "imported" | string; name: string };
  breeds: { slug: string; name: string }[];
  collections: { slug: string; name: string }[];
};

export type GonePuppy = {
  slug: string;
  displayName: string;
  ticketName: string;
  ticketMeta: string;
  routeFrom: string;
  ticketStyle: string;
  subtitle: string;
  details: Record<string, string>;
  description: string;
  media: Media[];
};

export type Faq = { id: string; question: string; answer: string };
export type Step = { title: string; text: string };
export type Journey = {
  key: "local" | "imported";
  label: string;
  hint: string;
  heading: string;
  body: string;
  note?: string;
  steps: Step[];
};

export const puppies = puppiesJson as Puppy[];
export const gonePuppies = goneJson as GonePuppy[];
export const familyPhotos = photosJson as Media[];
export const faqs = faqsJson as Faq[];
export const journeys = journeysJson as Journey[];

export const breedFilters = [
  { slug: "maltipoo", name: "Maltipoo" },
  { slug: "pomeranian", name: "Pomeranian" },
  { slug: "poodle", name: "Poodle" },
  { slug: "cavapoo", name: "Cavapoo" },
  { slug: "shih-tzu", name: "Shih Tzu" },
];

export function getPuppy(slug: string) {
  return puppies.find((p) => p.slug === slug);
}
export function getGonePuppy(slug: string) {
  return gonePuppies.find((p) => p.slug === slug);
}

/** "girl, 2 months, with video" style summary used on cards and doors. */
export function puppyMeta(p: Puppy) {
  const parts = [p.genderLabel.toLowerCase().replace("boy & girl", "boy & girl"), p.age];
  const hasVideo = p.media.some((m) => m.kind === "video");
  return { lead: p.name ? `${p.breed},` : "", parts, hasVideo };
}

/** object-position from a media focal point */
export function focal(m: Pick<Media, "focalX" | "focalY">) {
  return `${(m.focalX * 100).toFixed(1)}% ${(m.focalY * 100).toFixed(1)}%`;
}

/** Everything the puppy detail page needs, for available and gone-home puppies alike. */
export type PupView = {
  id: string;
  slug: string;
  name: string;
  breed: string;
  gender: string;
  age: string;
  colour?: string;
  where: string;
  origin: "local" | "imported";
  media: Media[];
  gone: boolean;
  prev: { slug: string; name: string; cover: Media };
  next: { slug: string; name: string; cover: Media };
};

export function getPupView(slug: string): PupView | undefined {
  const i = puppies.findIndex((p) => p.slug === slug);
  if (i >= 0) {
    const p = puppies[i];
    const link = (q: Puppy) => ({ slug: q.slug, name: q.displayName, cover: q.cover });
    return {
      id: p.id,
      slug: p.slug,
      name: p.displayName,
      breed: p.breed,
      gender: p.genderLabel,
      age: p.age,
      colour: p.colour || undefined,
      where: p.origin.slug === "local" ? "In Dubai" : "Imported for you",
      origin: p.origin.slug === "local" ? "local" : "imported",
      media: p.media,
      gone: false,
      prev: link(puppies[(i - 1 + puppies.length) % puppies.length]),
      next: link(puppies[(i + 1) % puppies.length]),
    };
  }
  const j = gonePuppies.findIndex((p) => p.slug === slug);
  if (j < 0) return undefined;
  const g = gonePuppies[j];
  const link = (q: GonePuppy) => ({ slug: q.slug, name: q.displayName, cover: q.media[0] });
  return {
    id: g.slug,
    slug: g.slug,
    name: g.displayName,
    breed: g.details["Breed"],
    gender: g.details["Boy or girl"],
    age: g.details["Age"],
    colour: g.details["Colour"],
    where: g.details["Where"],
    origin: g.details["Where"] === "In Dubai" ? "local" : "imported",
    media: g.media,
    gone: true,
    prev: link(gonePuppies[(j - 1 + gonePuppies.length) % gonePuppies.length]),
    next: link(gonePuppies[(j + 1) % gonePuppies.length]),
  };
}
