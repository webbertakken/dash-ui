<svelte:options customElement="uni-heat-map" />
<script>
  import Original from '@w5-ui/svelte/components/HeatMap.svelte';
  let {
    data = [],
    colors = ['#1B2D5A', '#3F7BC4', '#7FB6FF', '#F5C26B', '#F5A623', '#FF7B7B'],
    xLabels = [],
    height = 160,
    cellGap = 1,
    ariaLabel = 'Heat map'
  } = $props();
</script>

<Original {data} {colors} {xLabels} {height} {cellGap} {ariaLabel}>
  <slot />
</Original>
