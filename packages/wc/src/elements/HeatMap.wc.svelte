<svelte:options customElement="uni-heat-map" />
<script>
  import Original from '@w5-ui/svelte/components/HeatMap.svelte';
  export let data = [];
  export let colors = ['#1B2D5A', '#3F7BC4', '#7FB6FF', '#F5C26B', '#F5A623', '#FF7B7B'];
  export let xLabels = [];
  export let height = 160;
  export let cellGap = 1;
  export let ariaLabel = 'Heat map';
</script>

<Original {data} {colors} {xLabels} {height} {cellGap} {ariaLabel}>
  <slot />
</Original>
