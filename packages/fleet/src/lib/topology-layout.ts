/**
 * Pure layout for the fleet board's grouped topology - a top-down DAG
 * rendered through SvelteFlow. Each group is laid out as its own tree
 * inside a fieldset rectangle, lanes side-by-side, so an outage in one
 * group never reflows another.
 *
 * Pure (no DOM, no Svelte runtime): every layout decision is exercised
 * under vitest without a graph canvas. All topology data is passed in;
 * nothing is read from a global registry.
 */

import type { Component, ComponentId, Group, GroupId, Status } from './types.ts'

/** Node + canvas geometry. Tweak in one place. */
export const TOPO_NODE_WIDTH = 240
export const TOPO_NODE_HEIGHT = 92
export const TOPO_X_GAP = 60
export const TOPO_Y_GAP = 28
export const TOPO_X_STEP = TOPO_NODE_WIDTH + TOPO_X_GAP
export const TOPO_Y_STEP = TOPO_NODE_HEIGHT + TOPO_Y_GAP

/** Fieldset chrome geometry for the grouped layout. */
export const GROUP_HEADER_HEIGHT = 60
export const GROUP_PADDING_X = 16
export const GROUP_PADDING_Y = 28
export const GROUP_LANE_GAP = 12
export const GROUP_MIN_LANE_WIDTH = 240
/** Default cap on cards per within-group depth row before wrapping. */
export const GROUP_MAX_COLS = 3
/** Default cap for the ungrouped flat layout. */
export const TOPO_MAX_COLS = 7
/** Gap between a parent fieldset and a child stacked beneath it. */
export const GROUP_STACK_GAP = 16

/** One chip rendered on a card (e.g. a running-instance tag). */
export interface CardChip {
  label: string
  title?: string
}

/**
 * Consumer-supplied per-card extras: an openable URL and/or a chip
 * strip. Keeps the card generic while letting a consumer surface
 * domain-specific affordances without shipping its own node component.
 */
export type CardExtras = (
  component: Component,
  result: { status: Status; details?: Record<string, string> },
) => { openUrl?: string | null; chips?: CardChip[] }

export interface TopologyNodeData {
  component: Component
  status: Status
  decommissioned: boolean
  subtitle: string | undefined
  details: Record<string, string> | undefined
  openUrl: string | null
  chips: CardChip[]
}

export interface TopologyNode {
  id: ComponentId
  type: 'topology'
  position: { x: number; y: number }
  data: TopologyNodeData
  width: number
  height: number
}

export interface TopologyEdge {
  id: string
  source: ComponentId
  target: ComponentId
  type?: 'default' | 'bezier' | 'smoothstep' | 'straight'
  animated?: boolean
  style?: string
  markerEnd?: { type: 'arrowclosed' | 'arrow'; color?: string; width?: number; height?: number }
}

/**
 * BFS-style depth assignment: a component's depth is one more than the
 * deepest of its upstreams (0 if none). Missing upstreams resolve to
 * depth 0 so a typo yields a visible-but-not-broken graph.
 */
export function computeDepths(components: readonly Component[]): Map<ComponentId, number> {
  const byId = new Map<ComponentId, Component>(components.map((c) => [c.id, c]))
  const depth = new Map<ComponentId, number>()

  function visit(id: ComponentId): number {
    const cached = depth.get(id)
    if (cached !== undefined) return cached
    const c = byId.get(id)
    if (!c || c.upstreams.length === 0) {
      depth.set(id, 0)
      return 0
    }
    const d = 1 + Math.max(...c.upstreams.map((u) => visit(u)))
    depth.set(id, d)
    return d
  }

  for (const c of components) visit(c.id)
  return depth
}

/** Group components by depth, preserving declaration order within a row. */
export function rowsByDepth(
  components: readonly Component[],
  depths: Map<ComponentId, number> = computeDepths(components),
): Component[][] {
  const maxDepth = Math.max(0, ...Array.from(depths.values()))
  const rows: Component[][] = Array.from({ length: maxDepth + 1 }, () => [])
  for (const c of components) {
    const d = depths.get(c.id) ?? 0
    rows[d].push(c)
  }
  return rows
}

