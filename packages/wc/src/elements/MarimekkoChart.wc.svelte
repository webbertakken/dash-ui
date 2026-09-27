<svelte:options customElement={{ tag: "uni-marimekko-chart", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/MarimekkoChart.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    columns = undefined,
    height = 160,
    ariaLabel = 'Marimekko chart'
  } = $props();
</script>

<Original {columns} {height} {ariaLabel}>
  <slot />
</Original>
