#!/usr/bin/env tsx
/**
 * Fourth pass: subtle white tints used as elevation cues
 * (`bg-white/[0.02]`, `bg-white/[0.03]`, `bg-white/[0.12]`). All of
 * these vanish on a white page bg; replace with the motif-aware
 * `--divider` (close match in dark, `#ececee` in light) or `--depthBg-3`
 * for the slightly stronger rail.
 *
 * Run:  npx tsx scripts/motif-sweep-subtle.ts
 */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const COMPONENTS_DIR = 'packages/svelte/src/lib/components'

const SUBSTITUTIONS: Array<[string, string]> = [
  ['bg-white/[0.02]', 'bg-divider'],
  ['bg-white/[0.03]', 'bg-divider'],
  ['bg-white/[0.12]', 'bg-bg-3'],
  ['border-white/[0.03]', 'border-divider'],
  ['border-white/[0.04]', 'border-divider'],
  ['border-white/[0.14]', 'border-border-3'],
]

function transform(src: string): { out: string; hits: number } {
  let out = src
  let hits = 0
  for (const [from, to] of SUBSTITUTIONS) {
    const before = out
    out = out.split(from).join(to)
    if (out !== before) hits += 1
  }
  return { out, hits }
}

function main(): void {
  const files = readdirSync(COMPONENTS_DIR).filter((f) => f.endsWith('.svelte'))
  let touched = 0
  for (const f of files) {
    const path = join(COMPONENTS_DIR, f)
    const src = readFileSync(path, 'utf8')
    const { out, hits } = transform(src)
    if (out !== src) {
      writeFileSync(path, out)
      touched += 1
      console.log(`  ${f}  (${hits} substitution${hits === 1 ? '' : 's'})`)
    }
  }
  console.log(`\nTotal files touched: ${touched}`)
}

main()
