#!/usr/bin/env tsx
// Reads every Svelte 4 component in @w5-ui/svelte and emits a thin custom
// element wrapper into packages/wc/src/elements/. Each wrapper:
//   - declares <svelte:options tag="uni-<kebab-name>" />
//   - re-exports the original component's `export let` props
//   - forwards the default slot
//
// We deliberately skip components whose props include heavy ReactNode-style
// inputs that don't round-trip well to attributes; those components are
// listed in SKIP. They still ship in the @w5-ui/svelte package, just not as
// custom elements (callers can mount them via Svelte directly).

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
const SKIP = new Set<string>([
  // Sub-components that only make sense inside a parent
  'AccordionItem',
  'TreeItem',
  'CenterNode',
  // Components whose API uses callback children / render props heavily
])

function kebab(name: string): string {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

interface Prop {
  name: string
  defaultExpr: string | null
}

function extractProps(src: string): Prop[] {
  // Strip <script> body
  const m = src.match(/<script[^>]*>([\s\S]*?)<\/script>/)
  if (!m) return []
  const body = m[1]!
  const props: Prop[] = []

  // Tokenise by walking the script body and finding each "export let NAME"
  // declaration. After the name, walk forward respecting (), <>, [], {}
  // depth until a top-level `=` (assignment) or `;` (no default) is reached.
  let i = 0
  const N = body.length
  while (i < N) {
    const idx = body.indexOf('export', i)
    if (idx < 0) break
    // Check that it's actually `export let`
    const after = body.slice(idx)
    const declMatch = after.match(/^export\s+let\s+([A-Za-z_$][\w$]*)/)
    if (!declMatch) {
      i = idx + 6
      continue
    }
    const name = declMatch[1]!
    let j = idx + declMatch[0].length
    // Skip optional `?` and type annotation `: T`
    while (j < N && /\s/.test(body[j]!)) j++
    if (body[j] === '?') j++
    while (j < N && /\s/.test(body[j]!)) j++
    if (body[j] === ':') {
      j++ // consume `:`
      // Walk through type, respecting depth, until we find a top-level `=`
      // (assignment) or `;`. Generic angle brackets are tracked, but we
      // ignore both `<` and `>` because TS type unions / extends can cause
      // false positives. Instead we rely on `(`, `[`, `{` depth and treat `=>`
      // (arrow function in type) as not-an-assignment by skipping when the
      // next char is `>`.
      let depth = 0
      while (j < N) {
        const c = body[j]!
        if (c === '(' || c === '[' || c === '{') depth++
        else if (c === ')' || c === ']' || c === '}') depth--
        else if (depth === 0 && c === '=' && body[j + 1] !== '>') break
        else if (depth === 0 && c === ';') break
        j++
      }
    }
    // Now at `=` or `;`
    let def: string | null = null
    if (body[j] === '=') {
      j++ // consume `=`
      const start = j
      let depth = 0
      while (j < N) {
        const c = body[j]!
        if (c === '(' || c === '[' || c === '{') depth++
        else if (c === ')' || c === ']' || c === '}') depth--
        else if (depth === 0 && c === ';') break
        // Watch out for arrow `=>` in default expressions; treat ; as terminator
        j++
      }
      def = body.slice(start, j).trim()
      // Strip trailing line comment
      def = def.replace(/\/\/.*$/, '').trim()
    }
    if (body[j] === ';') j++
    props.push({ name, defaultExpr: def })
    i = j
  }

  return props
}

function renderDefault(expr: string | null): string {
  if (!expr) return 'undefined'
  // If the default looks like a TS-only type cast or contains template literals
  // or arrow functions, wrap defensively. Most defaults are primitives.
  return expr
}

const files = (await readdir(SRC_DIR)).filter((f) => f.endsWith('.svelte')).sort()

await rm(OUT_DIR, { recursive: true, force: true })
await mkdir(OUT_DIR, { recursive: true })

const generated: { name: string; tag: string; file: string }[] = []

for (const file of files) {
  const name = file.replace(/\.svelte$/, '')
  if (SKIP.has(name)) continue
  const src = await readFile(path.join(SRC_DIR, file), 'utf8')
  const props = extractProps(src)

  const tag = `uni-${kebab(name)}`

  // Build the wrapper. We use a property forwarding pattern that handles
  // missing values gracefully: if a prop wasn't set on the custom element
  // the wrapper still passes `undefined`, leaving the original component's
  // default to take effect.
  const propDeclarations = props
    .map((p) => `  export let ${p.name} = ${renderDefault(p.defaultExpr)};`)
    .join('\n')
  const propForwards = props.map((p) => `{${p.name}}`).join(' ')

  // No lang="ts" - we don't run a TypeScript preprocessor on these wrappers.
  // Defaults are inlined verbatim from the source, which usually keeps them
  // valid JavaScript. Components whose defaults reference TS-only constructs
  // should be added to SKIP above.
  const wrapper = `<svelte:options tag="${tag}" />
<script>
  import Original from '@w5-ui/svelte/components/${name}.svelte';
${propDeclarations || '  // no public props'}
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
  ...generated.map(({ name }) => `import './elements/${name}.wc.svelte';`),
  '',
  `export const REGISTERED_TAGS = ${JSON.stringify(
    generated.map((g) => g.tag),
    null,
    2,
  )};`,
  '',
]
await writeFile(INDEX_PATH, indexLines.join('\n'))

// Manifest for stories / tests
const manifest = generated.map((g) => ({ name: g.name, tag: g.tag }))
await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2))

console.log(`Generated ${generated.length} custom element wrappers in ${OUT_DIR}`)
