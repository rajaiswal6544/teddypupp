import Link from "next/link";
import type { GonePuppy, Media, Puppy } from "@/lib/data";
import { maskUrl, sketchArt, type DoodleKind } from "@/lib/sketch";
import { MediaImg } from "@/components/ui/MediaImg";
import { PAW_PATH } from "@/components/ui/icons";

function Doodle({ kind, colour }: { kind: DoodleKind; colour: string }) {
  const stroke = { fill: "none", stroke: colour, strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  switch (kind) {
    case "motion":
      return <path d="M-5 -5l4 2M-6 0h5M-5 5l4 -2" {...stroke} />;
    case "spiral":
      return <path d="M0 0c1.6-.6 2.4 1.4.8 2.6-2 1.4-4.6-.4-4-3 .7-3 4.8-3.8 6.8-1.2 2.4 3-0.2 7.4-3.8 7.2" {...stroke} />;
    case "heart":
      return (
        <path
          d="M0 5C-4.6 1.8-6.4-.8-6.4-3.2c0-1.9 1.5-3.3 3.3-3.3 1.3 0 2.4.7 3.1 1.9.7-1.2 1.8-1.9 3.1-1.9 1.8 0 3.3 1.4 3.3 3.3C6.4-.8 4.6 1.8 0 5z"
          {...stroke}
        />
      );
    case "sparkle":
      return <path d="M0 -6c.6 3.6 2.4 5.4 6 6-3.6.6-5.4 2.4-6 6-.6-3.6-2.4-5.4-6-6 3.6-.6 5.4-2.4 6-6z" fill={colour} />;
    case "paw":
      return <path d={PAW_PATH} transform="scale(.17) translate(-32 -34)" fill={colour} opacity="0.85" />;
  }
}

export type SketchCard = {
  slug: string;
  name: string;
  meta?: string;
  label: string;
  cover: Media;
  gone?: boolean;
  video?: boolean;
};

export function puppyCard(p: Puppy): SketchCard {
  const gender = p.genderLabel.toLowerCase();
  return {
    slug: p.slug,
    name: p.displayName,
    meta: `${p.name ? `${p.breed} · ` : ""}${gender} · ${p.age}`,
    label: `${p.displayName}, ${p.name ? `${p.breed}, ` : ""}${gender}, ${p.age}, available`,
    cover: p.cover,
    video: p.media.some((m) => m.kind === "video"),
  };
}

export function goneCard(p: GonePuppy): SketchCard {
  const d = p.details;
  return {
    slug: p.slug,
    name: p.displayName,
    label: `${p.displayName}, ${d["Breed"]}, ${(d["Boy or girl"] ?? "").toLowerCase()}, ${d["Age"]}, gone home`,
    cover: p.media[0],
    gone: true,
  };
}

/** One page of Teddy's sketchbook: a puppy photo inside a wobbly pencil outline. */
export function Sketch({ card, index, small = false }: { card: SketchCard; index: number; small?: boolean }) {
  const art = sketchArt(card.slug);
  const mask = maskUrl(art.maskPath);
  return (
    <Link
      className={`tp-sketch${small ? " tp-sketch--small" : ""}`}
      data-reveal="true"
      style={{ "--tilt": art.tilt, "--d": `${(index % 6) * 70}ms`, "--wash": art.wash }}
      aria-label={card.label}
      href={`/puppies/${card.slug}`}
    >
      <span className="tp-sketch__frame">
        <svg aria-hidden="true" viewBox="0 0 100 100" className="tp-sketch__wash" style={{ translate: art.washShift }}>
          <path d={art.washPath} />
        </svg>
        <span className="tp-sketch__photo" style={{ maskImage: mask, WebkitMaskImage: mask }}>
          <MediaImg media={card.cover} alt="" />
        </span>
        <svg aria-hidden="true" viewBox="0 0 100 100" className="tp-sketch__ink">
          <path d={art.inkPath} pathLength={1} className="tp-sketch__line" />
          <path d={art.retracePath} pathLength={1} className="tp-sketch__line tp-sketch__line--retrace" />
          {art.doodles.map((d, i) => (
            <g key={i} transform={`translate(${d.x.toFixed(1)} ${d.y.toFixed(1)}) rotate(${d.rotate}) scale(${d.scale.toFixed(2)})`}>
              <g className="tp-sketch__doodle">
                <Doodle kind={d.kind} colour={d.colour} />
              </g>
            </g>
          ))}
        </svg>
        {card.gone ? (
          <span className="tp-sketch__sticker tp-sketch__sticker--home font-scrawl">gone home ♥</span>
        ) : (
          <span className="tp-sketch__sticker font-scrawl">Available</span>
        )}
        {card.video ? <span className="tp-sketch__video">▶ video</span> : null}
      </span>
      <span className="tp-sketch__name font-plush">{card.name}</span>
      {card.meta ? <span className="tp-sketch__meta">{card.meta}</span> : null}
    </Link>
  );
}
