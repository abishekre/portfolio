// Screenshots the desktop home at common laptop sizes, to check nothing on the desk is cut off.
import { chromium } from 'playwright';
const [base = 'http://localhost:4321', out = '.'] = process.argv.slice(2);
const b = await chromium.launch();
for (const [w, h] of [[1536, 730], [1366, 650], [1920, 960], [1280, 720]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.addInitScript(() => { localStorage.setItem('pf-unlocked', '1'); localStorage.setItem('pf-peeked', '1'); });
  await p.goto(base, { waitUntil: 'networkidle' });
  await p.waitForTimeout(700);
  await p.screenshot({ path: `${out}/size-${w}x${h}.png` });
  await p.close();
}
await b.close();
