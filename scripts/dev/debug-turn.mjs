import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 960 } });
await p.addInitScript(() => localStorage.setItem('pf-unlocked', '1'));
await p.goto(process.argv[2] ?? 'http://localhost:4321', { waitUntil: 'networkidle' });
await p.evaluate(() => {
  window.__log = [];
  document.addEventListener('astro:after-swap', () => {
    const snap = (label) => {
      const sheets = [...document.querySelectorAll('[data-pad] .sheet')].map((s) => s.className + ' | anims:' + s.getAnimations().map((a) => a.animationName + '@' + Math.round(a.currentTime)).join(','));
      window.__log.push(label + ' ' + JSON.stringify(sheets));
    };
    setTimeout(() => snap('t+50'), 50);
    setTimeout(() => snap('t+250'), 250);
    setTimeout(() => snap('t+500'), 500);
  });
});
await p.locator('a.app[href="/tally"]').click();
await p.waitForTimeout(900);
console.log((await p.evaluate(() => window.__log)).join('\n'));
await b.close();
