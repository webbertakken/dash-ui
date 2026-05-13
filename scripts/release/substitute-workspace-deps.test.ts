import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import {
  resolveWorkspaceSpec,
  substituteInPackage,
  substituteWorkspaceDepsInRepo,
} from './substitute-workspace-deps.ts'

describe('resolveWorkspaceSpec', () => {
  it('rewrites workspace:* to ^X.Y.Z', () => {
    expect(resolveWorkspaceSpec('workspace:*', '1.2.3')).toBe('^1.2.3')
  })

  it('rewrites workspace:^ to ^X.Y.Z', () => {
    expect(resolveWorkspaceSpec('workspace:^', '1.2.3')).toBe('^1.2.3')
  })

  it('rewrites workspace:~ to ~X.Y.Z', () => {
    expect(resolveWorkspaceSpec('workspace:~', '1.2.3')).toBe('~1.2.3')
  })

  it('passes a literal workspace:<range> through verbatim', () => {
    expect(resolveWorkspaceSpec('workspace:>=1.0.0 <2.0.0', '1.2.3')).toBe('>=1.0.0 <2.0.0')
  })

  it('returns null for non-workspace specs', () => {
    expect(resolveWorkspaceSpec('^1.2.3', '1.2.3')).toBeNull()
    expect(resolveWorkspaceSpec('1.2.3', '1.2.3')).toBeNull()
  })
})

describe('substituteInPackage', () => {
  it('rewrites workspace deps across every dep field', () => {
    const versions = new Map([
      ['@scope/a', '0.2.0'],
      ['@scope/b', '0.2.0'],
    ])
    const pkg = {
      name: '@scope/host',
      dependencies: { '@scope/a': 'workspace:*' },
      devDependencies: { '@scope/b': 'workspace:^' },
      peerDependencies: { '@scope/a': 'workspace:~' },
      optionalDependencies: { '@scope/b': 'workspace:1.2.3' },
    }
    const touched = substituteInPackage(pkg, versions)
    expect(touched.sort()).toEqual(
      ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'].sort(),
    )
    expect(pkg.dependencies).toEqual({ '@scope/a': '^0.2.0' })
    expect(pkg.devDependencies).toEqual({ '@scope/b': '^0.2.0' })
    expect(pkg.peerDependencies).toEqual({ '@scope/a': '~0.2.0' })
    expect(pkg.optionalDependencies).toEqual({ '@scope/b': '1.2.3' })
  })

  it('leaves non-workspace specs untouched', () => {
    const versions = new Map([['@scope/a', '0.2.0']])
    const pkg = {
      dependencies: { '@scope/a': '^0.1.0', svelte: '^5.0.0' },
    }
    const touched = substituteInPackage(pkg, versions)
    expect(touched).toEqual([])
    expect(pkg.dependencies).toEqual({ '@scope/a': '^0.1.0', svelte: '^5.0.0' })
  })

  it('leaves workspace deps without a resolved version untouched', () => {
    const versions = new Map<string, string>()
    const pkg = { dependencies: { '@scope/unknown': 'workspace:*' } }
    const touched = substituteInPackage(pkg, versions)
    expect(touched).toEqual([])
    expect(pkg.dependencies).toEqual({ '@scope/unknown': 'workspace:*' })
  })

  it('returns no fields when the package has no deps at all', () => {
    const versions = new Map([['@scope/a', '0.2.0']])
    const pkg = { name: '@scope/empty' }
    expect(substituteInPackage(pkg, versions)).toEqual([])
  })
})

describe('substituteWorkspaceDepsInRepo', () => {
  let root: string

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), 'dashui-sub-'))
  })
  afterEach(() => {
    rmSync(root, { recursive: true, force: true })
  })

  function writePkg(rel: string, json: Record<string, unknown>): void {
    const dir = join(root, rel)
    mkdirSync(dir, { recursive: true })
    writeFileSync(join(dir, 'package.json'), JSON.stringify(json, null, 2) + '\n')
  }
  function readPkg(rel: string): Record<string, unknown> {
    return JSON.parse(readFileSync(join(root, rel, 'package.json'), 'utf8')) as Record<
      string,
      unknown
    >
  }

  it('rewrites workspace deps across non-private packages', () => {
    writePkg('.', { name: 'root', workspaces: ['apps/*', 'packages/*'] })
    writePkg('packages/tokens', { name: '@w5-ui/tokens', version: '0.2.0' })
    writePkg('packages/svelte', {
      name: '@w5-ui/svelte',
      version: '0.2.0',
      dependencies: { '@w5-ui/tokens': 'workspace:*' },
    })

    const report = substituteWorkspaceDepsInRepo(root)
    expect(report.rewritten.map((r) => r.name)).toEqual(['@w5-ui/svelte'])
    expect(report.skippedPrivate).toEqual([])
    expect(report.skippedNoChange).toEqual(['@w5-ui/tokens'])

    const svelte = readPkg('packages/svelte') as { dependencies: Record<string, string> }
    expect(svelte.dependencies['@w5-ui/tokens']).toBe('^0.2.0')
  })

  it('skips private workspace packages entirely', () => {
    writePkg('.', { name: 'root', workspaces: ['apps/*', 'packages/*'] })
    writePkg('packages/tokens', { name: '@w5-ui/tokens', version: '0.2.0' })
    writePkg('apps/dashboard', {
      name: 'dashboard',
      version: '0.0.1',
      private: true,
      dependencies: { '@w5-ui/tokens': 'workspace:*' },
    })

    const report = substituteWorkspaceDepsInRepo(root)
    expect(report.skippedPrivate).toEqual(['dashboard'])
    // Private package was not rewritten on disk
    const dash = readPkg('apps/dashboard') as { dependencies: Record<string, string> }
    expect(dash.dependencies['@w5-ui/tokens']).toBe('workspace:*')
  })

  it('handles repos with no workspaces declared', () => {
    writePkg('.', { name: 'root' })
    const report = substituteWorkspaceDepsInRepo(root)
    expect(report).toEqual({ rewritten: [], skippedPrivate: [], skippedNoChange: [] })
  })

  it('tolerates workspace dirs that lack a package.json', () => {
    writePkg('.', { name: 'root', workspaces: ['packages/*'] })
    mkdirSync(join(root, 'packages', 'empty'), { recursive: true })
    writePkg('packages/tokens', { name: '@w5-ui/tokens', version: '0.2.0' })
    const report = substituteWorkspaceDepsInRepo(root)
    expect(report.skippedNoChange).toEqual(['@w5-ui/tokens'])
    expect(report.rewritten).toEqual([])
  })

  it('throws on unsupported workspace glob patterns', () => {
    writePkg('.', { name: 'root', workspaces: ['packages/**'] })
    expect(() => substituteWorkspaceDepsInRepo(root)).toThrow(/unsupported workspace pattern/)
  })

  it('writes a final newline so prettier/oxfmt-style diffs stay clean', () => {
    writePkg('.', { name: 'root', workspaces: ['packages/*'] })
    writePkg('packages/tokens', { name: '@w5-ui/tokens', version: '0.2.0' })
    writePkg('packages/svelte', {
      name: '@w5-ui/svelte',
      version: '0.2.0',
      dependencies: { '@w5-ui/tokens': 'workspace:*' },
    })
    substituteWorkspaceDepsInRepo(root)
    const raw = readFileSync(join(root, 'packages/svelte/package.json'), 'utf8')
    expect(raw.endsWith('\n')).toBe(true)
  })
})
