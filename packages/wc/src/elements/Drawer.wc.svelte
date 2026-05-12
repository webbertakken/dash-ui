<svelte:options customElement="uni-drawer" />
<script>
  import Original from '@w5-ui/svelte/components/Drawer.svelte';
  let {
    open = false,
    title = undefined
  } = $props();
</script>

<Original {open} {title}>
  <slot />
</Original>
