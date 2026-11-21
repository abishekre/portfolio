// Records pulling the lamp chain: it should lengthen, spring back, swing, and the theme should wipe from the bulb.
import { chromium } from 'playwright';
const [base = 'http://localhost:4321', out = '.'] = process.argv.slice(2);
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 960 }, recordVideo: { dir: out, size: { width: 1440, height: 960 } } });
await ctx.addInitScript(() => { localStorage.setItem('pf-unlocked', '1'); localStorage.setItem('pf-peeked', '1'); localStorage.setItem('pf-theme', 'light'); });
const p = await ctx.newPage();
await p.goto(base, { waitUntil: 'networkidle' });
await p.waitForTimeout(800);
const box = (await p.locator('[data-chain] .bob').boundingBox());
await p.mouse.move(box.x + 5, box.y + 5);
await p.mouse.down();
for (let i = 1; i <= 12; i++) { await p.mouse.move(box.x + 5, box.y + 5 + i * 8); await p.waitForTimeout(30); }
await p.waitForTimeout(200);
await p.mouse.up();
await p.waitForTimeout(1800);
await ctx.close(); await b.close();
