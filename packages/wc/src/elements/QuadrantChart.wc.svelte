<svelte:options customElement="uni-quadrant-chart" />
<script>
  import Original from '@w5-ui/svelte/components/QuadrantChart.svelte';
  let {
    points = [],
    xThreshold = undefined,
    yThreshold = undefined,
    xRange = undefined,
    yRange = undefined,
    quadrantLabels = ['', '', '', ''],
    quadrantColors = [
    'rgba(0,200,117,0.06)',
    'rgba(245,166,35,0.07)',
    'rgba(0,111,255,0.06)',
    'rgba(255,123,123,0.09)',
  ],
    xLabel = undefined,
    yLabel = undefined,
    height = 200,
    ariaLabel = 'Quadrant chart'
  } = $props();
</script>

<Original {points} {xThreshold} {yThreshold} {xRange} {yRange} {quadrantLabels} {quadrantColors} {xLabel} {yLabel} {height} {ariaLabel}>
  <slot />
</Original>
