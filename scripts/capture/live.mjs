// Saves into content/projects/<folder>/screens/. Screens show in filename order (1.png, 2.png, …), so rename to taste.
// Screenshots of the live web builds at phone size. Nothing here writes to a server:
// Kcal is used without an account (data stays in this throwaway browser).
// Usage: node scripts/capture/live.mjs [slug]
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const shot = (page, dir, n) => page.screenshot({ path: `${dir}/live-${n}.png` });

const targets = {
  bytwo: {
    url: 'https://bytwo.vercel.app',
    async run(page, dir) {
      await page.waitForTimeout(6000);
      await shot(page, dir, 1);
      console.log('bytwo buttons:', await page.locator('text=/./').allInnerTexts().then((t) => t.slice(0, 15).join(' | ')));
    },
  },
  deuce: {
    url: 'https://deuce-olive.vercel.app',
    async run(page, dir) {
      await page.waitForTimeout(2500);
      await shot(page, dir, 1);
    },
  },
  kcal: {
    url: 'https://kcal.abishekre.in',
    async run(page, dir) {
      await page.waitForTimeout(2000);
      await page.getByText('Continue without an account').click();
      await page.waitForTimeout(3500);
      await shot(page, dir, 1);
      console.log('kcal after:', (await page.locator('body').innerText()).slice(0, 400).replace(/\n+/g, ' | '));
    },
  },
};

const only = process.argv[2];
const browser = await chromium.launch();
for (const [slug, t] of Object.entries(targets)) {
  if (only && only !== slug) continue;
  const dir = `content/projects//screens${slug}`;
  await mkdir(dir, { recursive: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  try {
    await page.goto(t.url, { waitUntil: 'networkidle', timeout: 45000 });
    await t.run(page, dir);
    console.log('ok', slug);
  } catch (e) {
    console.log('failed', slug, e.message.split('\n')[0]);
  }
  await page.close();
}
await browser.close();
