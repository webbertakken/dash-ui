<svelte:options customElement="uni-step-chart" />
<script>
  import Original from '@w5-ui/svelte/components/StepChart.svelte';
  let {
    series = [],
    labels = [],
    height = 160,
    ariaLabel = 'Step chart'
  } = $props();
</script>

<Original {series} {labels} {height} {ariaLabel}>
  <slot />
</Original>
