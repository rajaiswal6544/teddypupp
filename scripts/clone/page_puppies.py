import sys; sys.path.insert(0,'tools')
from scaffold_pages import *
s=inner_main('jsx/rawxpuppies.main.jsx')
# the sketches list -> client filters (with full-list fallback)
a=s.find('<ul className="tp-sketches'); ls=s.rfind('\n',0,a)+1; ind=' '*(a-ls)
b=s.find('\n'+ind+'</ul>',a)+len('\n'+ind+'</ul>')
s=s[:ls]+ind+'<Suspense fallback={<AllSketches />}>\n'+ind+'  <PuppyFilters pups={filterable} whereOptions={whereOptions} breedOptions={breedOptions} />\n'+ind+'</Suspense>'+s[b:]
s=replace_list(s,'<ul className="tp-gone-strip__row"','','''          {gonePuppies.slice(0, 5).map((p, i) => (
            <li key={p.slug}>
              <Sketch card={goneCard(p)} index={i} small />
            </li>
          ))}
''')
pre='''export const metadata: Metadata = {
  title: "Available puppies",
  description: "Teacup and teddy bear puppies available now in Dubai, with real photos and videos of every puppy.",
};

const breedOptions = breedFilters.map((b) => ({ value: b.slug, label: b.name }));

const filterable: FilterablePup[] = puppies.map((p) => ({
  card: puppyCard(p),
  where: [p.origin.slug, ...p.collections.map((c) => c.slug)],
  breeds: p.breeds.map((b) => b.slug),
  gender: p.gender,
}));

// "where" stickers come from the data: origins first, then collections (e.g. Korean Teacup).
const whereOptions = [
  ...new Map(
    puppies.flatMap((p) => [
      [p.origin.slug, p.origin.slug === "local" ? "In Dubai" : p.origin.name] as const,
      ...p.collections.map((c) => [c.slug, c.name] as const),
    ]),
  ),
].map(([value, label]) => ({ value, label }));

/** No-JS / pre-hydration fallback: every puppy, unfiltered. */
function AllSketches() {
  return (
    <ul className="tp-sketches mt-20">
      {puppies.map((p, i) => (
        <li key={p.id}>
          <Sketch card={puppyCard(p)} index={i} />
        </li>
      ))}
    </ul>
  );
}
'''
out=page('PuppiesPage',s,['sit'],
 'import type { Metadata } from "next";\nimport { Suspense } from "react";\nimport { breedFilters, gonePuppies, puppies } from "@/lib/data";\nimport { Sketch, goneCard, puppyCard } from "@/components/puppies/Sketch";\nimport { PuppyFilters, type FilterablePup } from "@/components/puppies/PuppyFilters";\n',pre)
open(H+'app/puppies/page.tsx','w').write(out)
