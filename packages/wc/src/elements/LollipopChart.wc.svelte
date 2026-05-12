<svelte:options customElement="uni-lollipop-chart" />
<script>
  import Original from '@w5-ui/svelte/components/LollipopChart.svelte';
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
