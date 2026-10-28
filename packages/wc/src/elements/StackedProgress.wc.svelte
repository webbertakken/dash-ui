<svelte:options customElement={{ tag: "uni-stacked-progress", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/StackedProgress.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    segments = undefined,
    total = undefined,
    ariaLabel = undefined,
    showLegend = true
  } = $props();
</script>

<Original {segments} {total} {ariaLabel} {showLegend}>
  <slot />
</Original>
