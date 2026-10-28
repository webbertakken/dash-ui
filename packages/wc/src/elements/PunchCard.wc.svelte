<svelte:options customElement={{ tag: "uni-punch-card", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/PunchCard.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    data = undefined,
    rowLabels = undefined,
    colLabels = undefined,
    color = '#006FFF',
    height = 180,
    ariaLabel = 'Punch card chart'
  } = $props();
</script>

<Original {data} {rowLabels} {colLabels} {color} {height} {ariaLabel}>
  <slot />
</Original>
