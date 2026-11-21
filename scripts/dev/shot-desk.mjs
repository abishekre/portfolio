// Screenshots the desktop home at 2x, day and night, for checking the desk objects.
import { chromium } from 'playwright';
const [base = 'http://localhost:4321', out = '.'] = process.argv.slice(2);
const b = await chromium.launch();
for (const time of ['day', 'night']) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, colorScheme: time === 'night' ? 'dark' : 'light' });
  await p.goto(base, { waitUntil: 'networkidle' });
  await p.evaluate((t) => { localStorage.setItem('pf-unlocked', '1'); localStorage.setItem('pf-peeked', '1'); }, time);
  await p.reload({ waitUntil: 'networkidle' });
  await p.evaluate((t) => { document.documentElement.dataset.time = t; return document.fonts.ready; }, time);
  await p.waitForTimeout(800);
  await p.screenshot({ path: `${out}/desk-${time}.png` });
  await p.close();
}
await b.close();
