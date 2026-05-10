<svelte:options tag="uni-icicle-chart" />
<script>
  import Original from '@dash-ui/svelte/components/IcicleChart.svelte';
  export let root = undefined;
  export let height = 160;
  export let ariaLabel = 'Icicle chart';
</script>

<Original {root} {height} {ariaLabel}>
  <slot />
</Original>
