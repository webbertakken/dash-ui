// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/svelte'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { COMPONENTS, GROUPS, statusMap } from '../test-fixtures.ts'
import FleetBoard from './FleetBoard.svelte'

// Stub SvelteFlow to passthrough stubs so the board mounts under jsdom
// without a real graph runtime. Node building is covered by the pure
// topology-layout tests; here we assert the board shell renders.
vi.mock('@xyflow/svelte', async () => {
  const Noop = (await import('../testkit/Noop.svelte')).default
  return {
    Background: Noop,
    Controls: Noop,
    MiniMap: Noop,
    SvelteFlow: Noop,
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
