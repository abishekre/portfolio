// The phone with Control Center open (desktop, 2x), and the home screen with side buttons.
import { chromium } from 'playwright';
const [base = 'http://localhost:4321', out = '.'] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 2 });
await p.addInitScript(() => { localStorage.setItem('pf-unlocked', '1'); localStorage.setItem('pf-theme', 'light'); });
await p.goto(base, { waitUntil: 'networkidle' });
await p.waitForTimeout(600);
const phone = p.locator('.phone');
const r = await phone.boundingBox();
const clip = { x: r.x - 20, y: r.y, width: r.width + 40, height: r.height };
await p.screenshot({ path: `${out}/phone-home.png`, clip });
await p.getByRole('button', { name: /Control Center/ }).click();
await p.waitForTimeout(700);
await p.screenshot({ path: `${out}/phone-cc.png`, clip });
await b.close();
