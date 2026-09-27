<!--
  Tooltip vs hover card vs popover, side by side (mirrors the React story).
  Inline layout styles, like the React and WC mirrors: Storybook's docs CSS
  is unlayered and would override layered Tailwind utilities on the docs page.
-->
<script lang="ts">
  import { Button, HoverCard, IconButton, PlusIcon, Popover, SearchIcon, Tooltip } from '@w5-ui/svelte';

  const column = 'display:grid;gap:8px;align-content:start;min-height:180px';
  const caption = 'margin:0;font-size:12px;color:var(--text-3)';
</script>

<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px">
  <div style={column}>
    <p style={caption}>Tooltip: hover 1 s, or Tab to it</p>
    <div style="display:flex;gap:4px">
      <Tooltip label="Zoom in" placement="bottom"><IconButton><PlusIcon /></IconButton></Tooltip>
      <Tooltip label="Search" placement="bottom"><IconButton><SearchIcon /></IconButton></Tooltip>
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
    <Popover label="Filter" title="Filter"><Button>Online only</Button></Popover>
  </div>
</div>
