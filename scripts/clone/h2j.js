// HTML -> JSX converter for SSR markup. Usage: node h2j.js in.html out.jsx
const { parseDocument } = require('htmlparser2');
const fs = require('fs');
const VOID = new Set(['img','input','br','hr','meta','link','source','area','col','wbr','track']);
const MAP = { class:'className', for:'htmlFor', tabindex:'tabIndex', fetchpriority:'fetchPriority', srcset:'srcSet',
  autocomplete:'autoComplete', maxlength:'maxLength', minlength:'minLength', readonly:'readOnly', colspan:'colSpan', rowspan:'rowSpan',
  crossorigin:'crossOrigin', enctype:'encType', novalidate:'noValidate', spellcheck:'spellCheck', autoplay:'autoPlay',
  playsinline:'playsInline', inputmode:'inputMode', enterkeyhint:'enterKeyHint', datetime:'dateTime', charset:'charSet',
  'xlink:href':'xlinkHref', 'xml:space':'xmlSpace', 'xmlns:xlink':'xmlnsXlink', autofocus:'autoFocus', allowfullscreen:'allowFullScreen',
  frameborder:'frameBorder', referrerpolicy:'referrerPolicy', imagesrcset:'imageSrcSet', imagesizes:'imageSizes', accesskey:'accessKey',
  contenteditable:'contentEditable', popovertarget:'popoverTarget', defaultvalue:'defaultValue' };
const camel = s => s.replace(/[-:]([a-z])/g, (_, c) => c.toUpperCase());
const esc = s => JSON.stringify(s);
function styleObj(s) {
  const parts = []; let depth = 0, cur = '';
  for (const ch of s) { if (ch === '(') depth++; if (ch === ')') depth--; if (ch === ';' && depth === 0) { parts.push(cur); cur=''; } else cur += ch; }
  if (cur.trim()) parts.push(cur);
  const kv = parts.map(p => { const i = p.indexOf(':'); if (i < 0) return null; let k = p.slice(0, i).trim(), v = p.slice(i + 1).trim();
    if (!k) return null; const key = k.startsWith('--') ? esc(k) : camel(k.replace(/^-webkit-/, 'webkit-').replace(/^-ms-/, 'ms-'));
    if (/^background-image$/.test(k) && v.includes('data:image')) return null; // drop blur placeholders
    return `${key.startsWith('"') ? key : (/^webkit/.test(key) ? 'Webkit' + key.slice(6) : key)}: ${esc(v)}`; }).filter(Boolean);
  return `{{ ${kv.join(', ')} }}`;
}
function fixSrc(v) { const m = v.match(/^\/_next\/image\?url=([^&]+)/); return m ? decodeURIComponent(m[1]) : v; }
function attrs(el) {
  const out = [];
  for (let [k, v] of Object.entries(el.attribs)) {
    if (k === 'srcset' || k === 'srcSet' || k === 'sizes' || k === 'data-nimg' || k === 'decoding') continue;
    if (k === 'style') { out.push(`style=${styleObj(v)}`); continue; }
    if (k === 'src' || k === 'href' || k === 'poster') v = fixSrc(v);
    let name = MAP[k] || MAP[k.toLowerCase()] || k;
    if (!/^(data|aria)-/.test(name) && /[-:]/.test(name)) name = camel(name);
    if (name === 'value' && el.name !== 'option' && el.name !== 'button') name = 'defaultValue';
    if (name === 'checked') name = 'defaultChecked';
    if (v === '' && ['hidden','open','disabled','required','defaultChecked','readOnly','multiple','selected','autoPlay','muted','loop','playsInline','noValidate','controls','async','defer'].includes(name)) { out.push(name); continue; }
    out.push(`${name}=${esc(v)}`);
  }
  return out.length ? ' ' + out.join(' ') : '';
}
function render(node, d) {
  const pad = '  '.repeat(d);
  if (node.type === 'text') { const t = node.data.replace(/\s+/g, ' '); if (!t.trim()) return ''; return pad + (/[{}<>"'&`]/.test(t) || /^\s|\s$/.test(t) ? `{${esc(t)}}` : t.trim()) + '\n'; }
  if (node.type === 'comment' || node.type === 'directive') return '';
  if (node.type === 'script' || node.name === 'script' || node.name === 'template') return '';
  if (node.name === 'style') return pad + `<style>{${esc(node.children.map(c => c.data).join(''))}}</style>\n`;
  // React separates adjacent text with <!-- --> comments; merge them back into one text run
  const merged = [];
  for (const c of (node.children || [])) {
    if (c.type === 'comment') continue;
    const last = merged[merged.length - 1];
    if (c.type === 'text' && last && last.type === 'text') merged[merged.length - 1] = { type: 'text', data: last.data + c.data };
    else merged.push(c);
  }
  const kids = merged.map(c => render(c, d + 1)).join('');
  const a = attrs(node);
  if (VOID.has(node.name) || !kids) return `${pad}<${node.name}${a} />\n`;
  return `${pad}<${node.name}${a}>\n${kids}${pad}</${node.name}>\n`;
}
const html = fs.readFileSync(process.argv[2], 'utf8');
const doc = parseDocument(html, { lowerCaseAttributeNames: false, lowerCaseTags: false, recognizeSelfClosing: true });
const sel = process.argv[4];
let roots = doc.children;
if (sel) { const du = require('domutils'); roots = du.findAll(e => (e.attribs?.class || '').split(' ').includes(sel) || e.attribs?.['data-section'] === sel || e.attribs?.id === sel, doc.children).slice(0, 1); }
fs.writeFileSync(process.argv[3], roots.map(r => render(r, 0)).join(''));
