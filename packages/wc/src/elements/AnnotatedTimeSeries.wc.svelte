<svelte:options tag="uni-annotated-time-series" />
<script>
  import Original from '@w5-ui/svelte/components/AnnotatedTimeSeries.svelte';
  export let data = [];
  export let labels = [];
  export let annotations = [];
  export let color = '#006FFF';
  export let height = 160;
  export let ariaLabel = 'Annotated time series';
</script>

<Original {data} {labels} {annotations} {color} {height} {ariaLabel}>
  <slot />
</Original>
