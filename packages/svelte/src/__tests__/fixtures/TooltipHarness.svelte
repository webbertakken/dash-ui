<script lang="ts">
  import Tooltip from '../../lib/components/Tooltip.svelte';
  import IconButton from '../../lib/components/IconButton.svelte';
  import { PlusIcon } from '../../lib/icons.ts';

  interface Props {
    label?: string;
    delay?: number;
    placement?: 'top' | 'bottom' | 'left' | 'right';
    variant?: 'icon' | 'text' | 'pair';
  }
  let { label = 'Zoom in', delay = undefined, placement = 'top', variant = 'icon' }: Props = $props();
</script>

<Tooltip {label} {delay} {placement} class="extra">
  {#if variant === 'icon'}
    <IconButton><PlusIcon /></IconButton>
  {:else if variant === 'text'}
    <button type="button">Save</button>
  {:else}
    <span>
      <button type="button">A</button>
      <button type="button">B</button>
    </span>
  {/if}
</Tooltip>
