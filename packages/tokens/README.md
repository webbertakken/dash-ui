# @w5-ui/tokens

Design tokens for the Dash UI design system. CSS variables + typed JS constants.

```ts
import '@w5-ui/tokens/css' // imports the CSS variable definitions
import { brand, status } from '@w5-ui/tokens'
```

The CSS exports two motifs:

```html
<html data-motif="dark">
  <!-- dashboard -->
  <html data-motif="light">
    <!-- store / marketing -->
  </html>
</html>
```

## CSS entry points

The package ships four CSS files. Pick by what your app needs:

| Import                            | What it ships                                                      | When                                              |
| --------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------- |
| `@w5-ui/tokens/tokens.css`        | Raw CSS variables (dark + light)                                   | You want token vars only, nothing else            |
| `@w5-ui/tokens/dashboard.css`     | `.app` / `.workspace` / `.grid` / `.card` / `.ph-bar` chrome       | You want the canonical dashboard layout / rhythm  |
| `@w5-ui/tokens/tailwind.css`      | `tokens.css` + `@theme inline` bridge + `dark:` data-motif variant | You use Tailwind v4 and want token utilities only |
| `@w5-ui/tokens/tailwind-full.css` | `tailwind.css` + `dashboard.css` (single import)                   | You use Tailwind v4 and want chrome classes too   |

`tailwind.css` does **not** include `dashboard.css`. Tailwind users who also want the canonical
chrome classes can either reach for the one-stop `tailwind-full.css`:

```css
@import 'tailwindcss';
@import '@w5-ui/tokens/tailwind-full.css';
```

…or import both layers explicitly, in this exact order:

```css
@import 'tailwindcss';
@import '@w5-ui/tokens/tailwind.css';
@import '@w5-ui/tokens/dashboard.css';
```

If you don't import `dashboard.css`, `AppLayout`, `<div className="grid">`, and `<Card>` render as
unstyled boxes — Tailwind utilities still work, but the 12-column grid, page padding, card shell,
and `PageHeader` rhythm are gone. That's the single biggest reason a Tailwind userland app "looks
different" from the **Dashboard** Storybook story.

Easier: skip `tailwind.css` + `dashboard.css` and pull the framework bundle instead — it ships both
layers plus the component CSS in one import:

```ts
import '@w5-ui/react/styles.css' // or '@w5-ui/svelte/styles.css'
```

See **Foundations / Setup** in Storybook for the full end-to-end recipe.
