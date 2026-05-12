import { withThemeByDataAttribute } from '@storybook/addon-themes'
import type { Preview } from '@storybook/svelte'
import '@w5-ui/tokens/tokens.css'
import '@w5-ui/svelte/styles.css'
import './preview.css'

const preview: Preview = {
  parameters: {
    layout: 'padded',
    backgrounds: { disable: true, grid: { disable: true } },
    options: {
      // Storybook 8 requires this to be a literal
      storySort: {
        order: [
          'Foundations',
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
