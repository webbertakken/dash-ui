<script lang="ts">
  import type { Snippet } from 'svelte';
  import Card from './Card.svelte';

  interface Props {
    label: string;
    value?: string;
    unit?: string | undefined;
    sub?: string | undefined;
    delta?: string | undefined;
    deltaDir?: 'up' | 'down' | 'neutral';
    span?: number | undefined;
    color?: string | undefined;
    /** Snippet override for the value display. Renamed from the old `value`
     *  named slot to avoid colliding with the `value` prop in Svelte 5. */
    valueSlot?: Snippet;
  }

  let {
    label,
    value = '',
    unit = undefined,
    sub = undefined,
    delta = undefined,
    deltaDir = 'neutral',
    span = undefined,
    color = undefined,
    valueSlot,
  }: Props = $props();

  let deltaClass = $derived(
    deltaDir === 'up' ? 'delta-up' : deltaDir === 'down' ? 'delta-down' : '',
  );
</script>

<Card {span}>
  <h3>{label}</h3>
  <div class="stat" style={color ? `color:${color};` : ''}>
    {#if valueSlot}{@render valueSlot()}{:else}{value}{/if}{#if unit}<span class="unit">{unit}</span>{/if}
  </div>
  {#if sub || delta}
    <div class="submeta">
      {#if sub}{sub}{/if}{#if sub && delta} · {/if}{#if delta}<span class="sr-only">Trend: </span><span class={deltaClass}>{delta}</span>{/if}
    </div>
  {/if}
</Card>
