# @w5-ui/svelte

Svelte component library for the Dash UI design system. Mirrors `@w5-ui/react` 1:1. Pairs with
`@w5-ui/tokens` for design tokens and `@w5-ui/assets` for brand SVGs.

```bash
yarn add @w5-ui/svelte
```

## Quick start

```svelte
<script lang="ts">
  import '@w5-ui/svelte/styles.css' // ships @w5-ui/tokens/dashboard.css
  import { AppLayout, Topbar, Sidebar, PageHeader, Card, Stat, Pill } from '@w5-ui/svelte'
</script>

<AppLayout pageLabel="Dashboard">
  <Topbar slot="topbar" siteName="HQ" activeApp="system" />
  <Sidebar slot="sidebar" sections={SECTIONS} activeId={page} on:change={(e) => (page = e.detail)} />

  <PageHeader title="Dashboard" />
  <div class="grid">
    <Stat span={4} label="Internet" value="847" unit="Mbps" />
    <Stat span={4} label="Clients" value="124" />
    <Stat span={4} label="Throughput" value="12.4" unit="Gbps" />
    <Card span={8}>
      <h3>
        Traffic <Pill variant="success">healthy</Pill>
      </h3>
    </Card>
    <Card span={4}>
      <h3>Top clients</h3>
    </Card>
  </div>
</AppLayout>
```

That single skeleton (`AppLayout` then `PageHeader` then `<div class="grid">` then
`<Card span={n}>`) carries every padding, gap, and column value the reference dashboards use.
Reproduce it verbatim and spacing falls into place automatically.

## The contract (read this before styling anything)

The reference dashboards (`apps/dashboard-svelte`, rendered in Storybook under **Dashboard**) all
share one skeleton. Userland looking different almost always comes down to one of these:

| Don't                                                          | Do                                                                                 |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Wrap `.grid` in your own `<div style="padding: ...">`          | Render `.grid` as a direct child of `<main>`. It already pads 16px x 24px.         |
| `display: flex; gap: ...` on the page root                     | Render `<Banner>`, `<PageHeader>`, `.grid` as siblings. They own their spacing.    |
| Re-implement `.card` with a `<div>` and a custom border-radius | Use `<Card>` or `<Stat>`. The radius, padding, and `<h3>` rhythm ship together.    |
| `<h3>` outside a `<Card>`                                      | Keep titles inside `<Card>`. The `.card h3` selector sizes and colours them.       |
| `<span style="color: green">online</span>`                     | Use `<Pill variant="success">online</Pill>` (also `<Badge>`, `<StatusIndicator>`). |
| Mix `span={5}` and `span={7}`                                  | Use 4 / 6 / 8 / 12 so rows divide cleanly into the 12-column grid.                 |
| Skip `AppLayout` and roll your own `.app` grid                 | Use `AppLayout` once at the root. `.app`, `.workspace`, and `<main>` line up.      |
| Hand-pick hex colours                                          | Use tokens via the `data-motif` CSS variables. See `@w5-ui/tokens`.                |

## Grid math

`.grid` is `repeat(12, 1fr)` with a 12px gap and 16px x 24px outer padding.

| Tile width | `span` | Typical use                          |
| ---------- | ------ | ------------------------------------ |
| Third      | `4`    | Single-stat card, donut              |
| Half       | `6`    | Two-column comparison                |
| Two-thirds | `8`    | Wide table, line chart               |
| Full       | `12`   | Time series, sankey, page-wide table |

4+4+4, 8+4, 6+6, and 12 all snap cleanly. Avoid 5 and 7. They leave dead pixels and force the next
row to wrap unevenly.

## What lives where

| Package         | Description                                              |
| --------------- | -------------------------------------------------------- |
| `@w5-ui/svelte` | ~170 Svelte components (this package)                    |
| `@w5-ui/react`  | The same component surface for React                     |
| `@w5-ui/tokens` | CSS variables (`data-motif="dark"` / `"light"`) + JS map |
| `@w5-ui/assets` | Brand mark, wordmark, app-rail SVGs                      |

`@w5-ui/svelte/styles.css` re-exports `@w5-ui/tokens/dashboard.css`, so importing it once is enough
for tokens, the `.app` / `.workspace` / `.grid` / `.card` classes, and component styles.

## Themes

Two motifs ship in tokens:

```html
<html data-motif="dark">
  <!-- the default -->
</html>
<html data-motif="light"></html>
```

Set the attribute on `<html>` (or any ancestor of the app root) to switch.

## CSS hooks you can rely on

Stable class names that ship from `@w5-ui/tokens/dashboard.css`:

- `.app`, `.workspace`, `.content`: outer chrome, wired up by `AppLayout`
- `.grid`: 12-column page grid with the canonical gutter
- `.card`, `.card h3`: tile shell and title rhythm. Use through `<Card>` or `<Stat>`.
- `.ph-bar`, `.ph-title`, `.ph-actions`: page header primitives. Use through `<PageHeader>`.
- `.field-stack`, `.form-row`, `.form-actions`: form rhythm primitives
- `.mac`, `.name-cell`: monospace and avatar-style cell layouts

Anything else (raw colours, ad-hoc paddings) should come from tokens, not bespoke values.

## Reference

- **Storybook (Svelte)**: `/svelte/` in the published site
- **Foundations / Page layout**: the canonical recipe in full, with anatomy and pitfalls
- **Foundations / Spacing**: the 12-token spacing scale and rhythm rules
- **Foundations / Colours**, **Type**, **Icons**, **Forms**, **Tables**, **Charts**, **Status &
  feedback**, **Navigation**, **Overlays**, **Actions**: pick-by-question tables for every primitive

The Storybook **Dashboard** section renders the reference pages 1:1. When your page looks different,
open the matching story and diff the markup.
