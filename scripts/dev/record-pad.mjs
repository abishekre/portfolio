// Records the notepad: into an app, next app, previous app, back home.
import { chromium } from 'playwright';
const [base = 'http://localhost:4321', out = '.'] = process.argv.slice(2);
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 960 }, recordVideo: { dir: out, size: { width: 1440, height: 960 } } });
await ctx.addInitScript(() => { localStorage.setItem('pf-unlocked', '1'); localStorage.setItem('pf-theme', 'light'); });
const p = await ctx.newPage();
await p.goto(base, { waitUntil: 'networkidle' });
await p.waitForTimeout(1000);
const t0 = Date.now();
const mark = (n) => console.log(n, ((Date.now() - t0) / 1000 + 1).toFixed(2));
mark('open'); await p.locator('a.app[href="/tally"]').click(); await p.waitForTimeout(2200);
mark('next'); await p.locator('.pn a[data-dir="forward"]').click(); await p.waitForTimeout(2200);
mark('prev'); await p.locator('.pn a[data-dir="back"]').click(); await p.waitForTimeout(2200);
mark('home'); await p.keyboard.press('Escape'); await p.waitForTimeout(2200);
await ctx.close(); await b.close();
