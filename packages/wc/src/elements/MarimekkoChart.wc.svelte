<svelte:options tag="uni-marimekko-chart" />
<script>
  import Original from '@w5-ui/svelte/components/MarimekkoChart.svelte';
  export let columns = undefined;
  export let height = 160;
  export let ariaLabel = 'Marimekko chart';
</script>

<Original {columns} {height} {ariaLabel}>
  <slot />
</Original>
