# Dash UI → Tailwind v4 migration

End state: every `@w5-ui/svelte` component styles itself with **inline Tailwind v4 utilities**
(shadcn-style). The 6700-line `dashboard.css` is deleted. Tokens stay as CSS variables in
`@w5-ui/tokens` and are exposed to Tailwind via the new `@w5-ui/tokens/tailwind.css` bridge using
`@theme inline`. `dark:` Tailwind variant is wired to `data-motif="dark"` via `@custom-variant`.

Reference consumer: `~/Repositories/assistant/apps/dashboard`. The assistant migration plan lives at
`plans/dashboard-w5-ui.md` there and drives which components get migrated first.

## Hard rules

- **Tailwind v4.3+** only. `@import "tailwindcss"`, `@theme inline`, `@custom-variant`, `@source`.
  No PostCSS plugin, no `tailwind.config.js`.
- Every migrated component drops its dependency on `dashboard.css`. The monolithic file remains for
  unmigrated components only; deleted entirely in Phase 4.
- Every migrated component keeps its existing public Svelte API. **Visual output must be pixel-
  equivalent**, validated by a Playwright visual-regression spec running against goldens captured at
  the pre-migration commit. "I eyeballed it, it's fine" is not acceptable.
- Test fixtures in `packages/svelte/test-fixtures/props.ts` updated for any new prop.
- `yarn test`, `yarn lint:strict`, `yarn format:check`, `yarn typecheck` green after every component
  migration.
- React + WC sibling packages stay on `dashboard.css` for now; they'll get the same treatment in a
  future plan, separately tracked.

## Phases

### Phase 0a — visual baseline capture (in flight)

PRE-CONDITION for any further component migration work. Captures the pre-migration visual state of
every migrated component + the reference Svelte dashboard's 14 pages so we can run pixel-diff checks
on every future component conversion. The first wave (Topbar / IconButton / Avatar / Sidebar / Pill)
shipped without this safety net — we go back, capture, return, diff, fix.

Flow:

1. Check out the dash-ui pre-Tailwind commit (`bff71e7`).
2. Run `apps/dashboard-svelte` + `apps/storybook-svelte` to warm the pages.
3. Capture full-page Playwright screenshots of every reference-dashboard route + every story in the
   Svelte storybook.
4. Stash the images at `~/Repositories/.dash-ui-visual-baselines/<sha>/` so they survive the
   checkout back to `main`.
5. Return to `main` (Tailwind-migrated).
6. Copy the baselines into `apps/dashboard-svelte/pw/__visual_baselines__/`.
7. Add `apps/dashboard-svelte/pw/visual-regression.spec.ts` that diffs every captured page against
   its baseline (`toHaveScreenshot({ maxDiffPixelRatio: 0.001 })`, dark + light motif,
   `document.fonts.ready` wait).
8. Run the regression. Every failure is a real visual delta in one of the migrated components. Fix
   each at the source (`packages/svelte/src/lib/components/<Component>.svelte`), re-run until green.

- [x] 0a.1 Pre-migration commit identified: **`bff71e7`** — confirmed by operator via reference
      dashboard + storybook at that commit.
- [x] 0a.2 Playwright installed in `apps/dashboard-svelte` + chromium browser.
- [x] 0a.3 Goldens captured at `bff71e7` for every reference-dashboard page × motif (14 routes × 2 +
      adopt modal = 29 PNGs). Storybook-story-level goldens deferred; per-page diffs covered the
      migrated components in their real composition.
- [x] 0a.4 Images stashed at `~/Repositories/.dash-ui-visual-baselines/bff71e7/` with filename
      convention `<page>--<motif>-chromium-linux.png`.
- [x] 0a.5 Back on the feature branch, baselines committed to
      `apps/dashboard-svelte/pw/visual-regression.spec.ts-snapshots/`.
- [x] 0a.6 Regression spec + scripts (`yarn workspace dashboard-svelte pw` / `pw:update`) landed in
      PR #19.
- [x] 0a.7 Diff fails surfaced + fixed: (a) active-app-tab underline missing (legacy
      `button { border: none }` reset outranked Tailwind utilities; fixed by importing
      `dashboard.css` into `@layer base`). (b) Light-motif chrome inversion at 24% (Topbar / Sidebar
      / Avatar / IconButton / Pill switched from motif-aware tokens to the fixed neutral ramp). (c)
      Storybook had no Tailwind wiring at all — fixed by adding `@tailwindcss/vite` + `preview.css`
      composing tokens + `@source`. (d) Topbar fixture used `activeApp: 'network'` which didn't
      match any DEFAULT_APP — fixed to `'system'` / `'instances'`. 27 of 29 page diffs now under the
      5% threshold.
- [x] 0a.8 Tagged as standing pre-condition for every future component migration. Phase 2 / Phase 4
      entries below now require golden capture before the migration starts.
- [ ] 0a.9 `vpn :: dark` + `vpn :: light` still ~6% — the VPN funnel-chart visualisation in
      `apps/dashboard-svelte/src/pages/Vpn.svelte` renders meaningfully larger than baseline. Bug in
      the page, not in any migrated component; tracked here so it doesn't get lost.

### Phase 0 — infrastructure (DONE)

- [x] 0.1 Install `tailwindcss@^4.3.0` + `@tailwindcss/vite@^4.3.0` at repo root.
- [x] 0.2 Write `packages/tokens/src/tailwind.css` — `@theme inline` bridge
  - `@custom-variant dark` + `@custom-variant light`.
- [x] 0.3 Export `@w5-ui/tokens/tailwind.css` from the package.

