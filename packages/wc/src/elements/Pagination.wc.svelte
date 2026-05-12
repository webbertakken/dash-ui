<svelte:options customElement="uni-pagination" />
<script>
  import Original from '@w5-ui/svelte/components/Pagination.svelte';
  export let page = 1;
  export let pageSize = 10;
  export let total = 0;
</script>

<Original {page} {pageSize} {total}>
  <slot />
</Original>
