import { describe, expect, it } from 'vitest'
import { groupedComponents } from './helpers.ts'
import { COMPONENTS, GROUPS, component, statusMap } from './test-fixtures.ts'
import {
  buildGroupedTopology,
  buildTopologyEdges,
  buildTopologyNodes,
  computeDepths,
  depthsInGroup,
  GROUP_HEADER_HEIGHT,
  GROUP_LANE_GAP,
  GROUP_MIN_LANE_WIDTH,
  GROUP_PADDING_Y,
  rowsByDepth,
  TOPO_MAX_COLS,
  TOPO_NODE_HEIGHT,
  TOPO_NODE_WIDTH,
  TOPO_X_GAP,
  TOPO_X_STEP,
  TOPO_Y_STEP,
  type GroupedComponentsMap,
} from './topology-layout.ts'
import type { CheckResult, Group, GroupId, Status } from './types.ts'

describe('computeDepths', () => {
  it('places nodes with no upstreams at depth 0', () => {
    const d = computeDepths([component({ id: 'a' }), component({ id: 'b' })])
    expect(d.get('a')).toBe(0)
    expect(d.get('b')).toBe(0)
  })

  it('depth(child) = 1 + max(depth(upstream))', () => {
    const d = computeDepths([
      component({ id: 'a' }),
      component({ id: 'b', upstreams: ['a'] }),
      component({ id: 'c', upstreams: ['a', 'b'] }),
    ])
    expect(d.get('a')).toBe(0)
    expect(d.get('b')).toBe(1)
    expect(d.get('c')).toBe(2)
  })

  it('ignores upstream ids that do not resolve', () => {
    const d = computeDepths([component({ id: 'a', upstreams: ['ghost'] })])
    expect(d.get('a')).toBe(1)
    expect(d.get('ghost')).toBe(0)
  })

  it('memoises diamond DAGs without blowing up', () => {
    const dm = computeDepths([
      component({ id: 'a' }),
      component({ id: 'b', upstreams: ['a'] }),
      component({ id: 'c', upstreams: ['a'] }),
      component({ id: 'd', upstreams: ['b', 'c'] }),
    ])
    expect(dm.get('d')).toBe(2)
  })
})

describe('rowsByDepth', () => {
  it('groups every component into its depth row, preserving order', () => {
    const rows = rowsByDepth([
      component({ id: 'a' }),
      component({ id: 'b' }),
      component({ id: 'c', upstreams: ['a'] }),
    ])
    expect(rows[0].map((x) => x.id)).toEqual(['a', 'b'])
    expect(rows[1].map((x) => x.id)).toEqual(['c'])
  })

  it('returns [[]] when there are no components', () => {
    expect(rowsByDepth([])).toEqual([[]])
  })
})

describe('buildTopologyNodes', () => {
  it('returns one node per component', () => {
    const nodes = buildTopologyNodes({
      statusFor: statusMap(),
      components: [component({ id: 'a' }), component({ id: 'b', upstreams: ['a'] })],
    })
    expect(nodes.map((n) => n.id)).toEqual(['a', 'b'])
  })

  it('centres rows horizontally around x = 0', () => {
    const nodes = buildTopologyNodes({
      statusFor: statusMap(),
      components: [component({ id: 'a' }), component({ id: 'b' }), component({ id: 'c' })],
    })
    const expectedLeft = -(3 * TOPO_X_STEP - TOPO_X_GAP) / 2
    expect(nodes[0].position.x).toBe(expectedLeft)
    expect(nodes[2].position.x).toBe(expectedLeft + 2 * TOPO_X_STEP)
  })

  it('clusters cards within a row by group order', () => {
    const groups: Group[] = [
      { id: 'g0', label: 'g0' },
      { id: 'g1', label: 'g1' },
      { id: 'g2', label: 'g2' },
    ]
    const nodes = buildTopologyNodes({
      statusFor: statusMap(),
      groups,
      components: [
        component({ id: 'x', group: 'g2' }),
        component({ id: 'y', group: 'g0' }),
        component({ id: 'z', group: 'g1' }),
      ],
    })
    expect(nodes.map((n) => n.id)).toEqual(['y', 'z', 'x'])
  })

  it('wraps rows wider than maxCols onto stacked sub-rows', () => {
    const many = Array.from({ length: TOPO_MAX_COLS + 2 }, (_, i) => component({ id: `n${i}` }))
    const nodes = buildTopologyNodes({ statusFor: statusMap(), components: many })
    const rowYs = new Set(nodes.map((n) => n.position.y))
    expect(rowYs.size).toBe(2)
    expect(nodes.slice(0, TOPO_MAX_COLS).every((n) => n.position.y === 0)).toBe(true)
    expect(nodes.slice(TOPO_MAX_COLS).every((n) => n.position.y === TOPO_Y_STEP)).toBe(true)
  })

  it('a wrapped row pushes downstream depths further down', () => {
    const roots = Array.from({ length: TOPO_MAX_COLS + 1 }, (_, i) => component({ id: `r${i}` }))
    const child = component({ id: 'child', upstreams: ['r0'] })
    const nodes = buildTopologyNodes({ statusFor: statusMap(), components: [...roots, child] })
    expect(nodes.find((n) => n.id === 'child')!.position.y).toBe(2 * TOPO_Y_STEP)
  })

  it('passes status + decommissioned + subtitle + details through node.data', () => {
    const nodes = buildTopologyNodes({
      statusFor: statusMap({ a: { status: 'down', details: { model: 'x.gguf' } } }),
      components: [component({ id: 'a', decommissioned: true })],
    })
    expect(nodes[0].data.status).toBe('down')
    expect(nodes[0].data.decommissioned).toBe(true)
    expect(nodes[0].data.subtitle).toBe('model: x.gguf')
    expect(nodes[0].data.details).toEqual({ model: 'x.gguf' })
  })

  it('subtitle is undefined when there are no details', () => {
    const nodes = buildTopologyNodes({
      statusFor: statusMap(),
      components: [component({ id: 'a' })],
    })
    expect(nodes[0].data.subtitle).toBeUndefined()
  })

  it('applies cardExtras (chips + openUrl) to node.data', () => {
    const nodes = buildTopologyNodes({
      statusFor: statusMap(),
      components: [component({ id: 'a' })],
      cardExtras: (c) => ({ openUrl: `https://open/${c.id}`, chips: [{ label: 'x' }] }),
    })
    expect(nodes[0].data.openUrl).toBe('https://open/a')
    expect(nodes[0].data.chips).toEqual([{ label: 'x' }])
  })

  it('every node carries explicit width/height', () => {
    const nodes = buildTopologyNodes({
      statusFor: statusMap(),
      components: [component({ id: 'a' })],
    })
    expect(nodes[0].width).toBe(TOPO_NODE_WIDTH)
    expect(nodes[0].height).toBe(TOPO_NODE_HEIGHT)
  })
})

