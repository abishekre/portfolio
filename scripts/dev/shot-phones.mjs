// Home screen at real phone viewport sizes (the space between a browser's bars), dark.
import { chromium } from 'playwright';
const [base = 'http://localhost:4321', out = '.'] = process.argv.slice(2);
const b = await chromium.launch();
for (const [w, h] of [[393, 660], [393, 692], [430, 740], [375, 600]]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, colorScheme: 'dark' });
  await p.addInitScript(() => { localStorage.setItem('pf-unlocked', '1'); localStorage.setItem('pf-peeked', '1'); localStorage.setItem('pf-theme', 'dark'); });
  await p.goto(base, { waitUntil: 'networkidle' });
  await p.waitForTimeout(500);
  const fits = await p.evaluate(() => {
    const dock = document.querySelector('.dock').getBoundingClientRect();
    const pager = document.querySelector('.pager').getBoundingClientRect();
    const last = [...document.querySelectorAll('[data-grid] li')].pop().getBoundingClientRect();
    return { dockBottom: Math.round(dock.bottom), vh: innerHeight, pagerVisible: pager.bottom <= dock.top + 1, lastIconAboveDock: last.bottom <= pager.top + 1 };
  });
  console.log(w + 'x' + h, JSON.stringify(fits));
  await p.screenshot({ path: `${out}/ph-${w}x${h}.png` });
  await p.close();
}
await b.close();
