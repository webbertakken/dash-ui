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
