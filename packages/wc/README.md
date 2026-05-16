# @w5-ui/wc

Framework-agnostic Web Components (`<dash-*>`) for the Dash UI design system. Compiled from
`@w5-ui/svelte`. Use in any framework or vanilla HTML.

```bash
yarn add @w5-ui/wc
```

## Quick start

```html
<link rel="stylesheet" href="@w5-ui/wc/styles.css" />
<script type="module" src="@w5-ui/wc"></script>

<dash-app-layout page-label="Dashboard">
  <dash-topbar slot="topbar" site-name="HQ" active-app="system"></dash-topbar>
  <dash-sidebar slot="sidebar"></dash-sidebar>

  <dash-page-header title="Dashboard"></dash-page-header>
  <div class="grid">
    <dash-stat span="4" label="Internet" value="847" unit="Mbps"></dash-stat>
    <dash-stat span="4" label="Clients" value="124"></dash-stat>
    <dash-stat span="4" label="Throughput" value="12.4" unit="Gbps"></dash-stat>
    <dash-card span="8">
      <h3>Traffic <dash-pill variant="success">healthy</dash-pill></h3>
    </dash-card>
    <dash-card span="4">
      <h3>Top clients</h3>
    </dash-card>
  </div>
</dash-app-layout>
```

That single skeleton (`dash-app-layout` then `dash-page-header` then `<div class="grid">` then
`<dash-card span="n">`) carries every padding, gap, and column value the reference dashboards use.
Reproduce it verbatim and spacing falls into place automatically.

## The contract (read this before styling anything)

The reference dashboards (rendered in Storybook under **Dashboard**) all share one skeleton.
Userland looking different almost always comes down to one of these:

| Don't                                                          | Do                                                                                        |
| -------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Wrap `.grid` in your own `<div style="padding: ...">`          | Render `.grid` as a direct child of `<main>`. It already pads 16px x 24px.                |
| `display: flex; gap: ...` on the page root                     | Render `dash-banner`, `dash-page-header`, `.grid` as siblings. They own their spacing.    |
| Re-implement `.card` with a `<div>` and a custom border-radius | Use `<dash-card>` or `<dash-stat>`. The radius, padding, and `<h3>` rhythm ship together. |
| `<h3>` outside a `<dash-card>`                                 | Keep titles inside `<dash-card>`. The `.card h3` selector sizes and colours them.         |
| `<span style="color: green">online</span>`                     | Use `<dash-pill variant="success">online</dash-pill>` (or `<dash-badge>`).                |
| Mix `span="5"` and `span="7"`                                  | Use 4 / 6 / 8 / 12 so rows divide cleanly into the 12-column grid.                        |
| Skip `dash-app-layout` and roll your own `.app` grid           | Use `dash-app-layout` once at the root. `.app`, `.workspace`, and `<main>` line up.       |
| Hand-pick hex colours                                          | Use tokens via the `data-motif` CSS variables. See `@w5-ui/tokens`.                       |

## Grid math

`.grid` is `repeat(12, 1fr)` with a 12px gap and 16px x 24px outer padding.

| Tile width | `span` | Typical use                          |
| ---------- | ------ | ------------------------------------ |
| Third      | `4`    | Single-stat card, donut              |
| Half       | `6`    | Two-column comparison                |
| Two-thirds | `8`    | Wide table, line chart               |
| Full       | `12`   | Time series, sankey, page-wide table |

4+4+4, 8+4, 6+6, and 12 all snap cleanly. Avoid 5 and 7. They leave dead pixels.

## What lives where

| Package         | Description                                              |
| --------------- | -------------------------------------------------------- |
| `@w5-ui/wc`     | ~165 custom elements (this package)                      |
| `@w5-ui/react`  | The same component surface for React                     |
| `@w5-ui/svelte` | The same component surface for Svelte                    |
| `@w5-ui/tokens` | CSS variables (`data-motif="dark"` / `"light"`) + JS map |
| `@w5-ui/assets` | Brand mark, wordmark, app-rail SVGs                      |

`@w5-ui/wc/styles.css` re-exports `@w5-ui/tokens/dashboard.css`, so importing it once is enough for
tokens, the `.app` / `.workspace` / `.grid` / `.card` classes, and component styles.

## Themes

Two motifs ship in tokens. Set the attribute on `<html>` (or any ancestor of the app root):

```html
<html data-motif="dark">
  <!-- the default -->
</html>
<html data-motif="light"></html>
```

## Reference

- **Storybook (Web Components)**: `/wc/` in the published site
- **Foundations / Page layout** in `/svelte/` or `/` Storybooks: the canonical recipe in full
- **Foundations / Spacing**, **Colours**, **Type**, **Icons**, **Forms**, **Tables**, **Charts**,
  **Status & feedback**, **Navigation**, **Overlays**, **Actions**: pick-by-question tables for
  every primitive

When your page looks different from the reference, open the matching Storybook story and diff the
markup.