/** Order index of a group within the provided groups list. */
function groupOrderIndex(groups: readonly Group[]): Map<GroupId, number> {
  return new Map(groups.map((g, i) => [g.id, i]))
}

function makeExtras(cardExtras: CardExtras | undefined): CardExtras {
  return cardExtras ?? (() => ({}))
}

function nodeData(
  c: Component,
  result: { status: Status; details?: Record<string, string> },
  extras: CardExtras,
): TopologyNodeData {
  const firstDetail = result.details ? Object.entries(result.details)[0] : undefined
  const extra = extras(c, result)
  return {
    component: c,
    status: result.status,
    decommissioned: c.decommissioned ?? false,
    subtitle: firstDetail ? `${firstDetail[0]}: ${firstDetail[1]}` : undefined,
    details: result.details,
    openUrl: extra.openUrl ?? null,
    chips: extra.chips ?? [],
  }
}

export interface BuildArgs {
  statusFor: (id: ComponentId) => { status: Status; details?: Record<string, string> }
  components: readonly Component[]
  groups?: readonly Group[]
  maxCols?: number
  cardExtras?: CardExtras
}

/**
 * Ungrouped flat layout: each depth row centred around x=0, long rows
 * wrapping after `maxCols` cards. Cards are clustered by group order
 * when a `groups` list is supplied.
 */
export function buildTopologyNodes({
  statusFor,
  components,
  groups = [],
  maxCols = TOPO_MAX_COLS,
  cardExtras,
}: BuildArgs): TopologyNode[] {
  const extras = makeExtras(cardExtras)
  const order = groupOrderIndex(groups)
  const depths = computeDepths(components)
  const rows = rowsByDepth(components, depths)
  const nodes: TopologyNode[] = []
  let yOffset = 0
  rows.forEach((rawRow) => {
    const row = [...rawRow]
      .map((c, i) => ({ c, i }))
      .sort((a, b) => (order.get(a.c.group) ?? 0) - (order.get(b.c.group) ?? 0) || a.i - b.i)
      .map((x) => x.c)
    const subRows: Component[][] = []
    for (let i = 0; i < row.length; i += maxCols) subRows.push(row.slice(i, i + maxCols))
    if (subRows.length === 0) subRows.push([])
    subRows.forEach((subRow, subIndex) => {
      const rowWidth = subRow.length * TOPO_X_STEP - TOPO_X_GAP
      const rowStartX = -rowWidth / 2
      const rowY = (yOffset + subIndex) * TOPO_Y_STEP
      subRow.forEach((c, i) => {
        nodes.push({
          id: c.id,
          type: 'topology',
          position: { x: rowStartX + i * TOPO_X_STEP, y: rowY },
          data: nodeData(c, statusFor(c.id), extras),
          width: TOPO_NODE_WIDTH,
          height: TOPO_NODE_HEIGHT,
        })
      })
    })
    yOffset += subRows.length
  })
  return nodes
}

/**
 * Edges derived from `upstreams`. Cross-group edges (upstream in a
 * different group) get a brighter dashed stroke so ecosystem boundaries
 * read at a glance; within-group edges stay subtle.
 */
export function buildTopologyEdges(components: readonly Component[]): TopologyEdge[] {
  const byId = new Map(components.map((c) => [c.id, c]))
  const out: TopologyEdge[] = []
  for (const c of components) {
    for (const u of c.upstreams) {
      const upstream = byId.get(u)
      const crossGroup = upstream !== undefined && upstream.group !== c.group
      out.push({
        id: `${u}->${c.id}`,
        source: u,
        target: c.id,
        type: 'smoothstep',
        animated: false,
        style: crossGroup
          ? 'stroke: var(--text-4); stroke-width: 1.2; stroke-dasharray: 4 5; opacity: 0.55;'
          : 'stroke: var(--border-2); stroke-width: 1.4;',
        markerEnd: {
          type: 'arrowclosed',
          width: 16,
          height: 16,
          color: crossGroup ? '#5a5d64' : '#4a4d54',
        },
      })
    }
  }
  return out
}

