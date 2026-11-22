// Phone size: open Tally, then next → and ← previous, to check the sideways push.
import { chromium } from 'playwright';
const [base = 'http://localhost:4321', out = '.'] = process.argv.slice(2);
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 760 }, isMobile: true, hasTouch: true, recordVideo: { dir: out, size: { width: 390, height: 760 } } });
await ctx.addInitScript(() => { localStorage.setItem('pf-unlocked', '1'); localStorage.setItem('pf-theme', 'light'); });
const p = await ctx.newPage();
await p.goto(base + '/tally', { waitUntil: 'networkidle' });
await p.waitForTimeout(800);
await p.evaluate(() => document.querySelector('.pn').scrollIntoView());
await p.waitForTimeout(400);
await p.locator('.pn a[data-dir="forward"]').tap();
await p.waitForTimeout(1300);
await ctx.close(); await b.close();
