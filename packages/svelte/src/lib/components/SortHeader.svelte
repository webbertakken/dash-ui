<script lang="ts">
  
  interface Props {
    sortKey: string;
    activeKey?: string | null;
    dir?: 'asc' | 'desc';
    children?: import('svelte').Snippet;
    onsort?: (payload: string) => void;
  }

  let {
    sortKey,
    activeKey = null,
    dir = 'asc',
    children,
    onsort,
  }: Props = $props();
  let active = $derived(activeKey === sortKey);
  let ariaSort = $derived((active ? (dir === 'asc' ? 'ascending' : 'descending') : 'none') as 'ascending' | 'descending' | 'none');
</script>

<th scope="col" aria-sort={ariaSort}>
  <button type="button" class="sort-header-btn" onclick={() => onsort?.(sortKey)}>
    {@render children?.()}
    <svg class="sort-icon" viewBox="0 0 8 11" aria-hidden="true" fill="currentColor">
      <path d="M4 0L7 4H1Z" opacity={active && dir === 'asc' ? 1 : 0.3} />
      <path d="M4 11L1 7H7Z" opacity={active && dir === 'desc' ? 1 : 0.3} />
    </svg>
  </button>
</th>
