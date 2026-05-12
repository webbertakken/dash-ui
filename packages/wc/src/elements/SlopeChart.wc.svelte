<svelte:options customElement="uni-slope-chart" />
<script>
  import Original from '@w5-ui/svelte/components/SlopeChart.svelte';
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
