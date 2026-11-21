import re,sys
WA="https://wa.me/919898124987?text=Hi%20Insta%20Biz%20Web%2C%20I'd%20like%20to%20discuss%20a%20project."
def find_block(s,start):
    # given index of '<div', return end index of matching </div> (line-indent based)
    line_start=s.rfind('\n',0,start)+1; indent=start-line_start
    m=re.compile(r'\n'+' '*indent+r'</div>\n').search(s,start)
    return m.end()-1
def refine(s,poses=()):
    poses=list(poses); used=set()
    out=''; i=0
    while True:
        j=s.find('<div className="pup-buddy',i)
        if j<0: out+=s[i:]; break
        end=find_block(s,j); block=s[j:end]
        cls=re.match(r'<div className="pup-buddy ?([^"]*)"',block).group(1).strip()
        facing=re.search(r'data-facing="(\w+)"',block)
        label=re.search(r'aria-label="([^"]*)"',block)
        extra=re.findall(r'\n\s*(<div className="pup-bubble.*?</div>|<span className="pup-bubble.*?</span>)',block,re.S)
        pose=poses.pop(0) if poses else 'sit'
        attrs=f'pose="{pose}"'+(f' facing="{facing.group(1)}"' if facing and facing.group(1)!='right' else '')+(f' label="{label.group(1)}"' if label else '')+(f' className="{cls}"' if cls else '')
        out+=s[i:j]+f'<PupBuddy {attrs} />'; used.add('PupBuddy'); i=end
    s=out
    s=re.sub(r'\b(tabIndex|rows|cols|maxLength|minLength|colSpan|rowSpan)="(-?\d+)"',r'\1={\2}',s)
    s2=re.sub(r'<svg viewBox="0 0 64 64"((?: [a-zA-Z-]+="[^"]*")*)>\s*<path d="M32 30\.5c-7\.6[^"]*" />\s*</svg>',
              lambda m:'<Paw'+re.sub(r' (aria-hidden|fill|viewBox)="[^"]*"','',m.group(1))+' />',s)
    if s2!=s: used.add('Paw'); s=s2
    if WA in s or 'tel:+971500000000' in s or 'info@instabizweb.com' in s: used.add('site')
    s=s.replace(f'href="{WA}"','href={site.whatsapp}').replace('href="tel:+971500000000"','href={site.phoneHref}').replace('href="mailto:info@instabizweb.com"','href={`mailto:${site.email}`}')
    s=re.sub(r'href="/cdn-cgi/l/email-protection[^"]*"','href={`mailto:${site.email}`}',s)
    s=re.sub(r'<span className="__cf_email__"[^>]*>\s*\[email&#160;protected\]\s*</span>|<span className="__cf_email__"[^>]*>\s*\[email\xa0protected\]\s*</span>|<span className="__cf_email__"[^>]*>\s*\[email protected\]\s*</span>','{site.email}',s)
    if 'site.email' in s: used.add('site')
    # internal anchors -> next/link
    lines=s.split('\n'); stack=[]
    for k,l in enumerate(lines):
        m=re.match(r'(\s*)<a ((?:(?!target=)[^>])*?href="/[^"]*"[^>]*)>$',l)
        if m and 'target=' not in l:
            lines[k]=m.group(1)+'<Link '+m.group(2)+'>'; ind=m.group(1)
            for q in range(k+1,len(lines)):
                if lines[q]==ind+'</a>': lines[q]=ind+'</Link>'; break
            used.add('Link')
        m2=re.match(r'(\s*)<a ((?:(?!target=)[^>])*?href="/[^"]*"[^>]*) />$',l)
        if m2: lines[k]=m2.group(1)+'<Link '+m2.group(2)+' />'; used.add('Link')
    s='\n'.join(lines)
    return s,used
def imports(used):
    l=[]
    if 'Link' in used: l.append('import Link from "next/link";')
    if 'PupBuddy' in used: l.append('import { PupBuddy } from "@/components/pup/PupBuddy";')
    if 'Paw' in used: l.append('import { Paw } from "@/components/ui/icons";')
    if 'site' in used: l.append('import { site } from "@/lib/site";')
    return '\n'.join(l)
def component(name,s,poses=(),client=False,props=''):
    s,used=refine(s,poses)
    body='\n'.join('    '+x for x in s.rstrip('\n').split('\n'))
    return ('"use client";\n\n' if client else '')+imports(used)+f'\n\nexport function {name}({props}) {{\n  return (\n{body}\n  );\n}}\n'
if __name__=='__main__':
    src,name,out=sys.argv[1:4]; poses=sys.argv[4].split(',') if len(sys.argv)>4 and sys.argv[4] else []
    open(out,'w').write(component(name,open(src).read(),poses))
