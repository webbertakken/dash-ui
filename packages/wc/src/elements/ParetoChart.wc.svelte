<svelte:options tag="uni-pareto-chart" />
<script>
  import Original from '@dash-ui/svelte/components/ParetoChart.svelte';
  export let items = [];
  export let height = 160;
  export let ariaLabel = 'Pareto chart';
  export let barColor = '#006FFF';
  export let lineColor = '#F5A623';
  export let threshold = 0.8;
</script>

<Original {items} {height} {ariaLabel} {barColor} {lineColor} {threshold}>
  <slot />
</Original>
