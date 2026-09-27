<svelte:options customElement={{ tag: "uni-bump-chart", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/BumpChart.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    labels = [],
    series = [],
    ariaLabel = 'Bump chart'
  } = $props();
</script>

<Original {labels} {series} {ariaLabel}>
  <slot />
</Original>
