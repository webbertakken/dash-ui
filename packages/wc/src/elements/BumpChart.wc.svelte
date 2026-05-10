<svelte:options tag="uni-bump-chart" />
<script>
  import Original from '@dash-ui/svelte/components/BumpChart.svelte';
  export let labels = [];
  export let series = [];
  export let ariaLabel = 'Bump chart';
</script>

<Original {labels} {series} {ariaLabel}>
  <slot />
</Original>
