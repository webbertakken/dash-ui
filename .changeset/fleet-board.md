---
'@w5-ui/fleet': minor
---

Add `@w5-ui/fleet`: a grouped SvelteFlow topology board (`FleetBoard`) plus a
component drill-down panel (`DrillDown`) for operator dashboards. Consumers
supply their own topology data (components, groups, scenarios) and point the
board at a backend implementing the injectable `FleetApi` contract
(`createHttpFleetApi` ships a convenience HTTP client). Includes the pure
layout maths (`buildGroupedTopology`, `computeDepths`, ...), health helpers
(`rollupStatus`, `groupCounts`, `statusToColor`), and Storybook stories.
