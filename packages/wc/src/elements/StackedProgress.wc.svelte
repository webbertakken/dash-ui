<svelte:options tag="uni-stacked-progress" />
<script>
  import Original from '@w5-ui/svelte/components/StackedProgress.svelte';
  export let segments = undefined;
  export let total = undefined;
  export let ariaLabel = undefined;
  export let showLegend = true;
</script>

<Original {segments} {total} {ariaLabel} {showLegend}>
  <slot />
</Original>
