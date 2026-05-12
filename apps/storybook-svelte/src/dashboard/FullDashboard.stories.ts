import type { Meta, StoryObj } from '@storybook/svelte'
import App from 'dashboard-svelte/App.svelte'

const meta = {
  title: 'Dashboard/Full app',
  component: App,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The complete dashboard app, exactly as shipped in apps/dashboard-svelte. Use the sidebar inside the canvas to switch between pages.',
      },
    },
  },
} satisfies Meta<typeof App>
export default meta

type Story = StoryObj

export const FullApp: Story = { name: 'Full app' }
