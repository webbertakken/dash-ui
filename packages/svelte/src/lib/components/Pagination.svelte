<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let page: number = 1;
  export let pageSize: number = 10;
  export let total: number = 0;

  const dispatch = createEventDispatcher<{ change: number }>();

  $: totalPages = Math.max(1, Math.ceil(total / pageSize));
  $: pages = getPageNumbers(page, totalPages);

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

  function go(p: number) { dispatch('change', p); }
</script>

{#if totalPages > 1}
  <nav class="pagination" aria-label="Pagination">
    <button
      type="button"
      class="pagination-btn"
      aria-label="Previous page"
      disabled={page <= 1}
      on:click={() => go(page - 1)}
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
          on:click={() => go(p)}
        >{p}</button>
      {/if}
    {/each}
    <button
      type="button"
      class="pagination-btn"
      aria-label="Next page"
      disabled={page >= totalPages}
      on:click={() => go(page + 1)}
    >&#x203A;</button>
  </nav>
{/if}
