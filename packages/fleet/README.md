# @w5-ui/fleet

A grouped [SvelteFlow](https://svelteflow.dev) topology board plus a drill-down panel for operator
dashboards. You supply the topology **data** (components, groups, scenarios) and point the board at
a backend that implements the `FleetApi` contract; the package owns the canvas, the layout maths,
and the panel chrome.

Part of [Dash UI](https://github.com/webbertakken/dash-ui), Webber's design systems.

## Install

```sh
yarn add @w5-ui/fleet @w5-ui/tokens @xyflow/svelte svelte
```

`svelte` (^5) and `@xyflow/svelte` (^1) are peer dependencies. The components use `@w5-ui/tokens`
CSS variables and Tailwind utility classes, so your app's Tailwind build must scan `@w5-ui/fleet`
(and your own topology data file, which carries any per-group accent class strings).

## Concepts

- **Component** - one node on the board: `{ id, label, zone, kind, group, upstreams, health, ... }`.
- **Group** - a fieldset lane: `{ id, label, logo?, stackBelow?, maxCols?, accent? }`. `GroupId` is
  an opaque string; you define your own set.
- **Scenario** - a multi-step operator macro surfaced as a button in a component's drill-down:
  `{ id, label, description?, attachedTo }`. The steps run server-side; the board only starts a run
  and polls its progress.
- **FleetApi** - the backend contract the drill-down calls: `fetchStatus`, `runAction`, `fetchLogs`,
  `runScenario`, `getScenarioRun`, plus optional `fetchProcesses`, `fetchResources`, `setAutoStart`.

## Usage

```svelte
<script lang="ts">
  import { FleetBoard, DrillDown, createHttpFleetApi } from '@w5-ui/fleet'
  import type { Component, Group, ComponentId, CheckResult } from '@w5-ui/fleet'
  import '@w5-ui/tokens/tokens.css'

  const api = createHttpFleetApi('/api') // GET/POST against your aggregator
  let report = $state<Awaited<ReturnType<typeof api.fetchStatus>>>(null)
  // poll api.fetchStatus() into `report` on an interval you own

  const statusFor = (id: ComponentId): CheckResult =>
    report?.components?.[id] ?? { status: 'unknown', message: 'no report yet' }

  let selected = $state<ComponentId | null>(null)
</script>

<FleetBoard {components} {groups} {statusFor} onSelect={(id) => (selected = id)} />

{#if selected}
  <DrillDown
    component={components.find((c) => c.id === selected)!}
    result={statusFor(selected)}
    scenarios={scenariosFor(selected)}
    {api}
    onClose={() => (selected = null)}
  />
{/if}
```

### The backend contract (`FleetApi`)

`createHttpFleetApi(baseUrl, fetch?)` speaks this canonical REST shape (all bodies JSON, all
decoders tolerant of a malformed response):

| Method | Path                              | Body / query  | Returns                          |
| ------ | --------------------------------- | ------------- | -------------------------------- |
| GET    | `{base}/status`                   |               | `StatusReport`                   |
| GET    | `{base}/processes`                |               | `{ processes: ProcessRow[] }`    |
| GET    | `{base}/resources`                |               | `{ snapshot: ResourceSnapshot }` |
| POST   | `{base}/components/:id/action`    | `{ action }`  | `ActionResult`                   |
| GET    | `{base}/components/:id/logs`      | `?lines=N`    | `LogsResult`                     |
| PATCH  | `{base}/components/:id/autostart` | `{ enabled }` | `AutoStartResult`                |
| POST   | `{base}/scenarios/:id/run`        |               | `202 { runId }`                  |
| GET    | `{base}/scenarios/runs/:runId`    |               | `ScenarioRunResponse`            |

Implement `FleetApi` yourself if your backend differs; only `fetchStatus`, `runAction`, `fetchLogs`,
`runScenario` and `getScenarioRun` are required. Omitting `setAutoStart` hides the auto-start
toggle; omitting `fetchResources`/`fetchProcesses` simply means those panels stay empty.

### Softening a routinely-disconnected group

Pass `displayStatusFor(groupId, status)` to `FleetBoard` to clamp **colour only** (the rollup pill
label stays truthful). Useful for a group of edge devices that are often legitimately offline:

```svelte
<FleetBoard
  {...}
  displayStatusFor={(g, s) => (g === 'devices' && s === 'down' ? 'unknown' : s)}
/>
```

### Per-card extras

`cardExtras(component, result)` lets you attach an `openUrl` and/or a `chips` strip to a card
without shipping your own node component:

```svelte
<FleetBoard
  {...}
  cardExtras={(c, r) => ({
    openUrl: openUrlFor(c),
    chips: c.id === 'worker' ? parseInstances(r.details).map((i) => ({ label: i.kind })) : [],
  })}
/>
```

## Exports

Components: `FleetBoard`, `DrillDown`, `TopologyCard`, `GroupFieldset`, `KindIcon`. Helpers:
`groupedComponents`, `rollupStatus`, `groupCounts`, `statusToColor`, `buildGroupedTopology`,
`buildTopologyNodes`, `buildTopologyEdges`, `computeDepths`, the scenario-progress helpers. Client:
`createHttpFleetApi`, `decodeStatusReport`, and the `FleetApi` type. Plus every domain type
(`Component`, `Group`, `CheckResult`, `StatusReport`, `Scenario`, ...).

## Licence

MIT
