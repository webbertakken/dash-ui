<svelte:options tag="uni-modal" />
<script>
  import Original from '@w5-ui/svelte/components/Modal.svelte';
  export let open = false;
  export let title = undefined;
</script>

<Original {open} {title}>
  <slot />
</Original>
