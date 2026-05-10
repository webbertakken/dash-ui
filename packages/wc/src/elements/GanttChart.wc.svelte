<svelte:options tag="uni-gantt-chart" />
<script>
  import Original from '@dash-ui/svelte/components/GanttChart.svelte';
  export let tasks = [];
  export let xLabels = [];
  export let ariaLabel = 'Gantt chart';
</script>

<Original {tasks} {xLabels} {ariaLabel}>
  <slot />
</Original>
