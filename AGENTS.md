# Dash UI - design-system monorepo

Multi-framework dashboard design system: tokens, brand assets, and component libraries for React,
Svelte and framework-agnostic Web Components, plus two reference dashboard apps and three Storybook
instances.

## Layout

```
packages/
  tokens/          @w5-ui/tokens          CSS variables (dark + light motifs) + JS token map
  assets/          @w5-ui/assets          Brand mark, wordmark, app-rail icons
  react/           @w5-ui/react           ~170 React 18 components
  svelte/          @w5-ui/svelte          ~170 Svelte 4 components, mirrored API
  wc/              @w5-ui/wc              ~165 framework-agnostic custom elements compiled from the Svelte sources
  storybook-meta/  @w5-ui/storybook-meta  Shared sidebar category map (single source of truth across all storybooks)

apps/
  dashboard-react/   Vite + React reference dashboard (14 pages, full chrome)
  dashboard-svelte/  Vite + Svelte reference dashboard (feature parity)
  storybook-react/   Storybook 8 (React renderer)
  storybook-svelte/  Storybook 8 (Svelte renderer)
  storybook-wc/      Storybook 8 (Web Components renderer)
  storybook-site/    Assembles all three Storybooks into a single static site under /, /svelte/, /wc/
```

## Commands

- `yarn install` - install everything
- `yarn dev:react` - reference dashboard at http://localhost:5173
- `yarn dev:svelte` - reference dashboard at http://localhost:5174
- `yarn dev:storybook` - React Storybook at http://localhost:6006
- `yarn test` - ~1,300 vitest tests across React, Svelte and Web Components
- `yarn build` - build all packages
- `yarn build:site` - build the static tri-framework Storybook site into `apps/storybook-site/dist`
- `yarn serve:site` - serve the assembled site at http://localhost:4173

## Releases

- `yarn changeset` before merge to bump versions
- Merge to main opens auto Version Packages PR
- GH Releases fire only on `X.0.0` where X >= 1

## Rules

- Every Vite app + storybook wires Tailwind v4

## Source of truth

- Component-category mapping (12 sidebar groups): `packages/storybook-meta/src/categories.ts`
- Design tokens: `packages/tokens/src/tokens.css` (CSS variables for both motifs) and
  `packages/tokens/src/tokens.ts` (the JS surface)
- Reference dashboard pages (the canonical usage examples): `apps/dashboard-react/src/pages/*` and
  `apps/dashboard-svelte/src/pages/*`
