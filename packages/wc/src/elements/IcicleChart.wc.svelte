<svelte:options customElement={{ tag: "uni-icicle-chart", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/IcicleChart.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    root = undefined,
    height = 160,
    ariaLabel = 'Icicle chart'
  } = $props();
</script>

<Original {root} {height} {ariaLabel}>
  <slot />
</Original>
