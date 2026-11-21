import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 960 } });
await p.addInitScript(() => { localStorage.setItem('pf-unlocked', '1'); localStorage.setItem('pf-theme', 'light'); });
await p.goto(process.argv[2] ?? 'http://localhost:4321', { waitUntil: 'networkidle' });
const box = await p.locator('[data-chain] .bob').boundingBox();
console.log('bob', box);
await p.mouse.move(box.x + 5, box.y + 5);
await p.mouse.down();
for (let i = 1; i <= 12; i++) { await p.mouse.move(box.x + 5, box.y + 5 + i * 8); }
const mid = await p.evaluate(() => getComputedStyle(document.querySelector('[data-chain]')).getPropertyValue('--pull'));
await p.mouse.up();
await p.waitForTimeout(1200);
console.log('pull while dragging', mid, 'theme after', await p.evaluate(() => document.documentElement.dataset.time));
await b.close();
