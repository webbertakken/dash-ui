<svelte:options tag="uni-hexbin-chart" />
<script>
  import Original from '@w5-ui/svelte/components/HexbinChart.svelte';
  export let points = [];
  export let xRange = undefined;
  export let yRange = undefined;
  export let height = 200;
  export let hexRadius = 10;
  export let ariaLabel = 'Hexbin chart';
</script>

<Original {points} {xRange} {yRange} {height} {hexRadius} {ariaLabel}>
  <slot />
</Original>
