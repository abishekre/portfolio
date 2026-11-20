// Kcal without an account: onboarding with sample numbers, then the dashboard and a food search.
import { chromium } from 'playwright';
const browser = await chromium.launch();
const p = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const text = async () => (await p.locator('body').innerText()).slice(0, 260).replace(/\n+/g, ' | ');
await p.goto('https://kcal.abishekre.in', { waitUntil: 'networkidle' });
await p.waitForTimeout(2000);
await p.getByText('Continue without an account').click();
for (let i = 0; i < 8; i++) {
  await p.waitForTimeout(1600);
  const inputs = p.locator('input:visible');
  const n = await inputs.count();
  const sample = ['28', '172', '70'];
  const onAbout = (await text()).includes('About you');
  for (let j = 0; onAbout && j < n && j < 3; j++) {
    const v = await inputs.nth(j).inputValue();
    if (!v) await inputs.nth(j).fill(sample[j]).catch(() => {});
  }
  const btn = p.getByText(/^(Continue|Next|Done|Start|Let's go|Get started|Finish|Start tracking|Start logging)$/i).last();
  if (!(await btn.count())) break;
  console.log('step', i, await text());
  if ((await text()).includes('Your plan')) await p.screenshot({ path: 'src/assets/media/kcal/live-2.png' });
  await btn.click().catch(() => {});
}
await p.waitForTimeout(3000);
await p.screenshot({ path: 'src/assets/media/kcal/live-3.png' });
console.log('end:', await text());
await browser.close();
