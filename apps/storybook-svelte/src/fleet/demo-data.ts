// Demo topology + mocked FleetApi for the Fleet storybook stories.
// Neutral, invented services - no real deployment names.

import type { CheckResult, Component, FleetApi, Group, Scenario, Status } from '@w5-ui/fleet'

export const GROUPS: readonly Group[] = [
  {
    id: 'edge',
    label: 'Edge',
    maxCols: 1,
    accent: {
      border: 'border-status-warning/30',
      tint: 'from-status-warning/[0.14] via-bg-1/0 to-bg-1/0',
    },
  },
  {
    id: 'core',
    label: 'Core',
    maxCols: 2,
    accent: {
      border: 'border-status-info/30',
      tint: 'from-status-info/[0.16] via-bg-1/0 to-bg-1/0',
    },
  },
  {
    id: 'cloud',
    label: 'Cloud',
    maxCols: 1,
    accent: {
      border: 'border-status-success/25',
      tint: 'from-status-success/[0.14] via-bg-1/0 to-bg-1/0',
    },
  },
]

export const COMPONENTS: readonly Component[] = [
  {
    id: 'device',
    label: 'Field device',
    zone: 'edge',
    kind: 'app',
    group: 'edge',
    upstreams: [],
    health: { kind: 'adb', serial: 'device-1' },
  },
  {
    id: 'gateway',
    label: 'Gateway',
    zone: 'host',
    kind: 'service',
    group: 'core',
    upstreams: ['device'],
    health: { kind: 'pm2', name: 'gateway' },
  },
  {
    id: 'worker',
    label: 'Worker pool',
    zone: 'host',
    kind: 'service',
    group: 'core',
    upstreams: ['gateway'],
    health: { kind: 'pm2', name: 'worker' },
  },
  {
    id: 'store',
    label: 'Data store',
    zone: 'cloud',
    kind: 'storage',
    group: 'cloud',
    upstreams: ['worker'],
    health: { kind: 'static' },
  },
  {
    id: 'api',
    label: 'Public API',
    zone: 'cloud',
    kind: 'service',
    group: 'cloud',
    upstreams: ['store'],
    health: { kind: 'http', url: 'https://api.example/healthz' },
  },
]

export const SCENARIOS: readonly Scenario[] = [
  {
    id: 'restart-stack',
    label: 'Restart core stack',
    description: 'Cycle gateway + worker.',
    attachedTo: 'gateway',
  },
]

export function scenariosFor(id: string): Scenario[] {
  return SCENARIOS.filter((s) => s.attachedTo === id)
}

export function statusFor(overrides: Record<string, Status> = {}): (id: string) => CheckResult {
  return (id) => ({
    status: overrides[id] ?? 'up',
    lastSuccessfulAt: Date.now() - 20_000,
    ...(id === 'worker' ? { details: { workers: '3' } } : {}),
  })
}

/** A mocked backend so the drill-down actions/logs/scenarios resolve. */
export function mockApi(): FleetApi {
  return {
    fetchStatus: async () => ({ ts: Date.now(), components: {} }),
    runAction: async (id, action) => ({ ok: true, pm2Name: id, stdout: `${action} ok` }),
    fetchLogs: async (id) => ({
      ok: true,
      out: { path: `/logs/${id}.log`, lines: ['started', 'ready'] },
    }),
    runScenario: async () => ({ ok: true, runId: 'demo-run' }),
    getScenarioRun: async (runId) => ({
      ok: true,
      run: {
        runId,
        scenarioId: 'restart-stack',
        state: 'done',
        steps: [
          { kind: 'pm2-restart', ok: true, durationMs: 420, message: 'gateway restarted' },
          { kind: 'pm2-restart', ok: true, durationMs: 380, message: 'worker restarted' },
        ],
      },
    }),
    setAutoStart: async (id, enabled) => ({ ok: true, componentId: id, enabled }),
  }
}
