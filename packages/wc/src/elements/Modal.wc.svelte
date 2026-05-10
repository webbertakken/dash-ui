<svelte:options tag="uni-modal" />
<script>
  import Original from '@dash-ui/svelte/components/Modal.svelte';
  export let open = false;
  export let title = undefined;
</script>

<Original {open} {title}>
  <slot />
</Original>
