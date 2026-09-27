<svelte:options customElement={{ tag: "uni-lollipop-chart", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/LollipopChart.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    items = [],
    unit = '',
    color = '#006FFF',
    ariaLabel = 'Lollipop chart'
  } = $props();
</script>

<Original {items} {unit} {color} {ariaLabel}>
  <slot />
</Original>
