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
      // 5% tolerance for sub-pixel font anti-aliasing + tiny vertical
      // shifts (1–3px) that come from minor metric differences between the
      // legacy dashboard.css preflight + Tailwind v4's preflight. Genuine
      // structural bugs show up well above this floor (the light-motif
      // chrome inversion was 24% before the fix). Tune individual specs
      // with a per-call `maxDiffPixelRatio` if a noisy page legitimately
      // needs more headroom; tighten back down once we kill the
      // preflight-difference dance.
      maxDiffPixelRatio: 0.05,
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
