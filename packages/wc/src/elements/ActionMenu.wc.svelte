<svelte:options customElement="uni-action-menu" />
<script>
  import Original from '@w5-ui/svelte/components/ActionMenu.svelte';
  let {
    items = [],
    label = 'Actions'
  } = $props();
</script>

<Original {items} {label}>
  <slot />
</Original>
