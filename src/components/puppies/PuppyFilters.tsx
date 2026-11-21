"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Sketch, type SketchCard } from "./Sketch";

export type FilterablePup = {
  card: SketchCard;
  where: string[]; // origin slug + collection slugs, e.g. ["imported", "korean-teacup"]
  breeds: string[];
  gender: string; // "male" | "female" | "male-female"
};

type Option = { value: string; label: string };

function Chips({ label, options, value, onChange, allowNone }: { label: string; options: Option[]; value: string; onChange: (v: string) => void; allowNone?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-scrawl mr-1 w-full shrink-0 text-cocoa-soft sm:w-28">{label}</span>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          className="tp-sticker-chip"
          onClick={() => onChange(allowNone && value === o.value ? "" : o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Sticker-chip filters over the puppy sketches (where · breed · boy or girl). */
export function PuppyFilters({ pups, whereOptions, breedOptions }: { pups: FilterablePup[]; whereOptions: Option[]; breedOptions: Option[] }) {
  const params = useSearchParams();
  const [where, setWhere] = useState(() => params.get("origin") ?? params.get("collection") ?? "");
  const [breed, setBreed] = useState(() => params.get("breed") ?? "");
  const [gender, setGender] = useState(() => params.get("gender") ?? "");

  const shown = useMemo(
    () =>
      pups.filter(
        (p) =>
          (!where || p.where.includes(where)) &&
          (!breed || p.breeds.includes(breed)) &&
          (!gender || p.gender.split("-").includes(gender)),
      ),
    [pups, where, breed, gender],
  );

  return (
    <div>
      <div role="group" aria-label="Filter puppies" className="tp-sketchpad flex flex-col gap-4">
        <Chips label="where" options={[{ value: "", label: "Everywhere" }, ...whereOptions]} value={where} onChange={setWhere} />
        <Chips label="breed" options={breedOptions} value={breed} onChange={setBreed} allowNone />
        <Chips
          label="boy or girl"
          options={[
            { value: "male", label: "Boys" },
            { value: "female", label: "Girls" },
          ]}
          value={gender}
          onChange={setGender}
          allowNone
        />
      </div>
      <p className="font-scrawl mt-10 text-lg text-[var(--ink-soft)]" aria-live="polite">
        {shown.length === 0
          ? "no puppies match that — try another sticker"
          : `${shown.length} ${shown.length === 1 ? "puppy" : "puppies"} looking for a home`}
      </p>
      <div>
        <ul className="tp-sketches mt-8">
          {shown.map((p, i) => (
            <li key={p.card.slug}>
              <Sketch card={p.card} index={i} />
            </li>
          ))}
        </ul>
        {shown.length === 0 ? (
          <button
            type="button"
            className="btn btn-ghost mt-6"
            onClick={() => {
              setWhere("");
              setBreed("");
              setGender("");
            }}
          >
            Show all puppies
          </button>
        ) : null}
      </div>
    </div>
  );
}
