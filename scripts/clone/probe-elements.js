const { chromium } = require('playwright');
const [path, sel, ...ys] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto('https://puppy.instabizweb.com' + path, { waitUntil: 'load' }); await p.waitForTimeout(2500);
  for (const y of ys) {
    await p.evaluate(y => window.scrollTo(0, +y), y); await p.waitForTimeout(1200);
    const r = await p.evaluate(sel => [...document.querySelectorAll(sel)].map(e => {
      const a = {}; for (const at of e.attributes) if (at.name.startsWith('data-') || at.name === 'style') a[at.name] = at.value.slice(0, 160);
      const rc = e.getBoundingClientRect(); return { tag: e.className.toString().split(' ')[0] || e.tagName, top: Math.round(rc.top), h: Math.round(rc.height), w: Math.round(rc.width), ...a };
    }), sel);
    console.log('Y=' + y + ' sy=' + await p.evaluate(() => scrollY), JSON.stringify(r));
  }
  await b.close();
})();
