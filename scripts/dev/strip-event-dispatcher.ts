#!/usr/bin/env tsx
// Convert Svelte 4-style createEventDispatcher to Svelte 5 callback props.
//
// In:
//   import { createEventDispatcher } from 'svelte';
//   const dispatch = createEventDispatcher<{ change: number }>();
//   dispatch('change', 42);
//
// Out:
//   interface Props { ... onchange?: (value: number) => void; ... }
//   let { ..., onchange }: Props = $props();
//   onchange?.(42);
//
// We:
// 1. Parse the `{ ev1: T1; ev2: T2 }` literal after `createEventDispatcher<`.
// 2. For each `evN`, generate `on${evN}` callback prop + destructure entry.
// 3. Rewrite `dispatch('evN', payload)` -> `on${evN}?.(payload)`
//    and `dispatch('evN')` (void payload) -> `on${evN}?.()`.
// 4. Remove the import name + the `const dispatch = ...` line.
// 5. Patch the Props interface and the destructuring block.
//
// If the file doesn't match the canonical shape (single dispatcher, single
// Props interface, single $props() destructure block) it is skipped and the
// path is printed so we can hand-fix it.

import { readFileSync, writeFileSync } from 'node:fs'
import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { argv } from 'node:process'

const targets = argv.slice(2)
if (targets.length === 0) {
  console.error('Usage: tsx strip-event-dispatcher.ts <dir> [<dir>...]')
  process.exit(1)
}

let touched = 0
const skipped: string[] = []

for (const target of targets) {
  for (const file of walk(target)) {
    if (!file.endsWith('.svelte')) continue
    const before = readFileSync(file, 'utf8')
    if (!/createEventDispatcher/.test(before)) continue
    const after = tryTransform(before)
    if (after === null) {
      skipped.push(file)
      continue
    }
    if (after !== before) {
      writeFileSync(file, after, 'utf8')
      touched++
    }
  }
}

console.log(`Touched ${touched} file(s). Skipped ${skipped.length}:`)
for (const s of skipped) console.log('  ' + s)

function tryTransform(src: string): string | null {
  // 1. Find the dispatcher type literal.
  const dispMatch = src.match(
    /const\s+dispatch\s*=\s*createEventDispatcher<\s*\{([^}]+)\}\s*>\s*\(\s*\)\s*;?/,
  )
  if (!dispMatch) return null
  const inside = dispMatch[1]
  // Parse "name: Type;" entries, where Type may itself contain colons (object types).
  // Simplest: split on top-level `;`, then for each part split into name + rest at the first `:`.
  const events: Array<{ name: string; type: string }> = []
  for (const raw of splitTopLevel(inside, ';')) {
    const trimmed = raw.trim()
    if (!trimmed) continue
    const colonIdx = trimmed.indexOf(':')
    if (colonIdx === -1) return null
    const name = trimmed.slice(0, colonIdx).trim()
    const type = trimmed.slice(colonIdx + 1).trim()
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) return null
    events.push({ name, type })
  }
  if (events.length === 0) return null

  // 2. Remove createEventDispatcher from the `import` line.
  let out = src.replace(/import\s*\{\s*([^}]*)\}\s*from\s*'svelte'\s*;?/, (m, names: string) => {
    const remaining = names
      .split(',')
      .map((n) => n.trim())
      .filter((n) => n && n !== 'createEventDispatcher')
    if (remaining.length === 0) return ''
    return `import { ${remaining.join(', ')} } from 'svelte';`
  })

  // 3. Drop the `const dispatch = createEventDispatcher<...>();` line entirely.
  out = out.replace(
    /\s*const\s+dispatch\s*=\s*createEventDispatcher<\s*\{[^}]+\}\s*>\s*\(\s*\)\s*;?\s*\n/,
    '\n',
  )

  // 4. Rewrite each `dispatch('ev', payload)` call.
  for (const ev of events) {
    const cbName = `on${ev.name}`
    const isVoid = /^void$/.test(ev.type)
    // dispatch('ev', payload) -> on<Ev>?.(payload)
    // dispatch('ev') -> on<Ev>?.()
    out = out.replace(
      new RegExp(`\\bdispatch\\(\\s*['"]${ev.name}['"]\\s*\\)`, 'g'),
      `${cbName}?.()`,
    )
    out = out.replace(
      new RegExp(`\\bdispatch\\(\\s*['"]${ev.name}['"]\\s*,\\s*`, 'g'),
      `${cbName}?.(`,
    )
    void isVoid
  }

  // 5. Augment the Props interface (must be top-level `interface Props { ... }`).
  // Add `on<Ev>?: (payload: T) => void` for each event right before the closing brace.
  out = out.replace(
    /interface\s+Props(\s+extends[^{]*)?\s*\{([\s\S]*?)\n\s*\}/m,
    (_match, extendsClause: string | undefined, body: string) => {
      const lines = body.replace(/\n+$/, '')
      const addLines = events
        .map((ev) => {
          const param = ev.type === 'void' ? '' : `payload: ${ev.type}`
          return `    on${ev.name}?: (${param}) => void;`
        })
        .join('\n')
      return `interface Props${extendsClause ?? ''} {${lines}\n${addLines}\n  }`
    },
  )

  // 6. Augment the destructuring `let { ... }: Props = $props();`.
  // We add `on<Ev>` entries before the closing brace.
  out = out.replace(
    /let\s*\{([\s\S]*?)\}\s*:\s*Props\s*=\s*\$props\(\)\s*;?/,
    (_match, body: string) => {
      const trimmed = body.replace(/,?\s*$/, '')
      const addNames = events.map((ev) => `    on${ev.name}`).join(',\n')
      return `let {${trimmed},\n${addNames},\n  }: Props = $props();`
    },
  )

  return out
}

function splitTopLevel(input: string, sep: string): string[] {
  const out: string[] = []
  let depth = 0
  let buf = ''
  for (const c of input) {
    if (c === '{' || c === '<' || c === '(' || c === '[') depth++
    else if (c === '}' || c === '>' || c === ')' || c === ']') depth--
    if (c === sep && depth === 0) {
      out.push(buf)
      buf = ''
    } else {
      buf += c
    }
  }
  if (buf.trim()) out.push(buf)
  return out
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
