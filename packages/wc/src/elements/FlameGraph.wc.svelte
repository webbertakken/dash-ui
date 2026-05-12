<svelte:options customElement="uni-flame-graph" />
<script>
  import Original from '@w5-ui/svelte/components/FlameGraph.svelte';
  let {
    root = undefined,
    height = 160,
    ariaLabel = 'Flame graph'
  } = $props();
</script>

<Original {root} {height} {ariaLabel}>
  <slot />
</Original>
