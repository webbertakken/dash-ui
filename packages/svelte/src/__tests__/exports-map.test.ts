/**
 * Every module a consumer may need on its own has a subpath, so a page
 * can import what it draws without loading the whole barrel.
 */
import { readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const pkg = resolve(import.meta.dirname, '../..')
const exportsMap = JSON.parse(readFileSync(join(pkg, 'package.json'), 'utf8')).exports as Record<
  string,
  unknown
>

/** The file a subpath resolves to through a `*` pattern of the exports map, if any. */
function resolveSubpath(subpath: string): string | undefined {
  for (const [pattern, target] of Object.entries(exportsMap)) {
    if (typeof target !== 'string' || !pattern.includes('*')) continue
    const [prefix, suffix] = pattern.split('*') as [string, string]
    if (!subpath.startsWith(prefix) || !subpath.endsWith(suffix)) continue
    const star = subpath.slice(prefix.length, subpath.length - suffix.length)
    return target.replace('*', star)
  }
  return undefined
}

const files = (folder: string, extension: string): string[] =>
  readdirSync(join(pkg, 'src/lib', folder)).filter((file) => file.endsWith(extension))

describe('package exports', () => {
  it('reaches every component through ./components/<Name>.svelte', () => {
    for (const file of files('components', '.svelte')) {
      expect(resolveSubpath(`./components/${file}`)).toBe(`./src/lib/components/${file}`)
    }
  })

  it('reaches every icon through ./icons/<Name>.svelte', () => {
    for (const file of files('icons', '.svelte')) {
      expect(resolveSubpath(`./icons/${file}`)).toBe(`./src/lib/icons/${file}`)
    }
  })

  it('reaches every action through ./actions/<name>', () => {
    for (const file of files('actions', '.ts')) {
      const name = file.replace(/\.ts$/, '')
      expect(resolveSubpath(`./actions/${name}`)).toBe(`./src/lib/actions/${file}`)
    }
  })
})