describe('depthsInGroup', () => {
  it('only counts upstreams within the same group', () => {
    const a = component({ id: 'a', group: 'g' })
    const b = component({ id: 'b', group: 'g', upstreams: ['a'] })
    const byId = new Map([
      ['a', a],
      ['b', b],
    ])
    const d = depthsInGroup('g', [a, b], byId)
    expect(d.get('a')).toBe(0)
    expect(d.get('b')).toBe(1)
  })

  it('places members with cross-group-only upstreams at depth 0', () => {
    const ext = component({ id: 'ext', group: 'other' })
    const a = component({ id: 'a', group: 'g', upstreams: ['ext'] })
    const byId = new Map([
      ['a', a],
      ['ext', ext],
    ])
    expect(depthsInGroup('g', [a], byId).get('a')).toBe(0)
  })
})

describe('buildGroupedTopology', () => {
  const grouped = groupedComponents(COMPONENTS, GROUPS) as GroupedComponentsMap

  function buildArgs(over: Partial<Parameters<typeof buildGroupedTopology>[0]> = {}) {
    return {
      statusFor: statusMap(),
      groups: GROUPS,
      grouped,
      rollupFor: (_g: GroupId): Status => 'up',
      countsFor: (g: GroupId) => ({ reachable: grouped[g].length, total: grouped[g].length }),
      ...over,
    }
  }

  it('emits one group-fieldset node per group', () => {
    const { nodes } = buildGroupedTopology(buildArgs())
    expect(
      nodes
        .filter((n) => n.type === 'group-fieldset')
        .map((n) => n.id)
        .sort(),
    ).toEqual(['group:alpha', 'group:beta', 'group:gamma'])
  })

  it('fieldsets are non-draggable, non-selectable, behind cards', () => {
    for (const f of buildGroupedTopology(buildArgs()).nodes.filter(
      (n) => n.type === 'group-fieldset',
    )) {
      expect(f.draggable).toBe(false)
      expect(f.selectable).toBe(false)
      expect(f.zIndex).toBe(0)
    }
  })

  it('fieldset header carries rollup + counts + label/logo', () => {
    const f = buildGroupedTopology(buildArgs()).nodes.find((n) => n.id === 'group:alpha')!
    if (f.type !== 'group-fieldset') throw new Error('expected fieldset')
    expect(f.data.rollup).toBe('up')
    expect(f.data.total).toBe(2)
    expect(f.data.label).toBe('Alpha')
    expect(f.data.logo).toBe('/alpha.svg')
  })

  it('passes a group accent through to the fieldset node', () => {
    const groups: Group[] = [
      { id: 'alpha', label: 'Alpha', accent: { border: 'border-x', tint: 'from-y' } },
    ]
    const g = { alpha: [component({ id: 'a1', group: 'alpha' })] } as GroupedComponentsMap
    const f = buildGroupedTopology(
      buildArgs({ groups, grouped: g, countsFor: () => ({ reachable: 1, total: 1 }) }),
    ).nodes.find((n) => n.id === 'group:alpha')!
    if (f.type !== 'group-fieldset') throw new Error('expected fieldset')
    expect(f.data.accent).toEqual({ border: 'border-x', tint: 'from-y' })
  })

  it('lane widths obey the minimum when a group is tiny', () => {
    const tiny = {
      alpha: [component({ id: 'a', group: 'alpha' })],
      beta: [component({ id: 'b', group: 'beta' })],
      gamma: [component({ id: 'g', group: 'gamma' })],
    } as GroupedComponentsMap
    for (const f of buildGroupedTopology(buildArgs({ grouped: tiny })).nodes.filter(
      (n) => n.type === 'group-fieldset',
    )) {
      expect(f.width).toBeGreaterThanOrEqual(GROUP_MIN_LANE_WIDTH)
    }
  })

  it('primary lanes flow left-to-right; stackBelow children share parent X', () => {
    const { nodes } = buildGroupedTopology(buildArgs())
    const beta = nodes.find((n) => n.id === 'group:beta')!
    const gamma = nodes.find((n) => n.id === 'group:gamma')!
    expect(gamma.position.x).toBe(beta.position.x)
    expect(gamma.position.y).toBeGreaterThan(beta.position.y + beta.height)
    expect(gamma.width).toBe(beta.width)
  })

  it('primary lane columns are GROUP_LANE_GAP apart', () => {
    const { nodes } = buildGroupedTopology(buildArgs())
    const alpha = nodes.find((n) => n.id === 'group:alpha')!
    const beta = nodes.find((n) => n.id === 'group:beta')!
    expect(alpha.position.x).toBe(0)
    expect(beta.position.x).toBe(alpha.width + GROUP_LANE_GAP)
  })

  it('component nodes sit below the fieldset header band', () => {
    const cards = buildGroupedTopology(buildArgs()).nodes.filter((n) => n.type === 'topology')
    expect(cards.length).toBeGreaterThan(0)
    for (const c of cards)
      expect(c.position.y).toBeGreaterThanOrEqual(GROUP_HEADER_HEIGHT + GROUP_PADDING_Y)
  })

  it('cross-group upstream edges are still emitted', () => {
    const { edges } = buildGroupedTopology(buildArgs())
    expect(edges.some((e) => e.source === 'b1' && e.target === 'g1')).toBe(true)
  })

  it('groupMeta override drives the fieldset label + logo, with fallback', () => {
    const custom = buildGroupedTopology(
      buildArgs({ groupMeta: () => ({ label: 'C', logo: '/c.svg' }) }),
    )
    const f = custom.nodes.find((n) => n.id === 'group:alpha')!
    if (f.type !== 'group-fieldset') throw new Error('expected fieldset')
    expect(f.data.label).toBe('C')

    const fallback = buildGroupedTopology(buildArgs({ groupMeta: () => undefined }))
    const f2 = fallback.nodes.find((n) => n.id === 'group:alpha')!
    if (f2.type !== 'group-fieldset') throw new Error('expected fieldset')
    expect(f2.data.label).toBe('Alpha')
  })

  it('an empty group yields a fieldset at >= min width and no cards', () => {
    const empty = { alpha: [], beta: [], gamma: [] } as GroupedComponentsMap
    const { nodes } = buildGroupedTopology(buildArgs({ grouped: empty }))
    expect(nodes.filter((n) => n.type === 'group-fieldset')).toHaveLength(3)
    expect(nodes.filter((n) => n.type === 'topology')).toHaveLength(0)
  })
})

