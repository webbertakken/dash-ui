<svelte:options customElement={{ tag: "uni-gantt-chart", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/GanttChart.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    tasks = [],
    xLabels = [],
    ariaLabel = 'Gantt chart'
  } = $props();
</script>

<Original {tasks} {xLabels} {ariaLabel}>
  <slot />
</Original>
