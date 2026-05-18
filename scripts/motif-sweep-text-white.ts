#!/usr/bin/env tsx
/**
 * Second pass of the motif sweep: replace `text-white` with `text-text-1`
 * wherever it sits on a motif-aware surface, while preserving the cases
 * where the text really should stay white because the background is a
 * saturated colour that's the same in both motifs.
 *
 * Heuristic: examine each `text-white` token in its surrounding class
 * string (delimited by `'`, `"`, `\`` or `{` … `}`). If the same class
 * string contains a "saturated bg" trigger, keep `text-white`; else
 * flip it.
 *
 *   Saturated triggers (keep):
 *     bg-brand-{01..09}              (any solid brand step)
 *     bg-status-{success,warning,danger,info,neutral}
 *                                    (solid status colour)
 *     bg-neutral-06                  (avatar fixed mid-grey)
 *
 *   Opacity variants (`text-white/...`, `text-white/[0.18]`, etc.) are
 *   left alone because they're decorative shades, not chrome text.
 *
 *   The opening `text-white-classed` markers used in `data-[...]:text-white`
 *   variants are also flipped, because those activate on top of the
 *   motif-aware `bg-row-active` overlay rather than a saturated colour.
 *
 * Run:  npx tsx scripts/motif-sweep-text-white.ts
 */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const COMPONENTS_DIR = 'packages/svelte/src/lib/components'

const KEEP_TRIGGERS = [
  /\bbg-brand-0[1-9]\b/,
  /\bbg-status-(success|warning|danger|info|neutral)\b/,
  /\bbg-neutral-06\b/,
]

/**
 * Split a Svelte source into class-string segments. We only do the
 * replacement inside class strings — never in JS expressions or markup
 * outside the `class="…"` attribute.
 *
 * Returns an array of { start, end, body } for every class-string
 * literal found in the source (single, double, or backtick quoted).
 */
interface Segment {
  start: number
  end: number
  body: string
}

function findClassStrings(src: string): Segment[] {
  const out: Segment[] = []
  // Class strings live as either `class="..."` or as constants/template
  // literals that contain Tailwind utilities. To be safe, scan ALL
  // single, double, and backtick string literals, then filter to those
  // containing `text-white`.
  const re = /(['"`])((?:\\.|(?!\1)[^\\])*)\1/g
  let m: RegExpExecArray | null
  while ((m = re.exec(src)) !== null) {
    if (m[2].includes('text-white')) {
      out.push({ start: m.index + 1, end: m.index + 1 + m[2].length, body: m[2] })
    }
  }
  return out
}

/**
 * Replace `text-white` with `text-text-1` inside a single class-string
 * body — but only when no KEEP_TRIGGERS match the same body, and only
 * for the bare `text-white` (not the `/opacity` variants).
 */
function flipBody(body: string): string {
  if (KEEP_TRIGGERS.some((re) => re.test(body))) return body
  // Replace bare `text-white` that isn't followed by `/` (opacity).
  return body.replace(/\btext-white\b(?!\/)/g, 'text-text-1')
}

function transform(src: string): { out: string; hits: number } {
  const segs = findClassStrings(src)
  if (segs.length === 0) return { out: src, hits: 0 }
  let out = ''
  let cursor = 0
  let hits = 0
  for (const s of segs) {
    out += src.slice(cursor, s.start)
    const flipped = flipBody(s.body)
    if (flipped !== s.body) hits += 1
    out += flipped
    cursor = s.end
  }
  out += src.slice(cursor)
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
      console.log(`  ${f}  (${hits} class-string${hits === 1 ? '' : 's'} flipped)`)
    }
  }
  console.log(`\nTotal files touched: ${touched}`)
}

main()
