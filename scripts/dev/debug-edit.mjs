// Edit mode: hold an icon, drag it to another slot, Done, reload, and check the order stuck.
import { chromium } from 'playwright';
const b = await chromium.launch();
for (const touch of [false, true]) {
  const p = await b.newPage({ viewport: touch ? { width: 390, height: 844 } : { width: 1440, height: 960 }, isMobile: touch, hasTouch: touch });
  await p.addInitScript(() => { localStorage.setItem('pf-unlocked', '1'); localStorage.setItem('pf-peeked', '1'); });
  await p.goto(process.argv[2] ?? 'http://localhost:4321', { waitUntil: 'networkidle' });
  const order = () => p.evaluate(() => [...document.querySelectorAll('[data-grid] [data-app]')].slice(0, 4).map((a) => a.getAttribute('href')).join(' '));
  console.log(touch ? 'touch' : 'mouse', 'before', await order());
  const t = await p.locator('a.app[href="/tally"]').boundingBox();
  const k = await p.locator('a.app[href="/kcal"]').boundingBox();
  if (touch) {
    // A held finger: Playwright's touch can't hold, so use pointer events with pointerType touch via CDP.
    const cdp = await p.context().newCDPSession(p);
    const pt = (type, x, y) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y }] });
    await pt('touchStart', t.x + 30, t.y + 30);
    await p.waitForTimeout(700);
    await pt('touchEnd', 0, 0);
    await p.waitForTimeout(200);
    console.log('  jiggling after hold:', await p.evaluate(() => document.querySelector('[data-home]').classList.contains('jiggle')));
    await pt('touchStart', t.x + 30, t.y + 30);
    for (let i = 1; i <= 10; i++) await pt('touchMove', t.x + 30 + ((k.x - t.x) * i) / 10, k.y + 30);
    await pt('touchEnd', 0, 0);
  } else {
    await p.mouse.move(t.x + 30, t.y + 30);
    await p.mouse.down();
    await p.waitForTimeout(700);
    await p.mouse.up();
    console.log('  jiggling after hold:', await p.evaluate(() => document.querySelector('[data-home]').classList.contains('jiggle')));
    await p.mouse.move(t.x + 30, t.y + 30);
    await p.mouse.down();
    for (let i = 1; i <= 10; i++) await p.mouse.move(t.x + 30 + ((k.x - t.x) * i) / 10, k.y + 30);
    await p.mouse.up();
  }
  await p.waitForTimeout(400);
  console.log('  after drag', await order(), 'reset shown:', await p.locator('[data-reset]').isVisible());
  await p.getByRole('button', { name: 'Done' }).click();
  await p.reload({ waitUntil: 'networkidle' });
  console.log('  after reload', await order());
  await p.close();
}
await b.close();
