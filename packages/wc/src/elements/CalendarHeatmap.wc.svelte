<svelte:options customElement={{ tag: "uni-calendar-heatmap", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/CalendarHeatmap.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    data = [],
    maxValue = undefined,
    ariaLabel = 'Calendar heatmap'
  } = $props();
</script>

<Original {data} {maxValue} {ariaLabel}>
  <slot />
</Original>
