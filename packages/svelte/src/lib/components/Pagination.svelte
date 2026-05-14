<script lang="ts">
  interface Props {
    page?: number;
    pageSize?: number;
    total?: number;
    onchange?: (payload: number) => void;
  }

  let { page = 1, pageSize = 10, total = 0, onchange }: Props = $props();

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

  function go(p: number) {
    onchange?.(p);
  }

  let totalPages = $derived(Math.max(1, Math.ceil(total / pageSize)));
  let pages = $derived(getPageNumbers(page, totalPages));

  const BTN_BASE =
    'inline-flex h-[30px] min-w-[30px] cursor-pointer items-center justify-center rounded-md border border-transparent bg-transparent px-1.5 text-13 font-medium leading-none text-text-3 transition-[background-color,color,border-color] duration-100 hover:bg-white/[0.04] hover:text-white hover:border-white/10 disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-05';
  const BTN_ACTIVE = 'bg-brand-05 text-white border-brand-05 hover:bg-brand-06 hover:border-brand-06';
</script>

{#if totalPages > 1}
  <nav class="flex items-center gap-0.5" aria-label="Pagination">
    <button
      type="button"
      aria-label="Previous page"
      disabled={page <= 1}
      class={BTN_BASE}
      onclick={() => go(page - 1)}
    >&#x2039;</button>
    {#each pages as p, i (typeof p === 'number' ? p : `e${i}`)}
      {#if p === '...'}
        <span aria-hidden="true" class="inline-flex h-[30px] min-w-[30px] items-center justify-center text-13 text-[#6e7079]">&#x2026;</span>
      {:else}
        <button
          type="button"
          aria-label={`Page ${p}`}
          aria-current={p === page ? 'page' : undefined}
          class="{BTN_BASE} {p === page ? BTN_ACTIVE : ''}"
          onclick={() => go(p)}
        >{p}</button>
      {/if}
    {/each}
    <button
      type="button"
      aria-label="Next page"
      disabled={page >= totalPages}
      class={BTN_BASE}
      onclick={() => go(page + 1)}
    >&#x203A;</button>
  </nav>
{/if}
