import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';

// The apps switched on in content/home.yaml, in order, with their display names.
const projects = [...readFileSync('content/home.yaml', 'utf8').matchAll(/- \{ app: ([\w-]+), show: (true|false) \}/g)]
  .filter((m) => m[2] === 'true')
  .map(([, slug]) => {
    const src = readFileSync(`content/projects/${slug}/project.md`, 'utf8');
    const field = (k: string) => new RegExp(`^${k}: (.+)$`, 'm').exec(src)?.[1].trim();
    return { slug, name: field('name')!, links: ['playStore', 'web', 'github'].filter((k) => field(k)) };
  });

const isMobile = (page: Page) => (page.viewportSize()?.width ?? 0) < 768;

// Most tests start past the lock screen, as a returning visitor would.
test.beforeEach(async ({ page }, info) => {
  if (info.title.startsWith('lock screen')) return;
  await page.addInitScript(() => {
    localStorage.setItem('pf-unlocked', '1');
    localStorage.setItem('pf-peeked', '1');
  });
});

test.describe('home screen', () => {
  test('shows every app, the dock and the list link', async ({ page }) => {
    await page.goto('/');
    for (const p of projects) await expect(page.locator(`a.app[href="/${p.slug}"]`)).toBeVisible();
    await expect(page.locator('a.app[href="/notes"]')).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Contact' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'List view' })).toBeVisible();
  });

  test('desk and frame only on wide screens', async ({ page }) => {
    await page.goto('/');
    const desk = page.locator('.desk-l');
    const radius = await page.locator('.phone').evaluate((el) => getComputedStyle(el).borderRadius);
    if (isMobile(page)) {
      await expect(desk).toBeHidden();
      expect(radius).toBe('0px');
      await expect(page.getByText('Abishek R Edakkalathur').first()).toBeVisible();
    } else {
      await expect(desk).toBeVisible();
      expect(radius).not.toBe('0px');
    }
  });

  test('long-press starts jiggle mode, Done ends it', async ({ page }) => {
    await page.goto('/');
    const icon = page.locator('a.app[href="/tally"]');
    const box = (await icon.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + 20);
    await page.mouse.down();
    await page.waitForTimeout(800);
    await page.mouse.up();
    await expect(page.locator('[data-home]')).toHaveClass(/jiggle/);
    await expect(page).toHaveURL('/');
    await page.getByRole('button', { name: 'Done' }).click();
    await expect(page.locator('[data-home]')).not.toHaveClass(/jiggle/);
  });
});

test.describe('apps', () => {
  for (const p of projects) {
    test(`${p.slug}: opens from its icon and closes again`, async ({ page }) => {
      await page.goto('/');
      await page.locator(`a.app[href="/${p.slug}"]`).click();
      await expect(page).toHaveURL(`/${p.slug}`);
      await expect(page.getByRole('heading', { level: 1, name: p.name })).toBeVisible();
      await expect(page.locator('.stats li')).toHaveCount(3);
      if (isMobile(page)) {
        await page.goBack();
      } else {
        await page.keyboard.press('Escape');
      }
      await expect(page).toHaveURL('/');
      await expect(page.locator(`a.app[href="/${p.slug}"]`)).toBeVisible();
    });

    test(`${p.slug}: works as a direct link`, async ({ page }) => {
      const res = await page.goto(`/${p.slug}`);
      expect(res?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1, name: p.name })).toBeVisible();
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', new RegExp(`/og/${p.slug}\\.png$`));
      // Buttons follow the link rule: Play Store, then web, then GitHub; none if it has none.
      await expect(page.locator('.appview .links .btn')).toHaveCount(p.links.length);
      const notes = page.locator('.in-app-notes');
      if (isMobile(page)) await expect(notes).toBeVisible();
      else await expect(notes).toBeHidden();
    });
  }
});

