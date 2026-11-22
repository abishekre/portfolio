// Phone-size screenshots, light and dark: home, an app, and the theme-color the browser bar would use.
import { chromium } from 'playwright';
const [base = 'http://localhost:4321', out = '.'] = process.argv.slice(2);
const b = await chromium.launch();
for (const scheme of ['light', 'dark']) {
  const p = await b.newPage({ viewport: { width: 390, height: 760 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, colorScheme: scheme });
  await p.addInitScript((s) => { localStorage.setItem('pf-unlocked', '1'); localStorage.setItem('pf-peeked', '1'); localStorage.setItem('pf-theme', s === 'dark' ? 'dark' : 'light'); }, scheme);
  for (const path of ['/', '/tally', '/kcal', '/resume']) {
    await p.goto(base + path, { waitUntil: 'networkidle' });
    await p.waitForTimeout(500);
    const meta = await p.evaluate(() => [document.querySelector('meta[name=theme-color]')?.getAttribute('content'), getComputedStyle(document.body).backgroundColor]);
    console.log(scheme, path, 'theme-color', meta[0], 'body', meta[1]);
    await p.screenshot({ path: `${out}/m-${scheme}-${path.replace('/', '') || 'home'}.png` });
  }
  await p.close();
}
await b.close();
