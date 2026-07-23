/**
 * Fleet-board domain types. Generic: no consumer group names or
 * process identifiers are baked in. A consumer supplies its own
 * topology DATA (components + groups + scenarios) conforming to these
 * shapes, and points the board at a backend implementing `FleetApi`.
 */

/** Where a component physically runs. Free-text-ish, but these four
 *  cover the usual operator mental model. */
export type Zone = 'host' | 'edge' | 'cloud' | 'external'

/** Visual/icon family for a component card. */
export type Kind = 'app' | 'service' | 'channel' | 'model' | 'storage' | 'static'

/**
 * How the backend probes a component's health. The board never runs
 * these itself; they are metadata the drill-down surfaces (e.g. "pm2:
 * my-proc", "url: https://…"). The backend maps them to real probes.
 */
export type Health =
  | { kind: 'pm2'; name: string }
  | { kind: 'http'; url: string; expectStatus?: number }
  | { kind: 'docker'; name: string }
  | { kind: 'adb'; serial: string }
  | { kind: 'static' }

/** Group id is an opaque string; a consumer defines its own set. */
export type GroupId = string

/** Component id is an opaque string. */
export type ComponentId = string

/**
 * Optional per-group visual accent, applied by the fieldset frame.
 * These are Tailwind class strings scanned from the CONSUMER's topology
 * data file (so the consumer's Tailwind build generates them). When
 * absent the fieldset paints a neutral border with no tint.
 */
export interface GroupAccent {
  /** Border class, e.g. `border-status-success/25`. */
  border?: string
  /** Gradient tint class, e.g. `from-status-success/[0.14] via-bg-1/0 to-bg-1/0`. */
  tint?: string
}

export interface Group {
  id: GroupId
  label: string
  /** Absolute URL (under the consumer app's `public/`) for the legend logo. */
  logo?: string
  description?: string
  /**
   * Layout hint: when set, this group's fieldset stacks BELOW the named
   * group in the same X column instead of taking a new lane to the right.
   */
  stackBelow?: GroupId
  /** Per-group cap on cards per row before wrapping. Defaults to a global. */
  maxCols?: number
  /** Optional visual accent for the fieldset frame. */
  accent?: GroupAccent
}

export interface Component {
  id: ComponentId
  label: string
  zone: Zone
  kind: Kind
  /** Ecosystem this component belongs to; drives per-group rollup. */
  group: GroupId
  /** DAG parents, for layout + drill-down "depends on". */
  upstreams: readonly ComponentId[]
  health: Health
  /** Browser-openable base URL, when it hosts a web UI. */
  webUrl?: string
  /** Marked out-of-service; renders greyed even when nothing is broken. */
  decommissioned?: boolean
  /**
   * Per-group display order. Lower = earlier. When unset, falls back to
   * declaration order.
   */
  groupOrder?: number
  description?: string
  /**
   * PM2 process (or generic control target) name, when the board should
   * offer start/stop/restart even though `health.kind` isn't `pm2`.
   */
  controlVia?: string
  /**
   * Whether this component supports start/stop/restart actions. When
   * unset, the drill-down derives it from `health.kind === 'pm2'` or a
   * set `controlVia`.
   */
  canAct?: boolean
  /**
   * Whether this component can be toggled auto-start. The board only
   * renders the toggle when the backend also exposes `setAutoStart`.
   */
  canAutoStart?: boolean
  /** Override label for the scenarios section of the drill-down. */
  scenariosLabel?: string
}

// ── live status ───────────────────────────────────────────────────

export type Status = 'up' | 'degraded' | 'down' | 'unknown'

export interface CheckResult {
  status: Status
  latencyMs?: number
  lastSuccessfulAt?: number
  message?: string
  /** Per-component metadata surfaced in the drill-down details grid. */
  details?: Record<string, string>
}

export interface StatusReport {
  ts: number
  components: Record<ComponentId, CheckResult>
  /** Per-component auto-start flag; missing entries are treated as false. */
  autoStart?: Record<ComponentId, boolean>
  /** Host machine LAN IPv4 (or null), for building "open in browser" links. */
  hostLanIp?: string | null
}

// ── scenarios (multi-step operator macros, surfaced as buttons) ────

export interface Scenario {
  id: string
  label: string
  description?: string
  /** Drill-down of this component renders the scenario as a button. */
  attachedTo: ComponentId
}

// ── backend result shapes ─────────────────────────────────────────

export interface ProcessRow {
  name: string
  status: string
  pid?: number
  cpu?: number
  memory?: number
  restarts?: number
  uptimeMs?: number
}

export interface ResourceSnapshot {
  [key: string]: unknown
}

export interface ActionResult {
  ok: boolean
  pm2Name?: string
  stdout?: string
  stderr?: string
  error?: string
  details?: string
}

export interface LogTail {
  path: string
  lines: string[]
}

export interface LogsResult {
  ok: boolean
  out?: LogTail
  err?: LogTail
  error?: string
  details?: string
}

export interface AutoStartResult {
  ok: boolean
  componentId?: string
  enabled?: boolean
  components?: Record<string, boolean>
  error?: string
}

export type ScenarioAction = 'start' | 'stop' | 'restart'

export interface ScenarioStepView {
  kind: string
  ok: boolean
  durationMs: number
  message?: string
}

export type ScenarioRunState = 'running' | 'done' | 'failed'

export interface ScenarioRun {
  runId: string
  scenarioId: string
  state: ScenarioRunState
  steps: ScenarioStepView[]
  startedAt?: number
  finishedAt?: number
}

export type ScenarioRunAccepted = { ok: true; runId: string } | { ok: false; error: string }

export type ScenarioRunResponse = { ok: true; run: ScenarioRun } | { ok: false; error: string }