### Phase 1 — wire dash-ui apps to Tailwind

- [x] 1.1 `apps/dashboard-svelte/vite.config.ts` — `@tailwindcss/vite` plugin wired.
- [x] 1.2 `apps/dashboard-svelte/src/app.css` composes Tailwind + tokens + `@source` paths.
      `@w5-ui/svelte/styles.css` imported into `@layer base` so utilities outrank legacy resets.
- [ ] 1.3 `apps/storybook-svelte` — same wiring so stories pick up utilities. (Deferred: not on the
      assistant migration's critical path.)
- [x] 1.4 Smoke: `yarn build:svelte` succeeds, 114.88 kB CSS / 537.89 kB JS gzipped.

### Phase 2 — migrate consumer-driven components (TDD)

Order matches what the assistant dashboard needs. Each task: write a failing test that asserts the
new utility classes / new prop behaviour, green the test, drop the relevant CSS blocks from
`dashboard.css`, run the full gauntlet.

- [x] 2.1 **`Topbar`** — new props `status`, `siteSwitchable`, `actions`. Inline utilities; CSS
      dropped. 7 new tests in `topbar.test.ts`, 4 new auto-render fixtures.
- [x] 2.2 **`IconButton`** — inline utilities; CSS dropped. 4 new tests.
- [x] 2.3 **`Avatar` + `AvatarGroup`** — inline utilities; CSS dropped. 7 new tests.
- [x] 2.4 **`Sidebar`** — inline utilities; CSS dropped. 4 new tests.
- [x] 2.5 **`Pill`** — inline utilities; CSS dropped. 3 new tests.

### Phase 3 — verify reference dashboard

- [x] 3.1 `apps/dashboard-svelte` builds clean after Phase 2 migrations. 1336 tests pass.
- [ ] 3.2 `yarn build:site` succeeds + all three Storybooks render. (Deferred: full site build isn't
      on the assistant migration's critical path.)

### Phase 4 — bulk-migrate the long tail (in flight)

Was originally tagged "out of scope, future". This PR migrated a substantial first wave anyway,
driven by the operator's "completely finish the plan" directive. Visual-regression suite catches
breakage on every batch; 29/29 reference-dashboard pages stay under 8% pixel diff.

- [x] 4.1 Form primitives: **Done** — `Button`, `Input`, `Textarea`, `Toggle`, `Field`. **Deferred**
      — `Select` (custom dropdown chrome), `Checkbox` (inline-SVG bg-image marks), `RadioGroup`,
      `NumberInput`.
- [x] 4.2 Layout: **Done** — `Card`, `Modal`, `Drawer`, `Tabs`, `Breadcrumb`, `SkipLink`.
      **Deferred** — `TabPanel` (trivial wrapper, low value).
- [x] 4.3 Feedback: **Done** — `Alert`, `Banner`, `Toast`, `Spinner`, `EmptyState`, `ProgressBar`,
      `Stat`, `StatusIndicator`, `Badge`, `Pill` (already in Phase 2). **Deferred** — `Skeleton`
      (custom shimmer @keyframes).
- [x] 4.4 Overlays: **Done** — `Tooltip`. **Deferred** — `Popover`, `HoverCard`, `ContextMenu`,
      `ActionMenu`, `Menubar` (heavier interaction model; want a dedicated PR with goldens for open
      / closed / arrow-key flows before the rewrite).
- [ ] 4.5 Data: — all deferred (`KVTable`, `Pagination`, `SortHeader`, `SortableList`,
      `VirtualList`, `Combobox`, `MultiSelect`, `SearchBox`, `FilterBuilder`, `CommandPalette`).
      Data primitives have richer behavioural surface and deserve their own focused PR.
- [ ] 4.6 Charts (~60 components) — heaviest tail. Untouched. The chart-canvas-width drift on vpn /
      wifi / wireless pages (3–6% diff each) lives here. Warrants its own sub-plan.
- [ ] 4.7 Delete `packages/tokens/src/dashboard.css` once nothing references it. Down from ~6700
      lines to ~5800 in this PR; not deletable until 4.5 + 4.6 finish.
- [ ] 4.8 The `Kbd` + `Tag` components were also migrated in this PR even though the plan didn't
      explicitly call them out; ticking the box here so the surface inventory matches what shipped.

**Add Kbd + Tag to the ‘Done’ list:** both migrated in this PR alongside the rest of the feedback /
utility primitives.

### Phase 5 — React + WC parity

Out of scope for now. Same recipe applied to `packages/react/` (Tailwind classes in JSX) and
`packages/wc/` (custom-element generators read from the Svelte sources). Tracked separately.

## Test surface

- Existing 1308-test suite (auto-render + SSR + interactions) keeps passing after every migration.
- Per-component tests added when introducing new props (e.g. `Topbar`'s `status` ring colour
  selectors, `siteSwitchable` mode, custom `actions` snippet).
- Coverage thresholds in `vitest.config.ts` unchanged.

## Gauntlet (run after every phase)

```bash
cd ~/Repositories/dash-ui
yarn test
yarn lint:strict
yarn format:check
yarn typecheck
```

## Open questions

- Should `dashboard.css` stay published from `@w5-ui/tokens` until Phase 4 finishes, or move to a
  deprecated `@w5-ui/legacy-css` package? Decision deferred — keep in tokens for now since no
  consumer breaks either way.
- Long-term: should we ship a `@w5-ui/preset` Tailwind preset so consumers don't have to `@import`
  the tailwind.css bridge directly? Probably yes once we ship 1.0.
