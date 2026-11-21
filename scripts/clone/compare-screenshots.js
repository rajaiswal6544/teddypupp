// node cmp.js <path> <width> <outprefix> [scrollY...] : viewport screenshots of ref vs local at given scroll positions, side by side
const { chromium } = require('playwright'); const { execSync } = require('child_process');
const [path, w, out, ...ys] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch(); const W = +w, H = W < 600 ? 844 : 900;
  const shots = {};
  for (const [k, base] of [['ref', 'https://puppy.instabizweb.com'], ['me', 'http://localhost:3000']]) {
    const p = await b.newPage({ viewport: { width: W, height: H } });
    await p.goto(base + path, { waitUntil: 'load', timeout: 60000 }); await p.waitForTimeout(2500);
    shots[k] = [];
    for (const y of (ys.length ? ys : ['0'])) {
      await p.evaluate(y => { let t = +y; if (isNaN(t)) { const [sel, off] = y.split('@'); const e = document.querySelector(sel); t = e ? e.getBoundingClientRect().top + scrollY + (+off || 0) : 0; }
        const l = window.__lenis || null; if (l && l.scrollTo) l.scrollTo(t, { immediate: true, force: true }); window.scrollTo(0, t); }, y);
      for (let k = 0; k < 6; k++) { await p.mouse.wheel(0, 1); await p.waitForTimeout(80); }
      await p.waitForTimeout(900);
      const f = `${out}-${k}-${y.replace(/[^a-z0-9]/gi,'_')}.png`; await p.screenshot({ path: f }); shots[k].push(f);
    }
    await p.close();
  }
  await b.close();
  for (let i = 0; i < shots.ref.length; i++) {
    execSync(`python3 -c "
from PIL import Image
a=Image.open('${shots.ref[i]}');b=Image.open('${shots.me[i]}')
c=Image.new('RGB',(a.width+b.width+10,max(a.height,b.height)),'red');c.paste(a,(0,0));c.paste(b,(a.width+10,0))
s=0.5 if a.width>600 else 1
c=c.resize((int(c.width*s),int(c.height*s)));c.save('${out}-cmp-${(ys[i] || '0').replace(/[^a-z0-9]/gi,'_')}.png')"`);
  }
  console.log('ok');
})();
