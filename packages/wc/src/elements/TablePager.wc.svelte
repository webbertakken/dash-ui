<svelte:options customElement="uni-table-pager" />
<script>
  import Original from '@w5-ui/svelte/components/TablePager.svelte';
  let {
    class: className = ''
  } = $props();
</script>

<Original class={className}>
  <slot />
</Original>
