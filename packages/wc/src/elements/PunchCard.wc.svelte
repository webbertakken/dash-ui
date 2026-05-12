<svelte:options customElement="uni-punch-card" />
<script>
  import Original from '@w5-ui/svelte/components/PunchCard.svelte';
  let {
    data = undefined,
    rowLabels = undefined,
    colLabels = undefined,
    color = '#006FFF',
    height = 180,
    ariaLabel = 'Punch card chart'
  } = $props();
</script>

<Original {data} {rowLabels} {colLabels} {color} {height} {ariaLabel}>
  <slot />
</Original>
