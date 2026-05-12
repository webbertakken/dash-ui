<!-- @migration-task Error while migrating Svelte code: This migration would change the name of a slot (value to value_1) making the component unusable -->
<script lang="ts">
  import Card from './Card.svelte';
  export let label: string;
  export let value: string = '';
  export let unit: string | undefined = undefined;
  export let sub: string | undefined = undefined;
  export let delta: string | undefined = undefined;
  export let deltaDir: 'up' | 'down' | 'neutral' = 'neutral';
  export let span: number | undefined = undefined;
  export let color: string | undefined = undefined;
  $: deltaClass = deltaDir === 'up' ? 'delta-up' : deltaDir === 'down' ? 'delta-down' : '';
</script>

<Card {span}>
  <h3>{label}</h3>
  <div class="stat" style={color ? `color:${color};` : ''}>
    <slot name="value">{value}</slot>{#if unit}<span class="unit">{unit}</span>{/if}
  </div>
  {#if sub || delta}
    <div class="submeta">
      {#if sub}{sub}{/if}{#if sub && delta} · {/if}{#if delta}<span class="sr-only">Trend: </span><span class={deltaClass}>{delta}</span>{/if}
    </div>
  {/if}
</Card>
