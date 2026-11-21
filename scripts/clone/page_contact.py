import sys,os; sys.path.insert(0,'tools')
from scaffold_pages import *
s=inner_main('jsx/rawxcontact.main.jsx')
a=s.find('<div className="tp-post"'); ls=s.rfind('\n',0,a)+1; ind=' '*(a-ls)
b=s.find('\n'+ind+'</div>',a)+len('\n'+ind+'</div>')
s=s[:ls]+ind+'<LetterForm puppies={puppyOptions} />'+s[b:]
pre='''export const metadata: Metadata = {
  title: "Visit & contact",
  description: "Visit our Downtown Dubai showroom or send us a note — we'll help you find your new best friend.",
};

const puppyOptions = puppies.map((p) => ({
  id: p.id,
  label: `${p.displayName} (${p.name ? `${p.breed}, ` : ""}${p.genderLabel.toLowerCase()})`,
}));
'''
s=s.replace('<a href="https://www.instabizweb.com/" target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-6 !bg-milk">','<a href="https://www.google.com/maps/search/?api=1&query=Downtown+Dubai" target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-6 !bg-milk">')
out=page('ContactPage',s,['sit'],'import type { Metadata } from "next";\nimport { puppies } from "@/lib/data";\nimport { LetterForm } from "@/components/forms/LetterForm";\n',pre)
os.makedirs(H+'app/contact',exist_ok=True); open(H+'app/contact/page.tsx','w').write(out)
