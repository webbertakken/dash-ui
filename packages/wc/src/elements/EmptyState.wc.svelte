<svelte:options customElement="uni-empty-state" />
<script>
  import Original from '@w5-ui/svelte/components/EmptyState.svelte';
  let {
    title = undefined,
    description = undefined,
    class: className = ''
  } = $props();
</script>

<Original {title} {description} class={className}>
  <slot />
</Original>
