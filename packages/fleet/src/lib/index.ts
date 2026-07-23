/**
 * @w5-ui/fleet - a grouped SvelteFlow topology board + drill-down panel
 * for operator dashboards, driven by an injectable backend contract.
 */

export { default as FleetBoard } from './components/FleetBoard.svelte'
export { default as DrillDown } from './components/DrillDown.svelte'
export { default as TopologyCard } from './components/TopologyCard.svelte'
export { default as GroupFieldset } from './components/GroupFieldset.svelte'
export { default as KindIcon } from './components/KindIcon.svelte'

export * from './types.ts'
export * from './helpers.ts'
export * from './topology-layout.ts'
export * from './scenario-progress.ts'
export {
  createHttpFleetApi,
  decodeStatusReport,
  decodeProcesses,
  decodeResources,
  type FleetApi,
} from './fleet-api.ts'
