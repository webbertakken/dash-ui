/**
 * Rewrite `workspace:*` (and friends) in every non-private
 * workspace package.json to a concrete semver range pointing at the
 * sibling's current version.
 *
 * Why: `@changesets/cli`'s `version` command bumps `version` fields
 * but does not substitute the workspace protocol. `changeset
 * publish` then shells out to `npm publish` per package, and
 * `npm publish` from inside a package directory does not know about
 * yarn workspaces, so it uploads the raw `workspace:*` string to
 * the registry. Consumers outside the monorepo cannot resolve it.
 *
 * This script is meant to run in CI between `changeset version`
 * (which produces the bumped version numbers) and `changeset
 * publish` (which uploads the tarballs). It is a no-op for
 * already-substituted ranges.
 *
 * Substitution rules (matches yarn's pack-time behaviour):
 *
 *   workspace:*       -> ^X.Y.Z
 *   workspace:^       -> ^X.Y.Z
 *   workspace:~       -> ~X.Y.Z
 *   workspace:<range> -> <range>     (literal range passthrough)
 *
 * Private workspaces (apps/storybooks) are skipped — they never
 * publish, so their leaked workspace:* deps don't matter.
 */

import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

export interface WorkspacePackage {
  dir: string
  name: string
  version: string
  private: boolean
  pkg: Record<string, unknown>
}

const DEP_FIELDS = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies',
] as const

type DepField = (typeof DEP_FIELDS)[number]

/**
 * Translate a workspace-protocol spec into a concrete semver range
 * given the resolved target version. Returns `null` if `spec` is
 * not a workspace protocol string.
 */
export function resolveWorkspaceSpec(spec: string, target: string): string | null {
  if (!spec.startsWith('workspace:')) return null
  const range = spec.slice('workspace:'.length)
  if (range === '*' || range === '^') return `^${target}`
  if (range === '~') return `~${target}`
  return range
}

/**
 * Apply substitution to a single package.json object. Returns the
 * list of fields touched. Mutates `pkg` in place.
 */
export function substituteInPackage(
  pkg: Record<string, unknown>,
  versions: ReadonlyMap<string, string>,
): DepField[] {
  const touched: DepField[] = []
  for (const field of DEP_FIELDS) {
    const deps = pkg[field]
    if (!deps || typeof deps !== 'object') continue
    const depsRecord = deps as Record<string, string>
    let fieldTouched = false
    for (const [name, spec] of Object.entries(depsRecord)) {
      const target = versions.get(name)
      if (target === undefined) continue
      const next = resolveWorkspaceSpec(spec, target)
      if (next === null) continue
      depsRecord[name] = next
      fieldTouched = true
    }
    if (fieldTouched) touched.push(field)
  }
  return touched
}

/**
 * Read a workspace package's package.json from disk. Returns
 * `null` if the directory has no package.json (a stray child of
 * `apps/` or `packages/` that isn't a workspace).
 */
function loadPackage(dir: string): WorkspacePackage | null {
  const path = join(dir, 'package.json')
  let raw: string
  try {
    raw = readFileSync(path, 'utf8')
  } catch {
    return null
  }
  const pkg = JSON.parse(raw) as Record<string, unknown>
  const name = pkg.name
  const version = pkg.version
  if (typeof name !== 'string' || typeof version !== 'string') return null
  return {
    dir,
    name,
    version,
    private: pkg.private === true,
    pkg,
  }
}

/**
 * Expand a single workspace glob (e.g. `packages/*`) into actual
 * directories that contain a package.json. We only support the
 * trailing `/*` form because that's all this monorepo uses; if
 * dash-ui ever grows more elaborate workspace globs we'll need a
 * real glob lib.
 */
function expandWorkspaceGlob(root: string, pattern: string): string[] {
  if (!pattern.endsWith('/*')) {
    throw new Error(`unsupported workspace pattern: ${pattern} (only "<dir>/*" is supported)`)
  }
  const base = pattern.slice(0, -2)
  const absBase = join(root, base)
  let entries: string[]
  try {
    entries = readdirSync(absBase)
  } catch {
    return []
  }
  return entries
    .map((entry) => join(absBase, entry))
    .filter((p) => {
      try {
        return statSync(p).isDirectory()
      } catch {
        return false
      }
    })
}

export interface SubstitutionReport {
  rewritten: { dir: string; name: string; fields: DepField[] }[]
  skippedPrivate: string[]
  skippedNoChange: string[]
}

/**
 * Walk every workspace package, rewrite workspace-protocol deps in
 * the non-private ones, and write changes back to disk. Returns a
 * summary report (for CI logging + tests).
 */
export function substituteWorkspaceDepsInRepo(root: string): SubstitutionReport {
  const rootPkgRaw = readFileSync(join(root, 'package.json'), 'utf8')
  const rootPkg = JSON.parse(rootPkgRaw) as { workspaces?: string[] }
  const patterns = rootPkg.workspaces ?? []
  const dirs = patterns.flatMap((p) => expandWorkspaceGlob(root, p))

  const all: WorkspacePackage[] = []
  for (const dir of dirs) {
    const pkg = loadPackage(dir)
    if (pkg) all.push(pkg)
  }

  const versions = new Map<string, string>()
  for (const wp of all) {
    if (!wp.private) versions.set(wp.name, wp.version)
  }

  const report: SubstitutionReport = {
    rewritten: [],
    skippedPrivate: [],
    skippedNoChange: [],
  }

  for (const wp of all) {
    if (wp.private) {
      report.skippedPrivate.push(wp.name)
      continue
    }
    const fields = substituteInPackage(wp.pkg, versions)
    if (fields.length === 0) {
      report.skippedNoChange.push(wp.name)
      continue
    }
    writeFileSync(join(wp.dir, 'package.json'), JSON.stringify(wp.pkg, null, 2) + '\n')
    report.rewritten.push({ dir: wp.dir, name: wp.name, fields })
  }

  return report
}

// Entry point: invoked as a tsx script. Skip when imported.
if (import.meta.url === `file://${process.argv[1]}`) {
  const report = substituteWorkspaceDepsInRepo(process.cwd())
  for (const { name, fields } of report.rewritten) {
    console.log(`  rewrote workspace:* in ${name} (${fields.join(', ')})`)
  }
  console.log(
    `\nSubstituted ${report.rewritten.length} package(s), ` +
      `${report.skippedNoChange.length} unchanged, ` +
      `${report.skippedPrivate.length} skipped (private).`,
  )
}
