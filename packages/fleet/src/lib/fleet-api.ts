/**
 * The board's backend contract. A consumer implements this interface
 * (typically over its own aggregator) and passes it to the drill-down.
 * `createHttpFleetApi` is a convenience implementation over `fetch`
 * that speaks the canonical REST shape documented in the README.
 *
 * Every method is tolerant: a malformed body decodes to a safe error
 * envelope rather than throwing, so a single bad poll never crashes the
 * panel.
 */

import type {
  ActionResult,
  AutoStartResult,
  ComponentId,
  LogsResult,
  ProcessRow,
  ResourceSnapshot,
  ScenarioAction,
  ScenarioRunAccepted,
  ScenarioRunResponse,
  StatusReport,
} from './types.ts'

export interface FleetApi {
  /** Poll the component status report. */
  fetchStatus(): Promise<StatusReport | null>
  /** List backend process rows (optional capability). */
  fetchProcesses?(): Promise<ProcessRow[]>
  /** Poll the host resource snapshot (optional capability). */
  fetchResources?(): Promise<ResourceSnapshot | null>
  /** Start / stop / restart a component. */
  runAction(id: ComponentId, action: ScenarioAction): Promise<ActionResult>
  /** Tail a component's logs. */
  fetchLogs(id: ComponentId, lines: number): Promise<LogsResult>
  /** Start a scenario as a background job (202 + runId). */
  runScenario(scenarioId: string): Promise<ScenarioRunAccepted>
  /** Poll one scenario run's current state. */
  getScenarioRun(runId: string): Promise<ScenarioRunResponse>
  /** Toggle a component's auto-start (optional capability). */
  setAutoStart?(id: ComponentId, enabled: boolean): Promise<AutoStartResult>
}

// ── tolerant decode helpers ──────────────────────────────────────

function asObject(raw: unknown): Record<string, unknown> | null {
  return typeof raw === 'object' && raw !== null && !Array.isArray(raw)
    ? (raw as Record<string, unknown>)
    : null
}

export function decodeStatusReport(raw: unknown): StatusReport | null {
  const o = asObject(raw)
  if (o === null || asObject(o['components']) === null) return null
  return o as unknown as StatusReport
}

export function decodeProcesses(raw: unknown): ProcessRow[] {
  const o = asObject(raw)
  if (o === null || !Array.isArray(o['processes'])) return []
  return o['processes'] as ProcessRow[]
}

export function decodeResources(raw: unknown): ResourceSnapshot | null {
  const snapshot = asObject(asObject(raw)?.['snapshot'])
  return snapshot === null ? null : (snapshot as ResourceSnapshot)
}

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>

/**
 * HTTP implementation of `FleetApi` over a base URL (e.g. `/api`) and an
 * optional `fetch`. Endpoint shapes:
 *   GET  {base}/status
 *   GET  {base}/processes
 *   GET  {base}/resources
 *   POST {base}/components/:id/action        { action }
 *   GET  {base}/components/:id/logs?lines=N
 *   PATCH {base}/components/:id/autostart     { enabled }
 *   POST {base}/scenarios/:id/run
 *   GET  {base}/scenarios/runs/:runId
 */
export function createHttpFleetApi(
  baseUrl: string,
  fetchLike: FetchLike = globalThis.fetch,
): FleetApi {
  const base = baseUrl.replace(/\/$/, '')

  async function readJson(path: string, init?: RequestInit): Promise<unknown> {
    const res = await fetchLike(`${base}${path}`, init)
    const text = await res.text()
    if (text === '') return null
    try {
      return JSON.parse(text)
    } catch {
      return null
    }
  }

  return {
    async fetchStatus() {
      return decodeStatusReport(await readJson('/status', { cache: 'no-store' }))
    },
    async fetchProcesses() {
      return decodeProcesses(await readJson('/processes'))
    },
    async fetchResources() {
      return decodeResources(await readJson('/resources', { cache: 'no-store' }))
    },
    async runAction(id, action) {
      const body = await readJson(`/components/${encodeURIComponent(id)}/action`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      return (
        (asObject(body) as unknown as ActionResult | null) ?? { ok: false, error: 'no response' }
      )
    },
    async fetchLogs(id, lines) {
      const body = await readJson(`/components/${encodeURIComponent(id)}/logs?lines=${lines}`, {
        cache: 'no-store',
      })
      return (asObject(body) as unknown as LogsResult | null) ?? { ok: false, error: 'no response' }
    },
    async runScenario(scenarioId) {
      const body = await readJson(`/scenarios/${encodeURIComponent(scenarioId)}/run`, {
        method: 'POST',
      })
      return (
        (asObject(body) as unknown as ScenarioRunAccepted | null) ?? {
          ok: false,
          error: 'no response',
        }
      )
    },
    async getScenarioRun(runId) {
      const body = await readJson(`/scenarios/runs/${encodeURIComponent(runId)}`)
      return (
        (asObject(body) as unknown as ScenarioRunResponse | null) ?? {
          ok: false,
          error: 'no response',
        }
      )
    },
    async setAutoStart(id, enabled) {
      const body = await readJson(`/components/${encodeURIComponent(id)}/autostart`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ enabled }),
      })
      return (
        (asObject(body) as unknown as AutoStartResult | null) ?? { ok: false, error: 'no response' }
      )
    },
  }
}
