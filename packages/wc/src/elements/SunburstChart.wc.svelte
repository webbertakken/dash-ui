<svelte:options tag="uni-sunburst-chart" />
<script>
  import Original from '@dash-ui/svelte/components/SunburstChart.svelte';
  export let root = undefined;
  export let ariaLabel = 'Sunburst chart';
</script>

<Original {root} {ariaLabel}>
  <slot />
</Original>