describe('buildTopologyEdges', () => {
  it('emits one edge per (upstream, target) pair', () => {
    const edges = buildTopologyEdges([
      component({ id: 'a' }),
      component({ id: 'b', upstreams: ['a'] }),
      component({ id: 'c', upstreams: ['a', 'b'] }),
    ])
    expect(edges.map((e) => e.id).sort()).toEqual(['a->b', 'a->c', 'b->c'])
  })

  it('marks every edge smoothstep', () => {
    const edges = buildTopologyEdges([
      component({ id: 'a' }),
      component({ id: 'b', upstreams: ['a'] }),
    ])
    expect(edges[0].type).toBe('smoothstep')
  })

  it('flags cross-group edges with a dashed stroke', () => {
    const edges = buildTopologyEdges([
      component({ id: 'a', group: 'g1' }),
      component({ id: 'b', group: 'g2', upstreams: ['a'] }),
    ])
    expect(edges[0].style).toMatch(/dasharray/)
  })

  it('returns an empty list when there are no upstreams', () => {
    expect(buildTopologyEdges([component({ id: 'a' })])).toEqual([])
  })
})

describe('CheckResult in fixtures typechecks', () => {
  it('statusMap yields a CheckResult', () => {
    const r: CheckResult = statusMap({ a1: 'degraded' })('a1')
    expect(r.status).toBe('degraded')
  })
})
