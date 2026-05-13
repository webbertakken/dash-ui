import { test, expect, type Page } from '@playwright/test'

/**
 * Visual-regression suite for the reference Svelte dashboard.
 *
 * Pre-condition: `pm2 start dash-ui-dashboard-svelte` (or equivalent)
 * is serving http://127.0.0.1:5175. The Vite dev server reflects the
 * working-tree state, so running this spec on different dash-ui
 * commits captures different snapshots.
 *
 * Baselines were captured at `bff71e7` (last commit before PR #18 —
 * the first wave of components migrated to Tailwind v4). Any pixel
 * drift on `main` is a real visual delta in one of the migrated
 * components (Topbar / IconButton / Avatar / AvatarGroup / Sidebar /
 * Pill) and must be fixed at the component source before the next
 * migration step.
 *
 * To refresh baselines:
 *   yarn workspace dashboard-svelte exec playwright test --update-snapshots
 *
 * Pages exercised (all 14 reference-dashboard routes + adopt modal):
 *   dashboard, devices, clients, topology, alarms, logs, wifi, ports,
 *   vpn, security, settings, wireless, infra, integrations.
 *
 * Each page captured in dark motif (default) and light motif.
 */

const PAGES = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'devices', label: 'Devices' },
  { id: 'clients', label: 'Client Devices' },
  { id: 'topology', label: 'Topology' },
  { id: 'alarms', label: 'Alarm Manager' },
  { id: 'logs', label: 'Logs' },
  { id: 'wifi', label: 'Wi-Fi' },
  { id: 'ports', label: 'Ports' },
  { id: 'vpn', label: 'VPN' },
  { id: 'security', label: 'Security' },
  { id: 'settings', label: 'Settings' },
  { id: 'wireless', label: 'Wireless' },
  { id: 'infra', label: 'Infrastructure' },
  { id: 'integrations', label: 'Integrations' },
] as const

const MOTIFS = ['dark', 'light'] as const

async function preparePage(page: Page, motif: (typeof MOTIFS)[number]): Promise<void> {
  // Wait for the bootstrap to mount Svelte + tokens.
  await page.waitForSelector('nav[aria-label="Primary"]')
  // Pin the motif. The dashboard-svelte app doesn't expose a toggle;
  // we drive it via the same `data-motif` attribute the tokens use.
  await page.evaluate((m) => {
    document.documentElement.setAttribute('data-motif', m)
  }, motif)
  // Wait for fonts to settle so AA edges are deterministic.
  await page.evaluate(() => (document as Document).fonts.ready)
}

async function gotoPage(page: Page, pageDef: (typeof PAGES)[number]): Promise<void> {
  // The dashboard is state-driven, not URL-driven. Click the sidebar item.
  await page.getByRole('button', { name: new RegExp(`^${pageDef.label}`) }).click()
  // Settle: the click toggles a reactive state node, give Svelte one tick.
  await page.waitForTimeout(50)
}

test.describe('reference dashboard visual regression', () => {
  for (const motif of MOTIFS) {
    for (const pageDef of PAGES) {
      test(`${pageDef.id} :: ${motif}`, async ({ page }) => {
        await page.goto('/')
        await preparePage(page, motif)
        await gotoPage(page, pageDef)
        // `fullPage: false` captures viewport-only. The dash-ui shell is a
        // CSS-grid `.app { height: 100vh }` with `main { overflow: auto }`,
        // so `fullPage: true` triggers a Playwright quirk that re-renders
        // the entire shell stacked under the viewport and the diff balloons
        // by ~10% on noise. Viewport-only matches what a user sees + still
        // catches every layout / colour regression that lives in the shell.
        await expect(page).toHaveScreenshot(`${pageDef.id}--${motif}.png`)
      })
    }
  }

  test('adopt modal :: dark', async ({ page }) => {
    await page.goto('/')
    await preparePage(page, 'dark')
    await gotoPage(page, { id: 'dashboard', label: 'Dashboard' })
    await page.getByRole('button', { name: /Adopt/ }).first().click()
    await page.waitForSelector('[role="dialog"], dialog')
    await expect(page).toHaveScreenshot('modal-adopt--dark.png')
  })
})