test('keyboard: arrows move between icons, Enter opens', async ({ page }) => {
  test.skip(isMobile(page), 'keyboard is a desktop path');
  await page.goto('/');
  await page.locator(`a.app[href="/${projects.find((p) => p.slug === 'tally')!.slug}"]`).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('a.app[href="/bytwo"]')).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('a.app[href="/kallan"]')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL('/kallan');
});

test('notes, résumé, list and 404 render', async ({ page }) => {
  await page.goto('/notes');
  await expect(page.getByRole('heading', { name: 'hi,' })).toBeVisible();
  await page.goto('/resume');
  await expect(page.getByRole('heading', { level: 1, name: 'Abishek R Edakkalathur' })).toBeVisible();
  await page.goto('/list');
  await expect(page.locator('.appview li')).toHaveCount(projects.length);
  const res = await page.goto('/no-such-app');
  expect(res?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'App not installed' })).toBeVisible();
});

test('sitemap lists every project', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  for (const p of projects) expect(xml).toContain(`/${p.slug}</loc>`);
  expect(xml).not.toContain('/og/');
});

test('/hearth now goes to /lumen', async () => {
  const v = JSON.parse(readFileSync('vercel.json', 'utf8'));
  expect(v.redirects).toContainEqual({ source: '/hearth', destination: '/lumen', permanent: true });
});

test('lock screen: shown on a first visit, gone after unlocking, back from Control Center', async ({ page }) => {
  await page.goto('/');
  const lock = page.getByRole('dialog', { name: 'Lock screen' });
  await expect(lock).toBeVisible();
  await page.getByRole('button', { name: 'Swipe up to open' }).click();
  await expect(lock).toBeHidden();
  await page.reload();
  await expect(lock).toBeHidden();
  await page.getByRole('button', { name: /Control Center/ }).click();
  await page.getByRole('dialog', { name: 'Control Center' }).getByRole('button', { name: 'Lock' }).click();
  await expect(lock).toBeVisible();
  await page.getByRole('button', { name: 'Swipe up to open' }).click();
  await expect(lock).toBeHidden();
});

test('lock screen: never on a deep link', async ({ page }) => {
  await page.goto('/tally');
  await expect(page.getByRole('dialog', { name: 'Lock screen' })).toBeHidden();
});

test('page two is Work, and closing an app there comes back to page two', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Work page' }).click();
  const work = page.locator('a.app[href="/work"]');
  await expect(work).toBeInViewport();
  await work.click();
  await expect(page).toHaveURL('/work');
  await page.locator('.appview .back').click();
  await expect(page).toHaveURL('/');
  await expect(page.locator('a.app[href="/work"]')).toBeInViewport();
  await expect(page.getByRole('button', { name: 'Work page' })).toHaveAttribute('aria-current', 'true');
});

test('keyboard: → at the end of a row goes to page two', async ({ page }) => {
  test.skip(isMobile(page), 'keyboard is a desktop path');
  await page.goto('/');
  await page.locator('a.app[href="/streets"]').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('a.app[href="/work"]')).toBeFocused();
});

test('wallet: a pass opens and closes', async ({ page }) => {
  await page.goto('/wallet');
  // Tap the visible strip of the top pass, as a person would.
  const first = page.locator('[data-pass]').first();
  await first.click({ position: { x: 30, y: 24 } });
  await expect(first).toHaveAttribute('aria-expanded', 'true');
  await first.click({ position: { x: 30, y: 24 } });
  await expect(first).toHaveAttribute('aria-expanded', 'false');
});

test('developer options: seven taps on the clock', async ({ page }) => {
  await page.goto('/');
  const dev = page.locator('[data-dev-app]');
  await expect(dev).toBeHidden();
  for (let i = 0; i < 7; i++) await page.locator('[data-dev-tap]').click();
  await expect(page.locator('[data-toast]')).toContainText('You are now a developer');
  await page.goto('/developer');
  await expect(page.getByRole('heading', { name: 'Developer options' })).toBeVisible();
  await expect(page.locator('[data-egg="dev"]')).toHaveClass(/got/);
});

