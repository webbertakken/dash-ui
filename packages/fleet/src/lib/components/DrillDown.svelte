<script lang="ts">
  /**
   * Component drill-down panel. Slides in from the right when a card is
   * selected on the board. Status, an open-url affordance, start / stop
   * / restart actions (when the component is controllable), an optional
   * auto-start toggle (only when the backend exposes the capability),
   * attached scenario buttons with live-ish progress (polled), a topology
   * details grid, and a log tail. Consumers may inject extra sections via
   * the `extra` snippet.
   *
   * All mutations go through the injected `FleetApi`; the panel degrades
   * cleanly when a capability is absent.
   */
  import { AccordionItem, Alert, Button, Card, IconButton, KVTable, Pill, Toggle } from '@w5-ui/svelte'
  import type { Snippet } from 'svelte'
  import type {
    CheckResult,
    Component,
    LogsResult,
    Scenario,
    ScenarioAction,
    ScenarioRun,
  } from '../types.ts'
  import type { FleetApi } from '../fleet-api.ts'
  import { isTerminal, stateLabel, stateVariant, stepViews } from '../scenario-progress.ts'

  let {
    component,
    result,
    scenarios = [],
    api,
    autoStart = false,
    openUrl = null,
    onClose,
    extra,
  }: {
    component: Component
    result: CheckResult
    scenarios?: readonly Scenario[]
    api: FleetApi
    autoStart?: boolean
    openUrl?: string | null
    onClose: () => void
    extra?: Snippet
  } = $props()

  const controlName = $derived(
    component.controlVia ?? (component.health.kind === 'pm2' ? component.health.name : null),
  )
  const canAct = $derived(component.canAct ?? controlName !== null)
  const canAutoStart = $derived(component.canAutoStart === true && api.setAutoStart !== undefined)

  // ── actions ──────────────────────────────────────────────────
  let actionInFlight = $state<ScenarioAction | null>(null)
  let actionMessage = $state<string | null>(null)
  let actionOk = $state(true)

  async function handleAction(action: ScenarioAction): Promise<void> {
    actionInFlight = action
    actionMessage = null
    try {
      const r = await api.runAction(component.id, action)
      actionOk = r.ok
      actionMessage = r.ok
        ? `${action} ${r.pm2Name ?? component.id} ✓`
        : `${action} failed: ${r.error ?? 'unknown'}${r.details ? ` (${r.details})` : ''}`
    } catch (error) {
      actionOk = false
      actionMessage = `network error: ${(error as Error).message}`
    } finally {
      actionInFlight = null
    }
  }

  // ── auto-start ───────────────────────────────────────────────
  // svelte-ignore state_referenced_locally
  let autoStartOn = $state(autoStart)
  $effect(() => {
    autoStartOn = autoStart
  })
  async function handleAutoStart(next: boolean): Promise<void> {
    if (api.setAutoStart === undefined) return
    await api.setAutoStart(component.id, next).catch(() => {})
  }

  // ── scenarios (polled background jobs) ───────────────────────
  let scenarioInFlight = $state<string | null>(null)
  let scenarioRunId = $state<string | null>(null)
  let scenarioRun = $state<ScenarioRun | null>(null)
  let scenarioError = $state<string | null>(null)
  let scenarioTimer = $state<ReturnType<typeof setInterval> | null>(null)
  const SCENARIO_POLL_MS = 1_500
  const scenarioSteps = $derived(stepViews(scenarioRun))

  function stopScenarioPoll(): void {
    if (scenarioTimer !== null) {
      clearInterval(scenarioTimer)
      scenarioTimer = null
    }
  }

  async function pollScenario(): Promise<void> {
    if (scenarioRunId === null) return
    try {
      const r = await api.getScenarioRun(scenarioRunId)
      if (r.ok && r.run.runId === scenarioRunId) {
        scenarioRun = r.run
        if (isTerminal(r.run)) {
          scenarioInFlight = null
          stopScenarioPoll()
        }
      }
    } catch {
      // best-effort poll
    }
  }

  async function handleScenario(sid: string): Promise<void> {
    stopScenarioPoll()
    scenarioInFlight = sid
    scenarioRun = null
    scenarioRunId = null
    scenarioError = null
    try {
      const accepted = await api.runScenario(sid)
      if (!accepted.ok) {
        scenarioError = accepted.error
        scenarioInFlight = null
        return
      }
      scenarioRunId = accepted.runId
      scenarioTimer = setInterval(() => void pollScenario(), SCENARIO_POLL_MS)
    } catch (error) {
      scenarioError = `network error: ${(error as Error).message}`
      scenarioInFlight = null
    }
  }

  $effect(() => () => stopScenarioPoll())

  // ── logs ─────────────────────────────────────────────────────
  let logsOpen = $state(false)
  let logsLoading = $state(false)
  let logsResult = $state<LogsResult | null>(null)
  let logsTimer = $state<ReturnType<typeof setInterval> | null>(null)
  const LOGS_POLL_MS = 3_000
  const LOG_LINES = 200

  async function refreshLogs(): Promise<void> {
    logsLoading = true
    try {
      logsResult = await api.fetchLogs(component.id, LOG_LINES)
    } catch (error) {
      logsResult = { ok: false, error: `network error: ${(error as Error).message}` }
    } finally {
      logsLoading = false
    }
  }

  function toggleLogs(): void {
    logsOpen = !logsOpen
    if (logsOpen) {
      void refreshLogs()
      logsTimer = setInterval(() => void refreshLogs(), LOGS_POLL_MS)
    } else if (logsTimer !== null) {
      clearInterval(logsTimer)
      logsTimer = null
    }
  }

  $effect(() => () => {
    if (logsTimer !== null) clearInterval(logsTimer)
  })

  function fmtAgo(ts: number | undefined): string {
    if (!ts) return 'never'
    const s = Math.floor((Date.now() - ts) / 1000)
    if (s < 60) return `${s}s ago`
    if (s < 3600) return `${Math.floor(s / 60)}m ago`
    return `${Math.floor(s / 3600)}h ago`
  }

  const ACTION_VARIANT: Record<ScenarioAction, 'primary' | 'ghost' | 'danger'> = {
    start: 'primary',
    stop: 'danger',
    restart: 'ghost',
  }
  const STATUS_VARIANT: Record<string, 'success' | 'warn' | 'danger' | 'neutral'> = {
    up: 'success',
    degraded: 'warn',
    down: 'danger',
    unknown: 'neutral',
  }

  const detailsRows = $derived.by(() => {
    const rows: { label: string; value: string }[] = [
      { label: 'id', value: component.id },
      { label: 'kind', value: component.kind },
      { label: 'health', value: component.health.kind },
    ]
    if (component.health.kind === 'pm2') rows.push({ label: 'pm2', value: component.health.name })
    else if (component.health.kind === 'http') rows.push({ label: 'url', value: component.health.url })
    else if (component.health.kind === 'docker')
      rows.push({ label: 'container', value: component.health.name })
    else if (component.health.kind === 'adb')
      rows.push({ label: 'serial', value: component.health.serial })
    if (result.latencyMs !== undefined) rows.push({ label: 'latency', value: `${result.latencyMs} ms` })
    rows.push({ label: 'last up', value: fmtAgo(result.lastSuccessfulAt) })
    if (result.message) rows.push({ label: 'message', value: result.message })
    if (component.upstreams.length > 0)
      rows.push({ label: 'upstreams', value: component.upstreams.join(', ') })
    return rows
  })

  const resultDetailsRows = $derived(
    result.details ? Object.entries(result.details).map(([k, v]) => ({ label: k, value: v })) : [],
  )
