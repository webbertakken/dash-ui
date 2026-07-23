<script lang="ts">
  /**
   * The fleet board: a grouped SvelteFlow topology canvas. One fieldset
   * lane per group, component cards laid out by within-group DAG depth,
   * cross-group edges, minimap + pan/zoom, `fitView` framing the whole
   * graph. Selecting a card emits `onSelect(componentId)`.
   *
   * Pure presentation: the consumer owns status polling and passes
   * `statusFor`. An optional `displayStatusFor` clamps colour only (the
   * rollup/pill labels stay truthful) for routinely-disconnected groups.
   */
  import {
    Background,
    Controls,
    MiniMap,
    SvelteFlow,
    type Edge as FlowEdge,
    type Node as FlowNode,
    type NodeEventWithPointer,
  } from '@xyflow/svelte'
  import '@xyflow/svelte/dist/style.css'
  import type { CheckResult, Component, ComponentId, Group, GroupId, Status } from '../types.ts'
  import {
    buildGroupedTopology,
    type CardExtras,
    type GroupFieldsetNodeShape,
    type TopologyNode,
  } from '../topology-layout.ts'
  import { groupCounts, groupedComponents, rollupStatus } from '../helpers.ts'
  import GroupFieldset from './GroupFieldset.svelte'
  import TopologyCard from './TopologyCard.svelte'

  let {
    components,
    groups,
    statusFor,
    displayStatusFor,
    groupMeta,
    cardExtras,
    onSelect,
    hint = true,
  }: {
    components: readonly Component[]
    groups: readonly Group[]
    statusFor: (id: ComponentId) => CheckResult
    displayStatusFor?: (groupId: GroupId, status: Status) => Status
    groupMeta?: (groupId: GroupId) => { label: string; logo: string } | undefined
    cardExtras?: CardExtras
    onSelect?: (id: ComponentId | null) => void
    hint?: boolean
  } = $props()

  const clamp = $derived(displayStatusFor ?? ((_g: GroupId, s: Status): Status => s))
  const grouped = $derived(groupedComponents(components, groups))
  const groupOf = $derived(new Map(components.map((c) => [c.id, c.group])))

  const built = $derived(
    buildGroupedTopology({
      statusFor,
      groups,
      grouped,
      rollupFor: (g) => rollupStatus(g, statusFor, grouped),
      countsFor: (g) => groupCounts(g, statusFor, grouped),
      ...(groupMeta !== undefined ? { groupMeta } : {}),
      ...(cardExtras !== undefined ? { cardExtras } : {}),
    }),
  )

  // Inject the colour-only display clamp into each node's data so the
  // card paints (and the fieldset pill paints) the softened colour while
  // the semantic status + rollup label stay intact.
  const topoNodes = $derived<FlowNode[]>(
    built.nodes.map((n) => {
      if (n.type === 'group-fieldset') {
        const f = n as GroupFieldsetNodeShape
        return {
          ...f,
          data: { ...f.data, displayRollup: clamp(f.data.groupId, f.data.rollup) },
        } as unknown as FlowNode
      }
      const t = n as TopologyNode
      const g = groupOf.get(t.id)
      return {
        ...t,
        data: {
          ...t.data,
          displayStatus: g === undefined ? t.data.status : clamp(g, t.data.status),
        },
      } as unknown as FlowNode
    }),
  )
  const topoEdges = $derived<FlowEdge[]>(built.edges as unknown as FlowEdge[])

  const nodeTypes = {
    topology: TopologyCard,
    'group-fieldset': GroupFieldset,
  }
</script>

<div class="relative h-full w-full topology-canvas" data-testid="fleet-board">
  {#if hint}
    <div
      class="pointer-events-none absolute right-3 top-3 z-10 rounded-md border border-border-2 bg-bg-1/85 px-2 py-1 text-[10px] uppercase tracking-[0.06em] text-text-4 shadow-sm backdrop-blur-sm"
    >
      scroll · zoom &nbsp;·&nbsp; drag · pan
    </div>
  {/if}
  <SvelteFlow
    nodes={topoNodes}
    edges={topoEdges}
    {nodeTypes}
    fitView
    fitViewOptions={{ padding: 0.08 }}
    proOptions={{ hideAttribution: true }}
    minZoom={0.25}
    maxZoom={2.5}
    onnodeclick={({ node }: Parameters<NodeEventWithPointer<MouseEvent | TouchEvent>>[0]) => {
      if (node.id.startsWith('group:')) return
      onSelect?.(node.id)
    }}
    onpaneclick={() => onSelect?.(null)}
  >
    <Background gap={24} size={1} />
    <Controls showLock={false} />
    <MiniMap pannable zoomable />
  </SvelteFlow>
</div>

<style>
  .topology-canvas :global(.svelte-flow) {
    background-color: var(--bg-page);
    --xy-background-color: var(--bg-page);
    --xy-background-pattern-dots-color: var(--border-2);
    --xy-edge-stroke: var(--border-2);
    --xy-edge-stroke-selected: var(--primary);
    --xy-connectionline-stroke: var(--border-2);
    --xy-controls-button-background-color: var(--depthBg-1);
    --xy-controls-button-background-color-hover: var(--depthBg-2);
    --xy-controls-button-color: var(--text-1);
    --xy-controls-button-color-hover: var(--text-1);
    --xy-controls-button-border-color: var(--border-2);
    --xy-minimap-background-color: var(--depthBg-1);
    --xy-minimap-mask-background-color: rgba(0, 0, 0, 0.55);
    --xy-minimap-node-background-color: var(--text-3);
    --xy-minimap-node-stroke-color: var(--text-2);
  }
</style>
