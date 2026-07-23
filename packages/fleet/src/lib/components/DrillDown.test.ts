// @vitest-environment jsdom
import { cleanup, fireEvent, render, waitFor } from '@testing-library/svelte'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { FleetApi } from '../fleet-api.ts'
import { component } from '../test-fixtures.ts'
import type { CheckResult } from '../types.ts'
import DrillDown from './DrillDown.svelte'

afterEach(() => cleanup())

function fakeApi(over: Partial<FleetApi> = {}): FleetApi {
  return {
    fetchStatus: vi.fn().mockResolvedValue(null),
    runAction: vi.fn().mockResolvedValue({ ok: true, pm2Name: 'p' }),
    fetchLogs: vi.fn().mockResolvedValue({ ok: true, out: { path: '/o', lines: ['hi'] } }),
    runScenario: vi.fn().mockResolvedValue({ ok: true, runId: 'r1' }),
    getScenarioRun: vi.fn().mockResolvedValue({
      ok: true,
      run: { runId: 'r1', scenarioId: 's1', state: 'done', steps: [] },
    }),
    ...over,
  }
}

const pm2Comp = component({
  id: 'svc',
  label: 'Service',
  health: { kind: 'pm2', name: 'svc-proc' },
})
const staticComp = component({
  id: 'store',
  label: 'Store',
  kind: 'storage',
  health: { kind: 'static' },
})
const up: CheckResult = { status: 'up', lastSuccessfulAt: Date.now() }

describe('DrillDown', () => {
  it('renders header identity + status pill', () => {
    const { getByTestId } = render(DrillDown, {
      props: { component: pm2Comp, result: up, api: fakeApi(), onClose: () => {} },
    })
    const el = getByTestId('fleet-drilldown')
    expect(el.textContent).toContain('Service')
    expect(el.textContent).toContain('svc')
  })

  it('shows action buttons for a controllable component and calls runAction', async () => {
    const api = fakeApi()
    const { getByText } = render(DrillDown, {
      props: { component: pm2Comp, result: up, api, onClose: () => {} },
    })
    await fireEvent.click(getByText('restart'))
    expect(api.runAction).toHaveBeenCalledWith('svc', 'restart')
  })

  it('hides actions for a non-controllable static component', () => {
    const { queryByText } = render(DrillDown, {
      props: { component: staticComp, result: up, api: fakeApi(), onClose: () => {} },
    })
    expect(queryByText('restart')).toBeNull()
  })

  it('renders the auto-start toggle only when the capability exists', () => {
    const withCap = component({
      id: 'svc',
      label: 'Service',
      health: { kind: 'pm2', name: 'svc-proc' },
      canAutoStart: true,
    })
    const { getByLabelText } = render(DrillDown, {
      props: {
        component: withCap,
        result: up,
        api: fakeApi({ setAutoStart: vi.fn().mockResolvedValue({ ok: true }) }),
        onClose: () => {},
      },
    })
    expect(getByLabelText('Auto-start Service')).toBeTruthy()
  })

  it('omits the auto-start toggle when the api lacks the capability', () => {
    const withCap = component({
      id: 'svc',
      label: 'Service',
      health: { kind: 'pm2', name: 'svc-proc' },
      canAutoStart: true,
    })
    const { queryByLabelText } = render(DrillDown, {
      props: { component: withCap, result: up, api: fakeApi(), onClose: () => {} },
    })
    expect(queryByLabelText('Auto-start Service')).toBeNull()
  })

  it('runs a scenario and reflects its terminal state', async () => {
    vi.useFakeTimers()
    try {
      const api = fakeApi()
      const scenarios = [{ id: 's1', label: 'Do it', attachedTo: 'svc' }]
      const { getByText, getByTestId } = render(DrillDown, {
        props: { component: pm2Comp, result: up, scenarios, api, onClose: () => {} },
      })
      await fireEvent.click(getByText('Scenarios'))
      await fireEvent.click(getByText('Do it'))
      expect(api.runScenario).toHaveBeenCalledWith('s1')
      // First poll lands at 1.5s and flips the run to its terminal state.
      await vi.advanceTimersByTimeAsync(1600)
      expect(getByTestId('fleet-drilldown').textContent).toMatch(/completed/)
    } finally {
      vi.useRealTimers()
    }
  })

  it('opens logs and tails them', async () => {
    const api = fakeApi()
    const { getByText } = render(DrillDown, {
      props: { component: pm2Comp, result: up, api, onClose: () => {} },
    })
    await fireEvent.click(getByText(/Show logs/))
    await waitFor(() => expect(api.fetchLogs).toHaveBeenCalledWith('svc', 200))
  })

  it('renders an extra section snippet and an open-url card', () => {
    const withUrl = component({ id: 'web', label: 'Web', kind: 'app', webUrl: 'https://w' })
    const { getByTestId } = render(DrillDown, {
      props: {
        component: withUrl,
        result: up,
        api: fakeApi(),
        openUrl: 'https://w',
        onClose: () => {},
      },
    })
    expect(getByTestId('drilldown-open-url').getAttribute('href')).toBe('https://w')
  })

  it('close button fires onClose', async () => {
    const onClose = vi.fn()
    const { getByLabelText } = render(DrillDown, {
      props: { component: pm2Comp, result: up, api: fakeApi(), onClose },
    })
    await fireEvent.click(getByLabelText('close panel'))
    expect(onClose).toHaveBeenCalled()
  })
})