// ── Grouped layout - "distinct trees" view ────────────────────────

export interface GroupFieldsetNodeShape {
  id: string
  type: 'group-fieldset'
  position: { x: number; y: number }
  data: {
    groupId: GroupId
    label: string
    logo: string
    rollup: Status
    reachable: number
    total: number
    width: number
    height: number
    accent?: Group['accent']
  }
  width: number
  height: number
  draggable: false
  selectable: false
  zIndex: 0
}

export interface GroupedTopology {
  nodes: (TopologyNode | GroupFieldsetNodeShape)[]
  edges: TopologyEdge[]
}

export type GroupedComponentsMap = Record<GroupId, Component[]>

export interface BuildGroupedArgs {
  statusFor: (id: ComponentId) => { status: Status; details?: Record<string, string> }
  groups: readonly Group[]
  grouped: GroupedComponentsMap
  rollupFor: (groupId: GroupId) => Status
  countsFor: (groupId: GroupId) => { reachable: number; total: number }
  /** Group label + logo override. Falls back to the `groups` list. */
  groupMeta?: (groupId: GroupId) => { label: string; logo: string } | undefined
  cardExtras?: CardExtras
}

/**
 * Within-group depth: depth among upstreams that ALSO belong to the
 * same group. Cross-group upstreams are ignored so each tree starts at
 * depth 0 inside its own fieldset.
 */
export function depthsInGroup(
  _groupId: GroupId,
  members: readonly Component[],
  byId: Map<ComponentId, Component>,
): Map<ComponentId, number> {
  const inGroup = new Set(members.map((c) => c.id))
  const depths = new Map<ComponentId, number>()
  function visit(id: ComponentId): number {
    const cached = depths.get(id)
    if (cached !== undefined) return cached
    const c = byId.get(id)
    if (!c || !inGroup.has(id)) {
      depths.set(id, 0)
      return 0
    }
    const upInGroup = c.upstreams.filter((u) => inGroup.has(u))
    if (upInGroup.length === 0) {
      depths.set(id, 0)
      return 0
    }
    const d = 1 + Math.max(...upInGroup.map((u) => visit(u)))
    depths.set(id, d)
    return d
  }
  for (const c of members) visit(c.id)
  return depths
}

interface LaneSpec {
  group: Group
  width: number
  height: number
  subRows: Component[][]
}

function laneSpec(group: Group, members: Component[], byId: Map<ComponentId, Component>): LaneSpec {
  const depths = depthsInGroup(group.id, members, byId)
  const maxDepth = members.length === 0 ? -1 : Math.max(0, ...Array.from(depths.values()))
  const rows: Component[][] = maxDepth < 0 ? [] : Array.from({ length: maxDepth + 1 }, () => [])
  for (const c of members) {
    const d = depths.get(c.id) ?? 0
    rows[d].push(c)
  }
  for (const row of rows) row.sort((a, b) => (a.groupOrder ?? 100) - (b.groupOrder ?? 100))

  const maxCols = group.maxCols ?? GROUP_MAX_COLS
  const subRows: Component[][] = []
  for (const row of rows) {
    if (row.length === 0) {
      subRows.push([])
      continue
    }
    for (let i = 0; i < row.length; i += maxCols) subRows.push(row.slice(i, i + maxCols))
  }
  const widestSubRowCount = Math.max(1, ...subRows.map((r) => r.length))
  const width = Math.max(
    GROUP_MIN_LANE_WIDTH,
    widestSubRowCount * TOPO_X_STEP - TOPO_X_GAP + 2 * GROUP_PADDING_X,
  )
  const innerHeight = subRows.length === 0 ? 0 : subRows.length * TOPO_Y_STEP - TOPO_Y_GAP
  const height = GROUP_HEADER_HEIGHT + innerHeight + 2 * GROUP_PADDING_Y
  return { group, width, height, subRows }
}

