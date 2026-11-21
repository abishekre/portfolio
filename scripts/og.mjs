// Renders share images into public/og/. Run with the dev server up: npm run dev, then npm run og.
// Hidden projects get one too; it's harmless.
import { chromium } from 'playwright';
import { mkdir, readdir } from 'node:fs/promises';

const base = process.env.OG_BASE ?? 'http://localhost:4321';
const slugs = (await readdir('content/projects', { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name);
await mkdir('public/og', { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const slug of slugs) {
  await page.goto(`${base}/og/${slug}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `public/og/${slug}.png` });
  console.log('og', slug);
}

// The home card is the desk itself, in daylight.
const desk = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1, colorScheme: 'light' });
// As a returning visitor: past the lock screen.
await desk.addInitScript(() => {
  localStorage.setItem('pf-unlocked', '1');
  localStorage.setItem('pf-peeked', '1');
});
await desk.goto(base, { waitUntil: 'networkidle' });
await desk.evaluate(() => {
  document.documentElement.dataset.time = 'day';
  return document.fonts.ready;
});
await desk.waitForTimeout(800);
await desk.screenshot({ path: 'public/og/home.png' });
console.log('og home');
await browser.close();
