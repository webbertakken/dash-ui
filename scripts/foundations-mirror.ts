#!/usr/bin/env node
/**
 * Bulk-mirror foundation MDX pages from storybook-react to storybook-svelte
 * and storybook-wc. Performs the trivial framework substitutions so each
 * mirror compiles, then leaves a per-file diff for manual cleanup of
 * framework-specific code blocks.
 *
 * Run with `tsx scripts/foundations-mirror.ts <react|svelte|wc> <name>`. The
 * file is meant to be invoked manually per page; it does not blindly
 * overwrite an existing target without `--force`.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs'
import path from 'node:path'

const REACT_DIR = 'apps/storybook-react/src/foundations'
const SVELTE_DIR = 'apps/storybook-svelte/src/foundations'
const WC_DIR = 'apps/storybook-wc/src/foundations'

function mirror(framework: 'svelte' | 'wc', file: string, force = false): void {
  const targetDir = framework === 'svelte' ? SVELTE_DIR : WC_DIR
  const sourcePath = path.join(REACT_DIR, file)
  const targetPath = path.join(targetDir, file)
  if (!existsSync(sourcePath)) throw new Error(`source missing: ${sourcePath}`)
  if (existsSync(targetPath) && !force) {
    console.error(`skip (exists): ${targetPath} — pass --force to overwrite`)
    return
  }
  const src = readFileSync(sourcePath, 'utf8')
  let out = src
  if (framework === 'svelte') {
    out = out
      .replace(/from '@w5-ui\/react'/g, "from '@w5-ui/svelte'")
      .replace(/@w5-ui\/react\/styles\.css/g, '@w5-ui/svelte/styles.css')
      .replace(/```tsx/g, '```svelte')
  } else {
    out = out
      // Drop the React-style `import { ... } from '@w5-ui/react'` lines
      // wholesale inside WC fences — WC is a side-effect register, not a
      // named import. Replace with the canonical register import as a
      // comment line so the snippet still documents the wiring.
      .replace(
        /^import \{[^}]+\} from '@w5-ui\/react'\n/gm,
        '<!-- register all uni-* elements once at app entry -->\n',
      )
      .replace(/from '@w5-ui\/react'/g, "from '@w5-ui/wc'")
      .replace(/@w5-ui\/react\/styles\.css/g, '@w5-ui/wc/styles.css')
      .replace(/```tsx/g, '```html')
  }
  writeFileSync(targetPath, out)
  console.log(`wrote ${targetPath}`)
}

const [, , framework, file, flag] = process.argv
if (!framework || !file) {
  console.error('usage: tsx scripts/foundations-mirror.ts <svelte|wc> <file.mdx|all> [--force]')
  process.exit(1)
}
const force = flag === '--force'
if (framework !== 'svelte' && framework !== 'wc') {
  console.error('framework must be svelte or wc')
  process.exit(1)
}
if (file === 'all') {
  const files = readdirSync(REACT_DIR).filter((f) => f.endsWith('.mdx'))
  for (const f of files) mirror(framework, f, force)
} else {
  mirror(framework, file, force)
}
