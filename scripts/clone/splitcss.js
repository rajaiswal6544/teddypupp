const postcss = require('postcss'); const fs = require('fs'); const path = require('path');
const root = postcss.parse(fs.readFileSync('../ref/outside.css', 'utf8'));
const OUT = process.argv[2]; fs.mkdirSync(OUT, { recursive: true });
const buckets = {};
const famOf = sel => { const m = sel.match(/\.(tp|pup)-([a-z]+)/); if (m) return (m[1] === 'pup' ? 'pup' : m[2]); if (/cursor|html|body/.test(sel)) return 'base'; return 'misc'; };
const GROUP = { // merge tiny families into their page/section file
  'nav':'header','menu':'header','hem':'header', 'runner':'curtain', 'twinkle':'footer','moon':'footer','basket':'footer',
};
const G2=JSON.parse(fs.readFileSync("groups.json"));const fam = f => { f = GROUP[f] || f; return G2[f] || (console.error("UNMAPPED",f), f); };
function add(f, node, wrapAt) {
  f = fam(f); buckets[f] ||= postcss.root();
  if (!wrapAt) { buckets[f].append(node.clone()); return; }
  // find/create same at-rule wrapper as last node in bucket
  const last = buckets[f].last;
  if (last && last.type === 'atrule' && last.name === wrapAt.name && last.params === wrapAt.params) last.append(node.clone());
  else { const w = wrapAt.clone({ nodes: [] }); w.append(node.clone()); buckets[f].append(w); }
}
function keyframeFam(name){ const m=name.match(/^(?:tp|pup)-([a-z]+)/); return m? (name.startsWith("pup")?"pup":m[1]) : "anim"; }
root.each(n => {
  if (n.type === 'rule') add(famOf(n.selector), n);
  else if (n.type === 'atrule' && /keyframes/.test(n.name)) add(keyframeFam(n.params), n);
  else if (n.type === 'atrule' && (n.name === 'media' || n.name === 'supports' || n.name === 'container')) {
    n.each(c => { if (c.type === 'rule') add(famOf(c.selector), c, n); else if (c.type==='atrule') add(famOf(c.toString()), c, n); });
  } else add('misc', n);
});
const files = Object.keys(buckets).sort();
for (const f of files) fs.writeFileSync(path.join(OUT, f + '.css'), `/* ${f} */\n` + buckets[f].toString() + '\n');
console.log(files.map(f => f + ':' + buckets[f].toString().length).join(' '));
