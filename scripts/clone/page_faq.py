import sys,os; sys.path.insert(0,'tools')
from scaffold_pages import *
s=inner_main('jsx/rawxfaq.main.jsx')
a=s.find('<div className="tp-notes">'); ls=s.rfind('\n',0,a)+1; ind=' '*(a-ls)
b=s.find('\n'+ind+'</div>',a)+len('\n'+ind+'</div>')
s=s[:ls]+ind+'<FaqBoard faqs={faqs} teddy={<PupBuddy pose="read" label="Teddy, reading the notes" />} />'+s[b:]
pre='export const metadata: Metadata = {\n  title: "Questions & answers",\n  description: "Answers about vaccinations, meeting puppies, same-day pick-up, imports from Korea, delivery and after-care.",\n};\n'
s=s.replace('<div data-page="faq" className="tp-page">','<div data-page="faq" className="tp-page">\n  <FaqJsonLd />',1)
pre+="""
/** FAQ rich results for search engines. */
function FaqJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
"""
out=page('FaqPage',s,[],'import type { Metadata } from "next";\nimport { faqs } from "@/lib/data";\nimport { FaqBoard } from "@/components/faq/FaqBoard";\nimport { PupBuddy } from "@/components/pup/PupBuddy";\n',pre)
os.makedirs(H+'app/faq',exist_ok=True); open(H+'app/faq/page.tsx','w').write(out)
