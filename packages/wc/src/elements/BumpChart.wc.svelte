<svelte:options customElement="uni-bump-chart" />
<script>
  import Original from '@w5-ui/svelte/components/BumpChart.svelte';
  let {
    labels = [],
    series = [],
    ariaLabel = 'Bump chart'
  } = $props();
</script>

<Original {labels} {series} {ariaLabel}>
  <slot />
</Original>
