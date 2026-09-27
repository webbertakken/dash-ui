<svelte:options customElement={{ tag: "uni-pagination", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/Pagination.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    page = 1,
    pageSize = 10,
    total = 0
  } = $props();
</script>

<Original {page} {pageSize} {total}>
  <slot />
</Original>
