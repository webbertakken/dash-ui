<svelte:options customElement="uni-card-more" />
<script>
  import Original from '@w5-ui/svelte/components/CardMore.svelte';
  let {
    href = undefined,
    class: className = ''
  } = $props();
</script>

<Original {href} class={className}>
  <slot />
</Original>
