#!/usr/bin/env tsx
/**
 * Third pass of the motif sweep: catch the long tail of hardcoded
 * arbitrary-value classes that the first two passes don't cover.
 *
 * Popover / dropdown surfaces, code-block headers, menubars, tooltips,
 * the Signal weak-bar greys, and the Banner / Callout paler status
 * text variants. Every entry has been hand-checked to be safe in both
 * motifs.
 *
 * Run:  npx tsx scripts/motif-sweep-extras.ts
 */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const COMPONENTS_DIR = 'packages/svelte/src/lib/components'

const SUBSTITUTIONS: Array<[string, string]> = [
  // Popover / dropdown surface chrome (was #1a1a1c ≈ depthBg-2)
  ['bg-[#1a1a1c]', 'bg-bg-2'],
  ['bg-[#1f2329]', 'bg-bg-2'],
  ['bg-[#1e2028]', 'bg-bg-2'],
  ['bg-[#111113]', 'bg-bg-page'],
  ['bg-[#2a2a2c]', 'bg-bg-3'],
  ['border-[#2a2a2c]', 'border-bg-3'],

  // Border opacity edges that were close to the existing border tokens.
  ['border-white/[0.07]', 'border-border-1'],
  ['border-white/[0.08]', 'border-border-1'],
  ['border-white/[0.12]', 'border-border-3'],
  ['border-white/14', 'border-border-3'],

  // Banner / Callout / Pill paler text variants → semantic status tokens
  ['text-[#b8dbff]', 'text-status-info'],
  ['text-[#a0edd0]', 'text-status-success'],
  ['text-[#f5e1a8]', 'text-status-warning'],
  ['text-[#ffb8b8]', 'text-status-danger'],
  ['text-[#ff9898]', 'text-status-danger'],
  ['text-[#ffdb99]', 'text-status-warning'],
  ['text-[#ffc0c0]', 'text-status-danger'],

  // Misc one-offs
  ['text-[#4a4b53]', 'text-text-4'], // DatePicker outside-month
  ['text-[#9899a6]', 'text-text-3'], // Kbd glyph text
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
