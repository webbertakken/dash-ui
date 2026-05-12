<svelte:options customElement="uni-stacked-progress" />
<script>
  import Original from '@w5-ui/svelte/components/StackedProgress.svelte';
  let {
    segments = undefined,
    total = undefined,
    ariaLabel = undefined,
    showLegend = true
  } = $props();
</script>

<Original {segments} {total} {ariaLabel} {showLegend}>
  <slot />
</Original>
