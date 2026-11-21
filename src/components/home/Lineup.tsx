"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Puppy } from "@/lib/data";
import { MediaImg } from "@/components/ui/MediaImg";

/** Seat layout along the quilt: x position, photo width, how far it peeks up, tilt. */
const SEATS = [
  { x: "9%", w: "8.6rem", peek: 0.62, tilt: "-5deg" },
  { x: "22.5%", w: "10.4rem", peek: 0.8, tilt: "3deg" },
  { x: "35%", w: "9.2rem", peek: 0.7, tilt: "-2deg" },
  { x: "65%", w: "9.4rem", peek: 0.74, tilt: "3deg" },
  { x: "77.5%", w: "10.6rem", peek: 0.82, tilt: "-3deg" },
  { x: "91%", w: "8.4rem", peek: 0.6, tilt: "4deg" },
];

type SeatState = "" | "duck" | "pop";

/**
 * Six puppies peek over the hero quilt. Every few seconds one ducks down and
 * a different puppy pops up in its place, with its name tag shown briefly.
 */
export function Lineup({ friends }: { friends: Puppy[] }) {
  const [seats, setSeats] = useState(() => SEATS.map((_, i) => i % friends.length));
  const [states, setStates] = useState<SeatState[]>(() => SEATS.map(() => ""));
  const [tags, setTags] = useState<boolean[]>(() => SEATS.map(() => false));
  const next = useRef(SEATS.length % friends.length);
  const [preload, setPreload] = useState(next.current);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timers: number[] = [];
    let lastSeat = -1;
    const swap = () => {
      if (document.hidden) return;
      let seat = Math.floor(Math.random() * SEATS.length);
      if (seat === lastSeat) seat = (seat + 1) % SEATS.length;
      lastSeat = seat;
      const incoming = next.current;
      next.current = (next.current + 1) % friends.length;
      const patch = <T,>(arr: T[], v: T) => arr.map((x, i) => (i === seat ? v : x));
      setStates((s) => patch(s, "duck"));
      timers.push(
        window.setTimeout(() => {
          setSeats((s) => patch(s, incoming));
          setStates((s) => patch(s, "pop"));
          setTags((t) => patch(t, true));
          setPreload(next.current);
        }, 380),
        window.setTimeout(() => setStates((s) => patch(s, "")), 1000),
        window.setTimeout(() => setTags((t) => patch(t, false)), 2400),
      );
    };
    const id = window.setInterval(swap, 3200);
    return () => {
      clearInterval(id);
      timers.forEach(clearTimeout);
    };
  }, [friends.length]);

  const style = (i: number) => ({
    "--x": SEATS[i].x,
    "--w": SEATS[i].w,
    "--peek": SEATS[i].peek,
    "--tilt": SEATS[i].tilt,
    "--i": i,
  });

  return (
    <>
      <ul className="tp-lineup" aria-label="Some of the puppies in our showroom">
        {seats.map((f, i) => {
          const p = friends[f];
          return (
            <li key={i} className="tp-lineup__seat" style={style(i)}>
              <Link
                className="tp-lineup__pup"
                data-pup-friend="true"
                data-state={states[i]}
                aria-label={`Meet ${p.displayName}, ${p.breed}`}
                href={`/puppies/${p.slug}`}
              >
                <span className="tp-lineup__photo">
                  <MediaImg media={p.cover} priority={i < 2} />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <ul aria-hidden="true" className="tp-lineup tp-lineup--tags">
        {seats.map((f, i) => (
          <li key={i} className="tp-lineup__seat" style={style(i)}>
            <span className="tp-lineup__ghost" data-state={states[i]} data-tag={tags[i] ? "show" : ""}>
              <span className="tp-lineup__name font-scrawl">{friends[f].displayName}</span>
            </span>
          </li>
        ))}
      </ul>
      {/* Off-screen copy of the next photo so it is already loaded when it pops up. */}
      <span aria-hidden="true" className="tp-lineup__wings" data-for={preload}>
        <MediaImg media={friends[preload].cover} alt="" />
      </span>
    </>
  );
}
