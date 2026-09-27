// Tooltip vs hover card vs popover, side by side. Embedded by the
// Foundations / Overlays page; mirrored in the React and Svelte storybooks.

import type { Meta, StoryObj } from '@storybook/web-components'

const meta: Meta = {
  title: 'Selection & menus/Overlays compared',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Tooltip names a control (1 s hover, instant keyboard focus). Hover card shows rich, non-essential content (instant). Popover is a click-opened, interactive surface.',
      },
    },
  },
}
export default meta

type Story = StoryObj

export const Compared: Story = {
  name: 'Tooltip vs hover card vs popover',
  render: () => {
    const root = document.createElement('div')
    root.style.cssText = 'display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px'
    root.innerHTML = `
      <div style="display:grid;gap:8px;align-content:start;min-height:180px">
        <p style="margin:0;font-size:12px;color:var(--text-3)">Tooltip: hover 1 s, or Tab to it</p>
        <uni-tooltip label="Zoom in" placement="bottom"><uni-icon-button>+</uni-icon-button></uni-tooltip>
      </div>
      <div style="display:grid;gap:8px;align-content:start;min-height:180px">
        <p style="margin:0;font-size:12px;color:var(--text-3)">Hover card: hover or Tab, opens instantly</p>
        <uni-hover-card heading="gw-hq" description="Gateway · 99.98% uptime · 42 clients"><a href="#gw-hq">gw-hq</a></uni-hover-card>
      </div>
      <div style="display:grid;gap:8px;align-content:start;min-height:180px">
        <p style="margin:0;font-size:12px;color:var(--text-3)">Popover: click to open</p>
        <uni-popover label="Filter">Online only</uni-popover>
      </div>`
    return root
  },
}
