import type { Metadata } from "next";
import { faqs } from "@/lib/data";
import { FaqBoard } from "@/components/faq/FaqBoard";
import { PupBuddy } from "@/components/pup/PupBuddy";

export const metadata: Metadata = {
  title: "Questions & answers",
  description: "Answers about vaccinations, meeting puppies, same-day pick-up, imports from Korea, delivery and after-care.",
};

/** FAQ rich results for search engines. */
function FaqJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export default function FaqPage() {
  return (
    <div data-page="faq" className="tp-page">
      <FaqJsonLd />
      <section data-pup-scene="true" data-tone="dark" className="tp-scene tp-faqroom overflow-hidden" style={{ "--sky-top": "#a95e32", "--sky-bottom": "#331c11" }} aria-labelledby="faq-title">
        <div className="gutter relative mx-auto max-w-[110rem] pb-24 pt-10 md:pt-16">
          <header className="max-w-4xl">
            <h1 id="faq-title" className="font-plush text-giant">
              {"Questions & answers"}
            </h1>
            <p className="text-lede mt-6 max-w-[52ch] text-[var(--ink-soft)]">
              {"Can't find what you're looking for? Message us on WhatsApp — our team is available 24/7."}
            </p>
          </header>
          <div className="mt-12 md:mt-16">
            <FaqBoard faqs={faqs} teddy={<PupBuddy pose="read" label="Teddy, reading the notes" />} />
          </div>
        </div>
      </section>
    </div>
  );
}
