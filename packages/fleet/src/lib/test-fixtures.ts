/**
 * Synthetic topology fixtures for the fleet-board tests. Deliberately
 * generic (no real deployment names) so the package tests never couple
 * to a consumer's data.
 */

import type { CheckResult, Component, Group, Status } from './types.ts'

export function component(over: Partial<Component> & Pick<Component, 'id'>): Component {
  return {
    label: over.id,
    zone: 'host',
    kind: 'service',
    group: 'alpha',
    upstreams: [],
    health: { kind: 'static' },
    ...over,
  }
}

export const GROUPS: readonly Group[] = [
  { id: 'alpha', label: 'Alpha', logo: '/alpha.svg', maxCols: 2 },
  { id: 'beta', label: 'Beta', logo: '/beta.png' },
  { id: 'gamma', label: 'Gamma', logo: '/gamma.svg', stackBelow: 'beta' },
]

export const COMPONENTS: readonly Component[] = [
  component({ id: 'a1', group: 'alpha', health: { kind: 'pm2', name: 'a1' } }),
  component({ id: 'a2', group: 'alpha', upstreams: ['a1'] }),
  component({ id: 'b1', group: 'beta', health: { kind: 'http', url: 'https://x/health' } }),
  component({ id: 'g1', group: 'gamma', upstreams: ['b1'] }),
]

export function statusMap(
  overrides: Partial<Record<string, Status | CheckResult>> = {},
): (id: string) => CheckResult {
  return (id) => {
    const v = overrides[id]
    if (v === undefined) return { status: 'up' }
    return typeof v === 'string' ? { status: v } : v
  }
}
