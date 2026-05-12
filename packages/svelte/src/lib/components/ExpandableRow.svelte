<script lang="ts">
  interface Props {
    colSpan: number;
    defaultExpanded?: boolean;
    row?: import('svelte').Snippet;
    detail?: import('svelte').Snippet;
  }

  let {
    colSpan,
    defaultExpanded = false,
    row,
    detail
  }: Props = $props();

  // svelte-ignore state_referenced_locally
  let open = $state(defaultExpanded);
  const detailId = `exp-${Math.random().toString(36).slice(2, 9)}`;
</script>

<tbody class="exp-tbody">
  <tr class="exp-row">
    <td class="exp-toggle-cell">
      <button
        type="button"
        class="exp-toggle"
        aria-expanded={open}
        aria-controls={detailId}
        aria-label={open ? 'Collapse row' : 'Expand row'}
        onclick={() => (open = !open)}
      >
        <svg
          class="exp-chevron"
          class:exp-chevron--open={open}
          viewBox="0 0 10 6"
          fill="none"
          aria-hidden="true"
        >
          <path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </td>
    {@render row?.()}
  </tr>
  <tr
    id={detailId}
    class="exp-detail"
    class:exp-detail--open={open}
    aria-hidden={!open}
  >
    <td colspan={colSpan + 1} class="exp-detail-cell">
      {@render detail?.()}
    </td>
  </tr>
</tbody>
