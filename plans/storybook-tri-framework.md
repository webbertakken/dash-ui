# Storybook + tri-framework + SSR + static deploy

## Goal

Ship a static Storybook site that documents every component in the design system, exposed as React components, Svelte components, and Web Components, with SSR-ready output where it matters. 100% test coverage.

## Locked decisions (made unattended; user said "go make it")

- **Tri-framework strategy**: phased. React + Svelte stories + tests first (status quo + Storybook). Web components via Svelte 5 `customElement` compile output as `@dash-ui/wc`. No 159-component rewrite.
- **Storybook**: real Storybook 8, single instance with **React renderer** as primary, plus a parallel **Svelte renderer** Storybook deployed under `/svelte/` and **web-components renderer** under `/wc/` of the same static site. Landing page picks the framework.
- **Sidebar grouping**: 12 categories max (see below).
- **Static deploy target**: produce `dist/` artefact. Hosting wired up later.
- **SSR**: React `renderToString` smoke test + Svelte `render` (server) smoke test for every component. Web component DSD/Lit-SSR not in scope (Svelte 5 CE compile output hydrates client-side; documented).
- **Test runner**: vitest with jsdom + @testing-library/react + @testing-library/svelte + node SSR for Svelte server.
- **Coverage gate**: 100% lines for `packages/react/src/components`, `packages/svelte/src/lib/components`, `packages/wc/src`. Auto-generated catalogue files (`index.ts`, etc.) excluded.
- **Svelte upgrade**: Svelte 4 -> Svelte 5 for the WC compile path. Existing components stay in compat syntax (`export let`).

## Sidebar categories (max 12)

1. **Foundations** — colours, type, spacing, motion (MDX-only)
2. **Layout** — AppShell, Card, ResizablePanel, Drawer, Modal, Carousel
3. **Inputs** — Button, IconButton, Input, Textarea, Select, Combobox, MultiSelect, Checkbox, RadioGroup, Toggle, Slider, RangeSlider, DatePicker, DateRangePicker, TimePicker, NumberInput, ColorPicker, FileUpload, OTPInput, PasswordInput, IPInput, MACInput, CIDRInput, DurationInput, Kbd, InputGroup, TagInput, SegmentedControl, ToggleGroup, SplitButton, StarRating
4. **Selection & menus** — ActionMenu, ContextMenu, CommandPalette, Menubar, Popover, HoverCard, Tooltip, ContextualHelp, ColumnToggle, FilterBuilder
5. **Navigation** — Breadcrumb, Pagination, Stepper, Tabs, SkipLink, TimeRange
6. **Feedback** — Alert, Banner, Callout, Toast, ConfirmDialog, Spinner, Skeleton, EmptyState, ProgressBar, StackedProgress, Signal, StatusIndicator, HealthBar, Gauge, CountUp, Stat, NotificationPanel, ActivityFeed, InlineEdit, CopyButton
7. **Data display** — Avatar, AvatarGroup, Badge, Pill, Tag, Accordion, ExpandableRow, SortableTable, Timeline, TreeView, KVTable, JsonViewer, CodeBlock, LogViewer, GroupedList, RankedList, SortableList, Spoiler, VirtualList, KanbanBoard, SelectionToolbar, TransferList, SwitchPortGrid
8. **Charts: comparison** — BarChart, StackedBarChart, MirroredBarChart, LollipopChart, DotPlot, BulletChart, BumpChart, SlopeChart, DumbbellChart, ParetoChart, MarimekkoChart, WaffleChart, RadialBarChart, NightingaleChart, RadarChart
9. **Charts: time-series & area** — LineChart, AreaChart, StepChart, ErrorBandChart, AnnotatedTimeSeries, ThresholdAreaChart, StreamGraph, HorizonChart, CandlestickChart, GanttChart, UptimeTimeline, DualAxisChart, Sparkline, SparklineMatrix
10. **Charts: distribution & relation** — Histogram, BoxPlot, ViolinPlot, RidgelinePlot, BeeswarmChart, BubbleChart, ScatterPlot, QuadrantChart, HexbinChart, ContourPlot, CumulativeDistribution, ParallelCoordinates, CorrelationMatrix, MatrixChart, HeatMap, PolarHeatmap, CalendarHeatmap, PunchCard, StripeChart, WordCloud
11. **Charts: hierarchy & flow** — TreeMap, SunburstChart, IcicleChart, CirclePacking, Dendrogram, ChordDiagram, SankeyDiagram, FunnelChart, WaterfallChart, ArcDiagram, ForceGraph, VennDiagram, FlameGraph, PieChart, Donut
12. **Specialised** — Topbar, Sidebar (Network, Protect, etc.), AdoptDeviceModal, brand logos showcase, motif switch demo

