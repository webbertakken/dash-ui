<svelte:options tag="uni-empty-state" />
<script>
  import Original from '@w5-ui/svelte/components/EmptyState.svelte';
  export let title = undefined;
  export let description = undefined;
</script>

<Original {title} {description}>
  <slot />
</Original>
