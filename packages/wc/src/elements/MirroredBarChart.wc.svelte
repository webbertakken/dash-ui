<svelte:options tag="uni-mirrored-bar-chart" />
<script>
  import Original from '@w5-ui/svelte/components/MirroredBarChart.svelte';
  export let items = [];
  export let leftLabel = 'Download';
  export let rightLabel = 'Upload';
  export let leftColor = '#006FFF';
  export let rightColor = '#00C8C8';
  export let unit = '';
  export let ariaLabel = 'Mirrored bar chart';
</script>

<Original {items} {leftLabel} {rightLabel} {leftColor} {rightColor} {unit} {ariaLabel}>
  <slot />
</Original>
