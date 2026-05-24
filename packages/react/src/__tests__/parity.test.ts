/**
 * Cross-package parity check between `@w5-ui/svelte` and `@w5-ui/react`.
 *
 * The Svelte package is the source of truth. Every component exported
 * from `packages/svelte/src/lib/index.ts` MUST also be exported from
 * `packages/react/src/index.ts`, otherwise consumers picking the
 * React build silently lose primitives.
 *
 * The reverse direction (React-only names) is allowed — React
 * occasionally ships convenience wrappers that don't have a Svelte
 * counterpart yet (e.g. `RowToggleList`, `DEFAULT_APPS`,
 * `COLOR_SWATCHES`). We list those explicitly so a new React-only
 * export is a deliberate decision, not an accident.
 */

import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const SVELTE_INDEX = path.resolve(HERE, '../../../svelte/src/lib/index.ts')
const REACT_INDEX = path.resolve(HERE, '../index.ts')

/** Extract every name exposed by an `export { default as X } from ...` line. */
function extractSvelteExports(src: string): Set<string> {
  const out = new Set<string>()
  for (const m of src.matchAll(/default as ([A-Z][A-Za-z0-9]*)/g)) out.add(m[1]!)
  return out
}

/** Collect every uppercase value/function exported from each component
 *  file referenced by `export * from './components/X.js'` lines. We can't
 *  just parse the index.ts because React uses re-exports, so the actual
 *  names live in component files. */
function extractReactExports(src: string): Set<string> {
  const out = new Set<string>()
  const componentsDir = path.resolve(HERE, '../components')
  for (const m of src.matchAll(/export \* from '\.\/components\/([A-Za-z0-9]+)\.js'/g)) {
    const fname = m[1]!
    const file = path.join(componentsDir, `${fname}.tsx`)
    let body = ''
    try {
      body = readFileSync(file, 'utf8')
    } catch {
      continue
    }
    // Allow `_` in identifier names so constant data exports like
    // `DEFAULT_APPS` and `COLOR_SWATCHES` aren't truncated to their
    // leading run of uppercase letters by the regex.
    for (const mm of body.matchAll(/export\s+(?:function|const|class)\s+([A-Z][A-Za-z0-9_]*)/g)) {
      out.add(mm[1]!)
    }
  }
  return out
}

/**
 * React-only names that are intentional. Adding to this list must be a
 * conscious decision (please document the reason inline).
 */
const REACT_ONLY_ALLOWED = new Set<string>([
  'DEFAULT_APPS', // sample Topbar config (constant data)
  'COLOR_SWATCHES', // sample ColorPicker palette (constant data)
  'RowToggleList', // convenience wrapper over RowToggle; ports to Svelte tracked
])

describe('@w5-ui/react vs @w5-ui/svelte component parity', () => {
  const svelteExports = extractSvelteExports(readFileSync(SVELTE_INDEX, 'utf8'))
  const reactExports = extractReactExports(readFileSync(REACT_INDEX, 'utf8'))

  it('exports every Svelte primitive in React', () => {
    const missing = [...svelteExports].filter((name) => !reactExports.has(name)).sort()
    expect(missing).toEqual([])
  })

  it('React-only exports are on the allow-list', () => {
    const reactOnly = [...reactExports].filter((name) => !svelteExports.has(name)).sort()
    const unexpected = reactOnly.filter((name) => !REACT_ONLY_ALLOWED.has(name))
    expect(unexpected).toEqual([])
  })
})
