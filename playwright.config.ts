import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  use: { baseURL: 'http://127.0.0.1:4319', headless: true, channel: process.env.PLAYWRIGHT_CHANNEL },
  webServer: { command: 'bun tests/preview.ts', url: 'http://127.0.0.1:4319', reuseExistingServer: false },
  reporter: 'list',
  workers: 2,
});
