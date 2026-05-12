<svelte:options tag="uni-step-chart" />
<script>
  import Original from '@w5-ui/svelte/components/StepChart.svelte';
  export let series = [];
  export let labels = [];
  export let height = 160;
  export let ariaLabel = 'Step chart';
</script>

<Original {series} {labels} {height} {ariaLabel}>
  <slot />
</Original>
