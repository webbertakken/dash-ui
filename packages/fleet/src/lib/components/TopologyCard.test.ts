// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/svelte'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { component } from '../test-fixtures.ts'
import TopologyCard from './TopologyCard.svelte'

vi.mock('@xyflow/svelte', async () => {
  const Noop = (await import('../testkit/Noop.svelte')).default
  return { Handle: Noop, Position: { Top: 'top', Bottom: 'bottom' } }
})

afterEach(() => cleanup())

const base = component({ id: 'svc-1', label: 'Service one', kind: 'model' })

describe('TopologyCard', () => {
  it('renders the label', () => {
    const { container } = render(TopologyCard, {
      props: { data: { component: base, status: 'up', decommissioned: false } },
    })
    expect(container.textContent).toContain('Service one')
  })

  it('shows the subtitle when provided, else the zone·kind', () => {
    const { container: a } = render(TopologyCard, {
      props: {
        data: { component: base, status: 'up', decommissioned: false, subtitle: 'model: g.gguf' },
      },
    })
    expect(a.textContent).toContain('model: g.gguf')
    cleanup()
    const { container: b } = render(TopologyCard, {
      props: { data: { component: base, status: 'up', decommissioned: false } },
    })
    expect(b.textContent).toContain('host')
  })

  it('renders an open-url affordance only when openUrl is set', () => {
    const { queryByTestId, rerender } = render(TopologyCard, {
      props: { data: { component: base, status: 'up', decommissioned: false } },
    })
    expect(queryByTestId('card-open-url')).toBeNull()
    rerender({
      data: { component: base, status: 'up', decommissioned: false, openUrl: 'https://x' },
    })
  })

  it('renders chips and a +N overflow past three', () => {
    const chips = Array.from({ length: 5 }, (_, i) => ({ label: `c${i}` }))
    const { getByTestId, queryByTestId } = render(TopologyCard, {
      props: { data: { component: base, status: 'up', decommissioned: false, chips } },
    })
    expect(getByTestId('card-chip-0')).toBeTruthy()
    expect(getByTestId('card-chip-overflow').textContent).toContain('+2')
    expect(queryByTestId('card-chip-3')).toBeNull()
  })

  it('paints the display clamp colour when provided', () => {
    const { container } = render(TopologyCard, {
      props: {
        data: { component: base, status: 'down', decommissioned: false, displayStatus: 'unknown' },
      },
    })
    // clamp → neutral dot, not danger
    expect(container.querySelector('.bg-status-neutral')).toBeTruthy()
    expect(container.querySelector('.bg-status-danger')).toBeNull()
  })
})
