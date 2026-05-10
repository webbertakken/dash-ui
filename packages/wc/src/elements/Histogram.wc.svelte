<svelte:options tag="uni-histogram" />
<script>
  import Original from '@dash-ui/svelte/components/Histogram.svelte';
  export let bins = [];
  export let height = 160;
  export let color = '#006FFF';
  export let xUnit = '';
  export let ariaLabel = 'Histogram';
</script>

<Original {bins} {height} {color} {xUnit} {ariaLabel}>
  <slot />
</Original>
