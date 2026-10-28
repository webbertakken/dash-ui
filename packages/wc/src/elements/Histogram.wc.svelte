<svelte:options customElement={{ tag: "uni-histogram", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/Histogram.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    bins = [],
    height = 160,
    color = '#006FFF',
    xUnit = '',
    ariaLabel = 'Histogram'
  } = $props();
</script>

<Original {bins} {height} {color} {xUnit} {ariaLabel}>
  <slot />
</Original>
