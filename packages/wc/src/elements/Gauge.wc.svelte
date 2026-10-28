<svelte:options customElement={{ tag: "uni-gauge", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/Gauge.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    value = 0,
    label = '',
    color = '#006FFF',
    size = 120,
    ariaLabel = undefined
  } = $props();
</script>

<Original {value} {label} {color} {size} {ariaLabel}>
  <slot />
</Original>