## Tasks

### Phase 0: foundation

- [x] Decisions: lock and write to `DECISIONS.md`
- [x] Plan file (this file)
- [x] Confirm autoresearch loop is not running; document handover protocol in `AMBIGUITIES.md`
- [x] Add `vitest` + `@vitest/coverage-v8` + jsdom + testing libraries at workspace root
- [x] Add `pnpm test`, `pnpm test:coverage` scripts at root
- [x] Categorisation manifest: single source-of-truth `packages/storybook-meta/categories.ts` mapping each component to one category

### Phase 1: React tests (TDD-style: write generator first)

- [x] Test generator script that produces a smoke + variants test per React component
- [x] Run generator, get green tests for all 159 components
- [x] Coverage report: identify and fill gaps until lines = 100% for `packages/react/src/components/**`
- [x] Commit: "Add vitest + 100% smoke coverage for @dash-ui/react"

### Phase 2: React Storybook

- [x] Add `@storybook/react-vite` to a new `apps/storybook-react` app
- [x] Story generator: create `*.stories.tsx` for every component, grouped by category
- [x] Add MDX foundation pages (Colours, Type, Spacing, Motion)
- [x] Verify `pnpm --filter storybook-react build-storybook` produces clean output
- [x] Commit: "Add Storybook 8 for React with stories for all components"

### Phase 3: Svelte upgrade + WC build

- [x] Upgrade `packages/svelte` and `apps/dashboard-svelte` to Svelte 5 in compat mode (no rune migration, just dependency bump). Verify build still passes.
- [x] New `packages/wc` package: thin Svelte components compiled with `customElement: true` for components that don't rely on rich slots (start with all components, fall back where slot story is too lossy)
- [x] Auto-generate `packages/wc/src/elements/*.svelte` thin wrappers around `@dash-ui/svelte` components, with `<svelte:options customElement="uni-...">`
- [x] Build script: `pnpm --filter @dash-ui/wc build` produces ESM bundle with side-effect registration
- [x] Smoke test: each custom element registers and connects without throwing in jsdom
- [x] Commit: "Add @dash-ui/wc web components via Svelte 5 customElement compile"

### Phase 4: Svelte tests + Storybook

- [x] Test generator for Svelte components: SSR smoke (`render` from `svelte/server`) + client mount via `@testing-library/svelte`
- [x] Coverage: 100% for `packages/svelte/src/lib/components/**`
- [x] `apps/storybook-svelte` with `@storybook/svelte-vite`, mirrored stories + categories
- [x] Commit: "Add Svelte SSR tests + Storybook for @dash-ui/svelte"

### Phase 5: Web components Storybook

- [x] `apps/storybook-wc` with `@storybook/web-components-vite`
- [x] Mirrored stories that import the registered custom elements
- [x] Commit: "Add Storybook for @dash-ui/wc"

### Phase 6: SSR proof

- [x] Node script `scripts/ssr-smoke.ts` that imports every React component via `react-dom/server.renderToString` and every Svelte component via `svelte/server`. Logs failures and writes a manifest of which components are SSR-clean.
- [x] Hook into `pnpm test:ssr`
- [x] Commit: "Add SSR smoke runner for React + Svelte"

### Phase 7: Static site assembly

- [x] `apps/storybook-site` builds all three Storybooks and assembles a top-level `index.html` landing page with framework picker
- [x] `pnpm build:site` script at root
- [x] Verify `dist/` is openable from any static host (no absolute URLs)
- [x] Commit: "Assemble static tri-framework Storybook site"

### Phase 8: Quality gate

- [x] Final coverage report: 100% lines + branches across `packages/react`, `packages/svelte`, `packages/wc`
- [x] Lint + typecheck pass
- [x] Build pass: `pnpm build` and `pnpm build:site`
- [x] Start dev server via PM2 (`dashboard-design-system-storybook`) and tail logs
- [x] Hand back to user with URL
