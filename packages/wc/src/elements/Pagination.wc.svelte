<svelte:options tag="uni-pagination" />
<script>
  import Original from '@dash-ui/svelte/components/Pagination.svelte';
  export let page = 1;
  export let pageSize = 10;
  export let total = 0;
</script>

<Original {page} {pageSize} {total}>
  <slot />
</Original>
