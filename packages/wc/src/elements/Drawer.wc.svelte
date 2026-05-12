<svelte:options tag="uni-drawer" />
<script>
  import Original from '@w5-ui/svelte/components/Drawer.svelte';
  export let open = false;
  export let title = undefined;
</script>

<Original {open} {title}>
  <slot />
</Original>
