<svelte:options tag="uni-stream-graph" />
<script>
  import Original from '@dash-ui/svelte/components/StreamGraph.svelte';
  export let labels = [];
  export let series = [];
  export let ariaLabel = 'Stream graph';
</script>

<Original {labels} {series} {ariaLabel}>
  <slot />
</Original>
