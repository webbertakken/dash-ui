<svelte:options customElement="uni-stream-graph" />
<script>
  import Original from '@w5-ui/svelte/components/StreamGraph.svelte';
  let {
    labels = [],
    series = [],
    ariaLabel = 'Stream graph'
  } = $props();
</script>

<Original {labels} {series} {ariaLabel}>
  <slot />
</Original>
