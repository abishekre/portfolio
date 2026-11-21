import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 700 }, isMobile: true, hasTouch: true });
p.on('console', (m) => console.log('console', m.type(), m.text()));
p.on('pageerror', (e) => console.log('pageerror', e.message));
await p.goto(process.argv[2] ?? 'https://www.abishekre.in', { waitUntil: 'networkidle' });
await p.tap('a.app[href="/tally"]'); await p.waitForTimeout(1200); console.log('1', p.url());
await p.evaluate(() => document.querySelector('[data-appview]').scrollBy(0, 500)); await p.waitForTimeout(600); await p.tap('.back'); await p.waitForTimeout(1200); console.log('2', p.url());
const info = await p.evaluate(() => {
  const a = document.querySelector('a.app[href="/kcal"]'); const r = a.getBoundingClientRect();
  const top = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
  return { rect: [r.x, r.y, r.width, r.height], top: top?.outerHTML.slice(0, 160), appviews: document.querySelectorAll('[data-appview]').length, vt: document.documentElement.className };
});
console.log(JSON.stringify(info));
await p.tap('a.app[href="/kcal"]'); await p.waitForTimeout(1500); console.log('3', p.url());
await b.close();
