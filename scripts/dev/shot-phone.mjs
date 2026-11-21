// Screenshots the home screen at a tall-iPhone size (430x932 CSS px at 3x), page one and two.
import { chromium } from 'playwright';
const [base = 'http://localhost:4321', out = '.'] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, colorScheme: 'dark' });
await p.addInitScript(() => { localStorage.setItem('pf-unlocked', '1'); localStorage.setItem('pf-peeked', '1'); });
await p.goto(base, { waitUntil: 'networkidle' });
await p.waitForTimeout(600);
await p.screenshot({ path: `${out}/phone-1.png` });
await p.tap('[data-dot="1"]');
await p.waitForTimeout(800);
await p.screenshot({ path: `${out}/phone-2.png` });
await b.close();
