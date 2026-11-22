// Stills through one forward page turn (into an app) and one back (home), for checking the motion.
import { chromium } from 'playwright';
const [base = 'http://localhost:4321', out = '.'] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 960 } });
await p.addInitScript(() => { localStorage.setItem('pf-unlocked', '1'); localStorage.setItem('pf-theme', 'light'); });
await p.goto(base, { waitUntil: 'networkidle' });
await p.waitForTimeout(800);
const board = await p.locator('[data-clipboard]').boundingBox();
const clip = { x: board.x - 30, y: board.y - 330, width: board.width + 60, height: board.height + 340 };
const series = async (name, act) => {
  await act();
  const start = Date.now();
  for (const t of [80, 200, 320, 440, 560, 700, 900, 1500]) {
    await p.waitForTimeout(Math.max(0, t - (Date.now() - start)));
    await p.screenshot({ path: `${out}/${name}-${t}.png`, clip });
  }
};
await series('fwd', () => p.locator('a.app[href="/tally"]').click());
await series('back', () => p.keyboard.press('Escape'));
await b.close();
