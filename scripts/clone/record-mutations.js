const { chromium } = require('playwright');
const path=process.argv[2]||'/';
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.addInitScript(()=>{
    window.__m={};
    new MutationObserver(ms=>{for(const m of ms){
      const el=m.target; if(el.nodeType!==1) continue;
      const cls=(el.getAttribute('class')||'').split(' ').filter(c=>c.startsWith('tp-')||c.startsWith('pup')).slice(0,2).join('.')||el.tagName;
      let k;
      if(m.type==='attributes'){ const v=el.getAttribute(m.attributeName)||''; k=cls+' @'+m.attributeName+' = '+(m.attributeName==='style'?v.replace(/[\d.]+/g,'#').slice(0,140):v.slice(0,60)); }
      else k=cls+' childList +'+m.addedNodes.length+' -'+m.removedNodes.length;
      window.__m[k]=(window.__m[k]||0)+1;
    }}).observe(document,{subtree:true,attributes:true,childList:true});
  });
  await p.goto('https://puppy.instabizweb.com'+path,{waitUntil:'networkidle'});
  await p.waitForTimeout(2500);
  const H=await p.evaluate(()=>document.body.scrollHeight);
  for(let y=0;y<H;y+=250){await p.mouse.wheel(0,250);await p.waitForTimeout(60);}
  await p.waitForTimeout(1500);
  const m=await p.evaluate(()=>window.__m);
  for(const [k,v] of Object.entries(m).sort()) if(!/^(SPAN|DIV|SCRIPT|HEAD|BODY|LINK|META|STYLE|IMG|HTML) /.test(k)||/data-|class/.test(k)) console.log(v,k);
  await b.close();
})();
