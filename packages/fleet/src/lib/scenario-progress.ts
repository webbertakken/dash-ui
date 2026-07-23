/**
 * Pure helpers for rendering a scenario run's progress. Kept out of the
 * Svelte component so every branch is unit-testable.
 */

import type { ScenarioRun, ScenarioRunState, ScenarioStepView } from './types.ts'

/** A run is terminal once it is no longer `running`. */
export function isTerminal(run: Pick<ScenarioRun, 'state'>): boolean {
  return run.state !== 'running'
}

/** Human label for a run state. */
export function stateLabel(state: ScenarioRunState, stepCount: number): string {
  if (state === 'running') return `running… ${stepCount} step(s) done`
  if (state === 'done') return 'scenario completed'
  return 'scenario failed'
}

/** Alert variant for a run state. */
export function stateVariant(state: ScenarioRunState): 'info' | 'success' | 'danger' {
  if (state === 'running') return 'info'
  if (state === 'done') return 'success'
  return 'danger'
}

/** The per-step rows to render, tolerant of a null/absent run. */
export function stepViews(run: ScenarioRun | null): ScenarioStepView[] {
  return run?.steps ?? []
}
