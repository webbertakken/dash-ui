<script lang="ts">
  interface Props {
    colSpan: number;
    defaultExpanded?: boolean;
    row?: import('svelte').Snippet;
    detail?: import('svelte').Snippet;
  }

  let { colSpan, defaultExpanded = false, row, detail }: Props = $props();

  // svelte-ignore state_referenced_locally
  let open = $state(defaultExpanded);
  const detailId = `exp-${Math.random().toString(36).slice(2, 9)}`;
</script>

<tbody>
  <tr>
    <td class="w-8 px-1">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={detailId}
        aria-label={open ? 'Collapse row' : 'Expand row'}
        class="inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded border-0 bg-transparent p-0 text-[#6e7079] transition-colors duration-100 hover:text-[#c8c9d0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-05"
        onclick={() => (open = !open)}
      >
        <svg
          viewBox="0 0 10 6"
          fill="none"
          aria-hidden="true"
          class="h-1.5 w-2.5 transition-transform duration-100 motion-reduce:transition-none {open ? 'rotate-180' : ''}"
        >
          <path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </td>
    {@render row?.()}
  </tr>
  <tr
    id={detailId}
    aria-hidden={!open}
    class="{open ? 'table-row' : 'hidden'}"
  >
    <td colspan={colSpan + 1} class="border-b border-white/[0.06] bg-white/[0.02] pb-3 pl-9 pr-3 pt-2">
      {@render detail?.()}
    </td>
  </tr>
</tbody>
