This repo contains my prototyping Design Systems and their implementations. 

Design Systems present:
| name | prefix | description |
| --- | --- | --- |
| Dashboard | @dash-ui | Subtle, clean and factual dashboard components - dark-first, blue accent, generous data density - live demos: [React](https://webbertakken.github.io/design-system/react/) · [Svelte](https://webbertakken.github.io/design-system/svelte/) · [Web Components](https://webbertakken.github.io/design-system/wc/) |

# Dash UI

A multi-framework dashboard design system: tokens, components and a full reference dashboard, shipped for **React**, **Svelte**, and as **framework-agnostic Web Components**.

## Origin and independence

The visual direction was originally explored as a study of UniFi's dashboard aesthetic. **Dash UI is not affiliated with, endorsed by, or derived from Ubiquiti Inc.**

If you spot anything you believe is misattributed, open an issue.

## Packages

```
packages/
├── tokens/         @dash-ui/tokens          CSS variables (dark + light motifs) + JS token map
├── assets/         @dash-ui/assets          Mark, wordmark, app rail icons
├── react/          @dash-ui/react           ~170 React 18 components
├── svelte/         @dash-ui/svelte          ~170 Svelte 4 components, mirrored API
├── wc/             @dash-ui/wc              ~165 framework-agnostic custom elements
└── storybook-meta/ @dash-ui/storybook-meta  Sidebar category map shared by all storybooks

apps/
├── dashboard-react/   Vite + React reference dashboard
├── dashboard-svelte/  Vite + Svelte reference dashboard (feature parity)
├── storybook-react/   Storybook 8 (React renderer)
├── storybook-svelte/  Storybook 8 (Svelte renderer)
├── storybook-wc/      Storybook 8 (Web Components renderer)
└── storybook-site/    Static site assembling all three Storybooks under one host
```

## What the reference dashboard covers

Both `dashboard-react` and `dashboard-svelte` implement 14 pages with the same data, layout, and visual fidelity:

| Manage | Configure | Insights |
|---|---|---|
| Dashboard | Wi-Fi | AirView |
| Devices | Ports | Infrastructure |
| Client devices | VPN | Integrations |
| Topology | Security | |
| Alarm manager | Settings (8 tabs) | |
| Logs | | |

Plus the shared chrome: top app rail (System / Instances / Agents), site switcher, notification bell, sidebar, command palette, Adopt Device modal, the live Topology view with draggable nodes, and toggle / tab / modal interactions throughout.

## Component categories (12)

Stories in every Storybook are grouped under the same 12 sidebar categories:

1. Foundations
2. Layout
3. Inputs
4. Selection & menus
5. Navigation
6. Feedback
7. Data display
8. Charts: comparison
9. Charts: time-series
10. Charts: distribution
11. Charts: hierarchy & flow
12. Specialised

Source of truth for the mapping: `packages/storybook-meta/src/categories.ts`.

## Commands

```bash
pnpm install           # install everything
pnpm dev:react         # reference dashboard, http://localhost:5173
pnpm dev:svelte        # reference dashboard, http://localhost:5174
pnpm dev:storybook     # storybook for React,  http://localhost:6006
pnpm test              # vitest, ~1,300 tests across all three frameworks
pnpm test:coverage     # v8 coverage report
pnpm build             # build all packages
pnpm build:site        # build all three storybooks + landing page into apps/storybook-site/dist
pnpm serve:site        # serve the assembled site, http://localhost:4173
```

## Tokens

Two motifs ship in `tokens.css`. Apply via a data attribute on `<html>`:

```html
<html data-motif="dark">   <!-- default -->
<html data-motif="light">
```

Brand blue is `#006FFF`. Status: `#00B070` ok, `#F5A623` warn, `#F03A3A` critical. Type: Inter (UI) + JetBrains Mono (IPs / MACs / SKUs). Default radius 6 px (12 for modals, 9999 for pills).

## Tri-framework story

- **React** users: `pnpm add @dash-ui/react @dash-ui/tokens` then `import { Button } from '@dash-ui/react'`
- **Svelte** users: `pnpm add @dash-ui/svelte @dash-ui/tokens` then `import Button from '@dash-ui/svelte/components/Button.svelte'`
- **Anywhere else** (Vue, Angular, vanilla, Astro, Hugo): `pnpm add @dash-ui/wc @dash-ui/tokens`, import `@dash-ui/wc` once for its registration side effect, then use `<dash-button variant="primary">Save</dash-button>` etc.

The web component layer is generated from the Svelte sources at build time via thin custom-element wrappers; props mirror the Svelte API.

## License

[MIT](./LICENSE) License.
