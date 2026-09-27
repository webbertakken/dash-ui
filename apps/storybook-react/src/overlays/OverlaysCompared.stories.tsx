// Tooltip vs hover card vs popover, side by side. Embedded by the
// Foundations / Overlays page; mirrored in the Svelte and WC storybooks.

import type { Meta, StoryObj } from '@storybook/react'
import { Button, HoverCard, IconButton, PlusIcon, Popover, SearchIcon, Tooltip } from '@w5-ui/react'

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

const column = { display: 'grid', gap: 8, alignContent: 'start', minHeight: 180 } as const
const caption = { margin: 0, fontSize: 12, color: 'var(--text-3)' } as const

export const Compared: Story = {
  name: 'Tooltip vs hover card vs popover',
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
      <div style={column}>
        <p style={caption}>Tooltip: hover 1 s, or Tab to it</p>
        <div style={{ display: 'flex', gap: 4 }}>
          <Tooltip label="Zoom in" placement="bottom">
            <IconButton>
              <PlusIcon />
            </IconButton>
          </Tooltip>
          <Tooltip label="Search" placement="bottom">
            <IconButton>
              <SearchIcon />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <div style={column}>
        <p style={caption}>Hover card: hover or Tab, opens instantly</p>
        <HoverCard heading="gw-hq" description="Gateway · 99.98% uptime · 42 clients">
          <a href="#gw-hq">gw-hq</a>
        </HoverCard>
      </div>
      <div style={column}>
        <p style={caption}>Popover: click to open</p>
        <Popover label="Filter" title="Filter">
          <Button>Online only</Button>
        </Popover>
      </div>
    </div>
  ),
}
