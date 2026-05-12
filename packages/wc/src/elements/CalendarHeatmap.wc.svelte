<svelte:options tag="uni-calendar-heatmap" />
<script>
  import Original from '@w5-ui/svelte/components/CalendarHeatmap.svelte';
  export let data = [];
  export let maxValue = undefined;
  export let ariaLabel = 'Calendar heatmap';
</script>

<Original {data} {maxValue} {ariaLabel}>
  <slot />
</Original>
