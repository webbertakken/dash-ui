<svelte:options customElement="uni-waffle-chart" />
<script>
  import Original from '@w5-ui/svelte/components/WaffleChart.svelte';
  let {
    segments = [],
    total = undefined,
    cols = 10,
    rows = 10,
    gap = 2,
    ariaLabel = 'Waffle chart'
  } = $props();
</script>

<Original {segments} {total} {cols} {rows} {gap} {ariaLabel}>
  <slot />
</Original>
