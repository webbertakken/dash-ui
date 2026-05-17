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
    deltaDir === 'up'
      ? 'text-status-success'
      : deltaDir === 'down'
        ? 'text-status-danger'
        : '',
  );
</script>

<Card {span}>
  <!--
    `.card h3` rules in dashboard.css still target this <h3> for now;
    leaving them there until every Card consumer migrates its heading
    too. Stat's value + submeta are Tailwind utilities below.
  -->
  <h3>{label}</h3>
  <div
    class="text-[28px] font-semibold leading-[1.05] tracking-[-0.01em] tabular-nums text-text-1"
    style={color ? `color:${color};` : ''}
  >
    {#if valueSlot}{@render valueSlot()}{:else}{value}{/if}{#if unit}<span
        class="ml-1 text-13 font-normal text-text-4"
      >{unit}</span>{/if}
  </div>
  {#if sub || delta}
    <div class="text-[11px] tabular-nums text-text-4">
      {#if sub}{sub}{/if}{#if sub && delta} \u00b7 {/if}{#if delta}<span class="sr-only">Trend: </span><span class={deltaClass}>{delta}</span>{/if}
    </div>
  {/if}
</Card>
