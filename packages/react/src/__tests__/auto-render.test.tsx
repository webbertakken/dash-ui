import { cleanup, render } from '@testing-library/react'
import { describe, it, expect, afterEach } from 'vitest'
import { ALL_COMPONENTS, FIXTURES } from '../../test-fixtures/fixtures.js'
import * as U from '../index.js'

afterEach(() => {
  cleanup()
})

describe('@w5-ui/react auto-render fixtures', () => {
  it('exports a fixture for every public component', () => {
    const exported = Object.entries(U)
      .filter(([k, v]) => /^[A-Z]/.test(k) && typeof v === 'function')
      .map(([k]) => k)
    const known = new Set(ALL_COMPONENTS)
    const missing = exported.filter((name) => !known.has(name))
    // We only require fixtures for the 168-ish render components. Hooks and
    // non-component utilities are filtered out by the typeof === 'function'
    // check above + the component filter applied per-fixture.
    expect(missing).toEqual([])
  })

  for (const name of ALL_COMPONENTS) {
    const variants = FIXTURES[name]!
    describe(name, () => {
      for (const variant of variants) {
        it(`renders ${variant.name}`, () => {
          const result = render(<>{variant.node}</>)
          expect(result.container).toBeTruthy()
        })
      }
    })
  }
})
