// Drag the ID card to the right: its bottom should move right (and follow the pointer).
import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 960 } });
await p.addInitScript(() => localStorage.setItem('pf-unlocked', '1'));
await p.goto(process.argv[2] ?? 'http://localhost:4321', { waitUntil: 'networkidle' });
const card = p.locator('[data-idcard] .front');
const r0 = await card.boundingBox();
await p.mouse.move(r0.x + r0.width / 2, r0.y + r0.height - 20);
await p.mouse.down();
for (let i = 1; i <= 10; i++) await p.mouse.move(r0.x + r0.width / 2 + i * 8, r0.y + r0.height - 20);
const r1 = await card.boundingBox();
await p.mouse.up();
console.log('pointer moved right 80px; card centre moved', Math.round(r1.x + r1.width / 2 - (r0.x + r0.width / 2)), 'px');
await b.close();
