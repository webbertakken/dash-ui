<svelte:options customElement="uni-gantt-chart" />
<script>
  import Original from '@w5-ui/svelte/components/GanttChart.svelte';
  let {
    tasks = [],
    xLabels = [],
    ariaLabel = 'Gantt chart'
  } = $props();
</script>

<Original {tasks} {xLabels} {ariaLabel}>
  <slot />
</Original>
