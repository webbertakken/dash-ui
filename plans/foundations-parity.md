# Foundations parity across all three storybooks

Goal: every foundation page that exists in the React storybook also exists in the Svelte and Web
Components storybooks, with the same `Foundations/X` title and framework-native code examples. Stop
directing Svelte / WC users to the React storybook for the deep dive.

## Background

`apps/storybook-react/src/foundations/` ships 20 foundation MDX pages (Overview, Setup, For agents,
Recipes, Page layout, Type, Colours, Motifs, Spacing, Icons, Cards, Tables, Forms, Actions,
Navigation, Overlays, Status & feedback, Data display, Charts, Troubleshooting) plus a Chart gallery
story. `apps/storybook-svelte/src/foundations/` and `apps/storybook-wc/src/foundations/` each only
ship an `Overview.mdx` that cross-links to the React storybook. The result is that Svelte and WC
users see a single-entry Foundations sidebar and have to leave their storybook to read everything
else.

## Rules

- Mirror titles verbatim (`Foundations/Cards`, etc.) so the sidebar order is identical across all
  three storybooks.
- Mirror the prose verbatim where the content is framework-agnostic (token references, contract
  descriptions, anatomy diagrams).
- Adapt every code example to the target framework's native syntax:
  - **React**: JSX + `import { X } from '@w5-ui/react'`
  - **Svelte**: Svelte 5 component syntax (snippets, `$state`, `bind:`) +
    `import { X } from '@w5-ui/svelte'`
  - **WC**: Custom-element markup (`<uni-x>`) + side-effect register (`import '@w5-ui/wc'`) +
    JS-property setters for complex props
- Adapt every "Common mistakes" row so it lists the drift cases unique to the target framework
  (existing Svelte / WC Overviews already do this for their Overview — extend to every page).
- Cross-links between Foundations pages stay relative to the target storybook, not always to the
  React one.

## Tasks

### Phase 1 — Infrastructure

- [x] Add `scripts/storybook-foundations-parity.test.ts` that asserts every React MDX in
      `apps/storybook-react/src/foundations/*.mdx` has an equivalent file in
      `apps/storybook-svelte/src/foundations/` and `apps/storybook-wc/src/foundations/` with the
      same `<Meta title="...">`.
- [x] Confirm the test fails red with the expected 20-page gap.

### Phase 2 — Svelte foundations parity

For every page, copy + adapt. Use the existing Svelte `Overview.mdx` as the pattern for tone,
cross-link style, and Common-mistakes section.

- [x] `Overview.mdx` — already exists, audit for cross-link parity
- [x] `Setup.mdx` — install `@w5-ui/svelte` + tokens, import order, motif attr
- [x] `ForAgents.mdx` — Tailwind-drift → typed primitive cheat sheet with Svelte syntax
- [x] `Recipes.mdx` — three copy-paste page templates in Svelte 5 syntax
- [x] `PageLayout.mdx`
- [x] `Type.mdx`
- [x] `Colours.mdx`
- [x] `Motifs.mdx`
- [x] `Spacing.mdx`
- [x] `Icons.mdx`
- [x] `Cards.mdx`
- [x] `Tables.mdx`
- [x] `Forms.mdx`
- [x] `Actions.mdx`
- [x] `Navigation.mdx`
- [x] `Overlays.mdx`
- [x] `StatusFeedback.mdx`
- [x] `DataDisplay.mdx`
- [x] `Charts.mdx`
- [x] `Troubleshooting.mdx`

### Phase 3 — Web Components foundations parity

Same scope as Svelte but with custom-element markup. Use the existing WC `Overview.mdx` as the
pattern.

- [x] `Overview.mdx` — already exists, audit for cross-link parity
- [x] `Setup.mdx`
- [x] `ForAgents.mdx`
- [x] `Recipes.mdx`
- [x] `PageLayout.mdx`
- [x] `Type.mdx`
- [x] `Colours.mdx`
- [x] `Motifs.mdx`
- [x] `Spacing.mdx`
- [x] `Icons.mdx`
- [x] `Cards.mdx`
- [x] `Tables.mdx`
- [x] `Forms.mdx`
- [x] `Actions.mdx`
- [x] `Navigation.mdx`
- [x] `Overlays.mdx`
- [x] `StatusFeedback.mdx`
- [x] `DataDisplay.mdx`
- [x] `Charts.mdx`
- [x] `Troubleshooting.mdx`

### Phase 4 — Verification

- [x] Parity test green
- [x] All three storybooks render every foundation page without MDX compile errors
- [x] Visually spot-check Cards / Setup / Recipes / Troubleshooting in Svelte + WC
- [x] Run full `yarn test`, `yarn lint`, `yarn typecheck`, `yarn format:check`
- [x] Commit, push, open PR, merge