function pushFieldsetAndCards(
  spec: LaneSpec,
  position: { x: number; y: number },
  nodes: (TopologyNode | GroupFieldsetNodeShape)[],
  args: BuildGroupedArgs,
  metaFor: (g: GroupId) => { label: string; logo: string },
  extras: CardExtras,
): void {
  const counts = args.countsFor(spec.group.id)
  const meta = metaFor(spec.group.id)

  nodes.push({
    id: `group:${spec.group.id}`,
    type: 'group-fieldset',
    position,
    data: {
      groupId: spec.group.id,
      label: meta.label,
      logo: meta.logo,
      rollup: args.rollupFor(spec.group.id),
      reachable: counts.reachable,
      total: counts.total,
      width: spec.width,
      height: spec.height,
      ...(spec.group.accent !== undefined ? { accent: spec.group.accent } : {}),
    },
    width: spec.width,
    height: spec.height,
    draggable: false,
    selectable: false,
    zIndex: 0,
  })

  spec.subRows.forEach((subRow, subIndex) => {
    const rowWidth = subRow.length * TOPO_X_STEP - TOPO_X_GAP
    const rowStartX = position.x + (spec.width - rowWidth) / 2
    const rowY = position.y + GROUP_HEADER_HEIGHT + GROUP_PADDING_Y + subIndex * TOPO_Y_STEP
    subRow.forEach((c, i) => {
      nodes.push({
        id: c.id,
        type: 'topology',
        position: { x: rowStartX + i * TOPO_X_STEP, y: rowY },
        data: nodeData(c, args.statusFor(c.id), extras),
        width: TOPO_NODE_WIDTH,
        height: TOPO_NODE_HEIGHT,
      })
    })
  })
}

/**
 * Lay out every group as its own tree inside a fieldset. Primary lanes
 * sit side-by-side; groups with `stackBelow` reuse their parent's X
 * column and drop below it. The column width widens to fit the wider of
 * parent or child so fieldsets align.
 */
export function buildGroupedTopology(args: BuildGroupedArgs): GroupedTopology {
  const components = args.groups.flatMap((g) => args.grouped[g.id] ?? [])
  const byId = new Map<ComponentId, Component>(components.map((c) => [c.id, c]))
  const extras = makeExtras(args.cardExtras)
  const defaultMeta = (id: GroupId): { label: string; logo: string } => {
    const g = args.groups.find((x) => x.id === id)
    return g ? { label: g.label, logo: g.logo ?? '' } : { label: id, logo: '' }
  }
  const metaFor: (g: GroupId) => { label: string; logo: string } =
    args.groupMeta !== undefined ? (id) => args.groupMeta!(id) ?? defaultMeta(id) : defaultMeta

  const specs = new Map<GroupId, LaneSpec>(
    args.groups.map((g) => [g.id, laneSpec(g, args.grouped[g.id] ?? [], byId)]),
  )

  const childrenOf = new Map<GroupId, GroupId[]>()
  for (const g of args.groups) {
    if (g.stackBelow === undefined) continue
    const list = childrenOf.get(g.stackBelow) ?? []
    list.push(g.id)
    childrenOf.set(g.stackBelow, list)
  }

  const nodes: (TopologyNode | GroupFieldsetNodeShape)[] = []
  let cursorX = 0

  for (const group of args.groups) {
    if (group.stackBelow !== undefined) continue
    const spec = specs.get(group.id)!
    const children = (childrenOf.get(group.id) ?? []).map((id) => specs.get(id)!)
    const colWidth = Math.max(spec.width, ...children.map((c) => c.width))

    const parentSpec: LaneSpec = { ...spec, width: colWidth }
    pushFieldsetAndCards(parentSpec, { x: cursorX, y: 0 }, nodes, args, metaFor, extras)

    let stackY = parentSpec.height + GROUP_STACK_GAP
    for (const child of children) {
      const childSpec: LaneSpec = { ...child, width: colWidth }
      pushFieldsetAndCards(childSpec, { x: cursorX, y: stackY }, nodes, args, metaFor, extras)
      stackY += childSpec.height + GROUP_STACK_GAP
    }

    cursorX += colWidth + GROUP_LANE_GAP
  }

  return { nodes, edges: buildTopologyEdges(components) }
}
