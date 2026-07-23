/**
 * Pure helpers for the fleet board: bucket components into their groups,
 * roll a group's health up to a single status, and map a status to a
 * colour. No DOM, no global topology - every input is a parameter, so
 * the same logic serves any consumer's topology.
 */

import type { CheckResult, Component, ComponentId, Group, GroupId, Status } from './types.ts'

export type GroupedComponents = Record<GroupId, Component[]>

/** Bucket every component into its declared group, in declaration order. */
export function groupedComponents(
  components: readonly Component[],
  groups: readonly Group[],
): GroupedComponents {
  const out = Object.fromEntries(groups.map((g) => [g.id, [] as Component[]])) as GroupedComponents
  for (const c of components) {
    if (out[c.group] === undefined) out[c.group] = []
    out[c.group].push(c)
  }
  return out
}

/**
 * Aggregate a group's own-only status. `decommissioned` members are
 * excluded so a retired component can't drag a healthy group red.
 *
 *   any down -> down; else any degraded -> degraded;
 *   else any up -> up; else unknown.
 */
export function rollupStatus(
  groupId: GroupId,
  statusFor: (id: ComponentId) => CheckResult,
  grouped: GroupedComponents,
): Status {
  const live = (grouped[groupId] ?? []).filter((c) => !c.decommissioned)
  if (live.length === 0) return 'unknown'
  const buckets = { up: 0, degraded: 0, down: 0, unknown: 0 }
  for (const c of live) buckets[statusFor(c.id).status] += 1
  if (buckets.down > 0) return 'down'
  if (buckets.degraded > 0) return 'degraded'
  if (buckets.up > 0) return 'up'
  return 'unknown'
}

/**
 * Colour palette for status. Hex strings so an SVG (minimap, dendrogram)
 * can colour nodes directly. Match the dashboard's `--status-*` tokens.
 */
const STATUS_COLORS: Record<Status, string> = {
  up: '#22C55E',
  degraded: '#F5A623',
  down: '#EF4444',
  unknown: '#6E7079',
}

export function statusToColor(status: Status): string {
  return STATUS_COLORS[status]
}

/** Count of `up + degraded` members vs total live members in a group. */
export function groupCounts(
  groupId: GroupId,
  statusFor: (id: ComponentId) => CheckResult,
  grouped: GroupedComponents,
): { reachable: number; total: number } {
  const live = (grouped[groupId] ?? []).filter((c) => !c.decommissioned)
  let reachable = 0
  for (const c of live) {
    const s = statusFor(c.id).status
    if (s === 'up' || s === 'degraded') reachable += 1
  }
  return { reachable, total: live.length }
}

/**
 * Identity display-clamp. A consumer may pass its own
 * `displayStatusFor(groupId, status)` to the board to soften a
 * routinely-disconnected group (e.g. paint a "down" as grey), but the
 * package default never rewrites a status.
 */
export function identityDisplayStatus(_groupId: GroupId, status: Status): Status {
  return status
}