</script>

<aside
  class="fixed bottom-0 right-0 top-12 z-10 flex w-[420px] max-w-[92vw] flex-col border-l border-border-2 bg-bg-1 shadow-modal"
  data-testid="fleet-drilldown"
>
  <header
    class="flex shrink-0 items-start justify-between gap-2 border-b border-border-1 px-4 py-3.5"
  >
    <div class="min-w-0">
      <div class="text-[10px] font-semibold uppercase tracking-[0.08em] text-text-3">
        {component.zone} · {component.kind}
      </div>
      <h3 class="mt-1 truncate text-15 font-semibold text-text-1">{component.label}</h3>
      <div class="mt-0.5 font-mono text-11 text-text-4">{component.id}</div>
    </div>
    <div class="flex shrink-0 items-center gap-2">
      <Pill variant={STATUS_VARIANT[result.status] ?? 'neutral'}>{result.status}</Pill>
      <IconButton title="Close" aria-label="close panel" onclick={onClose}>×</IconButton>
    </div>
  </header>

  <div class="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
    {#if openUrl}
      <Card>
        <h4 class="m-0 text-11 font-semibold uppercase tracking-[0.08em] text-text-3">Open</h4>
        <a
          href={openUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="drilldown-open-url"
          class="mt-1.5 inline-flex max-w-full items-center gap-2 rounded-md border border-border-2 bg-bg-2 px-3 py-1.5 text-12 text-text-1 transition-colors hover:border-status-info/40 hover:bg-row-hover"
          aria-label={`Open ${component.label} in a new tab`}
        >
          <span class="truncate font-mono">{openUrl}</span>
        </a>
      </Card>
    {/if}

    {#if canAct}
      <Card>
        <h4 class="m-0 text-11 font-semibold uppercase tracking-[0.08em] text-text-3">Actions</h4>
        <div class="flex flex-wrap gap-1.5">
          {#each ['start', 'stop', 'restart'] as action (action)}
            <Button
              variant={ACTION_VARIANT[action as ScenarioAction]}
              disabled={actionInFlight !== null}
              onclick={() => handleAction(action as ScenarioAction)}
            >
              {actionInFlight === action ? '…' : action}
            </Button>
          {/each}
        </div>
        {#if controlName}
          <div class="mt-1.5 text-11 text-text-3">
            target: <code class="rounded bg-bg-2 px-1.5 py-0.5">{controlName}</code>
          </div>
        {/if}
        {#if canAutoStart}
          <label class="mt-2 flex items-center gap-2 text-12 text-text-2">
            <Toggle
              on={autoStartOn}
              ariaLabel={`Auto-start ${component.label}`}
              ontoggle={(v) => handleAutoStart(v)}
            />
            <span>Auto-start on boot</span>
          </label>
        {/if}
        {#if actionMessage}
          <div class="mt-2"><Alert variant={actionOk ? 'success' : 'danger'}>{actionMessage}</Alert></div>
        {/if}
      </Card>
    {/if}

    {#if scenarios.length > 0}
      <Card>
        <AccordionItem
          title={component.scenariosLabel ?? 'Scenarios'}
          defaultOpen={scenarioInFlight !== null || scenarioRun !== null || scenarioError !== null}
        >
          {#each scenarios as s (s.id)}
            <div class="mt-1">
              <Button variant="ghost" disabled={scenarioInFlight !== null} onclick={() => handleScenario(s.id)}>
                {scenarioInFlight === s.id ? '…' : s.label}
              </Button>
            </div>
            {#if s.description}
              <div class="mt-1 text-11 text-text-3">{s.description}</div>
            {/if}
          {/each}
          {#if scenarioError}
            <div class="mt-2.5"><Alert variant="danger">scenario failed to start: {scenarioError}</Alert></div>
          {/if}
          {#if scenarioRun}
            <div class="mt-2.5">
              <Alert variant={stateVariant(scenarioRun.state)}>
                {stateLabel(scenarioRun.state, scenarioRun.steps.length)}
              </Alert>
            </div>
            {#if scenarioSteps.length > 0}
              <ul class="m-0 mt-2 list-none p-0 font-mono text-11">
                {#each scenarioSteps as st, i (i)}
                  <li
                    class="grid border-b border-border-2 py-1 last:border-b-0"
                    style="grid-template-columns: 100px 1fr 60px; gap: 8px;"
                  >
                    <span class={st.ok ? 'text-status-success' : 'text-status-danger'}>{st.kind}</span>
                    <span class="truncate text-text-3">{st.message}</span>
                    <span class="text-right text-text-3 tabular-nums">{Math.round(st.durationMs)}ms</span>
                  </li>
                {/each}
              </ul>
            {/if}
          {/if}
        </AccordionItem>
      </Card>
    {/if}

    {#if extra}{@render extra()}{/if}

    {#if resultDetailsRows.length > 0}
      <Card>
        <h4 class="m-0 text-11 font-semibold uppercase tracking-[0.08em] text-text-3">Details</h4>
        <KVTable rows={resultDetailsRows} caption={`Live status details for ${component.label}`} />
      </Card>
    {/if}

    <Card>
      <KVTable rows={detailsRows} caption={`Topology for ${component.label}`} />
    </Card>

    {#if canAct}
      <Card>
        <Button variant="ghost" onclick={toggleLogs}>
          {logsOpen ? '▼ Hide logs' : '▶ Show logs'}
          {#if logsLoading}<span class="ml-1.5 text-text-3">…</span>{/if}
        </Button>
        {#if logsOpen && logsResult}
          {#if !logsResult.ok}
            <div class="mt-2">
              <Alert variant="danger">{logsResult.error}{logsResult.details ? ` — ${logsResult.details}` : ''}</Alert>
            </div>
          {:else}
            {@const hasOut = (logsResult.out?.lines.length ?? 0) > 0}
            {@const hasErr = (logsResult.err?.lines.length ?? 0) > 0}
            {#if logsResult.out}
              <details class="mt-2" open={hasOut || !hasErr}>
                <summary class="cursor-pointer select-none text-11 text-text-3">
                  stdout · <code class="rounded bg-bg-2 px-1.5 py-0.5">{logsResult.out.path}</code>{hasOut ? '' : ' · empty'}
                </summary>
                <pre class="mt-1.5 max-h-72 overflow-auto rounded-md border border-border-2 bg-bg-page px-2.5 py-2 text-11 leading-[1.4]">{hasOut
                    ? logsResult.out.lines.join('\n')
                    : '(empty — many CLIs log everything to stderr by convention)'}</pre>
              </details>
            {/if}
            {#if logsResult.err}
              <details class="mt-2" open={hasErr}>
                <summary class="cursor-pointer select-none text-11 text-text-3">
                  stderr · <code class="rounded bg-bg-2 px-1.5 py-0.5">{logsResult.err.path}</code>{hasErr ? '' : ' · empty'}
                </summary>
                <pre class="mt-1.5 max-h-72 overflow-auto rounded-md border border-border-2 bg-bg-page px-2.5 py-2 text-11 leading-[1.4]">{hasErr ? logsResult.err.lines.join('\n') : '(empty)'}</pre>
              </details>
            {/if}
          {/if}
        {/if}
      </Card>
    {/if}

    {#if component.description}
      <p class="m-0 text-13 leading-[1.5] text-text-3">{component.description}</p>
    {/if}
  </div>
</aside>
