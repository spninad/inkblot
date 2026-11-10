import { test, expect } from '@playwright/test';
import { getBuiltinThemes } from '../../dist/themes/index.js';
import { LANGUAGE_IDS, languages } from '../../src/themes/tokens/index.js';

const themes = getBuiltinThemes();
for (const theme of themes) {
  test(`${theme.name}: light/dark identity, readable layout, narrow containment`, async ({
    page,
  }) => {
    await page.goto(`/themes/${theme.name}.html`);
    for (const mode of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme: mode });
      const expected = theme[mode] || theme.light;
      const actual = await page.evaluate(() => ({
        bg: getComputedStyle(document.documentElement).getPropertyValue('--bg').trim(),
        ink: getComputedStyle(document.documentElement).getPropertyValue('--ink').trim(),
      }));
      expect(actual).toEqual({ bg: expected.bg, ink: expected.ink });
      await page.evaluate(
        (m) => document.documentElement.setAttribute('data-color-mode', m),
        mode === 'light' ? 'dark' : 'light',
      );
      expect(
        await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme),
      ).toBe(mode === 'light' ? 'dark' : 'light');
      await page.evaluate(() => document.documentElement.removeAttribute('data-color-mode'));
    }
    for (const width of [320, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
    }
    await expect(page.getByRole('main')).toHaveCount(1);
  });
}

test('shared palettes come from the canonical registry', () => {
  for (const id of LANGUAGE_IDS) {
    const theme = themes.find((t) => t.name === id)!;
    expect(theme).toBeDefined();
    for (const mode of ['light', 'dark'] as const) {
      expect(theme[mode]?.bg).toBe(languages[id].colors[mode].bg);
      expect(theme[mode]?.accent).toBe(languages[id].colors[mode].tones.accent.ink);
    }
    expect(theme.design?.radius).toBe(languages[id].radius.control);
  }
});

test('nested tabs have independent selection and full keyboard controls', async ({ page }) => {
  await page.goto('/themes/journal.html');
  const tabs = page.getByRole('tab');
  await tabs.getByText('Inner B', { exact: true }).click();
  await expect(page.getByText('Inner B content.', { exact: true })).toBeVisible();
  await expect(page.getByRole('tab', { name: 'Overview', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await page.getByRole('tab', { name: 'Overview', exact: true }).focus();
  await page.keyboard.press('End');
  await expect(page.getByText('Measurements panel.', { exact: true })).toBeVisible();
  await expect(page.getByRole('tab', { name: 'Measurements', exact: true })).toBeFocused();
  await page.keyboard.press('Home');
  await expect(page.getByText('Inner B content.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Experimental details', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(
    page.getByText('Disclosure content remains readable with the keyboard.'),
  ).toBeVisible();
});

test('site pages remain contained across mobile, tablet, and desktop', async ({ page }) => {
  for (const route of [
    '/',
    '/benchmarks',
    '/studies/diffusion-planning',
    '/studies/representation-geometry',
    '/studies/study-1',
  ]) {
    await page.goto(route);
    for (const width of [320, 375, 768, 1024, 1280, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        `${route} at ${width}px`,
      ).toBe(true);
      await expect(page.getByRole('main')).toHaveCount(1);
      expect(
        await page
          .locator('.inkblot-site-header')
          .evaluate((n) => n.getBoundingClientRect().height),
      ).toBe(64);
    }
  }
});

test('mobile navigation opens, closes with Escape, and retains focus', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const menu = page.getByRole('button', { name: 'Menu', exact: true });
  await menu.click();
  await expect(page.getByRole('dialog', { name: 'Site navigation' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expect(menu).toBeFocused();
});

test('color mode persists without changing the fixed language', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  await page.getByRole('button', { name: 'Choose color mode' }).click();
  await page.getByRole('menuitemradio', { name: 'Light', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'academic');
  await expect(page.locator('html')).toHaveAttribute('data-color-mode', 'light');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-color-mode', 'light');
});

test('search handles keyboard navigation, empty/error states and focus restoration', async ({
  page,
}) => {
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Search reports', exact: true });
  await trigger.click();
  const input = page.getByRole('combobox', { name: 'Search reports and sections' });
  await expect(input).toBeFocused();
  await input.fill('diffusion');
  const first = page.locator('.inkblot-search-result-item').first();
  await expect(first).toBeVisible();
  await page.keyboard.press('ArrowDown');
  await expect(input).toHaveAttribute('aria-activedescendant', /.+/);
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await page.keyboard.press('/');
  await input.fill('no-such-study-98765');
  await expect(page.getByText('No matching reports. Try another search.')).toBeVisible();
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await page.reload();
  await page.route('**/search-index.json', (route) => route.abort());
  await trigger.click();
  await input.fill('world');
  await expect(page.getByText('Search could not load. Please try again.')).toBeVisible();
});

test('reduced motion and 3D controls respond correctly', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/themes/paper.html');
  const rotate = page.getByRole('button', { name: 'Auto-Rotate', exact: true });
  // Exercise WebGL if this browser provides it. Fallback remains readable otherwise.
  await expect(async () => {
    const canvas = await page.locator('canvas').count();
    const fallback = await page.locator('.inkblot-3d-fallback').textContent();
    expect(canvas > 0 || fallback?.includes('unavailable')).toBe(true);
  }).toPass();
  if (await page.locator('canvas').count()) {
    await expect(rotate).toHaveAttribute('aria-pressed', 'false');
    await rotate.click();
    await expect(rotate).toHaveAttribute('aria-pressed', 'true');
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(async () =>
      expect(await page.locator('canvas').evaluate((n) => n.width)).toBeLessThanOrEqual(670),
    ).toPass();
  }
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe(
    'auto',
  );
});

test('search navigates with Enter from the command palette', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Search reports', exact: true }).click();
  const input = page.getByRole('combobox', { name: 'Search reports and sections' });
  await input.fill('diffusion');
  await expect(page.getByRole('option').first()).toHaveAttribute('aria-selected', 'true');
  await input.press('Enter');
  await expect(page).toHaveURL(/\/studies\/diffusion-planning/);
});
