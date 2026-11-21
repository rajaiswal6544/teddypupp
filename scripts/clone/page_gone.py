import sys,os; sys.path.insert(0,'tools')
from scaffold_pages import *
s=inner_main('jsx/rawxgone_home.main.jsx')
s=replace_list(s,'<ul className="tp-tickets"','','''          {gonePuppies.map((p, i) => (
            <Ticket key={p.slug} puppy={p} index={i} />
          ))}
''')
pre='export const metadata: Metadata = {\n  title: "Gone home",\n  description: "Puppies who have already found their forever families with TeddyPups U.A.E.",\n};\n'
out=page('GoneHomePage',s,['booth'],'import type { Metadata } from "next";\nimport { gonePuppies } from "@/lib/data";\nimport { Ticket } from "@/components/puppies/Ticket";\n',pre)
os.makedirs(H+'app/gone-home',exist_ok=True); open(H+'app/gone-home/page.tsx','w').write(out)
