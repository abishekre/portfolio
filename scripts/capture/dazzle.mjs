// Saves into content/projects/<folder>/screens/. Screens show in filename order (1.png, 2.png, …), so rename to taste.
// Dazzle Designs, run locally: (Dazzle Design) npx next dev -p 5193
// Only views pages; the quote form is never submitted.
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
const dir = 'content/projects/dazzle/screens';
await mkdir(dir, { recursive: true });
const browser = await chromium.launch();
const p = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
for (let i = 0; i < 20; i++) {
  try {
    await p.goto('http://localhost:5193', { waitUntil: 'networkidle', timeout: 90000 });
    break;
  } catch {
    await new Promise((r) => setTimeout(r, 3000));
  }
}
await p.waitForTimeout(3000);
await p.screenshot({ path: `${dir}/screen-1.png` });
await p.mouse.wheel(0, 900);
await p.waitForTimeout(1500);
await p.screenshot({ path: `${dir}/screen-2.png` });
for (const path of ['/portfolio', '/quote']) {
  await p.goto('http://localhost:5193' + path, { waitUntil: 'networkidle', timeout: 90000 }).catch(() => {});
  await p.waitForTimeout(2500);
  await p.screenshot({ path: `${dir}/screen${path.replace('/', '-')}.png` });
}
console.log((await p.locator('body').innerText()).slice(0, 200).replace(/\n+/g, ' | '));
await browser.close();
