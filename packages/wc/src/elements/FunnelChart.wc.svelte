<svelte:options tag="uni-funnel-chart" />
<script>
  import Original from '@dash-ui/svelte/components/FunnelChart.svelte';
  export let segments = [];
  export let height = 160;
  export let ariaLabel = 'Funnel chart';
</script>

<Original {segments} {height} {ariaLabel}>
  <slot />
</Original>
