#!/usr/bin/env tsx
/**
 * Motif sweep: replace the legacy "always-dark chrome" literal classes
 * across @w5-ui/svelte's components with the motif-aware tokens.
 *
 * One-off script kept here for traceability + so a reviewer can verify
 * the exact substitutions that landed. Safe to delete after the PR
 * merges, or to re-run on any straggler component a future migration
 * introduces.
 *
 * Strategy: each replacement is a token-boundary swap (preceded/followed
 * by a non-word character or end of class string). `text-white` is NOT
 * auto-replaced because it stays white on saturated brand / status
 * backgrounds; those occurrences are reviewed by hand.
 *
 * Run:  npx tsx scripts/motif-sweep.ts
 */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const COMPONENTS_DIR = 'packages/svelte/src/lib/components'

// Order matters: longer / more specific keys before their shorter prefixes.
const SUBSTITUTIONS: Array<[string, string]> = [
  // Backgrounds (chrome surfaces)
  ['bg-neutral-10', 'bg-bg-page'],
  ['bg-neutral-09', 'bg-bg-1'],
  ['bg-[#0a0a0b]', 'bg-bg-page'],
  ['bg-[#0f0f10]', 'bg-bg-0'],
  ['bg-[#141415]', 'bg-bg-1'],
  ['bg-[#1c1c1e]', 'bg-bg-2'],
  ['bg-[#1f2433]', 'bg-bg-3'],

  // Row-hover / active overlays
  ['hover:bg-white/[0.04]', 'hover:bg-row-hover'],
  ['hover:bg-white/[0.06]', 'hover:bg-row-active'],
  ['hover:bg-white/[0.07]', 'hover:bg-row-active'],
  ['hover:bg-white/[0.08]', 'hover:bg-row-active'],
  ['bg-white/[0.04]', 'bg-row-hover'],
  ['bg-white/[0.06]', 'bg-row-active'],
  ['bg-white/[0.07]', 'bg-row-active'],
  ['bg-white/[0.08]', 'bg-row-active'],

  // Borders
  ['border-white/[0.06]', 'border-border-1'],
  ['border-white/[0.04]', 'border-border-1'],
  ['border-white/10', 'border-border-2'],
  ['border-white/20', 'border-border-3'],

  // Text
  ['hover:text-white', 'hover:text-text-1'],
  ['text-neutral-04', 'text-text-3'],
  ['text-neutral-05', 'text-text-4'],
  ['text-[#c8c9d0]', 'text-text-2'],
  ['text-[#6e7079]', 'text-text-4'],
  ['text-[#e1e2e8]', 'text-text-1'],
  ['text-[#3e3e45]', 'text-border-3'],

  // Pill text variants → semantic status tokens
  ['text-[#5ddb9f]', 'text-status-success'],
  ['text-[#f5c26b]', 'text-status-warning'],
  ['text-[#ff7b7b]', 'text-status-danger'],
  ['text-[#7fb6ff]', 'text-status-info'],
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
