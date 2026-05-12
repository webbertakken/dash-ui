<svelte:options customElement="uni-dumbbell-chart" />
<script>
  import Original from '@w5-ui/svelte/components/DumbbellChart.svelte';
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
