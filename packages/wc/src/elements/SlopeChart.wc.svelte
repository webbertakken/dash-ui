<svelte:options customElement={{ tag: "uni-slope-chart", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/SlopeChart.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    items = [],
    labelBefore = 'Before',
    labelAfter = 'After',
    unit = '',
    ariaLabel = 'Slope chart',
    positiveIsGood = false
  } = $props();
</script>

<Original {items} {labelBefore} {labelAfter} {unit} {ariaLabel} {positiveIsGood}>
  <slot />
</Original>
