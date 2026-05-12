#!/usr/bin/env tsx
import { spawnSync } from 'node:child_process'
/**
 * Husky self-heal.
 *
 * Yarn 4 skips lifecycle scripts (including `prepare`) on no-op installs,
 * and `.husky/_/` is gitignored so worktrees never have it. This script
 * runs husky's installer if `.husky/_/` is missing. Cheap (~30 ms) when
 * the dir already exists.
 *
 * Wired into the `dev`, `test`, `build`, and `lint` scripts so the hook
 * fabric always exists before anyone touches the repo.
 */
import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(here, '..', '..')
const huskyInternalDir = resolve(repoRoot, '.husky', '_')

if (existsSync(huskyInternalDir)) {
  process.exit(0)
}

const result = spawnSync('npx', ['husky'], {
  cwd: repoRoot,
  stdio: 'inherit',
  shell: process.platform === 'win32',
})

process.exit(result.status ?? 0)
