<svelte:options customElement={{ tag: "uni-sparkline", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/Sparkline.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    bars = 36,
    active = false,
    seed = 1,
    ariaLabel = 'Activity sparkline'
  } = $props();
</script>

<Original {bars} {active} {seed} {ariaLabel}>
  <slot />
</Original>
