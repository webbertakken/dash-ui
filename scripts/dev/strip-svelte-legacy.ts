#!/usr/bin/env tsx
// Mechanically strips `svelte/legacy` shims left over after the codemod:
//   run(() => { body })            -> $effect(() => { body })
//   preventDefault(handler)        -> (e) => { e.preventDefault(); (handler)(e); }
//   stopPropagation(handler)       -> (e) => { e.stopPropagation(); (handler)(e); }
//
// We then drop `import { ... } from 'svelte/legacy'` lines whose names are
// no longer referenced. Leaves unrelated `from 'svelte/legacy'` imports
// untouched (none currently expected, but cheap insurance).

import { readFileSync, writeFileSync } from 'node:fs'
import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { argv } from 'node:process'

const targets = argv.slice(2)
if (targets.length === 0) {
  console.error('Usage: tsx strip-svelte-legacy.ts <dir> [<dir>...]')
  process.exit(1)
}

let changed = 0
for (const target of targets) {
  for (const file of walk(target)) {
    if (!file.endsWith('.svelte')) continue
    const before = readFileSync(file, 'utf8')
    let after = before

    // run((...) => ...)  ->  $effect((...) => ...)
    after = after.replace(/\brun\(/g, '$effect(')

    // preventDefault(fn-expr) -> wrapper. fn-expr can span multiple lines /
    // contain nested parens. We parse from `preventDefault(` until the matching
    // close paren at depth 0.
    after = wrapWrapper(after, 'preventDefault', 'e.preventDefault()')
    after = wrapWrapper(after, 'stopPropagation', 'e.stopPropagation()')

    // Drop the now-unused names from `from 'svelte/legacy'` imports. The
    // simplest correct thing: if the file no longer references any name we
    // could be importing from that module, delete the whole import line.
    const stillUsed = /\b(createBubbler|bubble)\b/.test(after)
    if (!stillUsed) {
      after = after.replace(/^\s*import \{[^}]*\} from 'svelte\/legacy';\s*\n/gm, '')
      // Also kill an immediately-following `const bubble = createBubbler()` if any.
      after = after.replace(/^\s*const bubble = createBubbler\(\);\s*\n/gm, '')
    }

    if (after !== before) {
      writeFileSync(file, after, 'utf8')
      changed++
    }
  }
}
console.log(`Updated ${changed} file(s).`)

function wrapWrapper(src: string, name: string, statement: string): string {
  const open = `${name}(`
  let out = ''
  let i = 0
  while (i < src.length) {
    const idx = src.indexOf(open, i)
    if (idx === -1) {
      out += src.slice(i)
      break
    }
    // Make sure this is a standalone identifier (not part of e.preventDefault())
    const prev = idx > 0 ? src[idx - 1] : ''
    if (prev && /[\w$.]/.test(prev)) {
      out += src.slice(i, idx + open.length)
      i = idx + open.length
      continue
    }
    out += src.slice(i, idx)
    // Find matching close paren.
    let depth = 1
    let j = idx + open.length
    let inSingle = false
    let inDouble = false
    let inTpl = false
    let inLineComment = false
    let inBlockComment = false
    while (j < src.length && depth > 0) {
      const c = src[j]!
      const next = src[j + 1] ?? ''
      if (inLineComment) {
        if (c === '\n') inLineComment = false
      } else if (inBlockComment) {
        if (c === '*' && next === '/') {
          inBlockComment = false
          j++
        }
      } else if (inSingle) {
        if (c === '\\') j++
        else if (c === "'") inSingle = false
      } else if (inDouble) {
        if (c === '\\') j++
        else if (c === '"') inDouble = false
      } else if (inTpl) {
        if (c === '\\') j++
        else if (c === '`') inTpl = false
      } else if (c === '/' && next === '/') {
        inLineComment = true
        j++
      } else if (c === '/' && next === '*') {
        inBlockComment = true
        j++
      } else if (c === "'") {
        inSingle = true
      } else if (c === '"') {
        inDouble = true
      } else if (c === '`') {
        inTpl = true
      } else if (c === '(') {
        depth++
      } else if (c === ')') {
        depth--
        if (depth === 0) break
      }
      j++
    }
    const inner = src.slice(idx + open.length, j).trim()
    // Replace
    out += `(e) => { ${statement}; (${inner})(e); }`
    i = j + 1
  }
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
