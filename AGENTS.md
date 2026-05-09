# Dashboard design system monorepo

Dash-flavored dashboard design system, recreated from the Claude Design handoff bundle in `design-bundle/`.

## Layout

```
packages/
  tokens/   CSS variables + JS token map (single source of truth)
  assets/   Brand SVG logos (Network, Protect, Access, Talk, Connect, Drive, Site Manager, Demo mark + wordmark)
  react/    React component library (@dash-ui/react)
  svelte/   Svelte component library (@dash-ui/svelte)
apps/
  dashboard-react/   Vite + React app: full Dash Network dashboard
  dashboard-svelte/  Vite + Svelte app: feature parity with the React app
design-bundle/       Original handoff bundle (read-only reference)
```

## Commands

- `pnpm install` - install everything
- `pnpm dev:react` - start the React dashboard at `http://localhost:5173`
- `pnpm dev:svelte` - start the Svelte dashboard at `http://localhost:5174`
- `pnpm build` - build all packages and apps

## Source of truth

Visual fidelity targets live in `design-bundle/dash-ui-design-system/`. The README there has the full content/visual/iconography spec. `colors_and_type.css` is copied verbatim into `packages/tokens/src/tokens.css`.
