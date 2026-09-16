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

/**
 * The element at `index`, or a failure naming what was actually there.
 *
 * This package is type-checked under `noUncheckedIndexedAccess` because
 * it SHIPS ITS SOURCE and a consumer compiles it with their flags. In a
 * test that has just asserted a length, `!` would crash with no context
 * and `?.` would let the assertion pass vacuously against `undefined`.
 */
export function at<T>(items: ArrayLike<T> | undefined, index: number, label = 'item'): T {
  if (items === undefined) throw new Error(`expected ${label}[${index}], but the list is undefined`)
  const item = items[index]
  if (item === undefined) {
    throw new Error(`expected ${label}[${index}], but the list has ${items.length}`)
  }
  return item
}

/** The value under `key`, or a failure naming the keys that were there. */
export function keyed<T>(
  record: Readonly<Record<string, T>> | undefined,
  key: string,
  label = 'entry',
): T {
  if (record === undefined) throw new Error(`expected ${label} '${key}', but the map is undefined`)
  const value = record[key]
  if (value === undefined) {
    throw new Error(
      `expected ${label} '${key}', but the map has: ${Object.keys(record).join(', ')}`,
    )
  }
  return value
}

/** `value`, or a failure. For the "this cannot be null here" step in a
 *  test that has already proved it. */
export function present<T>(value: T | null | undefined, label = 'value'): T {
  if (value === null || value === undefined) {
    throw new Error(`expected ${label}, got ${value === null ? 'null' : 'undefined'}`)
  }
  return value
}
