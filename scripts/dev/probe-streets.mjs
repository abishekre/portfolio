// Lists Silicon Streets' camera and player hooks, for the wallpaper capture.
import { chromium } from 'playwright';
const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 430, height: 932 } });
await p.goto('https://siliconstreets.abishekre.in', { waitUntil: 'load' });
await p.waitForFunction(() => window.__game, null, { timeout: 120000 });
console.log(await p.evaluate(() => {
  const g = window.__game;
  const pos = g.player?.pos ?? g.player?.position ?? g.W?.pos;
  return JSON.stringify({
    camCtl: Object.keys(g.camCtl ?? {}),
    player: Object.keys(g.player ?? {}).slice(0, 40),
    W: Object.keys(g.W ?? {}).slice(0, 40),
    pos: pos && [pos.x, pos.y, pos.z],
    cam: [g.camera.position.x, g.camera.position.y, g.camera.position.z],
    fov: g.camera.fov,
    worldKeys: Object.keys(g.world ?? {}).slice(0, 40),
  });
}));
await b.close();
