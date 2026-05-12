<svelte:options tag="uni-radar-chart" />
<script>
  import Original from '@w5-ui/svelte/components/RadarChart.svelte';
  export let series = [];
  export let axes = [];
  export let height = 200;
  export let ariaLabel = 'Radar chart';
</script>

<Original {series} {axes} {height} {ariaLabel}>
  <slot />
</Original>
