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
      // 2.5% tolerance for sub-pixel font anti-aliasing noise. The chrome
      // (topbar / sidebar / main) uses ~uniform colour fills so structural
      // bugs show up as 5–20% deltas (e.g. light-motif chrome inversion was
      // 24% before the fix). Genuine font / spacing regressions in text-
      // heavy pages typically push 5%+ as well. Tune individual specs with
      // a per-call `maxDiffPixelRatio` if a noisy page legitimately needs
      // more headroom.
      maxDiffPixelRatio: 0.025,
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
