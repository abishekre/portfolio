// Close-ups of the coffee: at rest, while stirring, and mid-sip.
import { chromium } from 'playwright';
const [base = 'http://localhost:4321', out = '.'] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 2 });
await p.addInitScript(() => { localStorage.setItem('pf-unlocked', '1'); localStorage.setItem('pf-theme', 'light'); });
await p.goto(base, { waitUntil: 'networkidle' });
await p.waitForTimeout(600);
const cup = p.locator('[data-cup]');
const r = await cup.boundingBox();
const shot = (n) => p.screenshot({ path: `${out}/coffee-${n}.png`, clip: { x: 0, y: r.y - 80, width: r.x + r.width + 40, height: r.height + 80 } });
await shot('rest');
const cx = r.x + r.width / 2, cy = r.y + r.height / 2;
await p.mouse.move(cx + 40, cy);
await p.mouse.down();
for (let i = 0; i <= 40; i++) { const a = (i / 40) * Math.PI * 1.6; await p.mouse.move(cx + Math.cos(a) * 40, cy + Math.sin(a) * 40); }
await shot('stir');
await p.mouse.up();
await p.waitForTimeout(1500);
await p.mouse.click(cx, cy);
await p.waitForTimeout(330);
await shot('sip');
await b.close();
