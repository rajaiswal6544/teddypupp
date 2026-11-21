import re,sys
sys.path.insert(0,'tools'); from refine import refine, imports
H='/home/user/teddypups/src/'
def inner_main(path):
    s=open(path).read().rstrip('\n').split('\n')
    assert s[0].startswith('<main'), s[0][:40]
    # drop main + the trailing mascot layers (pup-probe / pup-prints / pup-layer) that follow the page div
    body=s[1:-1]
    # keep only the first top-level child (the tp-page div)
    out=[]; depth_indent='  <div'
    for i,l in enumerate(body):
        out.append(l)
        if i>0 and l=='  </div>': break
    return '\n'.join(x[2:] for x in out)+'\n'
def replace_list(s, open_pat, item_pat, new_body):
    """Replace all items inside the first element matching open_pat with new_body."""
    a=s.find(open_pat); assert a>=0, open_pat
    line_start=s.rfind('\n',0,a)+1; ind=a-line_start
    tag=re.match(r'<(\w+)',s[a:]).group(1)
    end=s.find('\n'+' '*ind+f'</{tag}>',a)
    head_end=s.find('>\n',a)+2
    return s[:head_end]+new_body+s[end+1:]
def page(name,s,poses,extra_imports='',pre='',props=''):
    s,used=refine(s,poses)
    body='\n'.join('    '+x for x in s.rstrip('\n').split('\n'))
    imp=imports(used)
    return imp+('\n' if imp else '')+extra_imports+'\n'+pre+f'\nexport default function {name}({props}) {{\n  return (\n{body}\n  );\n}}\n'
