<svelte:options customElement="uni-icicle-chart" />
<script>
  import Original from '@w5-ui/svelte/components/IcicleChart.svelte';
  let {
    root = undefined,
    height = 160,
    ariaLabel = 'Icicle chart'
  } = $props();
</script>

<Original {root} {height} {ariaLabel}>
  <slot />
</Original>
