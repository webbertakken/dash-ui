<svelte:options customElement="uni-table-shell" />
<script>
  import Original from '@w5-ui/svelte/components/TableShell.svelte';
  let {
    class: className = ''
  } = $props();
</script>

<Original class={className}>
  <slot />
</Original>
