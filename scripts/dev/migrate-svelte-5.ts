#!/usr/bin/env tsx
// Non-interactive Svelte 4 → Svelte 5 codemod driver.
//
// Wraps the same transforms used by `npx sv migrate svelte-5` but skips
// the @clack/prompts UX so it can run in CI / scripted contexts. Resolves
// `svelte/compiler`'s `migrate()` from a passed-in cwd, so we can target
// `packages/svelte` (which has svelte 5 installed locally) even when the
// repo root still has svelte 4 hoisted.
//
// Usage:
//   tsx scripts/dev/migrate-svelte-5.ts <target-dir> [<target-dir>...]
//
// Each target-dir is walked recursively. .svelte files run through the
// Svelte 5 compiler `migrate()` plus the migration tool's source-level
// transforms; .ts / .js files run through the module-level transforms
// (mostly `new Component({...})` → `mount(Component, {...})`).

import { readFileSync, statSync, writeFileSync, readdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join, resolve, sep } from 'node:path'
import { pathToFileURL } from 'node:url'

const targets = process.argv.slice(2)
if (targets.length === 0) {
  console.error('Usage: tsx scripts/dev/migrate-svelte-5.ts <dir> [<dir>...]')
  process.exit(1)
}

const ABS_TARGETS = targets.map((t) => resolve(process.cwd(), t))

// Resolve svelte/compiler relative to the first target directory so we
// hit Svelte 5 (each target lives inside `packages/svelte` or downstream).
const sveltePkgRoot = await findUp(ABS_TARGETS[0], 'package.json', (pj) => {
  try {
    const json = JSON.parse(readFileSync(pj, 'utf8'))
    return Boolean(json.dependencies?.svelte || json.devDependencies?.svelte)
  } catch {
    return false
  }
})
if (!sveltePkgRoot) {
  console.error('Could not find a package.json with a svelte dep above target')
  process.exit(1)
}
const requireFromTarget = createRequire(join(sveltePkgRoot, 'noop.js'))

// Resolve the package root, then read its exports map and pick the ESM
// ("default") entry. The CJS entry is a UMD bundle that doesn't expose
// its named exports when loaded via dynamic import().
const sveltePkgJsonPath = requireFromTarget.resolve('svelte/package.json')
const sveltePkgDir = sveltePkgJsonPath.replace(/[\\/]package\.json$/, '')
const sveltePkgJson = JSON.parse(readFileSync(sveltePkgJsonPath, 'utf8')) as {
  exports?: Record<string, { default?: string }>
}
const compilerEsmRel = sveltePkgJson.exports?.['./compiler']?.default
if (!compilerEsmRel) {
  console.error('svelte package has no ESM ./compiler export — is this Svelte 5?')
  process.exit(1)
}
const svelteCompilerPath = join(sveltePkgDir, compilerEsmRel)
const compiler = await import(pathToFileURL(svelteCompilerPath).href)
const migrate = compiler.migrate as
  | ((code: string, opts: { filename?: string; use_ts?: boolean }) => { code: string })
  | undefined
if (!migrate) {
  console.error(
    `Resolved svelte/compiler ESM at ${svelteCompilerPath} but it does not export migrate(). Is this Svelte 5?`,
  )
  process.exit(1)
}

const migrateUrl = pathToFileURL(
  requireFromTarget.resolve('svelte-migrate/migrations/svelte-5/migrate.js'),
).href
const { transform_module_code, transform_svelte_code } = (await import(migrateUrl)) as {
  transform_module_code: (code: string) => string
  transform_svelte_code: (
    code: string,
    migrate: (code: string, opts: { filename?: string; use_ts?: boolean }) => { code: string },
    options: { filename?: string; use_ts?: boolean },
  ) => string
}

let svelteCount = 0
let moduleCount = 0
let errorCount = 0
const errors: Array<{ file: string; error: string }> = []

for (const target of ABS_TARGETS) {
  for (const file of walk(target)) {
    if (file.endsWith('.svelte')) {
      try {
        const before = readFileSync(file, 'utf8')
        // First pass: module-level transforms (mount(...) replacements).
        const afterModule = transform_module_code(before)
        // Second pass: source-level (export let → $props, $: → $derived, etc.)
        const afterSvelte = transform_svelte_code(afterModule, migrate, {
          filename: file,
          use_ts: true,
        })
        if (afterSvelte !== before) {
          writeFileSync(file, afterSvelte, 'utf8')
          svelteCount++
        }
      } catch (e) {
        errorCount++
        errors.push({ file, error: (e as Error).message })
      }
    } else if (file.endsWith('.ts') || file.endsWith('.js')) {
      try {
        const before = readFileSync(file, 'utf8')
        const after = transform_module_code(before)
        if (after !== before) {
          writeFileSync(file, after, 'utf8')
          moduleCount++
        }
      } catch (e) {
        errorCount++
        errors.push({ file, error: (e as Error).message })
      }
    }
  }
}

console.log(
  `\nMigration complete: ${svelteCount} .svelte updated, ${moduleCount} .ts/.js updated, ${errorCount} errors.`,
)
if (errors.length > 0) {
  console.log('\nErrors:')
  for (const { file, error } of errors) {
    console.log(`  ${file}: ${error}`)
  }
  process.exit(1)
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

async function findUp(
  start: string,
  filename: string,
  predicate: (path: string) => boolean,
): Promise<string | null> {
  let cur = start
  while (true) {
    const candidate = join(cur, filename)
    try {
      if (statSync(candidate).isFile() && predicate(candidate)) return cur
    } catch {
      /* not present */
    }
    const next = cur.endsWith(sep) ? cur : cur.split(sep).slice(0, -1).join(sep) || sep
    if (next === cur) return null
    cur = next
  }
}
