<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  export let sortKey: string;
  export let activeKey: string | null = null;
  export let dir: 'asc' | 'desc' = 'asc';
  const dispatch = createEventDispatcher<{ sort: string }>();
  $: active = activeKey === sortKey;
  $: ariaSort = active ? (dir === 'asc' ? 'ascending' : 'descending') : 'none';
</script>

<th scope="col" aria-sort={ariaSort}>
  <button type="button" class="sort-header-btn" on:click={() => dispatch('sort', sortKey)}>
    <slot />
    <svg class="sort-icon" viewBox="0 0 8 11" aria-hidden="true" fill="currentColor">
      <path d="M4 0L7 4H1Z" opacity={active && dir === 'asc' ? 1 : 0.3} />
      <path d="M4 11L1 7H7Z" opacity={active && dir === 'desc' ? 1 : 0.3} />
    </svg>
  </button>
</th>
