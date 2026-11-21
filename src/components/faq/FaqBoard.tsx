"use client";

import { useId, useMemo, useState } from "react";
import type { Faq } from "@/lib/data";
import { site } from "@/lib/site";

const PINS = ["var(--color-toffee)", "var(--color-sky-deep)", "#d9a13c", "#c45a6a"];
const TILTS = ["-1.6deg", "1.2deg", "-0.8deg", "1.8deg", "-1.2deg", "0.7deg", "-1.9deg", "1.4deg"];

/** Wraps every case-insensitive match of `q` in <mark>. */
function Highlight({ text, q }: { text: string; q: string }) {
  if (!q) return <>{text}</>;
  const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  return (
    <>
      {text.split(re).map((part, i) => (i % 2 ? <mark key={i}>{part}</mark> : part))}
    </>
  );
}

/** Notes pinned to a cork board: searchable, each one unfolds to show its answer. */
export function FaqBoard({ faqs, teddy }: { faqs: Faq[]; teddy: React.ReactNode }) {
  const searchId = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Set<string>>(new Set());
  const q = query.trim();

  const shown = useMemo(() => {
    if (!q) return faqs;
    const terms = q.toLowerCase().split(/\s+/);
    return faqs.filter((f) => terms.every((t) => `${f.question} ${f.answer}`.toLowerCase().includes(t)));
  }, [faqs, q]);

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="tp-notes" data-open={open.size ? "" : undefined}>
      <aside className="tp-notes__side" aria-label="Find a question">
        <label htmlFor={searchId} className="font-scrawl tp-notes__label">
          sniff out a question
        </label>
        <div className="tp-notes__search">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="tp-notes__lens">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m15.5 15.5 5 5" />
          </svg>
          <input
            id={searchId}
            type="search"
            placeholder="delivery, Korea, vaccinated…"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <p className="tp-notes__count" aria-live="polite">
          {q ? `${shown.length} of ${faqs.length} notes match` : `${faqs.length} notes on the board`}
        </p>
        <div className="tp-notes__teddy">
          <span aria-hidden="true" className="tp-notes__bubble font-plush">
            <span className="tp-notes__q">?</span>
            <span className="tp-notes__a">!</span>
          </span>
          {teddy}
        </div>
        <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp tp-notes__ask">
          Ask your own question
        </a>
      </aside>
      <div className="tp-notes__board">
        <ul className="tp-notes__list">
          {shown.map((f, i) => {
            const unfolded = open.has(f.id) || (!!q && shown.length <= 3);
            return (
              <li
                key={f.id}
                className="tp-note"
                data-reveal="true"
                data-unfolded={unfolded ? "" : undefined}
                style={{ "--tilt": TILTS[i % TILTS.length], "--pin": PINS[i % PINS.length], "--i": String(i) }}
              >
                <span aria-hidden="true" className="tp-note__pin" />
                <h2 className="tp-note__q">
                  <button type="button" id={`q-${f.id}`} aria-expanded={unfolded} aria-controls={`a-${f.id}`} onClick={() => toggle(f.id)}>
                    <span className="font-plush-text">
                      <Highlight text={f.question} q={q} />
                    </span>
                    <span aria-hidden="true" className="tp-note__chevron" />
                  </button>
                </h2>
                <div id={`a-${f.id}`} role="region" aria-labelledby={`q-${f.id}`} className="tp-note__answer" inert={!unfolded}>
                  <div className="tp-note__flap">
                    <p>
                      <Highlight text={f.answer} q={q} />
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
          {shown.length === 0 ? (
            <li className="tp-note tp-note--empty" style={{ "--tilt": "-1deg", "--pin": PINS[0] }}>
              <span aria-hidden="true" className="tp-note__pin" />
              <p className="font-plush-text text-lg font-bold">No notes about “{q}” yet.</p>
              <p className="mt-2">
                Try another word, or{" "}
                <a className="link-ink" href={site.whatsapp} target="_blank" rel="noopener noreferrer">
                  ask us on WhatsApp
                </a>
                .
              </p>
            </li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}
