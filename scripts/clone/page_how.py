import sys,os; sys.path.insert(0,'tools')
from scaffold_pages import *
s=inner_main('jsx/rawxhow_it_works.main.jsx')
s=s.replace('<section className="tp-journeys" aria-labelledby="two-ways-title">','<section className="tp-journeys" aria-labelledby="two-ways-title">\n              <JourneySwitch />',1)
s=s.replace('_R_1albsnkivb_','tp-flight-clip')
pre='export const metadata: Metadata = {\n  title: "How it works",\n  description: "Meet your puppy in our Downtown Dubai showroom or order a rare breed from abroad — here is how it works, step by step.",\n};\n'
out=page('HowItWorksPage',s,['read','play'],'import type { Metadata } from "next";\nimport { JourneySwitch } from "@/components/how/JourneySwitch";\n',pre)
os.makedirs(H+'app/how-it-works',exist_ok=True); open(H+'app/how-it-works/page.tsx','w').write(out)
