// Open Work from home page two, close it, and report which page the home screen is on.
import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 860 } });
await p.goto(process.argv[2] ?? 'http://localhost:4321', { waitUntil: 'networkidle' });
await p.evaluate(() => localStorage.setItem('pf-unlocked', '1'));
await p.reload({ waitUntil: 'networkidle' });
await p.click('[data-dot="1"]');
await p.waitForTimeout(700);
await p.click('a.app[href="/work"]');
await p.waitForTimeout(900);
await p.click('.back');
await p.waitForTimeout(900);
console.log(await p.evaluate(() => {
  const pages = document.querySelector('[data-pages]');
  return { page: Math.round(pages.scrollLeft / pages.clientWidth), dot: document.querySelector('.dot.on')?.dataset.dot };
}));
await b.close();
