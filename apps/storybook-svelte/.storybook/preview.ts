import { withThemeByDataAttribute } from '@storybook/addon-themes'
import type { Preview } from '@storybook/svelte'
// preview.css is the single CSS entry: it composes Tailwind + w5-ui
// tokens + the legacy dashboard.css (layered into @layer base) and tells
// Tailwind to @source the component package. Importing the raw tokens.css
// or styles.css here would skip the Tailwind pipeline entirely.
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
