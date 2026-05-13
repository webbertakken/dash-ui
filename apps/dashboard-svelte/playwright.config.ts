import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright config for visual regression of the reference Svelte
 * dashboard. We target a dev server we expect to be running locally
 * (PM2 process `dash-ui-dashboard-svelte`, default :5175). Snapshots
 * live next to each spec under `pw/<spec>.spec.ts-snapshots/`.
 *
 * Update baselines: `yarn workspace dashboard-svelte exec playwright test --update-snapshots`.
 */
export default defineConfig({
  testDir: './pw',
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:5175',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  },
  expect: {
    toHaveScreenshot: {
      // Tiny tolerance for AA / sub-pixel font rendering noise. Real
      // visual breakage shows up as thousands of pixels diffing, well
      // above this floor.
      maxDiffPixelRatio: 0.002,
      animations: 'disabled',
      caret: 'hide',
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
