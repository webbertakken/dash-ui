<svelte:options customElement="uni-modal" />
<script>
  import Original from '@w5-ui/svelte/components/Modal.svelte';
  let {
    open = false,
    title = undefined,
    size = 'md'
  } = $props();
</script>

<Original {open} {title} {size}>
  <slot />
</Original>
