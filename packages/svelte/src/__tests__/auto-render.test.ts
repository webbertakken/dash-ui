import { cleanup, render } from '@testing-library/svelte'
import { describe, it, expect, afterEach } from 'vitest'
import { BUNDLES, COMPONENT_NAMES } from '../../test-fixtures/props.js'
import * as U from '../lib/index.js'

afterEach(() => {
  cleanup()
})

describe('@w5-ui/svelte auto-render fixtures', () => {
  it('exports a fixture for every public component', () => {
    const exported = Object.entries(U)
      .filter(([k, v]) => /^[A-Z]/.test(k) && typeof v === 'function')
      .map(([k]) => k)
    const known = new Set(COMPONENT_NAMES)
    // Allow Toaster as alias for Toast
    const aliases: Record<string, string> = { Toaster: 'Toast' }
    const missing = exported.filter((name) => {
      const target = aliases[name] ?? name
      return !known.has(target)
    })
    expect(missing).toEqual([])
  })

  for (const name of COMPONENT_NAMES) {
    const variants = BUNDLES[name]!
    // Map fixture name -> Svelte component (handle alias: Toast -> Toaster)
    const aliasOut: Record<string, string> = { Toast: 'Toaster' }
    const exportName = aliasOut[name] ?? name
    const Component = (U as unknown as Record<string, unknown>)[exportName]
    if (typeof Component !== 'function') continue
    describe(name, () => {
      for (const variant of variants) {
        it(`renders ${variant.name}`, () => {
          // @ts-expect-error - dynamic component, props are loosely typed
          const { container } = render(Component, { props: variant.props ?? {} })
          expect(container).toBeTruthy()
        })
      }
    })
  }
})
