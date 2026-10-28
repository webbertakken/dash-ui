import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, it, expect } from 'vitest'

/**
 * Storybook folds its essentials (controls, actions, backgrounds, toolbars,
 * viewport) into core, but MDX docs stay in `@storybook/addon-docs`. That
 * addon only sees `mdxPluginOptions` passed directly in its own addon
 * entry; without them `remark-gfm` never plugs in and pipe-tables in MDX
 * render as a literal paragraph of `|` characters.
 *
 * This test guards that shape across all three storybooks so a future
 * refactor can't silently re-break GFM tables.
 */

const storybookRoots = [
  'apps/storybook-react/.storybook/main.ts',
  'apps/storybook-svelte/.storybook/main.ts',
  'apps/storybook-wc/.storybook/main.ts',
] as const

function read(rel: string): string {
  return readFileSync(path.join(process.cwd(), rel), 'utf8')
}

describe.each(storybookRoots)('storybook MDX config: %s', (configPath) => {
  const src = read(configPath)

  it('imports remark-gfm', () => {
    expect(src).toMatch(/import\s+remarkGfm\s+from\s+['"]remark-gfm['"]/)
  })

  it('does not register the retired @storybook/addon-essentials', () => {
    expect(src).not.toMatch(/@storybook\/addon-essentials/)
  })

  it('registers @storybook/addon-docs as a separate addon with mdxPluginOptions', () => {
    // Match the addon-docs object form: { name: '@storybook/addon-docs', options: { mdxPluginOptions: {...} } }
    const addonDocs = src.match(
      /\{\s*name:\s*['"]@storybook\/addon-docs['"][\s\S]*?options:\s*\{([\s\S]*?)\}\s*,?\s*\}/,
    )
    expect(addonDocs, '@storybook/addon-docs must appear as a separate addon entry').not.toBeNull()
    const optionsBody = addonDocs![1]
    expect(optionsBody).toMatch(/mdxPluginOptions/)
    expect(optionsBody).toMatch(/mdxCompileOptions/)
    expect(optionsBody).toMatch(/remarkPlugins/)
    expect(optionsBody).toMatch(/remarkGfm/)
  })

  it('keeps the addon list addon-docs -> addon-a11y -> addon-themes', () => {
    // Order matters: addon-docs must register before addon-a11y/addon-themes
    // so its preset wins the MDX pipeline. (Storybook applies addons in order;
    // later entries can only override, never inject earlier.)
    // Strip comments first so prose mentions of other addons don't fool the
    // ordering check.
    const code = src.replace(/\/\/[^\n]*|\/\*[\s\S]*?\*\//g, '')
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
})

describe('storybook MDX config: package.json has @storybook/addon-docs as devDep', () => {
  const apps = [
    'apps/storybook-react/package.json',
    'apps/storybook-svelte/package.json',
    'apps/storybook-wc/package.json',
  ] as const

  it.each(apps)('%s declares @storybook/addon-docs', (pkgPath) => {
    const pkg = JSON.parse(read(pkgPath)) as {
      devDependencies?: Record<string, string>
      dependencies?: Record<string, string>
    }
    const versionFromDev = pkg.devDependencies?.['@storybook/addon-docs']
    const versionFromProd = pkg.dependencies?.['@storybook/addon-docs']
    const version = versionFromDev ?? versionFromProd
    expect(version, `${pkgPath} must depend on @storybook/addon-docs`).toBeDefined()
  })

  it.each(apps)('%s drops the v8-only essentials and blocks packages', (pkgPath) => {
    const pkg = JSON.parse(read(pkgPath)) as {
      devDependencies?: Record<string, string>
      dependencies?: Record<string, string>
    }
    const all = { ...pkg.dependencies, ...pkg.devDependencies }
    expect(all['@storybook/addon-essentials']).toBeUndefined()
    expect(all['@storybook/blocks']).toBeUndefined()
  })
})
