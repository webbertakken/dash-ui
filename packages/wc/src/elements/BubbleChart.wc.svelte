<svelte:options tag="uni-bubble-chart" />
<script>
  import Original from '@dash-ui/svelte/components/BubbleChart.svelte';
  export let points = [];
  export let xRange = undefined;
  export let yRange = undefined;
  export let rRange = [4, 20];
  export let height = 160;
  export let ariaLabel = 'Bubble chart';
</script>

<Original {points} {xRange} {yRange} {rRange} {height} {ariaLabel}>
  <slot />
</Original>
