<svelte:options tag="uni-box-plot" />
<script>
  import Original from '@w5-ui/svelte/components/BoxPlot.svelte';
  export let series = [];
  export let yRange = undefined;
  export let height = 160;
  export let ariaLabel = 'Box plot';
</script>

<Original {series} {yRange} {height} {ariaLabel}>
  <slot />
</Original>
