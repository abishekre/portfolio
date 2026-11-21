import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 700 }, isMobile: true, hasTouch: true });
await p.goto(process.argv[2] ?? 'http://localhost:4330', { waitUntil: 'networkidle' });
await p.evaluate(() => {
  document.addEventListener('astro:after-swap', () => {
    setTimeout(() => {
      window.__anims = document.getAnimations().map((a) => ({
        pe: a.effect.pseudoElement, name: a.animationName, dur: a.effect.getTiming().duration, delay: a.effect.getTiming().delay,
      }));
      window.__vt = document.documentElement.dataset.vt;
      window.__named = [...document.querySelectorAll('*')].filter((e) => getComputedStyle(e).viewTransitionName !== 'none').map((e) => e.className + ' => ' + getComputedStyle(e).viewTransitionName);
    }, 60);
  });
});
await p.tap('a.app[href="/tally"]');
await p.waitForTimeout(800);
console.log(await p.evaluate(() => JSON.stringify({ vt: window.__vt, named: window.__named, anims: window.__anims }, null, 1)));
await b.close();
