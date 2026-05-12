#!/usr/bin/env tsx
// Reads every .tsx file in packages/react/src/components and prints
// JSON of { file, exports: [{ name, kind }] } where kind is "component"
// (function name starts with capital and signature returns JSX) or "other".

import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const dir = path.resolve('packages/react/src/components')
const files = (await readdir(dir)).filter((f) => f.endsWith('.tsx')).sort()

interface ExportInfo {
  name: string
  kind: 'component' | 'hook' | 'object' | 'type' | 'other'
}

const out: { file: string; exports: ExportInfo[] }[] = []
for (const file of files) {
  const src = await readFile(path.join(dir, file), 'utf8')
  const exports: ExportInfo[] = []
  // function declarations
  for (const m of src.matchAll(/^export\s+function\s+([A-Za-z_$][\w$]*)/gm)) {
    const name = m[1]!
    const kind = /^use[A-Z]/.test(name) ? 'hook' : /^[A-Z]/.test(name) ? 'component' : 'other'
    exports.push({ name, kind })
  }
  // const exports
  for (const m of src.matchAll(/^export\s+const\s+([A-Za-z_$][\w$]*)/gm)) {
    const name = m[1]!
    const kind = /^use[A-Z]/.test(name) ? 'hook' : /^[A-Z]/.test(name) ? 'component' : 'object'
    exports.push({ name, kind })
  }
  // type/interface
  for (const m of src.matchAll(/^export\s+(?:type|interface)\s+([A-Za-z_$][\w$]*)/gm)) {
    exports.push({ name: m[1]!, kind: 'type' })
  }
  out.push({ file, exports })
}

process.stdout.write(JSON.stringify(out, null, 2))
