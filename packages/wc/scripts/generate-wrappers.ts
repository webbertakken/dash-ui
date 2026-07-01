#!/usr/bin/env tsx
// Reads every Svelte 5 component in @w5-ui/svelte and emits a thin custom
// element wrapper into packages/wc/src/elements/. Each wrapper:
//   - declares <svelte:options customElement="uni-<kebab-name>" />
//   - re-declares the original component's destructured props as $props()
//   - forwards the default slot via <slot /> (Svelte 5 keeps the old slot
//     syntax inside CE compilation mode for legacy interop; snippet
//     children are not addressable as attributes anyway)
//
// We deliberately skip components whose props include heavy ReactNode-
// style inputs (callbacks / snippets that don't round-trip as attributes);
// those components are listed in SKIP. They still ship in the
// @w5-ui/svelte package, just not as custom elements (callers can mount
// them via Svelte directly).

import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.resolve(HERE, '..', '..', '..')
const SRC_DIR = path.join(REPO_ROOT, 'packages/svelte/src/lib/components')
const OUT_DIR = path.join(REPO_ROOT, 'packages/wc/src/elements')
const INDEX_PATH = path.join(REPO_ROOT, 'packages/wc/src/index.ts')
const MANIFEST_PATH = path.join(REPO_ROOT, 'packages/wc/src/manifest.json')

// Components we deliberately don't ship as custom elements.
//
// `AccordionItem` USED to live here on the assumption that it only makes
// sense inside an `<Accordion>`. In practice each AccordionItem manages
// its own open/close state and its props (`title`, `defaultOpen`) are
// HTML-attribute friendly, so composing `<uni-accordion-item>` inside
// `<uni-accordion>` works fine and matches the Svelte/React APIs.
// Parity test in `src/__tests__/parity.test.ts` keeps us honest.
//
// `TreeItem` stays skipped: it's a recursive renderer that takes a Set
// (`expanded`) and a node object as props — neither round-trip through
// HTML attributes, and the Svelte index doesn't export it.
const SKIP = new Set<string>([
  'TreeItem',
  // TreeBrowserNode is the recursive internal renderer for TreeBrowser
  // (takes a Set + node maps as props, not exported from the index).
  'TreeBrowserNode',
  // CenterNode used to be skipped pre-emptively but the component never
  // landed; remove if/when it ships.
])

function kebab(name: string): string {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

interface Prop {
  /** As written in the destructure (e.g. `class: className`) — used for renaming. */
  destructureName: string
  /** As seen by the outside world (`class`, `variant`, ...). */
  externalName: string
  /** As referenced inside the template (`className`, `variant`, ...). */
  internalName: string
  /** Verbatim default expression, or null if none. */
  defaultExpr: string | null
}

/** Parse the instance `<script>` block once, returning the destructure plus
 *  a set of prop names whose declared type is `Snippet` (we can't shuttle
 *  snippets as HTML attributes on a custom element, so we omit them). */
function extractScriptInfo(src: string): { props: Prop[]; snippetNames: Set<string> } {
  const props = extractProps(src)
  const snippetNames = new Set<string>()

  // Find the body again so we can scan the `interface Props { ... }` block.
  const scripts = [...src.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)]
  const instance = scripts.find(
    (m) => !/\bmodule\b/.test(m[1]) && !/context=['"]module['"]/.test(m[1]),
  )
  if (!instance) return { props, snippetNames }
  const body = instance[2]!
  const ifaceMatch = body.match(/interface\s+Props\b[\s\S]*?\{([\s\S]*?)\n\s*\}/m)
  if (!ifaceMatch) return { props, snippetNames }
  const fields = ifaceMatch[1]!
  for (const raw of splitTopLevel(fields, ';')) {
    // Strip leading JSDoc / line comments before matching the field name.
    const t = raw
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '')
      .trim()
    if (!t) continue
    const m = t.match(/^([A-Za-z_$][\w$]*)\??\s*:\s*([\s\S]+)$/)
    if (!m) continue
    const name = m[1]!
    const typeText = m[2]!
    if (/\bSnippet\b/.test(typeText)) snippetNames.add(name)
    // Also skip callback-shaped props (any `(...) => ...` type) — they
    // can't be set via an HTML attribute on the CE either.
    if (/=>/.test(typeText)) snippetNames.add(name)
  }
  return { props, snippetNames }
}

