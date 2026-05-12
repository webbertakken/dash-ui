<svelte:options tag="uni-gantt-chart" />
<script>
  import Original from '@w5-ui/svelte/components/GanttChart.svelte';
  export let tasks = [];
  export let xLabels = [];
  export let ariaLabel = 'Gantt chart';
</script>

<Original {tasks} {xLabels} {ariaLabel}>
  <slot />
</Original>
