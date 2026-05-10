<svelte:options tag="uni-slope-chart" />
<script>
  import Original from '@dash-ui/svelte/components/SlopeChart.svelte';
  export let items = [];
  export let labelBefore = 'Before';
  export let labelAfter = 'After';
  export let unit = '';
  export let ariaLabel = 'Slope chart';
  export let positiveIsGood = false;
</script>

<Original {items} {labelBefore} {labelAfter} {unit} {ariaLabel} {positiveIsGood}>
  <slot />
</Original>
