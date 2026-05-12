# Dash UI

A multi-framework dashboard design system:

- Subtle, clean and factual dashboard components - dark-first, blue accent, generous data density.
- Has `tokens`, `components` and a full reference dashboard
- Shipped for **React**, **Svelte**, and as **framework-agnostic Web Components**.
- Online [demo](https://webbertakken.github.io/dash-ui).

## Origin and creation

- The initial designs were created using a combination of Claude Design and Google Stitch.
- The visual direction was inspired by UniFi's dashboard aesthetic (not affiliated or a derivative).
- Andrej Karpathy's [auto research](https://github.com/karpathy/autoresearch) was used for complete
  accessibility and components set.

If you spot anything you believe is misattributed, please let me know by opening an issue.

## Tokens

Two motifs ship in `tokens.css`. Apply via a data attribute on `<html>`:

```html
<html data-motif="dark">
  <!-- default -->
  <html data-motif="light"></html>
</html>
```

Brand blue is `#006FFF`. Status: `#00B070` ok, `#F5A623` warn, `#F03A3A` critical. Type: Inter
(UI) + JetBrains Mono (IPs / MACs / SKUs). Default radius 6 px (12 for modals, 9999 for pills).

## Usage

- **React** users: `yarn add @w5-ui/react @w5-ui/tokens` then
  `import { Button } from '@w5-ui/react'`
- **Svelte** users: `yarn add @w5-ui/svelte @w5-ui/tokens` then
  `import Button from '@w5-ui/svelte/components/Button.svelte'`
- **Anywhere else** (Vue, Angular, vanilla, Astro, Hugo): `yarn add @w5-ui/wc @w5-ui/tokens`, import
  `@w5-ui/wc` once for its registration side effect, then use
  `<dash-button variant="primary">Save</dash-button>` etc.

The web component layer is generated from the Svelte sources at build time via thin custom-element
wrappers; props mirror the Svelte API.

## Packages

```
packages/
├── tokens/         @w5-ui/tokens          CSS variables (dark + light motifs) + JS token map
├── assets/         @w5-ui/assets          Mark, wordmark, app rail icons
├── react/          @w5-ui/react           ~170 React 18 components
├── svelte/         @w5-ui/svelte          ~170 Svelte 4 components, mirrored API
├── wc/             @w5-ui/wc              ~165 framework-agnostic custom elements
└── storybook-meta/ @w5-ui/storybook-meta  Sidebar category map shared by all storybooks

apps/
├── dashboard-react/   Vite + React reference dashboard
├── dashboard-svelte/  Vite + Svelte reference dashboard (feature parity)
├── storybook-react/   Storybook 8 (React renderer)
├── storybook-svelte/  Storybook 8 (Svelte renderer)
├── storybook-wc/      Storybook 8 (Web Components renderer)
└── storybook-site/    Static site assembling all three Storybooks under one host
```

## Commands

```bash
yarn install           # install everything
yarn dev:react         # reference dashboard, http://localhost:5173
yarn dev:svelte        # reference dashboard, http://localhost:5174
yarn dev:storybook     # storybook for React,  http://localhost:6006
yarn test              # vitest, ~1,300 tests across all three frameworks
yarn test:coverage     # v8 coverage report
yarn build             # build all packages
yarn build:site        # build all three storybooks + landing page into apps/storybook-site/dist
yarn serve:site        # serve the assembled site, http://localhost:4173
```

## License

[MIT](./LICENSE) License.
