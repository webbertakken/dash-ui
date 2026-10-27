import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { describe, it, expect } from 'vitest'

/**
 * Since Storybook 9 the essentials (controls, actions, backgrounds, viewport,
 * toolbars, measure, outline) live in `storybook` core; only docs remains an
 * addon. `remark-gfm` reaches the MDX pipeline through the
 * `@storybook/addon-docs` entry's `mdxPluginOptions`; without it pipe-tables
 * in MDX render as a literal paragraph of `|` characters.
 *
 * This test guards that shape across all three storybooks so a future
 * refactor can't silently re-break GFM tables.
 */

const storybookApps = [
  'apps/storybook-react',
  'apps/storybook-svelte',
  'apps/storybook-wc',
] as const

function read(rel: string): string {
  return readFileSync(path.join(process.cwd(), rel), 'utf8')
}

function stripComments(src: string): string {
  return src.replace(/\/\/[^\n]*|\/\*[\s\S]*?\*\//g, '')
}

function mdxFiles(dir: string): string[] {
  return readdirSync(path.join(process.cwd(), dir), { recursive: true, encoding: 'utf8' })
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => path.join(dir, file))
}

describe.each(storybookApps)('storybook MDX config: %s', (app) => {
  const src = read(`${app}/.storybook/main.ts`)
  const code = stripComments(src)

  it('imports remark-gfm', () => {
    expect(src).toMatch(/import\s+remarkGfm\s+from\s+['"]remark-gfm['"]/)
  })

  it('registers @storybook/addon-docs with mdxPluginOptions', () => {
    // Match the addon-docs object form: { name: '@storybook/addon-docs', options: { mdxPluginOptions: {...} } }
    const addonDocs = code.match(
      /\{\s*name:\s*['"]@storybook\/addon-docs['"][\s\S]*?options:\s*\{([\s\S]*?)\}\s*,?\s*\}/,
    )
    expect(addonDocs, '@storybook/addon-docs must appear as an addon entry').not.toBeNull()
    const optionsBody = addonDocs![1]
    expect(optionsBody).toMatch(/mdxPluginOptions/)
    expect(optionsBody).toMatch(/mdxCompileOptions/)
    expect(optionsBody).toMatch(/remarkPlugins/)
    expect(optionsBody).toMatch(/remarkGfm/)
  })

  it('does not register addons that moved into storybook core', () => {
    expect(code).not.toMatch(/@storybook\/addon-essentials/)
  })

  it('keeps the addon list addon-docs -> addon-a11y -> addon-themes', () => {
    // Order matters: addon-docs must register before addon-a11y/addon-themes
    // so its preset wins the MDX pipeline. (Storybook applies addons in order;
    // later entries can only override, never inject earlier.)
    const indexOfAddon = (name: string) => {
      const m = new RegExp(`(?:name:\\s*['"]${name}['"]|^\\s*['"]${name}['"])`, 'm').exec(code)
      return m ? m.index : -1
    }
    const idxDocs = indexOfAddon('@storybook/addon-docs')
    const idxA11y = indexOfAddon('@storybook/addon-a11y')
    const idxThemes = indexOfAddon('@storybook/addon-themes')
    expect(idxDocs).toBeGreaterThanOrEqual(0)
    expect(idxA11y).toBeGreaterThan(idxDocs)
    expect(idxThemes).toBeGreaterThan(idxA11y)
  })

  it('imports doc blocks from @storybook/addon-docs/blocks in every MDX page', () => {
    const offenders = mdxFiles(`${app}/src`).filter((file) =>
      /from\s+['"]@storybook\/blocks['"]/.test(read(file)),
    )
    expect(offenders).toEqual([])
  })
})

describe('storybook MDX config: package.json dependencies', () => {
  it.each(storybookApps)('%s declares @storybook/addon-docs', (app) => {
    const pkg = JSON.parse(read(`${app}/package.json`)) as {
      devDependencies?: Record<string, string>
      dependencies?: Record<string, string>
    }
    const version =
      pkg.devDependencies?.['@storybook/addon-docs'] ?? pkg.dependencies?.['@storybook/addon-docs']
    expect(version, `${app} must depend on @storybook/addon-docs`).toBeDefined()
  })

  it.each(storybookApps)('%s drops packages folded into storybook core', (app) => {
    const pkg = JSON.parse(read(`${app}/package.json`)) as {
      devDependencies?: Record<string, string>
      dependencies?: Record<string, string>
    }
    const all = { ...pkg.dependencies, ...pkg.devDependencies }
    expect(all).not.toHaveProperty('@storybook/addon-essentials')
    expect(all).not.toHaveProperty('@storybook/blocks')
  })
})
