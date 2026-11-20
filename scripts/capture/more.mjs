// Saves into content/projects/<folder>/screens/. Screens show in filename order (1.png, 2.png, …), so rename to taste.
// Extra screens from the live builds. Local-only interactions; nothing is submitted.
// Usage: node scripts/capture/more.mjs
import { chromium } from 'playwright';

const browser = await chromium.launch();
const newPage = () =>
  browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

async function step(name, fn) {
  const p = await newPage();
  try {
    await fn(p);
    console.log('ok', name);
  } catch (e) {
    console.log('failed', name, e.message.split('\n')[0]);
  }
  await p.close();
}

// ByTwo: second and third intro slides.
await step('bytwo', async (p) => {
  await p.goto('https://bytwo.vercel.app', { waitUntil: 'networkidle' });
  await p.waitForTimeout(5000);
  for (const n of [2, 3]) {
    await p.getByText(/^next$/i).first().click();
    await p.waitForTimeout(2500);
    await p.screenshot({ path: `content/projects/bytwo/screens/live-${n}.png` });
  }
});

// Deuce: type the players in, don't start the match.
await step('deuce', async (p) => {
  await p.goto('https://deuce-olive.vercel.app', { waitUntil: 'networkidle' });
  await p.waitForTimeout(2000);
  const names = ['Ammu', 'Rahul', 'Sneha', 'Joel'];
  for (let i = 0; i < 4; i++) await p.getByPlaceholder(`Player ${i + 1}`).fill(names[i]);
  await p.waitForTimeout(500);
  await p.screenshot({ path: 'content/projects/deuce/screens/live-1.png' });
});

// Kcal: through onboarding with the defaults, in this throwaway browser.
await step('kcal', async (p) => {
  await p.goto('https://kcal.abishekre.in', { waitUntil: 'networkidle' });
  await p.waitForTimeout(2000);
  await p.getByText('Continue without an account').click();
  for (let i = 0; i < 6; i++) {
    await p.waitForTimeout(1800);
    const btn = p.getByText(/^(Continue|Next|Done|Start|Let's go|Get started|Finish)$/i).last();
    if (!(await btn.count())) break;
    await p.screenshot({ path: `content/projects/kcal/screens/step-${i}.png` });
    await btn.click().catch(() => {});
  }
  await p.waitForTimeout(3000);
  await p.screenshot({ path: 'content/projects/kcal/screens/live-2.png' });
  console.log((await p.locator('body').innerText()).slice(0, 300).replace(/\n+/g, ' | '));
});

await browser.close();
