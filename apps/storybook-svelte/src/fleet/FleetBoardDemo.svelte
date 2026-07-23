<script lang="ts">
  import { FleetBoard, DrillDown } from '@w5-ui/fleet'
  import type { ComponentId, Status } from '@w5-ui/fleet'
  import { COMPONENTS, GROUPS, mockApi, scenariosFor, statusFor } from './demo-data.ts'

  let {
    single = false,
    degraded = false,
    withDrilldown = false,
  }: { single?: boolean; degraded?: boolean; withDrilldown?: boolean } = $props()

  const groups = $derived(single ? GROUPS.filter((g) => g.id === 'core') : GROUPS)
  const components = $derived(single ? COMPONENTS.filter((c) => c.group === 'core') : COMPONENTS)
  const overrides = $derived<Record<string, Status>>(
    degraded ? { device: 'down', worker: 'degraded', api: 'down' } : {},
  )
  const status = $derived(statusFor(overrides))
  const api = mockApi()

  let selected = $state<ComponentId | null>(withDrilldown ? 'gateway' : null)
</script>

<div style="position: relative; height: 620px; width: 100%;">
  <FleetBoard
    {components}
    {groups}
    statusFor={status}
    onSelect={(id) => (selected = id)}
  />
  {#if selected}
    {@const component = components.find((c) => c.id === selected)}
    {#if component}
      <DrillDown
        {component}
        result={status(selected)}
        scenarios={scenariosFor(selected)}
        {api}
        onClose={() => (selected = null)}
      />
    {/if}
  {/if}
</div>
