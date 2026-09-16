# @w5-ui/fleet

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
