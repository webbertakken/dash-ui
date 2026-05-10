<svelte:options tag="uni-ridgeline-plot" />
<script>
  import Original from '@dash-ui/svelte/components/RidgelinePlot.svelte';
  export let series = [];
  export let xRange = undefined;
  export let height = 180;
  export let ariaLabel = 'Ridgeline plot';
</script>

<Original {series} {xRange} {height} {ariaLabel}>
  <slot />
</Original>
