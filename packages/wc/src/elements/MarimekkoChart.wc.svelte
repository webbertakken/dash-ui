<svelte:options customElement="uni-marimekko-chart" />
<script>
  import Original from '@w5-ui/svelte/components/MarimekkoChart.svelte';
  let {
    columns = undefined,
    height = 160,
    ariaLabel = 'Marimekko chart'
  } = $props();
</script>

<Original {columns} {height} {ariaLabel}>
  <slot />
</Original>
