<svelte:options tag="uni-quadrant-chart" />
<script>
  import Original from '@dash-ui/svelte/components/QuadrantChart.svelte';
  export let points = [];
  export let xThreshold = undefined;
  export let yThreshold = undefined;
  export let xRange = undefined;
  export let yRange = undefined;
  export let quadrantLabels = ['', '', '', ''];
  export let quadrantColors = [
    'rgba(0,200,117,0.06)',
    'rgba(245,166,35,0.07)',
    'rgba(0,111,255,0.06)',
    'rgba(255,123,123,0.09)',
  ];
  export let xLabel = undefined;
  export let yLabel = undefined;
  export let height = 200;
  export let ariaLabel = 'Quadrant chart';
</script>

<Original {points} {xThreshold} {yThreshold} {xRange} {yRange} {quadrantLabels} {quadrantColors} {xLabel} {yLabel} {height} {ariaLabel}>
  <slot />
</Original>
