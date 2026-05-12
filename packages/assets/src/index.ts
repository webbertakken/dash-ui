// Resolve SVG asset URLs at runtime via `import.meta.url`. This avoids
// requiring consumers to register ambient module declarations for `*.svg`,
// and works in every modern bundler (Vite, Webpack 5, Rollup, esbuild).
const agentsUrl = new URL('../logos/agents.svg', import.meta.url).href
const dashUiMarkUrl = new URL('../logos/dash-ui-mark.svg', import.meta.url).href
const dashUiWordmarkUrl = new URL('../logos/dash-ui-wordmark.svg', import.meta.url).href
const instancesUrl = new URL('../logos/instances.svg', import.meta.url).href
const systemUrl = new URL('../logos/system.svg', import.meta.url).href

export const appLogos = {
  agents: agentsUrl,
  instances: instancesUrl,
  system: systemUrl,
} as const

export type AppLogoKey = keyof typeof appLogos

export const logos = {
  mark: dashUiMarkUrl,
  wordmark: dashUiWordmarkUrl,
} as const
