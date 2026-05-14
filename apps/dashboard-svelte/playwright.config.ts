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
      // 0.5% tolerance — the long-term floor after Phase 4.9 recaptured
      // baselines at post-Tailwind HEAD. The original 8% allowance was a
      // debt note for Tailwind preflight drift against the pre-migration
      // `bff71e7` baseline; that's resolved now that goldens reflect the
      // post-migration world. Genuine regressions in chrome, layout, or
      // colour will show up well above 0.5%; subpixel font AA noise stays
      // under it.
      maxDiffPixelRatio: 0.005,
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
