#!/usr/bin/env tsx
/**
 * After scripts/foundations-mirror.ts performs the trivial framework
 * substitutions, several duplicated-prose artefacts remain (e.g.
 * "Import `@w5-ui/svelte/styles.css` (or `@w5-ui/svelte/styles.css`)").
 * This pass cleans those up and applies framework-aware prose tweaks that
 * are repetitive enough to mechanise but too contextual for the mirror.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import path from 'node:path'

const SVELTE_DIR = 'apps/storybook-svelte/src/foundations'
const WC_DIR = 'apps/storybook-wc/src/foundations'

function cleanupSvelte(src: string): string {
  return (
    src
      // Duplicate framework parenthetical after mirror
      .replace(
        /`@w5-ui\/svelte\/styles\.css` \(or `@w5-ui\/svelte\/styles\.css`\)/g,
        '`@w5-ui/svelte/styles.css`',
      )
      .replace(/`@w5-ui\/react` \/ `@w5-ui\/svelte`/g, '`@w5-ui/svelte`')
      .replace(
        /from `@w5-ui\/react` \(and mirrors in `@w5-ui\/svelte` \/ `@w5-ui\/wc`\)/g,
        'from `@w5-ui/svelte` (mirrors in `@w5-ui/react` / `@w5-ui/wc`)',
      )
      .replace(
        /`@w5-ui\/svelte\/styles\.css` re-exports both for React userland/g,
        '`@w5-ui/svelte/styles.css` re-exports both for Svelte userland',
      )
      .replace(/ships in `@w5-ui\/react`/g, 'ships in `@w5-ui/svelte`')
      // Drop the React-only imports inside fences
      .replace(/^import React from 'react'\n/gm, '')
      .replace(/^import ReactDOM from 'react-dom\/client'\n/gm, '')
      .replace(/^import \{ useState \} from 'react'\n/gm, '')
      .replace(/^import \{ useEffect \} from 'react'\n/gm, '')
      .replace(/^import \{ useState, useEffect \} from 'react'\n/gm, '')
      .replace(/^import \{ useEffect, useState \} from 'react'\n/gm, '')
      // React idioms → Svelte 5 equivalents in code blocks
      .replace(/className=/g, 'class=')
      .replace(/onClick=/g, 'onclick=')
      .replace(/onSubmit=/g, 'onsubmit=')
      .replace(/onKeyDown=/g, 'onkeydown=')
      .replace(/onKeyUp=/g, 'onkeyup=')
      .replace(/onMouseEnter=/g, 'onmouseenter=')
      .replace(/onMouseLeave=/g, 'onmouseleave=')
      .replace(/onFocus=/g, 'onfocus=')
      .replace(/onBlur=/g, 'onblur=')
      .replace(/onScroll=/g, 'onscroll=')
      // tsx → svelte language tag for fences (mirror already did the simple
      // case but some pages have ```tsx without a leading newline boundary)
      .replace(/```tsx\b/g, '```svelte')
      // JSX-only expression-statement prefix (`;<X />`) makes the code
      // visually parse as JS-in-MDX in React but is unidiomatic in Svelte
      // markup files. Drop the leading semicolon so the snippet reads like
      // a real Svelte component invocation.
      .replace(/^;</gm, '<')
      // JSX block comments → HTML / Svelte comments inside fenced code blocks.
      .replace(/\{\/\* ?/g, '<!-- ')
      .replace(/ ?\*\/\}/g, ' -->')
      // Inline-style: React `style={{ k: v }}` → Svelte `style="k: v"`.
      // Best-effort: handles single-property single-line cases.
      .replace(/style=\{\{\s*([^}]+?)\s*\}\}/g, (_m, body: string) => {
        // Map JS keys to CSS property syntax: paddingTop → padding-top.
        const decls = body.split(/,\s*/).map((d) => {
          const [k, v] = d.split(/:\s*/)
          const key = k
            .replace(/^['"]|['"]$/g, '')
            .replace(/([A-Z])/g, '-$1')
            .toLowerCase()
          const value = (v ?? '').trim().replace(/^['"]|['"]$/g, '')
          return `${key}: ${value}`
        })
        return `style="${decls.join('; ')}"`
      })
  )
}

