// Phone-size recording: swipe to page two, open Work, close it. For checking the close lands on page two.
import { chromium } from 'playwright';
const [base = 'http://localhost:4330', out = '.'] = process.argv.slice(2);
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 760 }, isMobile: true, hasTouch: true, recordVideo: { dir: out, size: { width: 390, height: 760 } } });
await ctx.addInitScript(() => { localStorage.setItem('pf-unlocked', '1'); localStorage.setItem('pf-peeked', '1'); });
const p = await ctx.newPage();
await p.goto(base, { waitUntil: 'networkidle' });
await p.waitForTimeout(600);
await p.tap('[data-dot="1"]');
await p.waitForTimeout(900);
await p.tap('a.app[href="/work"]');
await p.waitForTimeout(1200);
await p.tap('.appview .back');
await p.waitForTimeout(1200);
await ctx.close(); await b.close();
