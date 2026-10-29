# @w5-ui/fleet

## 0.2.4

### Patch Changes

- [#84](https://github.com/webbertakken/dash-ui/pull/84) [`29f6719`](https://github.com/webbertakken/dash-ui/commit/29f6719c5eb8a662e78a5e64ad62ce261466c902) Thanks [@webbertakken](https://github.com/webbertakken)! - The DrillDown close button shows a `Tooltip` ("Close") instead of a native `title`, and its
  accessible name is now "Close panel" (was "close panel"), following the canonical overlay
  terminology in `@w5-ui/svelte`.
- Updated dependencies [[`29f6719`](https://github.com/webbertakken/dash-ui/commit/29f6719c5eb8a662e78a5e64ad62ce261466c902), [`2b84e65`](https://github.com/webbertakken/dash-ui/commit/2b84e65c79cea508445bf491261939c43961c299), [`2f429cd`](https://github.com/webbertakken/dash-ui/commit/2f429cda8cef757ac8e57998f6618be46c5044be), [`898b9ee`](https://github.com/webbertakken/dash-ui/commit/898b9ee5730f5259110a8754bbabe773c8505d1c)]:
  - @w5-ui/svelte@0.9.0
  - @w5-ui/tokens@0.9.0

## 0.2.3

### Patch Changes

- Updated dependencies [[`0b3c0b3`](https://github.com/webbertakken/dash-ui/commit/0b3c0b3cbede2eaf022d22912790f16966b7a889)]:
  - @w5-ui/svelte@0.8.1

## 0.2.2

### Patch Changes

- Updated dependencies [[`65f00e4`](https://github.com/webbertakken/dash-ui/commit/65f00e4862bdd05f9d7043a85c1a453b0c1f029a)]:
  - @w5-ui/tokens@0.8.0
  - @w5-ui/svelte@0.8.0

## 0.2.1

### Patch Changes

- [#80](https://github.com/webbertakken/dash-ui/pull/80) [`c9c56b3`](https://github.com/webbertakken/dash-ui/commit/c9c56b3bbf3e73f86e446dc78d7a5836084cae42) Thanks [@webbertakken](https://github.com/webbertakken)! - Type-check the package under the flags a strict consumer runs.

  `@w5-ui/fleet` ships its source, so a consumer compiles these files with
  THEIR compiler options - and until now nothing type-checked them here at
  all (no tsconfig, no `typecheck` script). Three unchecked index reads in
  `helpers.ts` and `topology-layout.ts` were therefore errors inside every
  consumer's `node_modules`, at a path they cannot edit.

  The package now has a tsconfig pinned to the strictest flags a consumer
  is likely to use (`strict`, `noUncheckedIndexedAccess`,
  `exactOptionalPropertyTypes`, `noImplicitReturns`,
  `noFallthroughCasesInSwitch`) and a `typecheck` script that the repo's
  `yarn typecheck` picks up, so this class of breakage cannot come back.

  No behaviour change: `rowsByDepth` / `laneSpec` build a row on demand
  instead of indexing a pre-sized array, and `groupedComponents` uses
  `??=` for the same bucket it created before.

## 0.2.0

### Minor Changes

- [#73](https://github.com/webbertakken/dash-ui/pull/73) [`f8fcb3d`](https://github.com/webbertakken/dash-ui/commit/f8fcb3dbd8d57b16109fd730afdb8e380e7f1c8e) Thanks [@webbertakken](https://github.com/webbertakken)! - Add `@w5-ui/fleet`: a grouped SvelteFlow topology board (`FleetBoard`) plus a
  component drill-down panel (`DrillDown`) for operator dashboards. Consumers
  supply their own topology data (components, groups, scenarios) and point the
  board at a backend implementing the injectable `FleetApi` contract
  (`createHttpFleetApi` ships a convenience HTTP client). Includes the pure
  layout maths (`buildGroupedTopology`, `computeDepths`, ...), health helpers
  (`rollupStatus`, `groupCounts`, `statusToColor`), and Storybook stories.
