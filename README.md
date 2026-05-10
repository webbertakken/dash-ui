This repo contains Design Systems and their implementations. Design Systems can be used in projects to easily style chosen components.

Design Systems present:
| name | prefix | description |
| --- | --- | --- |
| Dashboard | @dash-ui | Dash inspired components for dashboards - Subtle, clean and factual style - [example](link-to-svelte-storybook) |

# Dash design system

Complete recreation of the **Dash design system** delivered by Claude Design (claude.ai/design), implemented as a pnpm monorepo with both **React** and **Svelte** component libraries plus two fully functional **dashboard apps**.

## What's in here

```
packages/
├── tokens/          @dash-ui/tokens   - CSS variables (light + dark) + JS token map
├── assets/          @dash-ui/assets   - 9 brand SVG logos (Network/Protect/Access/...)
├── react/           @dash-ui/react    - React component library
└── svelte/          @dash-ui/svelte   - Svelte component library

apps/
├── dashboard-react/   Vite + React app   — full Edge Gateway X1 dashboard
└── dashboard-svelte/  Vite + Svelte app  — feature parity with the React app

design-bundle/      Original Claude Design handoff bundle (read-only reference)
```

## What the apps cover

Both apps implement **all 14 pages** from the original prototype, with the same data, layout and visual fidelity:

| Manage | Configure | Insights |
|---|---|---|
| Dashboard | Wi-Fi | AirView |
| Devices | Ports | Infrastructure |
| Client Devices | VPN | Integrations |
| Topology | Security | |
| Alarm Manager | Settings (8 tabs) | |
| Logs | | |

Plus the shared chrome (top app rail, site switcher, notification bell, sidebar, Adopt Device modal) and the interactive parts: tab switching, sidebar navigation, app switching, modal open/close, toggle switches with state, and the live Topology view that draws curved SVG links between draggable device nodes.

## Component libraries

`@dash-ui/react` and `@dash-ui/svelte` ship 1-to-1 component sets:

- **Layout**: `Topbar`, `Sidebar`, `Card`
- **Inputs**: `Button`, `IconButton`, `Input`, `Field`, `SearchBox`, `Toggle`, `RowToggle`
- **Display**: `Pill`, `Tabs`, `Modal`, `Sparkline`, `HealthBar`, `Donut`, `Signal`, `StatusIndicator`
- **Icons**: 22 outline icons (`Search`, `Plus`, `Download`, `Caret`, `Close`, `Bell`, `Help`, `Updates`, `Dashboard`, `Devices`, `Clients`, `Topology`, `Alarm`, `Logs`, `Wifi`, `Ports`, `Vpn`, `Security`, `Settings`, `Airview`, `Infra`, `Integrations`)

Both libraries depend only on `@dash-ui/tokens` (CSS variables + JS constants) and `@dash-ui/assets` (SVG URLs).

## Commands

```bash
pnpm install           # install everything
pnpm dev:react         # http://localhost:5173
pnpm dev:svelte        # http://localhost:5174
pnpm build             # build all packages and apps
```

## Tokens

Two motifs ship in `tokens.css`. The dashboards use `dark`; switch to `light` for store / marketing surfaces.

```html
<html data-motif="dark">  <!-- the default -->
<html data-motif="light">
```

Brand blue is `#006FFF` (the only saturated colour). Status: `#00B070` ok, `#F5A623` warn, `#F03A3A` critical. Type: Inter (UI) + JetBrains Mono (IPs/MACs/SKUs). Default radius 6 px (12 for modals, 9999 for pills).

## Source of truth

The full visual + content spec lives in `design-bundle/dash-ui-design-system/project/README.md` — content fundamentals, voice, iconography rules, layout tokens. `colors_and_type.css` from that bundle is copied verbatim into `packages/tokens/src/tokens.css`.
