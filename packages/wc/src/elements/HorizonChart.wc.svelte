<svelte:options tag="uni-horizon-chart" />
<script>
  import Original from '@dash-ui/svelte/components/HorizonChart.svelte';
  export let series = [];
  export let xLabels = undefined;
  export let bands = 3;
  export let ariaLabel = 'Horizon chart';
</script>

<Original {series} {xLabels} {bands} {ariaLabel}>
  <slot />
</Original>
