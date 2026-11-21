import sys,os; sys.path.insert(0,'tools')
from scaffold_pages import *
s=inner_main('jsx/rawxhappy_families.main.jsx')
a=s.find('<ul className="tp-wall"'); ls=s.rfind('\n',0,a)+1; ind=' '*(a-ls)
# replace the wrapper div (ul + dialog) that holds the wall
wa=s.rfind('\n',0,ls-1)+1  # line before ul: "<div>"
wrap_ind=' '*(len(s[wa:ls-1])-len(s[wa:ls-1].lstrip()))
we=s.find('\n'+wrap_ind+'</div>',ls)+len('\n'+wrap_ind+'</div>')
s=s[:wa]+wrap_ind+'<MemoryWall photos={familyPhotos} />'+s[we:]
s=s.replace('64 moments and counting','{familyPhotos.length} moments and counting')
pre='export const metadata: Metadata = {\n  title: "Happy families",\n  description: "Moments shared by TeddyPups families after welcoming their new puppy home.",\n};\n'
out=page('HappyFamiliesPage',s,['sit'],'import type { Metadata } from "next";\nimport { familyPhotos } from "@/lib/data";\nimport { MemoryWall } from "@/components/families/MemoryWall";\n',pre)
os.makedirs(H+'app/happy-families',exist_ok=True); open(H+'app/happy-families/page.tsx','w').write(out)
