<svelte:options customElement="uni-calendar-heatmap" />
<script>
  import Original from '@w5-ui/svelte/components/CalendarHeatmap.svelte';
  let {
    data = [],
    maxValue = undefined,
    ariaLabel = 'Calendar heatmap'
  } = $props();
</script>

<Original {data} {maxValue} {ariaLabel}>
  <slot />
</Original>
