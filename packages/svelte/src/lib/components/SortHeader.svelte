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
  let ariaSort = $derived(
    (active ? (dir === 'asc' ? 'ascending' : 'descending') : 'none') as
      | 'ascending'
      | 'descending'
      | 'none',
  );
</script>

<th scope="col" aria-sort={ariaSort}>
  <button
    type="button"
    class="inline-flex w-full cursor-pointer items-center gap-1.5 whitespace-nowrap border-0 bg-transparent px-3 py-2 font-inherit text-inherit hover:text-[#c8c9d0] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-05"
    onclick={() => onsort?.(sortKey)}
  >
    {@render children?.()}
    <svg class="h-[11px] w-2 shrink-0" viewBox="0 0 8 11" aria-hidden="true" fill="currentColor">
      <path d="M4 0L7 4H1Z" opacity={active && dir === 'asc' ? 1 : 0.3} />
      <path d="M4 11L1 7H7Z" opacity={active && dir === 'desc' ? 1 : 0.3} />
    </svg>
  </button>
</th>
