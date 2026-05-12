import * as React from 'react'
import { renderToString } from 'react-dom/server'
import { describe, it, expect } from 'vitest'
import { ALL_COMPONENTS, FIXTURES } from '../../test-fixtures/fixtures.js'

// Components that legitimately need a DOM at first render. We assert they
// render successfully on the client (covered by auto-render.test.tsx) and
// document them as needing client-only mounting in SSR contexts.
const SKIP_SSR = new Set<string>([])

describe('@w5-ui/react SSR (renderToString) smoke', () => {
  for (const name of ALL_COMPONENTS) {
    if (SKIP_SSR.has(name)) continue
    const variants = FIXTURES[name]!
    describe(name, () => {
      for (const variant of variants) {
        it(`SSRs ${variant.name}`, () => {
          const html = renderToString(
            React.createElement(React.Fragment, null, variant.node as React.ReactNode),
          )
          expect(typeof html).toBe('string')
        })
      }
    })
  }
})
