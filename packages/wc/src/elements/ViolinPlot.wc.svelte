<svelte:options tag="uni-violin-plot" />
<script>
  import Original from '@dash-ui/svelte/components/ViolinPlot.svelte';
  export let series = [];
  export let yRange = undefined;
  export let height = 160;
  export let ariaLabel = 'Violin plot';
</script>

<Original {series} {yRange} {height} {ariaLabel}>
  <slot />
</Original>
