<svelte:options tag="uni-waffle-chart" />
<script>
  import Original from '@w5-ui/svelte/components/WaffleChart.svelte';
  export let segments = [];
  export let total = undefined;
  export let cols = 10;
  export let rows = 10;
  export let gap = 2;
  export let ariaLabel = 'Waffle chart';
</script>

<Original {segments} {total} {cols} {rows} {gap} {ariaLabel}>
  <slot />
</Original>
