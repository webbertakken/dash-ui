<script lang="ts">
  

  interface Props {
    page?: number;
    pageSize?: number;
    total?: number;
    onchange?: (payload: number) => void;
  }

  let { page = 1, pageSize = 10, total = 0,
    onchange,
  }: Props = $props();
  function getPageNumbers(p: number, tp: number): (number | '...')[] {
    if (tp <= 7) return Array.from({ length: tp }, (_, i) => i + 1);
    const items: (number | '...')[] = [1];
    const lo = Math.max(2, p - 1);
    const hi = Math.min(tp - 1, p + 1);
    if (lo > 2) items.push('...');
    for (let i = lo; i <= hi; i++) items.push(i);
    if (hi < tp - 1) items.push('...');
    items.push(tp);
    return items;
  }

  function go(p: number) { onchange?.(p); }
  let totalPages = $derived(Math.max(1, Math.ceil(total / pageSize)));
  let pages = $derived(getPageNumbers(page, totalPages));
</script>

{#if totalPages > 1}
  <nav class="pagination" aria-label="Pagination">
    <button
      type="button"
      class="pagination-btn"
      aria-label="Previous page"
      disabled={page <= 1}
      onclick={() => go(page - 1)}
    >&#x2039;</button>
    {#each pages as p, i (typeof p === 'number' ? p : `e${i}`)}
      {#if p === '...'}
        <span class="pagination-ellipsis" aria-hidden="true">&#x2026;</span>
      {:else}
        <button
          type="button"
          class="pagination-btn{p === page ? ' active' : ''}"
          aria-label="Page {p}"
          aria-current={p === page ? 'page' : undefined}
          onclick={() => go(p)}
        >{p}</button>
      {/if}
    {/each}
    <button
      type="button"
      class="pagination-btn"
      aria-label="Next page"
      disabled={page >= totalPages}
      onclick={() => go(page + 1)}
    >&#x203A;</button>
  </nav>
{/if}
