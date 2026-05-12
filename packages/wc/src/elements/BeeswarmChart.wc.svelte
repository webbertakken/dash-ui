<svelte:options tag="uni-beeswarm-chart" />
<script>
  import Original from '@w5-ui/svelte/components/BeeswarmChart.svelte';
  export let series = [];
  export let yRange = undefined;
  export let height = 200;
  export let unit = '';
  export let dotRadius = 4;
  export let ariaLabel = 'Beeswarm chart';
</script>

<Original {series} {yRange} {height} {unit} {dotRadius} {ariaLabel}>
  <slot />
</Original>
