<svelte:options customElement="uni-switch-port-grid" />
<script>
  import Original from '@w5-ui/svelte/components/SwitchPortGrid.svelte';
  let {
    ports = [],
    columns = 12,
    ariaLabel = 'Switch port panel'
  } = $props();
</script>

<Original {ports} {columns} {ariaLabel}>
  <slot />
</Original>
