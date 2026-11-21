"use client";

import { useId, useRef, useState } from "react";
import { formToEnquiry, sendEnquiry, validateEnquiry, type EnquiryErrors } from "@/lib/enquiry";
import { Paw } from "@/components/ui/icons";

type Phase = "writing" | "sealing" | "posting" | "sent";
type PuppyOption = { id: string; label: string };

const LABELS: Record<string, string> = {
  name: "your name",
  phone: "your phone or WhatsApp number",
  email: "your email",
  area: "your area",
  message: "your message",
};

function Envelope() {
  return (
    <svg viewBox="0 0 176 120" className="tp-post__envelope" aria-hidden="true">
      <rect x="4" y="18" width="168" height="98" rx="10" fill="#fffdf8" stroke="#2a170e" strokeWidth="4" />
      <path d="M8 26 88 78 168 26" fill="none" stroke="#2a170e" strokeWidth="4" strokeLinejoin="round" />
      <path className="tp-post__flap" d="M6 22 88 76 170 22Z" fill="#fbe3b4" stroke="#2a170e" strokeWidth="4" strokeLinejoin="round" />
      <circle cx="88" cy="74" r="13" fill="#a24a1a" stroke="#2a170e" strokeWidth="3" />
      <path d="M83 74c0-3 3-4 5-1 2-3 5-2 5 1 0 3-5 6-5 6s-5-3-5-6z" fill="#fffdf8" />
    </svg>
  );
}

function PostBox() {
  return (
    <svg viewBox="0 0 208 200" className="tp-post__box" aria-hidden="true">
      <rect x="92" y="120" width="24" height="80" fill="#5a3a28" stroke="#2a170e" strokeWidth="4" />
      <path d="M24 64a80 52 0 0 1 160 0v64H24z" fill="#c2622b" stroke="#2a170e" strokeWidth="4" strokeLinejoin="round" />
      <rect x="64" y="58" width="80" height="10" rx="5" fill="#2a170e" />
      <path className="tp-post__flag" d="M184 70v-44h22v16h-22" fill="#f2be6b" stroke="#2a170e" strokeWidth="4" strokeLinejoin="round" />
      <text x="104" y="104" textAnchor="middle" fontFamily="var(--font-hand)" fontSize="18" fill="#fffdf8">
        TeddyPups
      </text>
    </svg>
  );
}

/** The contact page's fill-in-the-blanks letter, which folds into an envelope and gets posted. */
export function LetterForm({ puppies }: { puppies: PuppyOption[] }) {
  const uid = useId();
  const [phase, setPhase] = useState<Phase>("writing");
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [failed, setFailed] = useState(false);
  const sentRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const form = ev.currentTarget;
    const data = formToEnquiry(form);
    const errs = validateEnquiry(data);
    setErrors(errs);
    setFailed(false);
    if (Object.keys(errs).length) {
      requestAnimationFrame(() => form.querySelector<HTMLElement>("[aria-invalid=true]")?.focus());
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPhase("sealing");
    const wait = (ms: number) => new Promise((r) => setTimeout(r, reduce ? 0 : ms));
    try {
      const [res] = await Promise.all([sendEnquiry(data), wait(900)]);
      if (!res.ok) {
        setErrors(res.errors ?? {});
        setPhase("writing");
        return;
      }
      setPhase("posting");
      await wait(1300);
      setPhase("sent");
      requestAnimationFrame(() => sentRef.current?.focus());
    } catch {
      setFailed(true);
      setPhase("writing");
    }
  }

  const blank = (name: keyof EnquiryErrors) => ({ name, "aria-invalid": !!errors[name] || undefined });
  const errorList = Object.entries(errors).filter(([, v]) => v);

  if (phase === "sent") {
    return (
      <div className="tp-post" data-phase="sent">
        <div ref={sentRef} tabIndex={-1} role="status" className="tp-post__sent">
          <p className="font-scrawl text-lg">letter received!</p>
          <p className="font-plush mt-2 text-[clamp(2rem,4vw,3rem)]">Thank you — we’ll be in touch soon.</p>
          <p className="mx-auto mt-4 max-w-[40ch]">Our team usually replies within a few hours. For the quickest answer, message us on WhatsApp.</p>
          <button
            type="button"
            className="btn btn-ghost mt-6"
            onClick={() => {
              setErrors({});
              setPhase("writing");
            }}
          >
            Write another letter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tp-post" data-phase={phase}>
      <form ref={formRef} noValidate className="tp-letterform" onSubmit={onSubmit} aria-busy={phase !== "writing"}>
        <span aria-hidden="true" className="tp-letter__stamp">
          <Paw className="size-9" />
        </span>
        <p className="font-scrawl tp-letterform__greeting">Dear TeddyPups,</p>
        <p className="tp-letterform__line">
          {"my name is "}
          <span className="tp-blank" style={{ "--size": "16ch" }}>
            <input aria-label="Your name (required)" autoComplete="name" required minLength={2} maxLength={80} {...blank("name")} />
          </span>
          {", and you can reach me on "}
          <span className="tp-blank" style={{ "--size": "15ch" }}>
            <input
              aria-label="Phone or WhatsApp number with country code (required)"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              placeholder="+971 50 123 4567"
              {...blank("phone")}
            />
          </span>
          {" or by email at "}
          <span className="tp-blank" style={{ "--size": "20ch" }}>
            <input aria-label="Email (optional)" type="email" autoComplete="email" placeholder="optional" {...blank("email")} />
          </span>
          .
        </p>
        <p className="tp-letterform__line">
          {"I live in "}
          <span className="tp-blank" style={{ "--size": "13ch" }}>
            <input aria-label="Your area (optional)" autoComplete="address-level2" maxLength={80} placeholder="e.g. Dubai Marina" {...blank("area")} />
          </span>
          {", and I'm curious about "}
          <span className="tp-blank tp-blank--select">
            <label htmlFor={`${uid}-pup`} className="sr-only">
              {"Puppy you're interested in (optional)"}
            </label>
            <select id={`${uid}-pup`} name="puppyId" defaultValue="">
              <option value="">any puppy (not sure yet)</option>
              {puppies.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </span>
          .
        </p>
        <label htmlFor={`${uid}-msg`} className="sr-only">
          Your message (optional)
        </label>
        <textarea id={`${uid}-msg`} name="message" rows={4} maxLength={2000} placeholder="Anything else you'd like to tell us…" className="tp-letterform__note" />
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            Website
            <input tabIndex={-1} autoComplete="off" name="website" defaultValue="" />
          </label>
        </div>
        {errorList.length ? (
          <div role="alert" className="tp-letterform__alert">
            <p className="font-semibold">Almost there — please check {errorList.length === 1 ? "one thing" : "a few things"}:</p>
            <ul>
              {errorList.map(([k, v]) => (
                <li key={k}>
                  <span className="sr-only">{LABELS[k]}: </span>
                  {v}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {failed ? (
          <p role="alert" className="tp-letterform__alert">
            Sorry, your letter got lost on the way. Please try again or message us on WhatsApp.
          </p>
        ) : null}
        <div className="tp-letterform__sign">
          <p className="font-scrawl">with love, a future puppy parent</p>
          <button type="submit" disabled={phase !== "writing"} className="btn btn-primary disabled:opacity-70">
            Post my letter
          </button>
        </div>
      </form>
      {phase !== "writing" ? (
        <div className="tp-post__scene" aria-hidden="true">
          <Envelope />
          <PostBox />
        </div>
      ) : null}
    </div>
  );
}
