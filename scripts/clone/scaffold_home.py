import re,subprocess,sys
sys.path.insert(0,'tools'); from refine import component
H='/home/user/teddypups/src/components/'
def gen(src,name,out,poses):
    s=component(name,open(src).read(),poses); return s
# ---- Footer
s=gen('jsx/footer.jsx','Footer',None,['snug'])
s=s.replace('''          {"© "}\n          2026\n          TeddyPups U.A.E.''','          © {new Date().getFullYear()} {site.name}')
s=re.sub(r'\{"© 2026 TeddyPups U\.A\.E\."\}|© 2026 TeddyPups U\.A\.E\.','© {new Date().getFullYear()} {site.name}',s)
open(H+'layout/Footer.tsx','w').write(s)
# ---- Home sections
for sec in ['hero','meet','paths','journey','trust','families','questions','cta']:
    name='Home'+sec.capitalize()
    pose={'hero':'peek','cta':'bow'}.get(sec,'sitWing')
    s=gen(f'sec/home-{sec}.jsx',name,None,[pose])
    if sec=='meet':
        a=s.find('                <li className="tp-door" data-open="true">'); b=s.find('                <li className="tp-door tp-door--all"')
        s=s[:a]+'''                {meetPuppies.map((p, i) => (
                  <Door key={p.id} puppy={p} index={i} />
                ))}
'''+s[b:]
        s=s.replace('        <div data-pin-range="true" style={{ "--pinned": "0" }}>','        <MeetHall>')
        s=s.replace('          </div>\n        </div>\n      </section>','          </div>\n        </MeetHall>\n      </section>')
        s=s.replace('import { Paw } from "@/components/ui/icons";\n','')
        s=s.replace('export function','import { Door } from "@/components/puppies/Door";\nimport { puppies } from "@/lib/data";\nimport { MeetHall } from "./MeetHall";\n\nconst meetPuppies = puppies.filter((p) => p.status === "available");\n\nexport function',1)
        s=s.replace('data-pose="sit" data-facing="right" className="pup-stop tp-meet__teddy"','data-pose="walk" data-facing="right" data-act="treadmill" className="pup-stop tp-meet__teddy"')
    if sec=='hero':
        a=s.find('          <ul className="tp-lineup"'); b=s.find('</span>',s.find('className="tp-lineup__wings"'))+len('</span>\n')
        s=s[:a]+'          <Lineup friends={friends} />\n'+s[b:]
        s=s.replace('export function','import { puppies } from "@/lib/data";\nimport { Lineup } from "./Lineup";\n\nconst friends = puppies.filter((p) => p.status === "available");\n\nexport function',1)
    if sec=='journey':
        s=s.replace('        <div className="tp-chat__grid gutter" data-pin-range="true">','        <ChatDriver />\n        <div className="tp-chat__grid gutter" data-pin-range="true">')
        s=s.replace('export function','import { ChatDriver } from "./ChatDriver";\n\nexport function',1)
    if sec=='families':
        a=s.find('            <ul className="tp-photowall__prints"'); b=s.find('            </ul>\n',a)+len('            </ul>\n')
        s=s[:a]+'            <FamilyWall photos={homePhotos} />\n'+s[b:]
        s=s.replace('export function','import { familyPhotos } from "@/lib/data";\nimport { FamilyWall } from "./FamilyWall";\n\n// Captioned prints first, as on the reference home page.\nconst homePhotos = [...familyPhotos.filter((p) => p.caption), ...familyPhotos.filter((p) => !p.caption)];\n\nexport function',1)
    if sec=='questions':
        a=s.find('            <div className="tp-qa"'); b=s.find('          </dl>',a)
        s=s[:a]+'''            {faqs.slice(0, 3).map((f, i) => (
              <div key={f.id} className="tp-qa" data-pup-look={i < 2 ? "" : undefined}>
                <dt className="font-plush tp-qa__q">
                  <Star className="tp-qa__star" />
                  {f.question}
                </dt>
                <dd className="tp-qa__a">{f.answer}</dd>
              </div>
            ))}
'''+s[b:]
        s=s.replace('export function','import { faqs } from "@/lib/data";\nimport { Star } from "@/components/ui/icons";\n\nexport function',1)
    open(H+f'home/{name}.tsx','w').write(s)
print('ok')
