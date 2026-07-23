import { describe, expect, it } from 'vitest'
import {
  groupCounts,
  groupedComponents,
  identityDisplayStatus,
  rollupStatus,
  statusToColor,
} from './helpers.ts'
import { COMPONENTS, GROUPS, component, statusMap } from './test-fixtures.ts'
import type { Status } from './types.ts'

describe('groupedComponents', () => {
  it('returns one bucket per group, every component placed exactly once', () => {
    const grouped = groupedComponents(COMPONENTS, GROUPS)
    const total = GROUPS.reduce((sum, g) => sum + grouped[g.id].length, 0)
    expect(total).toBe(COMPONENTS.length)
  })

  it('preserves declaration order inside each group', () => {
    const grouped = groupedComponents(COMPONENTS, GROUPS)
    expect(grouped.alpha.map((c) => c.id)).toEqual(['a1', 'a2'])
  })

  it('creates a bucket for a component whose group is not in the groups list', () => {
    const orphan = component({ id: 'z1', group: 'zeta' })
    const grouped = groupedComponents([...COMPONENTS, orphan], GROUPS)
    expect(grouped['zeta'].map((c) => c.id)).toEqual(['z1'])
  })
})

describe('rollupStatus', () => {
  const grouped = groupedComponents(COMPONENTS, GROUPS)

  it('returns up when every member is up', () => {
    expect(rollupStatus('alpha', statusMap({}), grouped)).toBe('up')
  })

  it('returns down when any member is down (other groups unaffected)', () => {
    const s = statusMap({ a1: 'down' })
    expect(rollupStatus('alpha', s, grouped)).toBe('down')
    expect(rollupStatus('beta', s, grouped)).toBe('up')
  })

  it('returns degraded when a member is degraded and none down', () => {
    expect(rollupStatus('alpha', statusMap({ a2: 'degraded' }), grouped)).toBe('degraded')
  })

  it('returns unknown for an empty or all-unknown group', () => {
    expect(rollupStatus('alpha', () => ({ status: 'unknown' }), grouped)).toBe('unknown')
    expect(rollupStatus('missing', statusMap({}), grouped)).toBe('unknown')
  })

  it('excludes decommissioned members', () => {
    const dead = component({ id: 'ghost', group: 'alpha', decommissioned: true })
    const withDead = { ...grouped, alpha: [dead, ...grouped.alpha] }
    expect(rollupStatus('alpha', statusMap({ ghost: 'down' }), withDead)).toBe('up')
  })

  it('returns unknown when every member is decommissioned', () => {
    const dead = component({ id: 'ghost', group: 'alpha', decommissioned: true })
    expect(rollupStatus('alpha', statusMap({}), { ...grouped, alpha: [dead] })).toBe('unknown')
  })
})

describe('groupCounts', () => {
  const grouped = groupedComponents(COMPONENTS, GROUPS)

  it('counts up + degraded as reachable', () => {
    expect(groupCounts('alpha', statusMap({ a2: 'degraded' }), grouped)).toEqual({
      reachable: 2,
      total: 2,
    })
  })

  it('a down member is not reachable', () => {
    expect(groupCounts('alpha', statusMap({ a1: 'down' }), grouped)).toEqual({
      reachable: 1,
      total: 2,
    })
  })

  it('excludes decommissioned from the total', () => {
    const dead = component({ id: 'ghost', group: 'alpha', decommissioned: true })
    const withDead = { ...grouped, alpha: [dead, ...grouped.alpha] }
    expect(groupCounts('alpha', statusMap({}), withDead)).toEqual({ reachable: 2, total: 2 })
  })
})

describe('statusToColor', () => {
  it('maps every status to a distinct hex colour', () => {
    const seen = new Set(
      (['up', 'degraded', 'down', 'unknown'] as Status[]).map((s) => statusToColor(s)),
    )
    expect(seen.size).toBe(4)
    for (const s of ['up', 'degraded', 'down', 'unknown'] as Status[]) {
      expect(statusToColor(s)).toMatch(/^#[0-9A-Fa-f]{6}$/)
    }
  })
})

describe('identityDisplayStatus', () => {
  it('never rewrites the status', () => {
    for (const s of ['up', 'degraded', 'down', 'unknown'] as Status[]) {
      expect(identityDisplayStatus('any', s)).toBe(s)
    }
  })
})
