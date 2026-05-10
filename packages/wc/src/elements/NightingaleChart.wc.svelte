<svelte:options tag="uni-nightingale-chart" />
<script>
  import Original from '@dash-ui/svelte/components/NightingaleChart.svelte';
  export let segments = [];
  export let color = '#006FFF';
  export let ariaLabel = 'Nightingale chart';
</script>

<Original {segments} {color} {ariaLabel}>
  <slot />
</Original>
