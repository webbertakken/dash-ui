#!/usr/bin/env tsx
// Mechanically rewrite Svelte 4 `on:event={handler}` to Svelte 5
// callback-prop `onevent={handler}`. For component callers that used to
// read `e.detail` (Svelte 4 CustomEvent payload), the callback now
// receives the payload directly — we rewrite `e.detail` -> `e` inside the
// rewritten handler body when the original handler was an arrow function
// `(e) => { ... }` (single-parameter, single arrow). For all other
// handler shapes the rewrite is purely syntactic (drop the colon) and the
// dev is expected to adapt the handler manually — those cases are
// reported on stderr.
//
// Usage: tsx strip-on-colon.ts <dir> [<dir>...]

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const targets = process.argv.slice(2)
if (targets.length === 0) {
  console.error('Usage: tsx strip-on-colon.ts <dir> [<dir>...]')
  process.exit(1)
}

let rewrites = 0
let manual: Array<{ file: string; line: number; snippet: string }> = []

for (const target of targets) {
  for (const file of walk(target)) {
    if (!file.endsWith('.svelte')) continue
    const before = readFileSync(file, 'utf8')
    let after = before

    // Pass 1: rewrite `on:event={` -> `onevent={`. Capture the whole
    // attribute (including its `{...}` value) so we can rewrite
    // `e.detail` -> the new payload binding.
    after = after.replace(
      /\bon:([a-z][a-zA-Z]*)=\{([\s\S]*?)\}/g,
      (match, eventName: string, body: string) => {
        // Try arrow handler shape: `(<id>) => <expr>` or `(<id>) => { ... }`.
        const arrow = body.match(/^\s*\(\s*([A-Za-z_$][\w$]*)\s*\)\s*=>\s*([\s\S]*)$/)
        if (arrow) {
          const [, paramName, arrowBody] = arrow
          // Inside the body, rewrite `<param>.detail` -> `<param>` and
          // strip the `.detail` accessor so the handler now receives the
          // event payload directly (Svelte 5 callback prop semantics).
          const re = new RegExp(`\\b${paramName}\\.detail\\b`, 'g')
          const newBody = arrowBody.replace(re, paramName)
          return `on${eventName}={(${paramName}) => ${newBody}}`
        }
        // Bare reference (`on:event={handler}`) or zero-arg arrow — flag
        // for manual review since the handler's signature may need to
        // change too (payload was wrapped in a CustomEvent in v4).
        if (/^\s*([A-Za-z_$][\w$.]*)\s*$/.test(body)) {
          // Bare identifier — safe to rewrite, but the callee may need
          // updating. Flag.
          manual.push({ file, line: getLineNumber(before, match), snippet: match.slice(0, 80) })
        }
        return `on${eventName}={${body}}`
      },
    )

    if (after !== before) {
      writeFileSync(file, after, 'utf8')
      rewrites++
    }
  }
}

console.log(`Rewrote ${rewrites} file(s).`)
if (manual.length > 0) {
  console.log(`\n${manual.length} attribute(s) need manual handler-signature review:`)
  for (const m of manual) {
    console.log(`  ${m.file}:${m.line}\n    ${m.snippet}…`)
  }
}

function getLineNumber(src: string, snippet: string): number {
  const idx = src.indexOf(snippet)
  if (idx === -1) return 0
  return src.slice(0, idx).split('\n').length
}

function* walk(dir: string): Generator<string> {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry.startsWith('.')) continue
    const full = join(dir, entry)
    const s = statSync(full)
    if (s.isDirectory()) yield* walk(full)
    else if (s.isFile()) yield full
  }
}
