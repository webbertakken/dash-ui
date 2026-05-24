/**
 * Cross-package parity check between `@w5-ui/svelte` and `@w5-ui/wc`.
 *
 * Every component exported by Svelte's public index MUST have a
 * matching custom-element wrapper in `packages/wc/src/elements/`,
 * so consumers using vanilla HTML never silently lose primitives
 * the Svelte / React peers expose.
 *
 * The wrapper file is allowed to use a different basename than the
 * Svelte index export (e.g. `Toast.svelte` exports `Toaster`); we
 * accept either match.
 */

import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const SVELTE_INDEX = path.resolve(HERE, '../../../svelte/src/lib/index.ts')
const ELEMENTS_DIR = path.resolve(HERE, '../elements')
const SVELTE_COMPONENTS_DIR = path.resolve(HERE, '../../../svelte/src/lib/components')

/** Public Svelte index — `export { default as X, ...} from './components/Y.svelte'`. */
interface SvelteEntry {
  exportName: string
  componentFile: string
}
function extractSvelteEntries(src: string): SvelteEntry[] {
  const out: SvelteEntry[] = []
  // Bound the gap between `as <Name>` and the `from '...'` clause with
  // `[^']*` ("any non-quote") instead of `[^;]*` — the index file uses
  // semicolon-less ESM exports, so the latter is greedy across lines.
  for (const m of src.matchAll(
    /default as ([A-Z][A-Za-z0-9]*)[^']*'\.\/components\/([A-Za-z0-9]+)\.svelte'/g,
  )) {
    out.push({ exportName: m[1]!, componentFile: m[2]! })
  }
  return out
}

/** WC wrappers we ship — one custom element per `<X>.wc.svelte` file. */
function extractWrappedNames(): Set<string> {
  const out = new Set<string>()
  for (const f of readdirSync(ELEMENTS_DIR)) {
    if (!f.endsWith('.wc.svelte')) continue
    out.add(f.replace(/\.wc\.svelte$/, ''))
  }
  return out
}

/**
 * Components we deliberately don't ship as a custom element. Each
 * entry must come with a one-line reason; entries without a reason
 * are removed on the next sweep.
 *
 * Sub-components that are pure recursion helpers used internally by
 * a parent (TreeItem inside TreeView) are NOT consumer-facing and
 * stay skipped. AccordionItem used to live here but was added to the
 * WC build because it's a real composition primitive in userland.
 */
const SKIP: Record<string, string> = {
  TreeItem: 'recursive helper used internally by TreeView; not a userland primitive',
}

describe('@w5-ui/wc vs @w5-ui/svelte component parity', () => {
  it('exports a custom-element wrapper for every Svelte primitive', () => {
    const wrapped = extractWrappedNames()
    const svelteEntries = extractSvelteEntries(readFileSync(SVELTE_INDEX, 'utf8'))

    // A Svelte export is satisfied if either:
    //   (a) its component-file basename has a WC wrapper, OR
    //   (b) its export name has a WC wrapper (handles renames like
    //       Toast.svelte exporting `Toaster`).
    const missing = svelteEntries
      .filter((e) => !SKIP[e.exportName] && !SKIP[e.componentFile])
      .filter((e) => !wrapped.has(e.exportName) && !wrapped.has(e.componentFile))
      .map((e) => e.exportName)
      .sort()
    expect(missing).toEqual([])
  })

  it('every skipped component documents a reason and still exists in Svelte', () => {
    for (const [name, reason] of Object.entries(SKIP)) {
      expect(reason.length).toBeGreaterThan(20)
      // Either it lives as a real Svelte component file, or it's a
      // sub-component re-exported from a parent — both are valid;
      // the check is that the SKIP entry isn't stale.
      let exists = false
      try {
        readFileSync(path.join(SVELTE_COMPONENTS_DIR, `${name}.svelte`), 'utf8')
        exists = true
      } catch {
        // not a file; allow sub-components that are inline exports
        exists = readFileSync(SVELTE_INDEX, 'utf8').includes(name)
      }
      expect(exists, `SKIP entry "${name}" should still exist in Svelte`).toBe(true)
    }
  })
})
