// Records a phone-size video of opening and closing apps, for checking animations frame by frame.
// Usage: node scripts/dev/record-mobile.mjs <chromium|webkit> <base-url> <out-dir>
import { chromium, webkit } from 'playwright';
const engine = process.argv[2] ?? 'chromium';
const base = process.argv[3] ?? 'https://abishekre-portfolio.vercel.app';
const out = process.argv[4];
const b = await (engine === 'webkit' ? webkit : chromium).launch();
const W = Number(process.env.W ?? 390), H = Number(process.env.H ?? 700), mobile = W < 768;
const ctx = await b.newContext({ viewport: { width: W, height: H }, isMobile: mobile && engine !== 'webkit' ? true : undefined, hasTouch: mobile, deviceScaleFactor: 1, recordVideo: { dir: out, size: { width: W, height: H } } });
const p = await ctx.newPage();
await p.goto(base, { waitUntil: 'networkidle' });
await p.waitForTimeout(1200);
await (mobile ? p.tap.bind(p) : p.click.bind(p))('a.app[href="/tally"]');
await p.waitForTimeout(1500);
await p.mouse.wheel(0, 600).catch(() => {});
await p.evaluate(() => (document.querySelector('[data-appview]') ?? document.scrollingElement).scrollBy(0, 500));
await p.waitForTimeout(800);
await (mobile ? p.tap.bind(p) : p.click.bind(p))('.back');
await p.waitForTimeout(1500);
await (mobile ? p.tap.bind(p) : p.click.bind(p))('a.app[href="/kcal"]');
await p.waitForTimeout(1500);
await p.goBack();
await p.waitForTimeout(1500);
await ctx.close(); await b.close();
