import Link from "next/link";
import { PupBuddy } from "@/components/pup/PupBuddy";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className="gutter mx-auto grid min-h-[78vh] max-w-[110rem] place-items-center py-14">
      <div className="tp-poster">
        <span aria-hidden="true" className="tp-tape tp-tape--left" />
        <span aria-hidden="true" className="tp-tape tp-tape--right" />
        <p className="font-scrawl tp-poster__kicker">
          have you seen this page?
        </p>
        <h1 className="font-plush tp-poster__title">
          Lost
          <span className="sr-only">
            : this page has wandered off
          </span>
        </h1>
        <div className="tp-poster__photo">
          <PupBuddy pose="sitWing" label="Teddy, sniffing out the missing page" />
        </div>
        <p className="tp-poster__desc">
          {"One page, last seen wandering off. It answers to the address you typed, but it isn't here any more. Teddy is on the case."}
        </p>
        <p className="font-scrawl tp-poster__reward">
          if found, take a tab:
        </p>
        <ul className="tp-poster__tabs" aria-label="Pages that are here">
          <li>
            <Link className="tp-poster__tab" href="/">
              Home
            </Link>
          </li>
          <li>
            <Link className="tp-poster__tab" href="/puppies">
              Puppies
            </Link>
          </li>
          <li>
            <Link className="tp-poster__tab" href="/how-it-works">
              How it works
            </Link>
          </li>
          <li>
            <Link className="tp-poster__tab" href="/faq">
              Questions
            </Link>
          </li>
          <li>
            <Link className="tp-poster__tab" href="/contact">
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
