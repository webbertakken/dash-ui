<svelte:options customElement="uni-time-range" />
<script>
  import Original from '@w5-ui/svelte/components/TimeRange.svelte';
  let {
    value = '1h'
  } = $props();
</script>

<Original {value}>
  <slot />
</Original>
