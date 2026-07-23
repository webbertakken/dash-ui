import { describe, expect, it } from 'vitest'
import { isTerminal, stateLabel, stateVariant, stepViews } from './scenario-progress.ts'
import type { ScenarioRun } from './types.ts'

function run(over: Partial<ScenarioRun> = {}): ScenarioRun {
  return { runId: 'r', scenarioId: 's', state: 'running', steps: [], ...over }
}

describe('isTerminal', () => {
  it('is false while running, true once done or failed', () => {
    expect(isTerminal(run({ state: 'running' }))).toBe(false)
    expect(isTerminal(run({ state: 'done' }))).toBe(true)
    expect(isTerminal(run({ state: 'failed' }))).toBe(true)
  })
})

describe('stateLabel', () => {
  it('describes each state', () => {
    expect(stateLabel('running', 2)).toMatch(/running/)
    expect(stateLabel('running', 2)).toMatch(/2 step/)
    expect(stateLabel('done', 3)).toMatch(/completed/)
    expect(stateLabel('failed', 1)).toMatch(/failed/)
  })
})

describe('stateVariant', () => {
  it('maps each state to an alert variant', () => {
    expect(stateVariant('running')).toBe('info')
    expect(stateVariant('done')).toBe('success')
    expect(stateVariant('failed')).toBe('danger')
  })
})

describe('stepViews', () => {
  it('returns the steps, tolerant of null', () => {
    expect(stepViews(null)).toEqual([])
    const steps = [{ kind: 'pm2-start', ok: true, durationMs: 10 }]
    expect(stepViews(run({ steps }))).toEqual(steps)
  })
})
