<svelte:options customElement={{ tag: "uni-waffle-chart", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/WaffleChart.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    segments = [],
    total = undefined,
    cols = 10,
    rows = 10,
    gap = 2,
    ariaLabel = 'Waffle chart'
  } = $props();
</script>

<Original {segments} {total} {cols} {rows} {gap} {ariaLabel}>
  <slot />
</Original>
