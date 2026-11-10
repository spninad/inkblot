import { test, expect } from '@playwright/test';

async function choose(page: any, label: string) {
  await page.getByRole('button', { name: 'Choose design language' }).click();
  await page.getByRole('menuitemradio', { name: label, exact: true }).click();
  await expect(page.getByRole('menu')).toHaveCount(0);
}

test('all nine design languages can be selected and survive navigation', async ({ page }) => {
  await page.goto('/');
  for (const [name, label] of [
    ['paper', 'Paper'],
    ['journal', 'Journal'],
    ['cozy', 'Cozy'],
    ['modern', 'Modern'],
    ['colorful', 'Colorful'],
    ['glass', 'Glass'],
    ['industrie', 'Industrie'],
    ['classic', 'Classic LaTeX'],
    ['academic', 'Academic Monograph'],
  ] as const) {
    // Legacy labels are read from the registry rather than renamed by the UI.
    const config = await page
      .locator('[data-inkblot-island="toolbar"]')
      .getAttribute('data-inkblot-props');
    const actual = JSON.parse(config!).appearance.themes.find((t: any) => t.name === name).label;
    await choose(page, actual);
    await expect(page.locator('html')).toHaveAttribute('data-theme', name);
    const controlColor = await page
      .locator('.inkblot-appearance-controls')
      .evaluate((n) => getComputedStyle(n).getPropertyValue('--ib-primary').trim());
    expect(controlColor).not.toBe('');
  }
  await choose(page, 'Journal');
  await page.goto('/benchmarks');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'journal');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'journal');
});

test('restricted sites have independent preferences and correct search links', async ({ page }) => {
  await page.goto('/');
  await choose(page, 'Cozy');
  await page.goto('/restricted/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'journal');
  await page.getByRole('button', { name: 'Choose design language' }).click();
  await expect(page.getByRole('menuitemradio')).toHaveCount(2);
  await page.getByRole('menuitemradio', { name: 'Paper', exact: true }).click();
  await page.getByRole('button', { name: 'Search reports', exact: true }).click();
  await page.getByRole('combobox').fill('diffusion');
  await expect(page.locator('.inkblot-search-result-item').first()).toHaveAttribute(
    'href',
    /\/restricted\/studies\/diffusion-planning/,
  );
  await page.keyboard.press('Escape');
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'cozy');
});

test('standalone reports support opt-in selection, restrictions, and fixed languages', async ({
  page,
}) => {
  await page.goto('/themes/picker.html');
  await choose(page, 'Paper');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'paper');
  await page.goto('/themes/restricted.html');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'journal');
  await page.getByRole('button', { name: 'Choose design language' }).click();
  await expect(page.getByRole('menuitemradio')).toHaveCount(2);
  await page.keyboard.press('Escape');
  await page.evaluate(() =>
    localStorage.setItem(
      'inkblot-appearance:report:/themes/fixed.html',
      JSON.stringify({ theme: 'paper', mode: 'dark' }),
    ),
  );
  await page.goto('/themes/fixed.html');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'cozy');
  await expect(page.getByRole('button', { name: 'Choose design language' })).toHaveCount(0);
});

test('stale choices and unavailable storage fall back safely', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() =>
    localStorage.setItem(
      'inkblot-appearance:site:/restricted',
      JSON.stringify({ theme: 'cozy', mode: 'nonsense' }),
    ),
  );
  await page.goto('/restricted/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'journal');
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new Error('Storage blocked');
      },
    });
  });
  await page.goto('/themes/picker.html');
  await choose(page, 'Paper');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'paper');
});

test('system appearance follows OS changes in fixed reports', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/themes/fixed.html');
  const light = await page
    .locator('html')
    .evaluate((n) => getComputedStyle(n).getPropertyValue('--bg'));
  await page.emulateMedia({ colorScheme: 'dark' });
  const dark = await page
    .locator('html')
    .evaluate((n) => getComputedStyle(n).getPropertyValue('--bg'));
  expect(dark).not.toBe(light);
});

test('clientScript false keeps all content readable without interactive UI', async ({ page }) => {
  await page.goto('/themes/no-js.html');
  await expect(page.getByText('Overview panel.', { exact: true })).toBeVisible();
  await expect(page.getByText('Measurements panel.', { exact: true })).toBeVisible();
  await expect(page.getByText('Inner B content.', { exact: true })).toBeVisible();
  await expect(page.locator('[data-inkblot-island]')).toHaveCount(0);
  await expect(page.locator('script')).toHaveCount(0);
});