/** Parse the instance `<script>` body to find the single `$props()` destructure. */
function extractProps(src: string): Prop[] {
  // Skip module-scope script. The first `<script>` without `module` is the
  // instance script. The codemod sometimes emits `<script module>` or
  // `<script context="module">`.
  const scripts = [...src.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)]
  const instance = scripts.find(
    (m) => !/\bmodule\b/.test(m[1]) && !/context=['"]module['"]/.test(m[1]),
  )
  if (!instance) return []
  const body = instance[2]!
  // Find `$props()` — the destructure looks like `let { ... } = $props();`
  // (optionally preceded by a type annotation `: Props`).
  const propsCallIdx = body.indexOf('$props()')
  if (propsCallIdx < 0) return []
  // 1. Walk back from `$props()` to the closing `}` of the destructure.
  let braceEnd = -1
  for (let i = propsCallIdx - 1; i >= 0; i--) {
    if (body[i] === '}') {
      braceEnd = i
      break
    }
  }
  if (braceEnd < 0) return []
  // 2. From `braceEnd`, walk back to the matching `{`.
  let braceStart = -1
  let depth = 1
  for (let i = braceEnd - 1; i >= 0; i--) {
    const c = body[i]!
    if (c === '}') depth++
    else if (c === '{') {
      depth--
      if (depth === 0) {
        braceStart = i
        break
      }
    }
  }
  if (braceStart < 0) return []
  const inside = body.slice(braceStart + 1, braceEnd)
  return parseDestructure(inside)
}

function parseDestructure(inside: string): Prop[] {
  const out: Prop[] = []
  for (const raw of splitTopLevel(inside, ',')) {
    const trimmed = raw.trim()
    if (!trimmed) continue
    if (trimmed.startsWith('...')) continue // rest parameter — we don't forward this
    let externalName: string
    let internalName: string
    let defaultExpr: string | null = null
    // Look for `=` at top level — that splits prop name from default.
    const eqIdx = findTopLevel(trimmed, '=')
    let lhs: string
    if (eqIdx >= 0) {
      lhs = trimmed.slice(0, eqIdx).trim()
      defaultExpr = trimmed.slice(eqIdx + 1).trim()
    } else {
      lhs = trimmed
    }
    // Handle renaming `class: className` or plain `variant`.
    const colonIdx = findTopLevel(lhs, ':')
    if (colonIdx >= 0) {
      externalName = lhs.slice(0, colonIdx).trim()
      internalName = lhs.slice(colonIdx + 1).trim()
    } else {
      externalName = lhs
      internalName = lhs
    }
    if (!/^[A-Za-z_$][\w$]*$/.test(externalName) || !/^[A-Za-z_$][\w$]*$/.test(internalName)) {
      // Bail on shapes we don't understand (nested destructures, etc.).
      continue
    }
    out.push({
      destructureName: lhs,
      externalName,
      internalName,
      defaultExpr,
    })
  }
  return out
}

function splitTopLevel(input: string, sep: string): string[] {
  const out: string[] = []
  const depth: number[] = []
  let buf = ''
  let quote: string | null = null
  for (let i = 0; i < input.length; i++) {
    const c = input[i]!
    if (quote) {
      buf += c
      if (c === '\\') {
        buf += input[++i] ?? ''
        continue
      }
      if (c === quote) quote = null
      continue
    }
    if (c === "'" || c === '"' || c === '`') {
      quote = c
      buf += c
      continue
    }
    if (c === '(' || c === '[' || c === '{' || c === '<') depth.push(1)
    else if (c === ')' || c === ']' || c === '}' || c === '>') depth.pop()
    if (depth.length === 0 && c === sep) {
      out.push(buf)
      buf = ''
    } else {
      buf += c
    }
  }
  if (buf.trim()) out.push(buf)
  return out
}

function findTopLevel(input: string, sep: string): number {
  const depth: number[] = []
  let quote: string | null = null
  for (let i = 0; i < input.length; i++) {
    const c = input[i]!
    if (quote) {
      if (c === '\\') {
        i++
        continue
      }
      if (c === quote) quote = null
      continue
    }
    if (c === "'" || c === '"' || c === '`') {
      quote = c
      continue
    }
    if (c === '(' || c === '[' || c === '{' || c === '<') depth.push(1)
    else if (c === ')' || c === ']' || c === '}' || c === '>') depth.pop()
    else if (depth.length === 0 && c === sep) return i
  }
  return -1
}

