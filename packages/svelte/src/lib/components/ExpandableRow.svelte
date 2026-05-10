<script lang="ts">
  export let colSpan: number;
  export let defaultExpanded: boolean = false;

  let open = defaultExpanded;
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
        on:click={() => (open = !open)}
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
    <slot name="row" />
  </tr>
  <tr
    id={detailId}
    class="exp-detail"
    class:exp-detail--open={open}
    aria-hidden={!open}
  >
    <td colspan={colSpan + 1} class="exp-detail-cell">
      <slot name="detail" />
    </td>
  </tr>
</tbody>
