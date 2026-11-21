// Records unlocking (tap) and locking again (Control Center → Lock) at phone size.
import { chromium } from 'playwright';
const [base = 'http://localhost:4321', out = '.'] = process.argv.slice(2);
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 780 }, isMobile: true, hasTouch: true, recordVideo: { dir: out, size: { width: 390, height: 780 } } });
const p = await ctx.newPage();
await p.goto(base, { waitUntil: 'networkidle' });
await p.waitForTimeout(1500);
await p.getByRole('button', { name: 'Swipe up to open' }).tap();
await p.waitForTimeout(1600);
await p.getByRole('button', { name: /Control Center/ }).tap();
await p.waitForTimeout(900);
await p.getByRole('dialog', { name: 'Control Center' }).getByRole('button', { name: 'Lock' }).tap();
await p.waitForTimeout(1500);
await ctx.close(); await b.close();
