<svelte:options customElement={{ tag: "uni-dumbbell-chart", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/DumbbellChart.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    items = [],
    unit = '',
    color = '#006FFF',
    ariaLabel = 'Dumbbell chart'
  } = $props();
</script>

<Original {items} {unit} {color} {ariaLabel}>
  <slot />
</Original>
