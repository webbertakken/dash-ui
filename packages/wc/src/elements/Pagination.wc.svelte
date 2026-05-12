<svelte:options customElement="uni-pagination" />
<script>
  import Original from '@w5-ui/svelte/components/Pagination.svelte';
  let {
    page = 1,
    pageSize = 10,
    total = 0
  } = $props();
</script>

<Original {page} {pageSize} {total}>
  <slot />
</Original>
