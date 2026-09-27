<svelte:options customElement={{ tag: "uni-annotated-time-series", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/AnnotatedTimeSeries.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    data = [],
    labels = [],
    annotations = [],
    color = '#006FFF',
    height = 160,
    ariaLabel = 'Annotated time series'
  } = $props();
</script>

<Original {data} {labels} {annotations} {color} {height} {ariaLabel}>
  <slot />
</Original>
