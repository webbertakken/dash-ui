import { withThemeByDataAttribute } from '@storybook/addon-themes'
import type { Preview } from '@storybook/react'
import '@w5-ui/tokens/tokens.css'
import '@w5-ui/react/styles.css'
import './preview.css'

const preview: Preview = {
  parameters: {
    layout: 'padded',
    // Disable the backgrounds addon - it would race with the motif data
    // attribute and stories would lose their token-driven background. The
    // motif toolbar (Light / Dark) is the single source of truth.
    backgrounds: { disable: true, grid: { disable: true } },
    options: {
      // Storybook 8 requires this to be a literal
      storySort: {
        order: [
          // Foundation pages get an explicit reading order: alphabetical sort
          // buries Overview behind 'Actions' and 'Cards', and drops the
          // Troubleshooting reference into the middle of the conceptual lane.
          // Reorder so the entry path reads Overview -> Setup -> For agents
          // -> Recipes (paste-into-userland), then visual primitives, then
          // component groups, then chart picker, then Troubleshooting last.
          'Foundations',
          [
            'Overview',
            'Setup',
            'For agents',
            'Recipes',
            'Page layout',
            'Type',
            'Colours',
            'Motifs',
            'Spacing',
            'Icons',
            'Cards',
            'Tables',
            'Forms',
            'Actions',
            'Navigation',
            'Overlays',
            'Status & feedback',
            'Data display',
            'Charts',
            'Troubleshooting',
          ],
          'Dashboard',
          'Layout',
          'Inputs',
          'Selection & menus',
          'Navigation',
          'Feedback',
          'Data display',
          'Charts: comparison',
          'Charts: time-series',
          'Charts: distribution',
          'Charts: hierarchy & flow',
          'Specialised',
        ],
      },
    },
    controls: { expanded: true },
    a11y: { context: '#storybook-root' },
  },
  decorators: [
    withThemeByDataAttribute({
      themes: { Dark: 'dark', Light: 'light' },
      defaultTheme: 'Dark',
      attributeName: 'data-motif',
    }),
  ],
}

export default preview
