// Captures the lock-screen wallpaper from Silicon Streets: Bengaluru's skyline at dusk, seen from above
// MG Road, with no game UI. Freezes the game's own render loop and places the camera directly.
// Usage: node scripts/capture/wallpaper.mjs [scale=3] [yaw degrees, or "all" for a contact sheet]
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const scale = Number(process.argv[2] ?? 3);
const yaws = process.argv[3] === 'all' ? [0, 90, 180, 270] : [Number(process.argv[3] ?? 0)];
const height = Number(process.argv[4] ?? 55);
const hours = Number(process.argv[5] ?? 18.55);
const out = 'src/assets/lock';
await mkdir(out, { recursive: true });

const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await browser.newPage({ viewport: { width: 430, height: 932 }, deviceScaleFactor: scale });
await p.goto('https://siliconstreets.abishekre.in', { waitUntil: 'load' });
await p.waitForFunction(() => window.__game, null, { timeout: 180000 });
await p.getByText('Start roaming').click({ timeout: 20000 }).catch(() => {});
await p.waitForTimeout(3000);

await p.evaluate((h) => {
  const g = window.__game;
  g.state.live = false;
  g.state.timeSpeed = 0;
  g.state.hours = h;
  try {
    g.weather.set('clear');
  } catch {}
  g.player.group.visible = false;
  for (const el of document.querySelectorAll('body *')) {
    if (el.tagName !== 'CANVAS' && !el.querySelector('canvas')) el.style.visibility = 'hidden';
  }
  g.step(60); // let the sky, lights and streaming settle at this hour
}, hours);

// Hide the minimap and any other small canvases: only the big 3D view stays.
await p.evaluate(() => {
  const canvases = [...document.querySelectorAll('canvas')].sort((x, y) => y.width * y.height - x.width * x.height);
  canvases.slice(1).forEach((c) => (c.style.visibility = 'hidden'));
});

for (const yaw of yaws) {
  // Keep the game's own loop running, but pose the camera ourselves right before every draw.
  await p.evaluate(
    ({ yaw, height }) => {
      const g = window.__game;
      const at = g.player.pos;
      const a = (yaw * Math.PI) / 180;
      const pose = (cam) => {
        cam.position.set(at.x - Math.sin(a) * 30, height, at.z - Math.cos(a) * 30);
        cam.lookAt(at.x + Math.sin(a) * 400, height * 0.55, at.z + Math.cos(a) * 400);
        cam.fov = 58;
        cam.updateProjectionMatrix();
        cam.updateMatrixWorld();
      };
      if (!g.renderer.__orig) g.renderer.__orig = g.renderer.render.bind(g.renderer);
      g.renderer.render = (scene, cam) => {
        if (cam === g.camera) pose(cam);
        return g.renderer.__orig(scene, cam);
      };
    },
    { yaw, height },
  );
  await p.waitForTimeout(5000); // streaming catches up with the new viewpoint
  const file = `${out}/wallpaper-${yaws.length > 1 ? `y${yaw}` : 'raw'}.png`;
  await p.screenshot({ path: file });
  console.log('saved', file);
}
await browser.close();
