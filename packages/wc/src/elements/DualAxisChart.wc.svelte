<svelte:options tag="uni-dual-axis-chart" />
<script>
  import Original from '@dash-ui/svelte/components/DualAxisChart.svelte';
  export let bars = undefined;
  export let line = undefined;
  export let labels = [];
  export let height = 160;
  export let ariaLabel = 'Dual axis chart';
</script>

<Original {bars} {line} {labels} {height} {ariaLabel}>
  <slot />
</Original>