function cleanupWc(src: string): string {
  return (
    src
      .replace(
        /`@w5-ui\/wc\/styles\.css` \(or `@w5-ui\/wc\/styles\.css`\)/g,
        '`@w5-ui/wc/styles.css`',
      )
      .replace(/`@w5-ui\/react` \/ `@w5-ui\/wc`/g, '`@w5-ui/wc`')
      .replace(
        /from `@w5-ui\/react` \(and mirrors in `@w5-ui\/svelte` \/ `@w5-ui\/wc`\)/g,
        'from `@w5-ui/wc` (mirrors in `@w5-ui/react` / `@w5-ui/svelte`)',
      )
      .replace(/ships in `@w5-ui\/react`/g, 'ships in `@w5-ui/wc`')
      .replace(/^import React from 'react'\n/gm, '')
      .replace(/^import ReactDOM from 'react-dom\/client'\n/gm, '')
      .replace(/^import \{ useState \} from 'react'\n/gm, '')
      .replace(/^import \{ useEffect \} from 'react'\n/gm, '')
      // Custom-element substitutions for the most common typed primitives.
      // The WC build exposes every Svelte component as <uni-X> (auto-kebab).
      .replace(/<AppLayout(\s|>)/g, '<uni-app-layout$1')
      .replace(/<\/AppLayout>/g, '</uni-app-layout>')
      .replace(/<PageHeader(\s|\/>|>)/g, '<uni-page-header$1')
      .replace(/<\/PageHeader>/g, '</uni-page-header>')
      .replace(/<Topbar(\s|\/>|>)/g, '<uni-topbar$1')
      .replace(/<\/Topbar>/g, '</uni-topbar>')
      .replace(/<Sidebar(\s|\/>|>)/g, '<uni-sidebar$1')
      .replace(/<\/Sidebar>/g, '</uni-sidebar>')
      .replace(/<Grid(\s|\/>|>)/g, '<uni-grid$1')
      .replace(/<\/Grid>/g, '</uni-grid>')
      .replace(/<Card(\s|\/>|>)/g, '<uni-card$1')
      .replace(/<\/Card>/g, '</uni-card>')
      .replace(/<CardTitle(\s|\/>|>)/g, '<uni-card-title$1')
      .replace(/<\/CardTitle>/g, '</uni-card-title>')
      .replace(/<Stat(\s|\/>|>)/g, '<uni-stat$1')
      .replace(/<\/Stat>/g, '</uni-stat>')
      .replace(/<Pill(\s|\/>|>)/g, '<uni-pill$1')
      .replace(/<\/Pill>/g, '</uni-pill>')
      .replace(/<Badge(\s|\/>|>)/g, '<uni-badge$1')
      .replace(/<\/Badge>/g, '</uni-badge>')
      .replace(/<Button(\s|\/>|>)/g, '<uni-button$1')
      .replace(/<\/Button>/g, '</uni-button>')
      .replace(/<IconButton(\s|\/>|>)/g, '<uni-icon-button$1')
      .replace(/<\/IconButton>/g, '</uni-icon-button>')
      .replace(/<TableShell(\s|\/>|>)/g, '<uni-table-shell$1')
      .replace(/<\/TableShell>/g, '</uni-table-shell>')
      .replace(/<NameCell(\s|\/>|>)/g, '<uni-name-cell$1')
      .replace(/<\/NameCell>/g, '</uni-name-cell>')
      .replace(/<Submeta(\s|\/>|>)/g, '<uni-submeta$1')
      .replace(/<\/Submeta>/g, '</uni-submeta>')
      .replace(/<Unit(\s|\/>|>)/g, '<uni-unit$1')
      .replace(/<\/Unit>/g, '</uni-unit>')
      .replace(/<Delta(\s|\/>|>)/g, '<uni-delta$1')
      .replace(/<\/Delta>/g, '</uni-delta>')
      .replace(/<Body(\s|>)/g, '<uni-body$1')
      .replace(/<\/Body>/g, '</uni-body>')
      .replace(/<H1(\s|>)/g, '<uni-h1$1')
      .replace(/<\/H1>/g, '</uni-h1>')
      .replace(/<H2(\s|>)/g, '<uni-h2$1')
      .replace(/<\/H2>/g, '</uni-h2>')
      .replace(/<H3(\s|>)/g, '<uni-h3$1')
      .replace(/<\/H3>/g, '</uni-h3>')
      .replace(/<H4(\s|>)/g, '<uni-h4$1')
      .replace(/<\/H4>/g, '</uni-h4>')
      .replace(/<Mac(\s|>)/g, '<uni-mac$1')
      .replace(/<\/Mac>/g, '</uni-mac>')
      .replace(/<Mono(\s|>)/g, '<uni-mono$1')
      .replace(/<\/Mono>/g, '</uni-mono>')
      .replace(/<NotifDot(\s|\/>|>)/g, '<uni-notif-dot$1')
      .replace(/<\/NotifDot>/g, '</uni-notif-dot>')
      .replace(/<StatusRing(\s|\/>|>)/g, '<uni-status-ring$1')
      .replace(/<\/StatusRing>/g, '</uni-status-ring>')
      .replace(/<TopbarActions(\s|\/>|>)/g, '<uni-topbar-actions$1')
      .replace(/<\/TopbarActions>/g, '</uni-topbar-actions>')
      // React idioms → vanilla DOM. Most of these get replaced with prose
      // notes in the hand-crafted Setup/Recipes/ForAgents pages; here we
      // just blunt the most visible class= mismatch.
      .replace(/className=/g, 'class=')
      .replace(/```tsx\b/g, '```html')
      // JSX leading-semicolon hack used in React MDX fences
      .replace(/^;</gm, '<')
      // JSX block comments → HTML comments inside fenced code blocks.
      .replace(/\{\/\* ?/g, '<!-- ')
      .replace(/ ?\*\/\}/g, ' -->')
      // Awkward `(register via 'import @w5-ui/wc')` artefact from an
      // earlier mirror pass — collapse it to the canonical comment so the
      // generated fence stays readable.
      .replace(
        /import \{[^}]+\} \(register via `import '@w5-ui\/wc'`\)\n?/g,
        '<!-- register all uni-* elements once at app entry -->\n',
      )
      // JSX-style numeric attribute `span={4}` → HTML string attribute
      // `span="4"`. WC elements receive every attribute as a string and
      // coerce internally. Only target purely-numeric values to avoid
      // mangling expression attributes elsewhere.
      .replace(/=\{(\d+)\}/g, '="$1"')
    // Boolean JSX attrs without a value already work in HTML as bare
    // attribute names, so no change needed for those.
  )
}

function processDir(dir: string, cleaner: (src: string) => string): void {
  const files = readdirSync(dir).filter((f) => f.endsWith('.mdx') && f !== 'Overview.mdx')
  for (const f of files) {
    const p = path.join(dir, f)
    const before = readFileSync(p, 'utf8')
    const after = cleaner(before)
    if (after !== before) {
      writeFileSync(p, after)
      console.log(`cleaned ${p}`)
    }
  }
}

processDir(SVELTE_DIR, cleanupSvelte)
processDir(WC_DIR, cleanupWc)