test('hydration produces no errors and portals inherit the selected language', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  await page.goto('/themes/picker.html');
  await page.getByRole('tab', { name: 'Inner B', exact: true }).click();
  await choose(page, 'Cozy');
  await page.getByRole('button', { name: 'Choose color mode' }).click();
  const menu = page.getByRole('menu');
  await expect(menu).toBeVisible();
  expect(
    await menu.evaluate((n) => getComputedStyle(n).getPropertyValue('--ib-popover').trim()),
  ).not.toBe('');
  await page.getByRole('menuitemradio', { name: 'Dark', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-color-mode', 'dark');
  expect(errors.filter((e) => !e.includes('favicon'))).toEqual([]);
});

test('React hosts use real controls without restyling the host application', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/host.html');
  await expect(page.getByRole('tab', { name: 'Overview', exact: true })).toBeVisible();
  await page.getByRole('tab', { name: 'Measurements', exact: true }).click();
  await expect(page.getByText('Measurements panel.', { exact: true })).toBeVisible();
  await choose(page, 'Paper');
  await expect(page.locator('[data-inkblot-root]').last()).toHaveAttribute(
    'data-inkblot-theme',
    'paper',
  );
  await expect(page.locator('html')).not.toHaveAttribute('data-theme');
  const host = await page.evaluate(() => ({
    heading: getComputedStyle(document.getElementById('host-heading')!).fontSize,
    paragraph: getComputedStyle(document.getElementById('host-paragraph')!).fontSize,
    margin: getComputedStyle(document.body).margin,
    border: getComputedStyle(document.getElementById('host-button')!).borderTopWidth,
  }));
  expect(host).toEqual({ heading: '31px', paragraph: '25px', margin: '13px', border: '3px' });
  await page.locator('#host-button').click();
  await page.locator('#host-button').click();
  await expect(page.getByRole('tab', { name: 'Overview', exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test('standalone UI needs no network JavaScript dependencies', async ({ page }) => {
  const external: string[] = [];
  page.on('request', (r) => {
    if (r.resourceType() === 'script' && !r.url().startsWith('http://127.0.0.1:4319/'))
      external.push(r.url());
  });
  await page.route('https://**/*', (route) => route.abort());
  await page.goto('/themes/picker.html');
  await page.getByRole('tab', { name: 'Measurements', exact: true }).click();
  await expect(page.getByText('Measurements panel.', { exact: true })).toBeVisible();
  await choose(page, 'Paper');
  expect(external.filter((url) => !url.includes('three'))).toEqual([]);
});

test('saved language restores before the UI bundle runs', async ({ page }) => {
  await page.goto('/');
  await choose(page, 'Journal');
  await page.route('**/assets/site.js', (route) => route.abort());
  await page.goto('/benchmarks');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'journal');
  const color = await page
    .locator('html')
    .evaluate((n) => getComputedStyle(n).getPropertyValue('--ib-primary').trim());
  expect(color).not.toBe('');
  await expect(page.locator('[data-inkblot-hydrated]')).toHaveCount(0);
});

test('server-rendered React controls hydrate with restored scope preferences', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  await page.goto('/');
  await page.evaluate(() =>
    localStorage.setItem(
      'inkblot-appearance:report:/ssr-host.html',
      JSON.stringify({ theme: 'paper', mode: 'dark' }),
    ),
  );
  await page.goto('/ssr-host.html');
  await expect(page.locator('[data-inkblot-root]')).toHaveAttribute('data-inkblot-theme', 'paper');
  await expect(page.locator('[data-inkblot-root]')).toHaveAttribute('data-color-mode', 'dark');
  await page.getByRole('tab', { name: 'Server measurements', exact: true }).click();
  await expect(page.getByText('Server-rendered measurements.', { exact: true })).toBeVisible();
  await expect(page.locator('[data-inkblot-island]')).toHaveCount(0);
  expect(errors.filter((e) => !e.includes('favicon'))).toEqual([]);
});

test('custom theme objects stay local even when they reuse a built-in name', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/custom-host.html');
  await expect(page.locator('[data-inkblot-root]')).toHaveCount(2);
  const values = await page
    .locator('[data-inkblot-root]')
    .evaluateAll((nodes) =>
      nodes.map((n) => ({
        bg: getComputedStyle(n).getPropertyValue('--bg').trim(),
        primary: getComputedStyle(n).getPropertyValue('--ib-primary').trim(),
      })),
    );
  expect(values[0]).toEqual({ bg: '#e8f0ff', primary: '#123456' });
  expect(values[1].bg).not.toBe(values[0].bg);
  expect(values[1].primary).not.toBe(values[0].primary);
});
