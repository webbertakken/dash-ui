# @w5-ui/fleet

## 0.2.0

### Minor Changes

- [#73](https://github.com/webbertakken/dash-ui/pull/73) [`f8fcb3d`](https://github.com/webbertakken/dash-ui/commit/f8fcb3dbd8d57b16109fd730afdb8e380e7f1c8e) Thanks [@webbertakken](https://github.com/webbertakken)! - Add `@w5-ui/fleet`: a grouped SvelteFlow topology board (`FleetBoard`) plus a
  component drill-down panel (`DrillDown`) for operator dashboards. Consumers
  supply their own topology data (components, groups, scenarios) and point the
  board at a backend implementing the injectable `FleetApi` contract
  (`createHttpFleetApi` ships a convenience HTTP client). Includes the pure
  layout maths (`buildGroupedTopology`, `computeDepths`, ...), health helpers
  (`rollupStatus`, `groupCounts`, `statusToColor`), and Storybook stories.