/** Drop props whose declared default expression contains JSX/Snippet/callback
 *  shapes that don't round-trip as HTML attributes on a custom element.
 *  Also drop `children` and any `on*` callbacks. */
function isAttributeRoundTrippable(p: Prop, snippetNames: Set<string>): boolean {
  if (p.externalName === 'children') return false
  if (/^on[a-z]/.test(p.externalName)) return false
  if (snippetNames.has(p.externalName)) return false
  if (p.defaultExpr && /=>|Snippet/.test(p.defaultExpr)) return false
  return true
}

/** Unwrap `$bindable(default)` in a destructure default so the CE wrapper
 *  gets a plain one-way value (CE attribute -> prop is read-only). */
function unwrapBindable(expr: string | null): string | null {
  if (!expr) return expr
  const m = expr.match(/^\$bindable\(([\s\S]*)\)$/)
  if (!m) return expr
  const inner = m[1]!.trim()
  return inner === '' ? 'undefined' : inner
}

const files = (await readdir(SRC_DIR)).filter((f) => f.endsWith('.svelte')).sort()

await rm(OUT_DIR, { recursive: true, force: true })
await mkdir(OUT_DIR, { recursive: true })

const generated: { name: string; tag: string; file: string }[] = []

for (const file of files) {
  const name = file.replace(/\.svelte$/, '')
  if (SKIP.has(name)) continue
  const src = await readFile(path.join(SRC_DIR, file), 'utf8')
  const { props: allProps, snippetNames } = extractScriptInfo(src)
  const props = allProps
    .filter((p) => isAttributeRoundTrippable(p, snippetNames))
    .map((p) => ({ ...p, defaultExpr: unwrapBindable(p.defaultExpr) }))

  const tag = `uni-${kebab(name)}`

  const propLines = props
    .map(
      (p) =>
        `    ${p.externalName === p.internalName ? p.externalName : `${p.externalName}: ${p.internalName}`} = ${p.defaultExpr ?? 'undefined'}`,
    )
    .join(',\n')
  const propForwards = props
    .map((p) =>
      p.externalName === p.internalName
        ? `{${p.internalName}}`
        : `${p.externalName}={${p.internalName}}`,
    )
    .join(' ')

  // Svelte 5 wrapper: typed `$props()` destructure, slot forwards as <slot />.
  // We don't typecheck these wrappers (vite-plugin-svelte compiles them
  // directly without `lang="ts"` running through tsc), so the prop types are
  // intentionally erased — defaults carry the runtime intent.
  const wrapper = `<svelte:options customElement="${tag}" />
<script>
  import Original from '@w5-ui/svelte/components/${name}.svelte';
  let {
${propLines || '    /* no public props */'}
  } = $props();
</script>

<Original ${propForwards}>
  <slot />
</Original>
`
  const outFile = path.join(OUT_DIR, `${name}.wc.svelte`)
  await writeFile(outFile, wrapper)
  generated.push({ name, tag, file: outFile })
}

// Emit an index.ts that imports every wrapper. Importing this module
// registers all custom elements as a side effect.
const indexLines = [
  '// AUTO-GENERATED by scripts/generate-wrappers.ts. Do not edit by hand.',
  '// Importing this module registers every uni-* custom element on the page.',
  '',
  ...generated.map(({ name }) => `import './elements/${name}.wc.svelte'`),
  '',
  // oxfmt prefers single-quoted strings; JSON.stringify gives doubles, so
  // emit the array literal by hand.
  `export const REGISTERED_TAGS = [`,
  ...generated.map((g) => `  '${g.tag}',`),
  `]`,
  '',
]
await writeFile(INDEX_PATH, indexLines.join('\n'))

// Manifest for stories / tests (trailing newline keeps oxfmt happy).
const manifest = generated.map((g) => ({ name: g.name, tag: g.tag }))
await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n')

console.log(`Generated ${generated.length} custom element wrappers in ${OUT_DIR}`)
