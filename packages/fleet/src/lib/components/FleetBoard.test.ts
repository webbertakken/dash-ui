// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/svelte'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { COMPONENTS, GROUPS, statusMap } from '../test-fixtures.ts'
import FleetBoard from './FleetBoard.svelte'

// Stub SvelteFlow to passthrough stubs so the board mounts under jsdom
// without a real graph runtime. Node building is covered by the pure
// topology-layout tests; here we assert the board shell renders.
// The SvelteFlow stub records the props the board hands it.
const flow = vi.hoisted(() => ({ props: undefined as Record<string, unknown> | undefined }))

vi.mock('@xyflow/svelte', async () => {
  const Noop = (await import('../testkit/Noop.svelte')).default
  return {
    Background: Noop,
    Controls: Noop,
    MiniMap: Noop,
    SvelteFlow: (anchor: unknown, props: Record<string, unknown>) => {
      flow.props = props
      return (Noop as unknown as (a: unknown, p: unknown) => unknown)(anchor, props)
    },
    Handle: Noop,
    Position: { Top: 'top', Bottom: 'bottom' },
  }
})

afterEach(() => cleanup())

describe('FleetBoard', () => {
  it('renders the board shell with the pan/zoom hint', () => {
    const { getByTestId } = render(FleetBoard, {
      props: { components: COMPONENTS, groups: GROUPS, statusFor: statusMap() },
    })
    expect(getByTestId('fleet-board').textContent).toMatch(/scroll/)
  })

  it('can hide the hint', () => {
    const { getByTestId } = render(FleetBoard, {
      props: { components: COMPONENTS, groups: GROUPS, statusFor: statusMap(), hint: false },
    })
    expect(getByTestId('fleet-board').textContent).not.toMatch(/scroll/)
  })

  it('frames the graph with a percentage fit-view padding', () => {
    render(FleetBoard, {
      props: { components: COMPONENTS, groups: GROUPS, statusFor: statusMap() },
    })

    // A bare number is read as pixels, which would frame the graph flush to the edges.
    expect(flow.props?.['fitViewOptions']).toEqual({ padding: '3.7%' })
  })

  it('mounts without throwing when a display clamp is supplied', () => {
    const { getByTestId } = render(FleetBoard, {
      props: {
        components: COMPONENTS,
        groups: GROUPS,
        statusFor: statusMap({ a1: 'down' }),
        displayStatusFor: () => 'unknown',
      },
    })
    expect(getByTestId('fleet-board')).toBeTruthy()
  })
})
