// Saves into content/projects/<folder>/screens/. Screens show in filename order (1.png, 2.png, …), so rename to taste.
// Screens from projects that only run locally. Start them first:
//   Rally:           (Badminton tracker) npx vite --port 5191
//   Silicon Streets: (silicon-streets)   npx vite preview --port 5192
// Usage: node scripts/capture/local.mjs [rally|streets]
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const what = process.argv[2];
const bodyText = async (p) => (await p.locator('body').innerText()).slice(0, 300).replace(/\n+/g, ' | ');

if (!what || what === 'rally') {
  const dir = 'content/projects/rally/screens';
  await mkdir(dir, { recursive: true });
  const p = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await p.goto('http://localhost:5191', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1200);
  const input = p.locator('input').first();
  for (const name of ['Ammu', 'Rahul', 'Sneha', 'Joel', 'Fathima', 'Arjun', 'Nikhil', 'Meera']) {
    await input.fill(name);
    await input.press('Enter');
    await p.waitForTimeout(250);
  }
  await p.waitForTimeout(600);
  await p.screenshot({ path: `${dir}/screen-1.png` });
  await p.getByText('Start rotating').click();
  await p.waitForTimeout(1200);
  await p.getByText('Start round').click();
  await p.waitForTimeout(1800);
  await p.screenshot({ path: `${dir}/screen-2.png` });
  console.log('rally live:', await bodyText(p));
  await p.close();
}

if (!what || what === 'streets') {
  const dir = 'content/projects/streets/screens';
  await mkdir(dir, { recursive: true });
  const p = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await p.goto('http://localhost:5192', { waitUntil: 'load' });
  await p.waitForTimeout(12000);
  await p.screenshot({ path: `${dir}/screen-1.png` });
  await p.getByText('Start roaming').click();
  await p.waitForTimeout(5000);
  await p.keyboard.down('w');
  await p.waitForTimeout(3500);
  await p.screenshot({ path: `${dir}/screen-2.png` });
  await p.keyboard.up('w');
  await p.keyboard.press('m');
  await p.waitForTimeout(2500);
  await p.screenshot({ path: `${dir}/screen-3.png` });
  console.log('streets map:', await bodyText(p));
  await p.close();
}
await browser.close();
