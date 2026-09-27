<!-- Tooltip vs hover card vs popover, side by side (mirrors the React story). -->
<script lang="ts">
  import { Button, HoverCard, IconButton, PlusIcon, Popover, SearchIcon, Tooltip } from '@w5-ui/svelte';
</script>

<div class="grid grid-cols-3 gap-6">
  <div class="grid min-h-[180px] content-start gap-2">
    <p class="m-0 text-12 text-text-3">Tooltip: hover 1 s, or Tab to it</p>
    <div class="flex gap-1">
      <Tooltip label="Zoom in" placement="bottom"><IconButton><PlusIcon /></IconButton></Tooltip>
      <Tooltip label="Search" placement="bottom"><IconButton><SearchIcon /></IconButton></Tooltip>
    </div>
  </div>
  <div class="grid min-h-[180px] content-start gap-2">
    <p class="m-0 text-12 text-text-3">Hover card: hover or Tab, opens instantly</p>
    <HoverCard heading="gw-hq" description="Gateway · 99.98% uptime · 42 clients">
      <a href="#gw-hq">gw-hq</a>
    </HoverCard>
  </div>
  <div class="grid min-h-[180px] content-start gap-2">
    <p class="m-0 text-12 text-text-3">Popover: click to open</p>
    <Popover label="Filter" title="Filter"><Button>Online only</Button></Popover>
  </div>
</div>