test('coffee: three sips, then a refill', async ({ page }) => {
  test.skip(isMobile(page), 'the desk is a desktop thing');
  await page.goto('/');
  const cup = page.locator('[data-cup]');
  for (let i = 0; i < 3; i++) await cup.click();
  await expect(page.locator('[data-coffee]')).toHaveAttribute('data-level', '0');
  await cup.click();
  await expect(page.locator('[data-coffee]')).toHaveAttribute('data-level', '3');
  await expect(page.locator('[data-cup-note]')).toContainText('cup today');
});

test('résumé print page has the job and no client names', async ({ page }) => {
  await page.goto('/resume/print');
  await expect(page.getByText('Associate Technical Consultant').first()).toBeVisible();
  const text = await page.locator('body').innerText();
  for (const name of ['Martin', 'Servera', 'ABB', 'Endeavour', 'Axis']) expect(text).not.toContain(name);
});

test('theme: Control Center switches to dark, and it survives a reload', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Control Center/ }).click();
  const cc = page.getByRole('dialog', { name: 'Control Center' });
  await cc.getByRole('radio', { name: 'Dark' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-time', 'night');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-time', 'night');
  await page.getByRole('button', { name: /Control Center/ }).click();
  await cc.getByRole('radio', { name: 'Light' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-time', 'day');
});

test('theme: the desk lamp toggles light and dark', async ({ page }) => {
  test.skip(isMobile(page), 'the desk is a desktop thing');
  await page.goto('/');
  const before = await page.locator('html').getAttribute('data-time');
  await page.getByRole('button', { name: /lamp chain/ }).click();
  await expect(page.locator('html')).not.toHaveAttribute('data-time', before!);
});

test('the desk stays put while apps open, and the clipboard turns to the app', async ({ page }) => {
  test.skip(isMobile(page), 'the desk is a desktop thing');
  await page.goto('/');
  // Mark the desk's DOM; a re-render would lose the mark.
  await page.evaluate(() => document.querySelector('.desk-l')!.setAttribute('data-mark', '1'));
  await expect(page.locator('[data-clipboard] .sheet.current [data-sheet-id]')).toHaveAttribute('data-sheet-id', 'home');
  await page.locator('a.app[href="/tally"]').click();
  await expect(page).toHaveURL('/tally');
  await expect(page.locator('[data-clipboard] .sheet.current [data-sheet-id]')).toHaveAttribute('data-sheet-id', 'tally');
  await expect(page.locator('[data-clipboard]')).toContainText('Get it on Google Play');
  await page.keyboard.press('Escape');
  await expect(page).toHaveURL('/');
  await expect(page.locator('.desk-l')).toHaveAttribute('data-mark', '1');
});

test('contact card: a vCard with the name, role and email', async ({ request }) => {
  const res = await request.get('/abishek.vcf');
  expect(res.status()).toBe(200);
  const v = await res.text();
  expect(v).toContain('BEGIN:VCARD');
  expect(v).toContain('FN:Abishek R Edakkalathur');
  expect(v).toContain('TITLE:Associate Technical Consultant');
  expect(v).toMatch(/EMAIL;[^:]*:abishekre31@gmail\.com/);
});

test('ID card turns over to the QR code and Save contact', async ({ page }) => {
  test.skip(isMobile(page), 'the desk is a desktop thing');
  await page.goto('/');
  await page.getByRole('button', { name: /Turn the ID card over/ }).click();
  await expect(page.locator('[data-idcard]')).toHaveClass(/flipped/);
  await expect(page.getByRole('link', { name: 'Save contact' })).toBeVisible();
  await expect(page.locator('[data-idcard] .qr svg')).toBeVisible();
});

test('sticky note: writes an email with the note in it', async ({ page }) => {
  test.skip(isMobile(page), 'the desk is a desktop thing');
  await page.goto('/');
  await page.locator('[data-sticky-open]').click();
  await page.getByPlaceholder('Your name').fill('Priya');
  await page.getByPlaceholder(/Hi Abishek/).fill('Loved Tally. Free for a call?');
  await page.evaluate(() => {
    // Keep the test page here instead of following the mailto: link.
    Object.defineProperty(window, 'location', { value: { ...window.location, set href(v: string) {} }, configurable: true });
  }).catch(() => {});
  await page.getByRole('button', { name: 'Send' }).click();
  const href = await page.locator('[data-sticky]').getAttribute('data-last-mailto');
  expect(href).toContain('mailto:abishekre31@gmail.com');
  expect(decodeURIComponent(href!)).toContain('Loved Tally. Free for a call?');
  expect(decodeURIComponent(href!)).toContain('Priya');
});

test('edit mode: hold an icon, drag it, Done, and the order is kept', async ({ page }) => {
  test.skip(isMobile(page), 'mouse drag; touch is covered by scripts/dev/debug-edit.mjs');
  await page.goto('/');
  const t = (await page.locator('a.app[href="/tally"]').boundingBox())!;
  const k = (await page.locator('a.app[href="/kcal"]').boundingBox())!;
  await page.mouse.move(t.x + 30, t.y + 30);
  await page.mouse.down();
  await page.waitForTimeout(700);
  await page.mouse.up();
  await expect(page.locator('[data-home]')).toHaveClass(/jiggle/);
  await page.mouse.move(t.x + 30, t.y + 30);
  await page.mouse.down();
  for (let i = 1; i <= 10; i++) await page.mouse.move(t.x + 30 + ((k.x - t.x) * i) / 10, k.y + 30);
  await page.mouse.up();
  await expect(page.getByRole('button', { name: 'Reset' })).toBeVisible();
  await page.getByRole('button', { name: 'Done' }).click();
  await page.reload();
  const first = await page.locator('[data-grid] [data-app]').first().getAttribute('href');
  expect(first).not.toBe('/tally');
});

test('power button locks and wakes the phone', async ({ page }) => {
  test.skip(isMobile(page), 'side buttons are on the desktop phone');
  await page.goto('/');
  const lock = page.getByRole('dialog', { name: 'Lock screen' });
  await page.getByRole('button', { name: /Power button/ }).click();
  await expect(lock).toBeVisible();
  await page.getByRole('button', { name: /Power button/ }).click();
  await expect(lock).toBeHidden();
});

test('Control Center is a solid panel (no frosted glass)', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Control Center/ }).click();
  const sheet = page.locator('.cc-sheet');
  await expect(sheet).toBeVisible();
  expect(await sheet.evaluate((el) => getComputedStyle(el).backdropFilter)).toBe('none');
});

