// Screenshots the lock screen on a tall phone and on desktop, as a first-time visitor.
import { chromium } from 'playwright';
const [base = 'http://localhost:4321', out = '.'] = process.argv.slice(2);
const b = await chromium.launch();
const phone = await b.newPage({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
await phone.goto(base, { waitUntil: 'networkidle' });
await phone.waitForTimeout(1500);
await phone.screenshot({ path: `${out}/lock-phone.png` });
const desk = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
await desk.goto(base, { waitUntil: 'networkidle' });
await desk.waitForTimeout(1500);
await desk.screenshot({ path: `${out}/lock-desk.png` });
await b.close();
