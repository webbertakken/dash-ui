<svelte:options customElement="uni-circle-packing" />
<script>
  import Original from '@w5-ui/svelte/components/CirclePacking.svelte';
  let {
    items = undefined,
    height = 200,
    ariaLabel = 'Circle packing chart'
  } = $props();
</script>

<Original {items} {height} {ariaLabel}>
  <slot />
</Original>