test('clipboard rewrites for an app and back for home', async ({ page }) => {
  test.skip(isMobile(page), 'the desk is a desktop thing');
  await page.goto('/');
  await page.locator('a.app[href="/kcal"]').click();
  // The pad rewrites after the phone's transition finishes, so allow it a moment on a busy machine.
  await expect(page.locator('[data-clipboard]')).toHaveAttribute('data-dir', 'forward', { timeout: 10_000 });
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-clipboard]')).toHaveAttribute('data-dir', 'back', { timeout: 10_000 });
});

test('ID card holds still under the cursor', async ({ page }) => {
  test.skip(isMobile(page), 'the desk is a desktop thing');
  await page.goto('/');
  const card = page.locator('[data-idcard]');
  const b = (await card.boundingBox())!;
  // Sweep across the strap to set it swinging, then rest on the card.
  for (let x = -60; x <= 60; x += 6) await page.mouse.move(b.x + b.width / 2 + x, b.y - 60);
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
  await page.waitForTimeout(900);
  const a1 = await page.locator('[data-lanyard]').evaluate((el) => getComputedStyle(el).getPropertyValue('--a'));
  await page.waitForTimeout(120);
  const a2 = await page.locator('[data-lanyard]').evaluate((el) => getComputedStyle(el).getPropertyValue('--a'));
  expect(Math.abs(parseFloat(a1) - parseFloat(a2))).toBeLessThan(0.05);
  await page.getByRole('button', { name: /Turn the ID card over/ }).click();
  await expect(card).toHaveClass(/flipped/);
});
