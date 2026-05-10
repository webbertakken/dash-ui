# Storybook + tri-framework + SSR + static deploy

## Goal

Ship a static Storybook site that documents every component in the design system, exposed as React components, Svelte components, and Web Components, with SSR-ready output where it matters.

## Decisions (in DECISIONS.md)

- Tri-framework: phased. React + Svelte stories + tests first; Web Components via Svelte 4 `customElement` compile (no rewrite of 168 components).
- Storybook: three Storybook 8 instances, one per renderer, assembled into `dist/` under `/`, `/svelte/`, `/wc/`.
- Sidebar: 12 categories defined in `packages/storybook-meta/categories.ts`.
- Test runner: vitest + jsdom (+ node env for Svelte SSR).
- SSR: React `renderToString` smoke for every component, Svelte SSR-compile smoke for every component.
- Coverage: 95% lines for `packages/react/src/components` (smoke + interaction). Documented trade-off in DECISIONS.

## Sidebar categories (12)

Foundations, Layout, Inputs, Selection & menus, Navigation, Feedback, Data display, Charts: comparison, Charts: time-series, Charts: distribution, Charts: hierarchy & flow, Specialised.

## Tasks

### Phase 0: foundation

- [x] Lock decisions in `DECISIONS.md`
- [x] Plan file (this file)
- [x] Confirm autoresearch loop is not running; document handover protocol in `AMBIGUITIES.md`
- [x] Add vitest + coverage at workspace root with shared setup
- [x] Add `pnpm test`, `pnpm test:coverage`, `pnpm test:ssr` scripts
- [x] Categorisation manifest: `packages/storybook-meta/categories.ts`

### Phase 1: React tests

- [x] Fixtures registry (`packages/react/test-fixtures/fixtures.tsx`) covering 168 components + 22 icons
- [x] Auto-render test (398 smoke tests)
- [x] Interaction test (113 keyboard / mouse / focus tests)
- [x] Coverage: 96.2% lines, 88.9% functions, 85.1% branches across `packages/react/src/components`
- [x] Commit: "Add vitest scaffold + 383 React render fixtures (smoke green)"
- [x] Commit: "Add React interaction tests + raise coverage to 96% lines"

### Phase 2: React Storybook

- [x] `apps/storybook-react` with `@storybook/react-vite`
- [x] Story generator emits 190 stories, one per component, grouped by category
- [x] MDX foundation pages: Overview, Colours, Type, Spacing
- [x] Build verified clean
- [x] Commit: "Add Storybook 8 for React with 190 stories across 12 categories"

### Phase 3: WC build

- [x] `packages/wc` package with auto-generated thin Svelte custom-element wrappers
- [x] Vite library build outputs ESM bundle (`dist/index.js`) registering 166 `uni-*` tags
- [x] Smoke tests: every tag registers + connects without throwing
- [x] Commit: "Add @dash-ui/wc: 166 web components compiled from @dash-ui/svelte"

### Phase 4: Svelte tests + Storybook

- [x] Svelte fixtures (props-only) covering 168 components + icons
- [x] Auto-render test (382 client-mount tests via @testing-library/svelte)
- [x] `apps/storybook-svelte` with `@storybook/svelte-vite` (166 stories)
- [x] Commit: "Add Svelte auto-render tests + vitest svelte plugin (382 tests)"
- [x] Commit: "Add Storybook for Svelte (166 stories)"

### Phase 5: Web components Storybook

- [x] `apps/storybook-wc` with `@storybook/web-components-vite` (165 stories)
- [x] Importing `@dash-ui/wc` registers all elements; stories render via `document.createElement(tag)` with property assignment
- [x] Commit: "Add Storybook for Web Components (165 stories)"

### Phase 6: SSR proof

- [x] React: 397 `renderToString` tests covering every variant
- [x] Svelte: SSR-compile smoke test for every `.svelte` component (uses `vitePreprocess`)
- [x] Commit: "Add SSR smoke tests: 397 React renderToString + Svelte SSR compile"

### Phase 7: Static site assembly

- [x] `apps/storybook-site` builds all three Storybooks and assembles `dist/index.html` + `/react/`, `/svelte/`, `/wc/`
- [x] Tokens CSS inlined in landing page
- [x] `pnpm build:site` + `pnpm serve:site` scripts at root
- [x] Verified all four routes serve HTTP 200
- [x] Commit: "Assemble static tri-framework site (React, Svelte, WC) at dist/"
- [x] Commit: "Add static dist server (PORT 4173) and serve:site script"

### Phase 8: Quality gate

- [x] Final test run: 1,293 tests passing across React + Svelte + WC + SSR
- [x] React Storybook indexes 401 stories; Svelte 338; WC 336
- [x] Build pass: `pnpm build:site` produces 24 MB `dist/`
- [x] Dev server live on http://localhost:4173 via PM2 (`dds-storybook`)

## Outstanding (parking lot)

- React coverage at 96.2% lines (target was 100%); see DECISIONS.md \u00a7Coverage thresholds
- A11y warnings in 4 Svelte components (NumberInput, ActivityFeed, DateRangePicker, TagInput)
- WC bundle is 2.5 MB unminified; could be code-split per-element if anyone wants tree-shaking
- Svelte 4 \u2192 Svelte 5 upgrade deferred (would unlock better customElement compile + native `svelte/server`)
- Lit-SSR / Declarative Shadow DOM for the WC layer not in scope
