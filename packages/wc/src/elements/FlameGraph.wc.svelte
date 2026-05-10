<svelte:options tag="uni-flame-graph" />
<script>
  import Original from '@dash-ui/svelte/components/FlameGraph.svelte';
  export let root = undefined;
  export let height = 160;
  export let ariaLabel = 'Flame graph';
</script>

<Original {root} {height} {ariaLabel}>
  <slot />
</Original>
